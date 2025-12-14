/**
 * VoiceInput Component
 * Beautiful UI for voice recording with real-time transcription
 * Combines voiceRecorder and speechToText services
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Square, Play, Pause, Trash2, Check, AlertCircle, Volume2 } from 'lucide-react';
import { voiceRecorder, VoiceRecorderService, formatDuration, RecordingState } from '../services/voiceRecorder';
import { speechToText, SpeechToTextService, SpeechToTextState, cleanTranscript } from '../services/speechToText';

interface VoiceInputProps {
  onTranscriptChange?: (transcript: string) => void;
  onRecordingComplete?: (data: VoiceRecordingData) => void;
  onCancel?: () => void;
  language?: 'es' | 'en';
  placeholder?: string;
  disabled?: boolean;
  showTranscript?: boolean;
  maxDuration?: number; // Max recording duration in seconds
  className?: string;
}

export interface VoiceRecordingData {
  transcript: string;
  audioBlob: Blob | null;
  duration: number;
  confidence: number;
  language: 'es' | 'en';
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
  onTranscriptChange,
  onRecordingComplete,
  onCancel,
  language = 'es',
  placeholder,
  disabled = false,
  showTranscript = true,
  maxDuration = 300, // 5 minutes default
  className = '',
}) => {
  // State
  const [isSupported, setIsSupported] = useState(true);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [recordingState, setRecordingState] = useState<RecordingState>({
    isRecording: false,
    isPaused: false,
    duration: 0,
    audioBlob: null,
    error: null,
  });
  const [sttState, setSttState] = useState<SpeechToTextState>({
    isListening: false,
    transcript: '',
    interimTranscript: '',
    confidence: 0,
    error: null,
    language: language,
  });
  const [audioLevel, setAudioLevel] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Refs
  const audioLevelInterval = useRef<NodeJS.Timeout | null>(null);
  const maxDurationTimeout = useRef<NodeJS.Timeout | null>(null);

  // Check support on mount
  useEffect(() => {
    const recorderSupported = VoiceRecorderService.isSupported();
    const sttSupported = SpeechToTextService.isSupported();
    
    setIsSupported(recorderSupported); // Recording is required, STT is optional
    
    if (!recorderSupported) {
      console.warn('Voice recording not supported');
    }
    if (!sttSupported) {
      console.warn('Speech-to-text not supported, transcription will be disabled');
    }

    // Initialize services
    voiceRecorder.initialize({
      onStateChange: setRecordingState,
    });

    if (sttSupported) {
      speechToText.initialize({
        language,
        onStateChange: setSttState,
        onResult: (result) => {
          // Emit FULL transcript updates
          if (result.isFinal) {
            onTranscriptChange?.(speechToText.getFullTranscript());
          }
        },
      });
    }

    // Cleanup
    return () => {
      stopAudioLevelMonitor();
      clearMaxDurationTimeout();
      voiceRecorder.cancel();
      speechToText.destroy();
    };
  }, []);

  // Update language when prop changes
  useEffect(() => {
    speechToText.setLanguage(language);
  }, [language]);

  // Audio level monitoring
  const startAudioLevelMonitor = useCallback(() => {
    audioLevelInterval.current = setInterval(async () => {
      const level = await voiceRecorder.getAudioLevel();
      setAudioLevel(level);
    }, 100);
  }, []);

  const stopAudioLevelMonitor = useCallback(() => {
    if (audioLevelInterval.current) {
      clearInterval(audioLevelInterval.current);
      audioLevelInterval.current = null;
    }
    setAudioLevel(0);
  }, []);

  // Max duration timeout
  const startMaxDurationTimeout = useCallback(() => {
    if (maxDuration > 0) {
      maxDurationTimeout.current = setTimeout(() => {
        handleStop();
      }, maxDuration * 1000);
    }
  }, [maxDuration]);

  const clearMaxDurationTimeout = useCallback(() => {
    if (maxDurationTimeout.current) {
      clearTimeout(maxDurationTimeout.current);
      maxDurationTimeout.current = null;
    }
  }, []);

  // Request permission
  const requestPermission = async (): Promise<boolean> => {
    try {
      const granted = await voiceRecorder.requestPermission();
      setHasPermission(granted);
      return granted;
    } catch (error) {
      setHasPermission(false);
      return false;
    }
  };

  // Start recording
  const handleStart = async () => {
    if (disabled || recordingState.isRecording) return;

    // Check permission first
    if (hasPermission === null) {
      const granted = await requestPermission();
      if (!granted) return;
    } else if (!hasPermission) {
      return;
    }

    const started = await voiceRecorder.start();
    if (started) {
      speechToText.start();
      startAudioLevelMonitor();
      startMaxDurationTimeout();
    }
  };

  // Stop recording
  const handleStop = async () => {
    if (!recordingState.isRecording && !recordingState.isPaused) return;

    setIsProcessing(true);
    stopAudioLevelMonitor();
    clearMaxDurationTimeout();

    try {
      const audioBlob = await voiceRecorder.stop();
      speechToText.stop();

      const finalTranscript = cleanTranscript(speechToText.getFullTranscript());

      onRecordingComplete?.({
        transcript: finalTranscript,
        audioBlob,
        duration: recordingState.duration,
        confidence: sttState.confidence,
        language,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Pause/resume
  const handlePauseResume = () => {
    if (recordingState.isPaused) {
      voiceRecorder.resume();
      speechToText.start();
      startAudioLevelMonitor();
    } else {
      voiceRecorder.pause();
      speechToText.stop();
      stopAudioLevelMonitor();
    }
  };

  // Cancel recording
  const handleCancel = () => {
    stopAudioLevelMonitor();
    clearMaxDurationTimeout();
    voiceRecorder.cancel();
    speechToText.abort();
    onCancel?.();
  };

  // Get display text
  const getDisplayText = (): string => {
    if (sttState.transcript || sttState.interimTranscript) {
      return sttState.transcript + (sttState.interimTranscript ? ` ${sttState.interimTranscript}` : '');
    }
    return placeholder || (language === 'es' ? 'Haz clic para grabar...' : 'Click to record...');
  };

  // Not supported UI
  if (!isSupported) {
    return (
      <div className={`flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl ${className}`}>
        <AlertCircle className="text-red-400 flex-shrink-0" size={20} />
        <span className="text-red-400 text-sm">
          {language === 'es' 
            ? 'Tu navegador no soporta grabación de voz. Usa Chrome o Edge.'
            : 'Your browser does not support voice recording. Use Chrome or Edge.'}
        </span>
      </div>
    );
  }

  // Permission denied UI
  if (hasPermission === false) {
    return (
      <div className={`flex items-center gap-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl ${className}`}>
        <MicOff className="text-yellow-400 flex-shrink-0" size={20} />
        <div className="flex-1">
          <span className="text-yellow-400 text-sm block">
            {language === 'es' 
              ? 'Permiso de micrófono denegado'
              : 'Microphone permission denied'}
          </span>
          <button 
            onClick={requestPermission}
            className="text-xs text-yellow-500 hover:text-yellow-400 underline mt-1"
          >
            {language === 'es' ? 'Intentar de nuevo' : 'Try again'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Main Recording Interface */}
      <div className={`
        relative overflow-hidden rounded-2xl border transition-all duration-300
        ${recordingState.isRecording 
          ? 'bg-gradient-to-r from-red-500/10 to-pink-500/10 border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.2)]' 
          : 'bg-white/5 border-white/10 hover:border-white/20'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}>
        
        {/* Audio Level Visualizer */}
        <AnimatePresence>
          {recordingState.isRecording && !recordingState.isPaused && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: audioLevel }}
              exit={{ scaleX: 0 }}
              transition={{ duration: 0.1 }}
              className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-transparent origin-left pointer-events-none"
            />
          )}
        </AnimatePresence>

        {/* Content */}
        <div className="relative p-4">
          <div className="flex items-start gap-4">
            
            {/* Record Button */}
            <button
              onClick={recordingState.isRecording ? handleStop : handleStart}
              disabled={disabled || isProcessing}
              className={`
                relative flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center
                transition-all duration-300 hover:scale-105
                ${recordingState.isRecording
                  ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)]'
                  : 'bg-neon/10 text-neon hover:bg-neon/20 border border-neon/30'
                }
                ${isProcessing ? 'animate-pulse' : ''}
              `}
            >
              {isProcessing ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : recordingState.isRecording ? (
                <Square size={20} fill="currentColor" />
              ) : (
                <Mic size={24} />
              )}
              
              {/* Pulse animation when recording */}
              {recordingState.isRecording && !recordingState.isPaused && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-red-500"
                  animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </button>

            {/* Transcript Area */}
            <div className="flex-1 min-h-[56px]">
              {showTranscript && (
                <div className="text-white">
                  {/* Transcript text */}
                  <p className={`text-sm leading-relaxed ${
                    !sttState.transcript && !sttState.interimTranscript ? 'text-slate-500 italic' : ''
                  }`}>
                    {sttState.transcript || ''}
                    <span className="text-slate-400">{sttState.interimTranscript}</span>
                    {!sttState.transcript && !sttState.interimTranscript && (
                      <span>{placeholder || (language === 'es' ? 'Haz clic para grabar...' : 'Click to record...')}</span>
                    )}
                  </p>
                  
                  {/* Recording indicator */}
                  <AnimatePresence>
                    {recordingState.isRecording && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-3 mt-3"
                      >
                        <span className="flex items-center gap-2 text-xs text-red-400">
                          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                          {recordingState.isPaused ? 'PAUSADO' : 'GRABANDO'}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">
                          {formatDuration(recordingState.duration)}
                        </span>
                        {sttState.confidence > 0 && (
                          <span className="text-xs text-slate-600">
                            {Math.round(sttState.confidence * 100)}% confianza
                          </span>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <AnimatePresence>
              {recordingState.isRecording && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-2"
                >
                  {/* Pause/Resume */}
                  <button
                    onClick={handlePauseResume}
                    className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                    title={recordingState.isPaused ? 'Reanudar' : 'Pausar'}
                  >
                    {recordingState.isPaused ? <Play size={18} /> : <Pause size={18} />}
                  </button>
                  
                  {/* Cancel */}
                  <button
                    onClick={handleCancel}
                    className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                    title="Cancelar"
                  >
                    <Trash2 size={18} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Error Display */}
        <AnimatePresence>
          {(recordingState.error || sttState.error) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-4 pb-3"
            >
              <p className="text-xs text-red-400 flex items-center gap-2">
                <AlertCircle size={14} />
                {recordingState.error || sttState.error}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Audio Waveform Visualizer */}
      <AnimatePresence>
        {recordingState.isRecording && !recordingState.isPaused && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-3 flex items-center justify-center gap-1 h-8"
          >
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-neon rounded-full"
                animate={{
                  height: `${Math.max(4, Math.min(32, audioLevel * 100 * Math.sin(i * 0.5) * 1.5 + Math.random() * 10))}px`,
                }}
                transition={{ duration: 0.1 }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Max Duration Warning */}
      {recordingState.isRecording && recordingState.duration > maxDuration - 30 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-yellow-400 text-center mt-2"
        >
          {language === 'es' 
            ? `Grabación terminará en ${maxDuration - recordingState.duration} segundos`
            : `Recording will end in ${maxDuration - recordingState.duration} seconds`
          }
        </motion.p>
      )}
    </div>
  );
};

export default VoiceInput;

/**
 * Speech-to-Text Service
 * Uses Web Speech API for FREE real-time transcription
 * Falls back to manual input for unsupported browsers
 */

export interface TranscriptionResult {
  text: string;
  confidence: number;
  isFinal: boolean;
  language: 'es' | 'en';
  alternatives?: string[];
}

export interface SpeechToTextState {
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  confidence: number;
  error: string | null;
  language: 'es' | 'en';
}

export interface SpeechToTextOptions {
  language?: 'es' | 'en';
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
  onResult?: (result: TranscriptionResult) => void;
  onError?: (error: Error) => void;
  onStateChange?: (state: SpeechToTextState) => void;
  onStart?: () => void;
  onEnd?: () => void;
}

// Type declaration for Web Speech API
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

// Web Speech API type (varies by browser)
type SpeechRecognitionType = new () => SpeechRecognition;

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onspeechend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

class SpeechToTextService {
  private recognition: SpeechRecognition | null = null;
  private options: SpeechToTextOptions = {};
  private restartAttempts = 0;
  private maxRestartAttempts = 3;
  private shouldRestart = false;
  
  private state: SpeechToTextState = {
    isListening: false,
    transcript: '',
    interimTranscript: '',
    confidence: 0,
    error: null,
    language: 'es',
  };

  /**
   * Check if Web Speech API is supported
   */
  static isSupported(): boolean {
    return !!(
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition
    );
  }

  /**
   * Get supported languages
   */
  static getSupportedLanguages(): { code: string; name: string }[] {
    return [
      { code: 'es-ES', name: 'Español (España)' },
      { code: 'es-MX', name: 'Español (México)' },
      { code: 'es-AR', name: 'Español (Argentina)' },
      { code: 'es-CO', name: 'Español (Colombia)' },
      { code: 'en-US', name: 'English (US)' },
      { code: 'en-GB', name: 'English (UK)' },
    ];
  }

  /**
   * Initialize the speech recognition
   */
  initialize(options: SpeechToTextOptions = {}): boolean {
    if (!SpeechToTextService.isSupported()) {
      console.warn('Web Speech API not supported in this browser');
      this.updateState({ error: 'Reconocimiento de voz no soportado en este navegador' });
      return false;
    }

    this.options = {
      language: 'es',
      continuous: true,
      interimResults: true,
      maxAlternatives: 3,
      ...options,
    };

    try {
      const SpeechRecognition: SpeechRecognitionType = 
        (window as any).SpeechRecognition || 
        (window as any).webkitSpeechRecognition;
      
      this.recognition = new SpeechRecognition();
      this.configureRecognition();
      
      console.log('🎤 Speech recognition initialized');
      return true;
    } catch (error) {
      console.error('Error initializing speech recognition:', error);
      this.updateState({ error: 'Error al inicializar reconocimiento de voz' });
      return false;
    }
  }

  /**
   * Configure the recognition instance
   */
  private configureRecognition(): void {
    if (!this.recognition) return;

    // Set language based on option
    const langCode = this.options.language === 'es' ? 'es-ES' : 'en-US';
    this.recognition.lang = langCode;
    this.recognition.continuous = this.options.continuous ?? true;
    this.recognition.interimResults = this.options.interimResults ?? true;
    this.recognition.maxAlternatives = this.options.maxAlternatives ?? 3;

    // Handle results
    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interimTranscript = '';
      let bestConfidence = 0;
      const alternatives: string[] = [];

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const primaryAlternative = result[0];
        
        if (result.isFinal) {
          finalTranscript += primaryAlternative.transcript + ' ';
          bestConfidence = Math.max(bestConfidence, primaryAlternative.confidence);
          
          // Collect alternatives
          for (let j = 1; j < result.length; j++) {
            alternatives.push(result[j].transcript);
          }
        } else {
          interimTranscript += primaryAlternative.transcript;
        }
      }

      // Update state with new transcripts
      if (finalTranscript) {
        const newTranscript = this.state.transcript + finalTranscript;
        this.updateState({ 
          transcript: newTranscript.trim(),
          interimTranscript: '',
          confidence: bestConfidence || this.state.confidence,
        });

        // Notify callback
        this.options.onResult?.({
          text: finalTranscript.trim(),
          confidence: bestConfidence,
          isFinal: true,
          language: this.options.language ?? 'es',
          alternatives: alternatives.length > 0 ? alternatives : undefined,
        });
      }

      if (interimTranscript) {
        this.updateState({ interimTranscript });
        
        // Notify callback for interim results
        this.options.onResult?.({
          text: interimTranscript,
          confidence: 0,
          isFinal: false,
          language: this.options.language ?? 'es',
        });
      }
    };

    // Handle errors
    this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      
      let errorMessage = 'Error de reconocimiento';
      switch (event.error) {
        case 'not-allowed':
          errorMessage = 'Permiso de micrófono denegado';
          break;
        case 'no-speech':
          errorMessage = 'No se detectó voz';
          // Don't treat no-speech as a fatal error
          if (this.shouldRestart && this.restartAttempts < this.maxRestartAttempts) {
            this.restartAttempts++;
            setTimeout(() => this.start(), 100);
            return;
          }
          break;
        case 'audio-capture':
          errorMessage = 'No se pudo capturar audio';
          break;
        case 'network':
          errorMessage = 'Error de red';
          break;
        case 'aborted':
          // Normal abort, not an error
          return;
      }

      this.updateState({ error: errorMessage, isListening: false });
      this.options.onError?.(new Error(errorMessage));
    };

    // Handle start
    this.recognition.onstart = () => {
      console.log('🎤 Speech recognition started');
      this.restartAttempts = 0;
      this.updateState({ isListening: true, error: null });
      this.options.onStart?.();
    };

    // Handle end
    this.recognition.onend = () => {
      console.log('🎤 Speech recognition ended');
      
      // Auto-restart if continuous and should be listening
      if (this.shouldRestart && this.state.isListening) {
        if (this.restartAttempts < this.maxRestartAttempts) {
          this.restartAttempts++;
          setTimeout(() => {
            if (this.shouldRestart) {
              this.recognition?.start();
            }
          }, 100);
          return;
        }
      }
      
      this.updateState({ isListening: false });
      this.options.onEnd?.();
    };
  }

  /**
   * Start listening for speech
   */
  start(): boolean {
    if (!this.recognition) {
      const initialized = this.initialize(this.options);
      if (!initialized) return false;
    }

    if (this.state.isListening) {
      console.warn('Already listening');
      return true;
    }

    try {
      this.shouldRestart = true;
      this.restartAttempts = 0;
      this.recognition?.start();
      return true;
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      this.updateState({ error: 'Error al iniciar reconocimiento' });
      return false;
    }
  }

  /**
   * Stop listening
   */
  stop(): void {
    this.shouldRestart = false;
    
    if (this.recognition && this.state.isListening) {
      try {
        this.recognition.stop();
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
      }
    }
    
    this.updateState({ isListening: false });
  }

  /**
   * Abort recognition (discard results)
   */
  abort(): void {
    this.shouldRestart = false;
    
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch (error) {
        console.error('Error aborting speech recognition:', error);
      }
    }
    
    this.updateState({ 
      isListening: false,
      transcript: '',
      interimTranscript: '',
    });
  }

  /**
   * Clear the current transcript
   */
  clearTranscript(): void {
    this.updateState({ 
      transcript: '',
      interimTranscript: '',
      confidence: 0,
    });
  }

  /**
   * Get the current state
   */
  getState(): SpeechToTextState {
    return { ...this.state };
  }

  /**
   * Get the full transcript (final + interim)
   */
  getFullTranscript(): string {
    return (this.state.transcript + ' ' + this.state.interimTranscript).trim();
  }

  /**
   * Change the language on the fly
   */
  setLanguage(language: 'es' | 'en'): void {
    const wasListening = this.state.isListening;
    
    if (wasListening) {
      this.stop();
    }
    
    this.options.language = language;
    this.updateState({ language });
    
    if (this.recognition) {
      this.recognition.lang = language === 'es' ? 'es-ES' : 'en-US';
    }
    
    if (wasListening) {
      setTimeout(() => this.start(), 100);
    }
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    this.abort();
    this.recognition = null;
  }

  // Private helpers

  private updateState(partial: Partial<SpeechToTextState>): void {
    this.state = { ...this.state, ...partial };
    this.options.onStateChange?.(this.state);
  }
}

// Export singleton instance
export const speechToText = new SpeechToTextService();

// Export class for testing
export { SpeechToTextService };

/**
 * Utility: Estimate speaking time from text
 * Average speaking rate: 150 words per minute
 */
export function estimateSpeakingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.ceil((words / 150) * 60); // Returns seconds
}

/**
 * Utility: Clean up transcript text
 * Capitalizes first letter, fixes punctuation, etc.
 */
export function cleanTranscript(text: string): string {
  if (!text) return '';
  
  // Capitalize first letter
  let cleaned = text.charAt(0).toUpperCase() + text.slice(1);
  
  // Add period at end if missing
  if (!/[.!?]$/.test(cleaned)) {
    cleaned += '.';
  }
  
  // Fix multiple spaces
  cleaned = cleaned.replace(/\s+/g, ' ');
  
  return cleaned.trim();
}

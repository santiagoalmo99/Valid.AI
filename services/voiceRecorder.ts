/**
 * Voice Recorder Service
 * Records audio from the user's microphone using Web Audio API
 * Supports start, stop, pause, resume, and get audio blob
 */

export interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  audioBlob: Blob | null;
  error: string | null;
}

export interface VoiceRecorderOptions {
  mimeType?: string;
  audioBitsPerSecond?: number;
  onDataAvailable?: (data: Blob) => void;
  onError?: (error: Error) => void;
  onStateChange?: (state: RecordingState) => void;
}

class VoiceRecorderService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;
  private startTime: number = 0;
  private pausedTime: number = 0;
  private durationInterval: NodeJS.Timeout | null = null;
  private options: VoiceRecorderOptions = {};
  
  private state: RecordingState = {
    isRecording: false,
    isPaused: false,
    duration: 0,
    audioBlob: null,
    error: null,
  };

  /**
   * Check if the browser supports audio recording
   */
  static isSupported(): boolean {
    return !!(
      navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia &&
      window.MediaRecorder
    );
  }

  /**
   * Get available audio input devices
   */
  static async getAudioDevices(): Promise<MediaDeviceInfo[]> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.filter(device => device.kind === 'audioinput');
    } catch (error) {
      console.error('Error getting audio devices:', error);
      return [];
    }
  }

  /**
   * Request microphone permission
   */
  async requestPermission(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop the stream immediately - we just wanted to check permission
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      this.updateState({ error: 'Permiso de micrófono denegado' });
      return false;
    }
  }

  /**
   * Initialize the recorder with options
   */
  initialize(options: VoiceRecorderOptions = {}): void {
    this.options = {
      mimeType: this.getSupportedMimeType(),
      audioBitsPerSecond: 128000,
      ...options,
    };
  }

  /**
   * Get the best supported MIME type for this browser
   */
  private getSupportedMimeType(): string {
    const mimeTypes = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/ogg',
      'audio/mp4',
      'audio/mpeg',
    ];
    
    for (const mimeType of mimeTypes) {
      if (MediaRecorder.isTypeSupported(mimeType)) {
        return mimeType;
      }
    }
    
    return 'audio/webm'; // Default fallback
  }

  /**
   * Start recording audio
   */
  async start(deviceId?: string): Promise<boolean> {
    if (this.state.isRecording) {
      console.warn('Already recording');
      return false;
    }

    try {
      const constraints: MediaStreamConstraints = {
        audio: deviceId 
          ? { deviceId: { exact: deviceId } }
          : {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
            },
      };

      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: this.options.mimeType,
        audioBitsPerSecond: this.options.audioBitsPerSecond,
      });

      this.audioChunks = [];
      this.startTime = Date.now();
      this.pausedTime = 0;

      // Handle data availability
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
          this.options.onDataAvailable?.(event.data);
        }
      };

      // Handle recording stop
      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: this.options.mimeType });
        this.updateState({ 
          audioBlob,
          isRecording: false,
          isPaused: false,
        });
        this.stopDurationTimer();
      };

      // Handle errors
      this.mediaRecorder.onerror = (event: Event) => {
        const error = (event as ErrorEvent).error || new Error('Recording error');
        this.updateState({ error: error.message });
        this.options.onError?.(error);
      };

      // Start recording with timeslice for real-time data
      this.mediaRecorder.start(1000); // Get data every second
      
      this.updateState({ 
        isRecording: true, 
        isPaused: false,
        duration: 0,
        error: null,
        audioBlob: null,
      });
      
      this.startDurationTimer();
      
      console.log('🎙️ Recording started');
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al iniciar grabación';
      console.error('Error starting recording:', error);
      this.updateState({ error: errorMessage });
      this.options.onError?.(error instanceof Error ? error : new Error(errorMessage));
      return false;
    }
  }

  /**
   * Stop recording and return the audio blob
   */
  async stop(): Promise<Blob | null> {
    if (!this.mediaRecorder || !this.state.isRecording) {
      console.warn('Not recording');
      return null;
    }

    return new Promise((resolve) => {
      if (!this.mediaRecorder) {
        resolve(null);
        return;
      }

      const handleStop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: this.options.mimeType });
        this.cleanup();
        resolve(audioBlob);
      };

      this.mediaRecorder.addEventListener('stop', handleStop, { once: true });
      this.mediaRecorder.stop();
    });
  }

  /**
   * Pause the recording
   */
  pause(): boolean {
    if (!this.mediaRecorder || !this.state.isRecording || this.state.isPaused) {
      return false;
    }

    if (this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.pause();
      this.pausedTime = Date.now();
      this.updateState({ isPaused: true });
      this.stopDurationTimer();
      console.log('⏸️ Recording paused');
      return true;
    }
    
    return false;
  }

  /**
   * Resume a paused recording
   */
  resume(): boolean {
    if (!this.mediaRecorder || !this.state.isPaused) {
      return false;
    }

    if (this.mediaRecorder.state === 'paused') {
      this.mediaRecorder.resume();
      // Adjust start time to account for pause duration
      this.startTime += Date.now() - this.pausedTime;
      this.pausedTime = 0;
      this.updateState({ isPaused: false });
      this.startDurationTimer();
      console.log('▶️ Recording resumed');
      return true;
    }
    
    return false;
  }

  /**
   * Cancel the current recording without saving
   */
  cancel(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    this.cleanup();
    this.updateState({
      isRecording: false,
      isPaused: false,
      duration: 0,
      audioBlob: null,
      error: null,
    });
    console.log('❌ Recording cancelled');
  }

  /**
   * Get the current recording state
   */
  getState(): RecordingState {
    return { ...this.state };
  }

  /**
   * Get audio level for visualization (0-1)
   */
  async getAudioLevel(): Promise<number> {
    if (!this.stream || !this.state.isRecording) {
      return 0;
    }

    try {
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(this.stream);
      source.connect(analyser);
      
      analyser.fftSize = 256;
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(dataArray);
      
      // Calculate average level
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      
      // Cleanup
      source.disconnect();
      await audioContext.close();
      
      return average / 255;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Convert blob to base64 for storage/transmission
   */
  static async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert blob to base64'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  /**
   * Convert base64 back to blob
   */
  static base64ToBlob(base64: string, mimeType: string = 'audio/webm'): Blob {
    const byteCharacters = atob(base64.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }

  // Private helpers

  private updateState(partial: Partial<RecordingState>): void {
    this.state = { ...this.state, ...partial };
    this.options.onStateChange?.(this.state);
  }

  private startDurationTimer(): void {
    this.durationInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
      this.updateState({ duration: elapsed });
    }, 100);
  }

  private stopDurationTimer(): void {
    if (this.durationInterval) {
      clearInterval(this.durationInterval);
      this.durationInterval = null;
    }
  }

  private cleanup(): void {
    this.stopDurationTimer();
    
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    
    this.mediaRecorder = null;
    this.audioChunks = [];
  }
}

// Export singleton instance
export const voiceRecorder = new VoiceRecorderService();

// Export class for testing
export { VoiceRecorderService };

// Utility function to format duration
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Web Speech and Audio Recording Helper with TalkBack Screen Reader Engine and Live Speech Recognition

export type TalkBackListener = (status: { isSpeaking: boolean; activeText: string }) => void;

// Web Speech API interface declarations
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export class AudioController {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private isRecording: boolean = false;
  private stream: MediaStream | null = null;
  private recognition: any = null;
  private isRecognizing: boolean = false;
  
  // TalkBack & TTS State
  private talkBackEnabled: boolean = true;
  private isCurrentlySpeaking: boolean = false;
  private currentSpokenText: string = '';
  private listeners: Set<TalkBackListener> = new Set();
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private speechTimeout: any = null;
  private voices: SpeechSynthesisVoice[] = [];
  private audioContext: AudioContext | null = null;
  private analyserNode: AnalyserNode | null = null;
  private mediaSourceNode: MediaStreamAudioSourceNode | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices(): void {
    try {
      if ('speechSynthesis' in window) {
        this.voices = window.speechSynthesis.getVoices() || [];
      }
    } catch {
      this.voices = [];
    }
  }

  public subscribeTalkBack(listener: TalkBackListener): () => void {
    this.listeners.add(listener);
    listener({ isSpeaking: this.isCurrentlySpeaking, activeText: this.currentSpokenText });
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    this.listeners.forEach((l) =>
      l({ isSpeaking: this.isCurrentlySpeaking, activeText: this.currentSpokenText })
    );
  }

  public setTalkBackEnabled(enabled: boolean) {
    this.talkBackEnabled = enabled;
    if (!enabled) {
      this.stopSpeaking();
    }
  }

  public isTalkBackEnabled(): boolean {
    return this.talkBackEnabled;
  }

  public playChime(type: 'start' | 'success' | 'alert' = 'start'): void {
    try {
      if (!this.audioContext) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) this.audioContext = new AudioCtx();
      }
      if (!this.audioContext) return;
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      osc.connect(gain);
      gain.connect(this.audioContext.destination);

      const now = this.audioContext.currentTime;
      if (type === 'start') {
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'success') {
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.1);
        osc.frequency.setValueAtTime(783.99, now + 0.2);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      }
    } catch {
      // Audio context might be restricted
    }
  }

  public async requestMicPermission(): Promise<boolean> {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return false;
      }
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      return true;
    } catch (err) {
      console.warn('Microphone permission request was denied or unavailable:', err);
      return false;
    }
  }

  public getLocaleFromLanguage(languageCode: string = 'hi'): string {
    const lang = (languageCode || 'hi').toLowerCase();
    if (lang.startsWith('hi')) return 'hi-IN';
    if (lang.startsWith('bn')) return 'bn-IN';
    if (lang.startsWith('ta')) return 'ta-IN';
    if (lang.startsWith('te')) return 'te-IN';
    if (lang.startsWith('mr')) return 'mr-IN';
    if (lang.startsWith('gu')) return 'gu-IN';
    if (lang.startsWith('pa')) return 'pa-IN';
    if (lang.startsWith('kn')) return 'kn-IN';
    if (lang.startsWith('ml')) return 'ml-IN';
    if (lang.startsWith('or')) return 'or-IN';
    if (lang.startsWith('as')) return 'as-IN';
    return 'en-IN';
  }

  // Real-time browser speech recognition (Web Speech API)
  public startSpeechRecognition(
    languageCode: string = 'hi',
    onInterim: (text: string) => void,
    onFinal: (text: string) => void,
    onError?: (error: any) => void
  ): boolean {
    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionClass) {
      console.warn('Browser SpeechRecognition API not supported on this browser/platform');
      return false;
    }

    try {
      this.stopSpeechRecognition();

      this.recognition = new SpeechRecognitionClass();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = this.getLocaleFromLanguage(languageCode);

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          onFinal(finalTranscript.trim());
        } else if (interimTranscript) {
          onInterim(interimTranscript.trim());
        }
      };

      this.recognition.onerror = (event: any) => {
        console.warn('SpeechRecognition event error:', event.error);
        if (onError) onError(event.error);
      };

      this.recognition.onend = () => {
        this.isRecognizing = false;
      };

      this.recognition.start();
      this.isRecognizing = true;
      return true;
    } catch (err) {
      console.warn('Failed to start SpeechRecognition:', err);
      if (onError) onError(err);
      return false;
    }
  }

  public stopSpeechRecognition(): void {
    if (this.recognition) {
      try {
        this.recognition.abort ? this.recognition.abort() : this.recognition.stop();
      } catch {
        // ignore
      }
      this.recognition = null;
      this.isRecognizing = false;
    }
  }

  public async startRecording(onDataAvailable?: (chunk: Blob) => void): Promise<boolean> {
    try {
      this.playChime('start');

      if (!this.stream) {
        const granted = await this.requestMicPermission();
        if (!granted) return false;
      }

      this.audioChunks = [];
      try {
        this.setupAnalyser();
        this.mediaRecorder = new MediaRecorder(this.stream!);
      } catch (e) {
        console.warn('MediaRecorder init failed, fallback:', e);
        return false;
      }

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          this.audioChunks.push(event.data);
          if (onDataAvailable) onDataAvailable(event.data);
        }
      };

      this.mediaRecorder.start(250);
      this.isRecording = true;
      return true;
    } catch (err) {
      console.warn('Failed to start recording:', err);
      return false;
    }
  }

  public stopRecording(): Promise<Blob | null> {
    return new Promise((resolve) => {
      this.stopSpeechRecognition();

      if (!this.mediaRecorder || !this.isRecording) {
        this.isRecording = false;
        resolve(null);
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        this.isRecording = false;
        resolve(audioBlob);
      };

      try {
        if (this.mediaRecorder.state !== 'inactive') {
          this.mediaRecorder.stop();
        } else {
          this.isRecording = false;
          resolve(null);
        }
      } catch {
        this.isRecording = false;
        resolve(null);
      }
    });
  }

  public async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // remove data:audio/webm;base64, prefix
        const base64Data = base64String.split(',')[1] || base64String;
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  public speakText(text: string, languageCode: string = 'hi-IN'): Promise<void> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        console.warn('Browser speech synthesis not supported');
        resolve();
        return;
      }

      if (!text || text.trim() === '') {
        resolve();
        return;
      }

      // Cancel any ongoing speech and clear existing timeout
      this.stopSpeaking();

      const targetLocale = this.getLocaleFromLanguage(languageCode);
      const cleanText = text.replace(/[*_#`]/g, '').trim();

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = targetLocale;
      utterance.rate = 0.92; // Slightly slower, clear cadence for rural comprehension
      utterance.pitch = 1.0;

      // Select best matched voice if available
      if (this.voices.length === 0) {
        this.loadVoices();
      }
      if (this.voices.length > 0) {
        const matchedVoice = this.voices.find(
          (v) => v.lang.toLowerCase() === targetLocale.toLowerCase() || v.lang.toLowerCase().startsWith(targetLocale.slice(0, 2).toLowerCase())
        );
        if (matchedVoice) {
          utterance.voice = matchedVoice;
        }
      }

      // CRITICAL FOR CHROMIUM: retain utterance in instance property to prevent garbage collection
      this.currentUtterance = utterance;
      this.isCurrentlySpeaking = true;
      this.currentSpokenText = cleanText;
      this.notifyListeners();

      let isFinished = false;

      const finishSpeech = () => {
        if (isFinished) return;
        isFinished = true;
        if (this.speechTimeout) {
          clearTimeout(this.speechTimeout);
          this.speechTimeout = null;
        }
        this.isCurrentlySpeaking = false;
        this.currentSpokenText = '';
        this.currentUtterance = null;
        this.notifyListeners();
        resolve();
      };

      utterance.onend = finishSpeech;
      utterance.onerror = (err) => {
        console.warn('SpeechSynthesis utterance error:', err);
        finishSpeech();
      };

      // Hard timeout fallback: maximum ~100ms per character, min 4s, max 15s
      const timeoutDuration = Math.min(15000, Math.max(4000, cleanText.length * 100));
      this.speechTimeout = setTimeout(() => {
        if (!isFinished) {
          console.warn('SpeechSynthesis timeout safeguard triggered');
          finishSpeech();
        }
      }, timeoutDuration);

      try {
        // Resume synthesis queue if suspended in Chrome
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.warn('speechSynthesis.speak threw error:', e);
        finishSpeech();
      }
    });
  }

  public stopSpeaking(): void {
    if (this.speechTimeout) {
      clearTimeout(this.speechTimeout);
      this.speechTimeout = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }
    this.currentUtterance = null;
    this.isCurrentlySpeaking = false;
    this.currentSpokenText = '';
    this.notifyListeners();
  }

  public getStream(): MediaStream | null {
    return this.stream;
  }

  public getAudioContext(): AudioContext | null {
    return this.audioContext;
  }

  public getAnalyserNode(): AnalyserNode | null {
    return this.analyserNode;
  }

  public setupAnalyser(): AnalyserNode | null {
    try {
      if (!this.stream) return null;
      
      if (!this.audioContext) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) this.audioContext = new AudioCtx();
      }
      if (!this.audioContext) return null;

      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      if (!this.analyserNode) {
        this.analyserNode = this.audioContext.createAnalyser();
        this.analyserNode.fftSize = 256;
        this.analyserNode.smoothingTimeConstant = 0.8;
      }

      if (this.mediaSourceNode) {
        try {
          this.mediaSourceNode.disconnect();
        } catch {
          // ignore
        }
      }

      this.mediaSourceNode = this.audioContext.createMediaStreamSource(this.stream);
      this.mediaSourceNode.connect(this.analyserNode);

      return this.analyserNode;
    } catch (e) {
      console.warn('Could not setup Web Audio AnalyserNode:', e);
      return null;
    }
  }

  public cleanup(): void {
    this.stopSpeaking();
    this.stopSpeechRecognition();
    if (this.mediaSourceNode) {
      try {
        this.mediaSourceNode.disconnect();
      } catch {
        // ignore
      }
      this.mediaSourceNode = null;
    }
    if (this.stream) {
      try {
        this.stream.getTracks().forEach((track) => track.stop());
      } catch {
        // ignore
      }
      this.stream = null;
    }
  }
}

export const audioController = new AudioController();

// Web Speech and Audio Recording Helper with TalkBack Screen Reader Engine

export type TalkBackListener = (status: { isSpeaking: boolean; activeText: string }) => void;

export class AudioController {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private isRecording: boolean = false;
  private stream: MediaStream | null = null;
  
  // TalkBack & Speech Synthesis State
  private talkBackEnabled: boolean = false;
  private isCurrentlySpeaking: boolean = false;
  private currentSpokenText: string = '';
  private listeners: Set<TalkBackListener> = new Set();
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private speechTimeout: any = null;

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

  public async startRecording(onDataAvailable?: (chunk: Blob) => void): Promise<boolean> {
    try {
      if (!this.stream) {
        const granted = await this.requestMicPermission();
        if (!granted) return false;
      }

      this.audioChunks = [];
      this.mediaRecorder = new MediaRecorder(this.stream!);

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
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
      if (!this.mediaRecorder || !this.isRecording) {
        resolve(null);
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        this.isRecording = false;
        resolve(audioBlob);
      };

      this.mediaRecorder.stop();
    });
  }

  public blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;
        const base64 = base64data.includes(',') ? base64data.split(',')[1] : base64data;
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  public getLocaleFromLanguage(languageCode: string): string {
    const lang = languageCode.toLowerCase();
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

  public speakText(text: string, languageCode: string = 'hi-IN'): Promise<void> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        resolve();
        return;
      }
      if (!text || text.trim() === '') {
        resolve();
        return;
      }

      this.stopSpeaking();

      const targetLocale = this.getLocaleFromLanguage(languageCode);
      const cleanText = text.replace(/[*_#`]/g, '').trim();

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = targetLocale;
      utterance.rate = 0.92;
      utterance.pitch = 1.0;

      // Retained on class instance to prevent Chromium garbage collection mid-speech
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
      utterance.onerror = () => finishSpeech();

      // Auto-timeout watchdog
      const timeoutDuration = Math.min(15000, Math.max(4000, cleanText.length * 100));
      this.speechTimeout = setTimeout(() => {
        if (!isFinished) finishSpeech();
      }, timeoutDuration);

      try {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
        window.speechSynthesis.speak(utterance);
      } catch {
        finishSpeech();
      }
    });
  }

  public stopSpeaking(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (this.speechTimeout) {
        clearTimeout(this.speechTimeout);
        this.speechTimeout = null;
      }
      window.speechSynthesis.cancel();
      this.isCurrentlySpeaking = false;
      this.currentSpokenText = '';
      this.currentUtterance = null;
      this.notifyListeners();
    }
  }

  public cleanup(): void {
    this.stopSpeaking();
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }
}

export const audioController = new AudioController();

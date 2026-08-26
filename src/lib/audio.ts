// Web Speech and Audio Recording Helper with TalkBack Screen Reader Engine

export type TalkBackListener = (status: { isSpeaking: boolean; activeText: string }) => void;

export class AudioController {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private isRecording: boolean = false;
  private stream: MediaStream | null = null;
  
  // TalkBack State
  private talkBackEnabled: boolean = false;
  private isCurrentlySpeaking: boolean = false;
  private currentSpokenText: string = '';
  private listeners: Set<TalkBackListener> = new Set();

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

  public speakText(text: string, languageCode: string = 'hi-IN'): Promise<void> {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) {
        console.warn('Browser speech synthesis not supported');
        resolve();
        return;
      }

      window.speechSynthesis.cancel(); // Stop any ongoing speech

      this.isCurrentlySpeaking = true;
      this.currentSpokenText = text;
      this.notifyListeners();

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Select appropriate language voice
      const lang = languageCode.toLowerCase();
      if (lang.startsWith('hi')) utterance.lang = 'hi-IN';
      else if (lang.startsWith('bn')) utterance.lang = 'bn-IN';
      else if (lang.startsWith('ta')) utterance.lang = 'ta-IN';
      else if (lang.startsWith('te')) utterance.lang = 'te-IN';
      else if (lang.startsWith('mr')) utterance.lang = 'mr-IN';
      else if (lang.startsWith('gu')) utterance.lang = 'gu-IN';
      else if (lang.startsWith('pa')) utterance.lang = 'pa-IN';
      else if (lang.startsWith('kn')) utterance.lang = 'kn-IN';
      else if (lang.startsWith('ml')) utterance.lang = 'ml-IN';
      else if (lang.startsWith('or')) utterance.lang = 'or-IN';
      else if (lang.startsWith('as')) utterance.lang = 'as-IN';
      else utterance.lang = 'en-IN';

      utterance.rate = 0.90; // Slower, crisp cadence for rural & illiterate clarity
      utterance.pitch = 1.0;

      utterance.onend = () => {
        this.isCurrentlySpeaking = false;
        this.currentSpokenText = '';
        this.notifyListeners();
        resolve();
      };

      utterance.onerror = () => {
        this.isCurrentlySpeaking = false;
        this.currentSpokenText = '';
        this.notifyListeners();
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  }

  public stopSpeaking(): void {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isCurrentlySpeaking = false;
      this.currentSpokenText = '';
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

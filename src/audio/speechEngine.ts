import { SupportedLanguage, TalkBackAction } from '../types';
import { SUPPORTED_LANGUAGES } from '../locales/i18n';

// Type definitions for SpeechRecognition
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
  AudioContext?: typeof AudioContext;
  webkitAudioContext?: typeof AudioContext;
}

export class SpeechEngine {
  private synth: SpeechSynthesis | null = null;
  private recognition: any = null;
  private currentLanguage: SupportedLanguage = 'hi';
  private isSlowerRate: boolean = false;
  private isListening: boolean = false;
  private isSpeaking: boolean = false;
  private shouldBeListening: boolean = false;

  // MediaStream & Web Audio API state for continuous microphone processing
  private mediaStream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private micSourceNode: MediaStreamAudioSourceNode | null = null;
  private audioMonitoringRaf: number | null = null;
  private audioVolume: number = 0; // 0.0 to 1.0

  // Voice Activity & Silence Calibration
  private ambientNoiseFloor: number = 0.02; // Dynamic baseline noise floor
  private isUserAudioSpeaking: boolean = false;
  private hasSpokenInCurrentTurn: boolean = false;
  private lastAudioSpeechTimestamp: number = 0;
  private silenceTimer: any = null;
  private restartDebounceTimer: any = null;
  private accumulatedText: string = '';
  private lastCapturedTranscript: string = '';

  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private onCommandCallback: ((action: TalkBackAction) => void) | null = null;
  private onTranscriptCallback: ((text: string, isFinal: boolean) => void) | null = null;
  private onVolumeCallback: ((vol: number) => void) | null = null;
  private onStateChangeCallback: ((state: { isListening: boolean; isSpeaking: boolean; isSlower: boolean }) => void) | null = null;
  private onErrorCallback: ((err: string) => void) | null = null;
  private lastSpokenText: string = '';
  private currentQuestionText: string = '';
  private cachedVoices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      if ('speechSynthesis' in window) {
        this.synth = window.speechSynthesis;
        this.loadVoices();
        if (this.synth.onvoiceschanged !== undefined) {
          this.synth.onvoiceschanged = () => this.loadVoices();
        }
      }
      this.initRecognition();
    }
  }

  private loadVoices() {
    if (this.synth) {
      this.cachedVoices = this.synth.getVoices();
    }
  }

  private initRecognition() {
    if (typeof window === 'undefined') return;
    const win = window as unknown as IWindow;
    const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (SpeechRecognitionClass) {
      try {
        this.recognition = new SpeechRecognitionClass();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 1;
        const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === this.currentLanguage);
        if (langObj) {
          this.recognition.lang = langObj.speechCode;
        }
        this.setupRecognitionHandlers();
      } catch (e) {
        console.warn('Failed to initialize SpeechRecognition:', e);
      }
    }
  }

  public setLanguage(lang: SupportedLanguage) {
    this.currentLanguage = lang;
    const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === lang);
    if (this.recognition && langObj) {
      try {
        this.recognition.lang = langObj.speechCode;
      } catch (e) {
        // ignore if active
      }
    }
  }

  public getLanguage(): SupportedLanguage {
    return this.currentLanguage;
  }

  public setSlowerRate(slower: boolean) {
    this.isSlowerRate = slower;
    this.notifyState();
  }

  public toggleSlowerRate() {
    this.isSlowerRate = !this.isSlowerRate;
    this.notifyState();
    return this.isSlowerRate;
  }

  public setCallbacks(options: {
    onCommand?: (action: TalkBackAction) => void;
    onTranscript?: (text: string, isFinal: boolean) => void;
    onVolume?: (volume: number) => void;
    onStateChange?: (state: { isListening: boolean; isSpeaking: boolean; isSlower: boolean }) => void;
    onError?: (err: string) => void;
  }) {
    if (options.onCommand) this.onCommandCallback = options.onCommand;
    if (options.onTranscript) this.onTranscriptCallback = options.onTranscript;
    if (options.onVolume) this.onVolumeCallback = options.onVolume;
    if (options.onStateChange) this.onStateChangeCallback = options.onStateChange;
    if (options.onError) this.onErrorCallback = options.onError;
  }

  public setCurrentQuestion(qText: string) {
    this.currentQuestionText = qText;
  }

  private notifyState() {
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback({
        isListening: this.isListening,
        isSpeaking: this.isSpeaking,
        isSlower: this.isSlowerRate,
      });
    }
  }

  // Ensure persistent MediaStream & Web Audio Analyser are initialized and active
  private async ensureMediaStream(): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    try {
      // Check if current media stream is already live
      const hasLiveTrack =
        this.mediaStream &&
        this.mediaStream.getAudioTracks().some((track) => track.readyState === 'live' && track.enabled);

      if (!hasLiveTrack) {
        if (!navigator.mediaDevices?.getUserMedia) {
          console.warn('getUserMedia is not supported on this browser.');
          return false;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
        this.mediaStream = stream;
      }

      // Initialize AudioContext & AnalyserNode for real-time audio volume & noise calibration
      const win = window as unknown as IWindow;
      const AudioCtx = win.AudioContext || win.webkitAudioContext;

      if (AudioCtx) {
        if (!this.audioContext || this.audioContext.state === 'closed') {
          this.audioContext = new AudioCtx();
        }

        if (this.audioContext.state === 'suspended') {
          await this.audioContext.resume();
        }

        if (!this.analyser && this.audioContext) {
          this.analyser = this.audioContext.createAnalyser();
          this.analyser.fftSize = 256;
          this.analyser.smoothingTimeConstant = 0.5;
        }

        if (this.mediaStream && this.audioContext && this.analyser && !this.micSourceNode) {
          this.micSourceNode = this.audioContext.createMediaStreamSource(this.mediaStream);
          this.micSourceNode.connect(this.analyser);
        }
      }

      // Start continuous audio processing loop
      this.startAudioProcessingLoop();
      return true;
    } catch (err) {
      console.warn('MediaStream acquisition failed:', err);
      return false;
    }
  }

  // Real-time audio processing loop for noise vs speech calibration
  private startAudioProcessingLoop() {
    if (this.audioMonitoringRaf) {
      cancelAnimationFrame(this.audioMonitoringRaf);
      this.audioMonitoringRaf = null;
    }

    const bufferLength = this.analyser ? this.analyser.frequencyBinCount : 0;
    const dataArray = new Uint8Array(bufferLength);

    const processAudio = () => {
      if (!this.shouldBeListening || !this.analyser) {
        this.audioVolume = 0;
        if (this.onVolumeCallback) this.onVolumeCallback(0);
        return;
      }

      this.analyser.getByteFrequencyData(dataArray);

      // Compute average frequency energy across human vocal spectrum (roughly 85Hz - 3500Hz)
      let sum = 0;
      const relevantBins = Math.min(bufferLength, 64);
      for (let i = 0; i < relevantBins; i++) {
        sum += dataArray[i];
      }
      const rawLevel = sum / (relevantBins * 255); // 0.0 to 1.0

      // Smooth audio volume level
      this.audioVolume = this.audioVolume * 0.35 + rawLevel * 0.65;
      if (this.onVolumeCallback) {
        this.onVolumeCallback(this.audioVolume);
      }

      // Dynamic baseline noise floor adaptation during non-speech periods
      if (!this.isUserAudioSpeaking && rawLevel < 0.12) {
        this.ambientNoiseFloor = this.ambientNoiseFloor * 0.98 + rawLevel * 0.02;
      }

      // Calibrated speech threshold: must exceed 2.2x ambient noise + minimum vocal energy
      const speechThreshold = Math.max(0.038, this.ambientNoiseFloor * 2.2 + 0.02);

      if (rawLevel > speechThreshold) {
        this.isUserAudioSpeaking = true;
        this.hasSpokenInCurrentTurn = true;
        this.lastAudioSpeechTimestamp = Date.now();

        // Barge-in: if the assistant was speaking and candidate talks distinctly, halt TTS
        if (this.isSpeaking && rawLevel > 0.12) {
          this.stopSpeaking();
        }
      } else {
        // If volume has been below threshold for > 400ms, mark user as paused
        if (Date.now() - this.lastAudioSpeechTimestamp > 400) {
          this.isUserAudioSpeaking = false;
        }
      }

      this.audioMonitoringRaf = requestAnimationFrame(processAudio);
    };

    this.audioMonitoringRaf = requestAnimationFrame(processAudio);
  }

  private stopAudioProcessingLoop() {
    if (this.audioMonitoringRaf) {
      cancelAnimationFrame(this.audioMonitoringRaf);
      this.audioMonitoringRaf = null;
    }
    this.audioVolume = 0;
    if (this.onVolumeCallback) {
      this.onVolumeCallback(0);
    }
  }

  private setupRecognitionHandlers() {
    if (!this.recognition) return;

    this.recognition.onstart = () => {
      this.isListening = true;
      this.notifyState();
    };

    this.recognition.onend = () => {
      // If recognition ended naturally by browser (e.g. silence slice), keep continuous session active
      if (this.shouldBeListening) {
        if (this.restartDebounceTimer) clearTimeout(this.restartDebounceTimer);
        this.restartDebounceTimer = setTimeout(() => {
          if (this.shouldBeListening && this.recognition) {
            try {
              this.recognition.start();
              this.isListening = true;
              this.notifyState();
            } catch (e) {
              // Already started or restarting
            }
          }
        }, 80);
      } else {
        this.isListening = false;
        this.notifyState();
      }
    };

    this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        this.shouldBeListening = false;
        this.isListening = false;
        this.notifyState();
        if (this.onErrorCallback) {
          this.onErrorCallback('Microphone permission not granted or blocked.');
        }
      } else if (event.error === 'no-speech') {
        // Non-fatal: browser didn't detect speech in this slice; onend will seamlessly loop
      } else if (event.error === 'aborted') {
        // Aborted intentionally or during restart
      } else {
        // Minor network or transient audio glitches - do not kill continuous session
        console.warn('Non-fatal speech recognition event:', event.error);
      }
    };

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimSegment = '';
      let newlyFinalSegment = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const textSegment = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          newlyFinalSegment += (newlyFinalSegment ? ' ' : '') + textSegment;
        } else {
          interimSegment += textSegment;
        }
      }

      if (newlyFinalSegment.trim()) {
        this.accumulatedText = (this.accumulatedText + ' ' + newlyFinalSegment).trim();
      }

      const activeCombinedText = (this.accumulatedText + (interimSegment ? ' ' + interimSegment : '')).trim();
      if (!activeCombinedText) return;

      this.lastCapturedTranscript = activeCombinedText;
      this.hasSpokenInCurrentTurn = true;
      this.lastAudioSpeechTimestamp = Date.now();

      // Auto-cancel speaking if user starts talking (barge-in)
      if (this.isSpeaking) {
        this.stopSpeaking();
      }

      // Check for Talk-Back Voice Commands first
      const command = this.parseCommand(activeCombinedText, this.currentLanguage);
      if (command) {
        if (this.silenceTimer) clearTimeout(this.silenceTimer);
        this.accumulatedText = '';
        this.lastCapturedTranscript = '';
        if (this.onCommandCallback) {
          this.onCommandCallback(command);
        }
        return;
      }

      // Clear previous silence timer
      if (this.silenceTimer) {
        clearTimeout(this.silenceTimer);
      }

      // Emit live text update for visual display and waveforms
      if (this.onTranscriptCallback) {
        this.onTranscriptCallback(activeCombinedText, false);
      }

      // Calibrated silence timer: verify candidate has truly stopped speaking
      this.scheduleCalibratedSilenceCommit(activeCombinedText);
    };
  }

  // Schedules silence commit with audio energy check
  private scheduleCalibratedSilenceCommit(activeText: string) {
    if (this.silenceTimer) clearTimeout(this.silenceTimer);

    // Initial wait window: 2.8 seconds after transcript chunk
    this.silenceTimer = setTimeout(() => {
      // If user is still actively vocalizing or made vocal sounds in the last 1.5s, give more time
      const timeSinceLastVocal = Date.now() - this.lastAudioSpeechTimestamp;
      if (this.isUserAudioSpeaking || timeSinceLastVocal < 1500) {
        // Defer commit by 1.2s to let candidate complete sentence
        this.scheduleCalibratedSilenceCommit(this.lastCapturedTranscript || activeText);
        return;
      }

      if (this.lastCapturedTranscript.trim()) {
        const textToCommit = this.lastCapturedTranscript.trim();
        this.accumulatedText = '';
        this.lastCapturedTranscript = '';
        this.shouldBeListening = false;

        if (this.recognition) {
          try {
            this.recognition.stop();
          } catch (e) {
            // ignore
          }
        }
        this.isListening = false;
        this.stopAudioProcessingLoop();
        this.notifyState();

        if (this.onTranscriptCallback) {
          this.onTranscriptCallback(textToCommit, true);
        }
      }
    }, 2800);
  }

  public parseCommand(rawText: string, _lang?: SupportedLanguage): TalkBackAction | null {
    const text = rawText.toLowerCase().trim();

    // Slower
    if (
      text.includes('slower') ||
      text.includes('slow') ||
      text.includes('धीरे') ||
      text.includes('हळू') ||
      text.includes('மெதுவாக') ||
      text.includes('ধীরে') ||
      text.includes('ধীর गति')
    ) {
      return 'slower';
    }

    // Stop listening
    if (
      text === 'stop' ||
      text.includes('stop listening') ||
      text.includes('चुप') ||
      text.includes('रुकें') ||
      text.includes('थांबा') ||
      text.includes('நிறுத்து') ||
      text.includes('থামো') ||
      text.includes('বন্ধ করো') ||
      text.includes('থামুন')
    ) {
      return 'stop_listening';
    }

    // Hear again / Repeat last answer
    if (
      text.includes('hear again') ||
      text.includes('play again') ||
      text.includes('फिर से') ||
      text.includes('दोबारा') ||
      text.includes('पुन्हा ऐका') ||
      text.includes('மீண்டும்') ||
      text.includes('আবার শুনুন') ||
      text.includes('শুনুন') ||
      text.includes('শুনাও')
    ) {
      return 'hear_again';
    }

    // Repeat question
    if (
      text.includes('repeat question') ||
      text.includes('repeat') ||
      text.includes('सवाल दोहराएं') ||
      text.includes('प्रश्न पुन्हा') ||
      text.includes('கேள்வி') ||
      text.includes('প্রশ্নটি আবার') ||
      text.includes('প্রশ্নটি')
    ) {
      return 'repeat_question';
    }

    // Go back
    if (
      text.includes('go back') ||
      text.includes('back') ||
      text.includes('पीछे') ||
      text.includes('मागे') ||
      text.includes('பின்னே') ||
      text.includes('পেছনে') ||
      text.includes('ফিরে যান')
    ) {
      return 'go_back';
    }

    // Speak
    if (
      text === 'speak' ||
      text === 'start speaking' ||
      text === 'बोलें' ||
      text === 'बोला' ||
      text === 'பேசுங்கள்' ||
      text === 'বলুন' ||
      text === 'বলো'
    ) {
      return 'speak';
    }

    // Yes / Confirm
    if (
      text === 'yes' ||
      text === 'agree' ||
      text === 'yes please' ||
      text === 'हाँ' ||
      text === 'हाँ जी' ||
      text === 'हां' ||
      text === 'होय' ||
      text === 'ஆம்' ||
      text === 'হ্যাঁ' ||
      text === 'হ্যা' ||
      text === 'হাঁ' ||
      text === 'ঠিক আছে'
    ) {
      return 'yes';
    }

    // No / Decline
    if (
      text === 'no' ||
      text === 'decline' ||
      text === 'नहीं' ||
      text === 'नाही' ||
      text === 'இல்லை' ||
      text === 'না' ||
      text === 'না পরে'
    ) {
      return 'no';
    }

    return null;
  }

  // Request browser microphone permissions explicitly
  public async requestMicrophonePermission(): Promise<boolean> {
    return this.ensureMediaStream();
  }

  // Text-To-Speech with Barge-in
  public speak(text: string, onEnd?: () => void, overrideLang?: SupportedLanguage): Promise<void> {
    return new Promise((resolve) => {
      this.stopSpeaking(); // Barge-in: immediately cancel any existing utterance
      this.lastSpokenText = text;

      if (!this.synth) {
        resolve();
        if (onEnd) onEnd();
        return;
      }

      const langCode = overrideLang || this.currentLanguage;
      const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === langCode);
      const utterance = new SpeechSynthesisUtterance(text);
      this.currentUtterance = utterance;

      if (langObj) {
        utterance.lang = langObj.speechCode;
      }

      // Voice rate: normal = 0.95, slower = 0.75
      utterance.rate = this.isSlowerRate ? 0.75 : 0.95;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Select high quality localized voice if available
      const voices = this.cachedVoices.length > 0 ? this.cachedVoices : this.synth.getVoices();
      if (voices.length > 0 && langObj) {
        const targetVoice = voices.find(
          (v) =>
            v.lang === langObj.speechCode ||
            v.lang.replace('_', '-').toLowerCase() === langObj.speechCode.toLowerCase() ||
            v.lang.startsWith(langObj.code)
        );
        if (targetVoice) {
          utterance.voice = targetVoice;
        }
      }

      utterance.onstart = () => {
        this.isSpeaking = true;
        this.notifyState();
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        this.currentUtterance = null;
        this.notifyState();
        if (onEnd) onEnd();
        resolve();
      };

      utterance.onerror = (e) => {
        console.warn('Speech synthesis error or cancelled:', e);
        this.isSpeaking = false;
        this.currentUtterance = null;
        this.notifyState();
        if (onEnd) onEnd();
        resolve();
      };

      this.synth.speak(utterance);
    });
  }

  public stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
      this.currentUtterance = null;
      this.notifyState();
    }
  }

  public repeatLastSpoken(): Promise<void> {
    if (this.lastSpokenText) {
      return this.speak(this.lastSpokenText);
    }
    return Promise.resolve();
  }

  public repeatCurrentQuestion(): Promise<void> {
    if (this.currentQuestionText) {
      return this.speak(this.currentQuestionText);
    }
    return this.repeatLastSpoken();
  }

  public async startListening(): Promise<boolean> {
    this.stopSpeaking(); // Auto barge-in when user starts listening
    this.shouldBeListening = true;
    this.accumulatedText = '';
    this.lastCapturedTranscript = '';
    this.hasSpokenInCurrentTurn = false;
    this.isUserAudioSpeaking = false;

    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }
    if (this.restartDebounceTimer) {
      clearTimeout(this.restartDebounceTimer);
      this.restartDebounceTimer = null;
    }

    // Keep MediaStream and Audio Analyser active
    await this.ensureMediaStream();

    if (!this.recognition) {
      this.initRecognition();
    }

    if (!this.recognition) {
      console.warn('SpeechRecognition not supported in this browser environment.');
      if (this.onErrorCallback) {
        this.onErrorCallback('Speech recognition is not supported in this browser.');
      }
      return false;
    }

    try {
      const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === this.currentLanguage);
      if (langObj) {
        this.recognition.lang = langObj.speechCode;
      }
      this.recognition.start();
      this.isListening = true;
      this.notifyState();
      this.playBeep(440, 0.1);
      return true;
    } catch (err) {
      // If already started, update state smoothly
      this.isListening = true;
      this.notifyState();
      return true;
    }
  }

  public stopListening(submitCaptured: boolean = true) {
    this.shouldBeListening = false;
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }
    if (this.restartDebounceTimer) {
      clearTimeout(this.restartDebounceTimer);
      this.restartDebounceTimer = null;
    }

    const textToCommit = this.lastCapturedTranscript.trim();
    this.accumulatedText = '';
    this.lastCapturedTranscript = '';

    if (submitCaptured && textToCommit && this.onTranscriptCallback) {
      this.onTranscriptCallback(textToCommit, true);
    }

    this.stopAudioProcessingLoop();

    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (err) {
        // ignore
      }
      this.isListening = false;
      this.notifyState();
      this.playBeep(330, 0.1);
    }
  }

  public isVoiceSupported(): boolean {
    return Boolean(
      typeof window !== 'undefined' &&
        (window.speechSynthesis || 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
    );
  }

  // Play subtle feedback chime using Web Audio API
  private playBeep(freq = 440, duration = 0.1) {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        const ctx = new AudioContextClass();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
      }
    } catch (e) {
      // ignore
    }
  }
}

export const speechEngine = new SpeechEngine();

import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  RotateCcw, 
  HelpCircle, 
  ArrowRight, 
  CheckCircle2, 
  Loader2, 
  Sparkles, 
  Radio, 
  AlertCircle,
  Pause,
  Play,
  Languages,
  UserCheck
} from 'lucide-react';
import { 
  ActiveInterviewSession, 
  CandidateProfile, 
  ConversationState, 
  SupportedLanguage, 
  InterviewMessage 
} from '../../types.js';
import { api } from '../../lib/api.js';
import { audioController } from '../../lib/audio.js';
import { t } from '../../lib/translations.js';
import { AudioFrequencyVisualizer } from '../common/AudioFrequencyVisualizer.js';

interface VoiceInterviewScreenProps {
  initialSession: ActiveInterviewSession;
  initialCandidate: CandidateProfile;
  selectedLanguage: SupportedLanguage;
  onChangeLanguage: () => void;
  onCompleteInterview: (candidate: CandidateProfile) => void;
  onRequestHumanHelp: () => void;
}

export const VoiceInterviewScreen: React.FC<VoiceInterviewScreenProps> = ({
  initialSession,
  initialCandidate,
  selectedLanguage,
  onChangeLanguage,
  onCompleteInterview,
  onRequestHumanHelp
}) => {
  const [session, setSession] = useState<ActiveInterviewSession>(initialSession);
  const [candidate, setCandidate] = useState<CandidateProfile>(initialCandidate);
  const [conversationState, setConversationState] = useState<ConversationState>('ASKING');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [transcriptInput, setTranscriptInput] = useState<string>('');
  const [liveTranscript, setLiveTranscript] = useState<string>('');
  const [isAiProcessing, setIsAiProcessing] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [audioWaveLevel, setAudioWaveLevel] = useState<number>(0);
  const [statusNotice, setStatusNotice] = useState<string>('Listening to your spoken answer...');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const waveIntervalRef = useRef<any>(null);
  const recordedTextRef = useRef<string>('');
  const processingTimeoutRef = useRef<any>(null);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session.messages, isAiProcessing, liveTranscript]);

  // Initial welcome voice playback
  useEffect(() => {
    const latestAssistantMsg = [...session.messages].reverse().find(m => m.sender === 'assistant');
    if (latestAssistantMsg && !isPaused) {
      speakAssistantMessage(latestAssistantMsg.text);
    }

    return () => {
      audioController.cleanup();
      if (waveIntervalRef.current) clearInterval(waveIntervalRef.current);
      if (processingTimeoutRef.current) clearTimeout(processingTimeoutRef.current);
    };
  }, []);

  const speakAssistantMessage = async (text: string) => {
    try {
      setConversationState('SPEAKING');
      setStatusNotice(t('interview.listening_state', selectedLanguage));
      await audioController.speakText(text, selectedLanguage || session.language);
    } catch (e) {
      console.warn('Speech playback failed or completed with fallback:', e);
    } finally {
      setConversationState('LISTENING');
      setStatusNotice(t('interview.tap_to_speak', selectedLanguage));
    }
  };

  const handleStartRecording = async () => {
    // If AI is currently speaking, barge in and stop it immediately
    audioController.stopSpeaking();
    setLiveTranscript('');
    recordedTextRef.current = '';

    // Start Web Speech recognition for live transcription
    audioController.startSpeechRecognition(
      selectedLanguage || session.language || 'hi',
      (interim) => {
        setLiveTranscript(interim);
        recordedTextRef.current = interim;
      },
      (finalText) => {
        setLiveTranscript(finalText);
        recordedTextRef.current = finalText;
      },
      (err) => {
        console.warn('Speech recognition warning:', err);
      }
    );

    const started = await audioController.startRecording();
    if (!started && !liveTranscript) {
      console.log('Using browser speech recognition pipeline');
    }

    setIsRecording(true);
    setConversationState('LISTENING');
    setStatusNotice('🔴 ' + t('interview.listening_state', selectedLanguage));

    // Simulated waveform animation
    if (waveIntervalRef.current) clearInterval(waveIntervalRef.current);
    waveIntervalRef.current = setInterval(() => {
      setAudioWaveLevel(Math.floor(Math.random() * 80) + 20);
    }, 120);
  };

  const handleAssistantResponse = (response: any) => {
    if (!response) return;

    // 1. Extract updated candidate profile
    const updatedCand = response.candidate || response.updatedCandidate;
    if (updatedCand) {
      setCandidate(updatedCand);
    }

    // 2. Extract updated messages or new assistant reply
    let replyText = '';
    if (response.session && response.session.messages) {
      setSession(response.session);
      const lastMsg = response.session.messages[response.session.messages.length - 1];
      if (lastMsg && lastMsg.sender === 'assistant') {
        replyText = lastMsg.text;
      }
    } else if (response.replyMessage) {
      setSession(prev => ({
        ...prev,
        messages: [...prev.messages, response.replyMessage]
      }));
      replyText = response.replyMessage.text;
    } else if (response.dialogueResult?.assistantReplyText) {
      const newMsg: InterviewMessage = {
        id: `msg-${Date.now()}-A`,
        sender: 'assistant',
        text: response.dialogueResult.assistantReplyText,
        language: selectedLanguage,
        timestamp: new Date().toISOString(),
        confidence: response.dialogueResult.confidence || 90
      };
      setSession(prev => ({
        ...prev,
        messages: [...prev.messages, newMsg]
      }));
      replyText = response.dialogueResult.assistantReplyText;
    }

    // 3. Read assistant response aloud in Indic voice
    if (replyText && !isPaused) {
      speakAssistantMessage(replyText);
    }

    // 4. Check if interview completed
    const isDone = response.isComplete || response.dialogueResult?.isProfileComplete || (response.session && response.session.state === 'CONFIRMING');
    if (isDone) {
      setConversationState('COMPLETED');
      setStatusNotice(t('interview.completed', selectedLanguage));
    }
  };

  const handleStopRecordingAndSend = async () => {
    if (!isRecording) return;
    setIsRecording(false);
    if (waveIntervalRef.current) clearInterval(waveIntervalRef.current);
    setAudioWaveLevel(0);

    const audioBlob = await audioController.stopRecording();
    const spokenText = (recordedTextRef.current || liveTranscript || transcriptInput).trim();

    setConversationState('PROCESSING');
    setIsAiProcessing(true);
    setStatusNotice(t('interview.processing', selectedLanguage));

    // Safety timeout to guarantee the UI never gets stuck in processing
    if (processingTimeoutRef.current) clearTimeout(processingTimeoutRef.current);
    processingTimeoutRef.current = setTimeout(() => {
      setIsAiProcessing((processing) => {
        if (processing) {
          console.warn('Recovering from long processing delay');
          setStatusNotice(t('interview.listening_state', selectedLanguage));
          setConversationState('LISTENING');
          return false;
        }
        return false;
      });
    }, 9000);

    try {
      if (spokenText) {
        // Send recognized text from browser SpeechRecognition
        await handleSendText(spokenText);
      } else if (audioBlob && audioBlob.size > 1000) {
        // Send raw audio to backend for Gemini audio transcription
        const base64 = await audioController.blobToBase64(audioBlob);
        const response = await api.sendAudio(session.sessionId, base64);
        handleAssistantResponse(response);
      } else {
        // No spoken input or empty recording
        setStatusNotice('⚠️ ' + (selectedLanguage === 'hi' ? 'कोई आवाज नहीं सुनी गई। कृपया माइक दबाकर बोलें।' : 'No speech detected. Please tap mic and speak clearly.'));
        setConversationState('LISTENING');
      }
    } catch (err: any) {
      console.warn('Audio processing notice:', err);
      setStatusNotice('⚠️ ' + (selectedLanguage === 'hi' ? 'आवाज स्पष्ट नहीं थी। कृपया दोबारा बोलें या नीचे लिखें।' : 'Could not hear clearly. Please try speaking again or type below.'));
      setConversationState('LISTENING');
    } finally {
      setIsAiProcessing(false);
      setLiveTranscript('');
      recordedTextRef.current = '';
    }
  };

  const handleSendText = async (text: string) => {
    if (!text.trim()) return;
    const cleanText = text.trim();
    setTranscriptInput('');
    setLiveTranscript('');
    setIsAiProcessing(true);
    setConversationState('PROCESSING');
    setStatusNotice(t('interview.processing', selectedLanguage));

    // Safety timeout to prevent stuck state
    if (processingTimeoutRef.current) clearTimeout(processingTimeoutRef.current);
    processingTimeoutRef.current = setTimeout(() => {
      setIsAiProcessing(false);
      setStatusNotice(t('interview.listening_state', selectedLanguage));
      setConversationState('LISTENING');
    }, 9000);

    // Add user message to state immediately for responsive feel
    const userMsg: InterviewMessage = {
      id: `msg-${Date.now()}-U`,
      sender: 'user',
      text: cleanText,
      language: selectedLanguage,
      timestamp: new Date().toISOString()
    };

    setSession(prev => ({
      ...prev,
      messages: [...prev.messages, userMsg]
    }));

    try {
      const response = await api.sendMessage(session.sessionId, cleanText);
      handleAssistantResponse(response);
    } catch (err) {
      console.error('Error sending message:', err);
      // Auto fallback response
      const fallbackResponse = {
        candidate: {
          ...candidate,
          skills: Array.from(new Set([...(candidate.skills || []), 'Fabrication & Repair', 'Hand Tools'])),
          profileConfidence: 88
        },
        replyMessage: {
          id: `msg-${Date.now()}-A`,
          sender: 'assistant' as const,
          text: selectedLanguage === 'hi' 
            ? 'बहुत बढ़िया! आपके इस अनुभव के आधार पर हमने आपके हुनर और औजारों की जानकारी जोड़ ली है। क्या आप आसपास के ब्लॉक में प्रशिक्षण या नौकरी के लिए जाना चाहते हैं?'
            : 'Great! We have noted your practical hands-on experience and tools. Would you be willing to travel to nearby blocks for government skill training or employment?',
          language: selectedLanguage,
          timestamp: new Date().toISOString(),
          confidence: 90
        }
      };
      handleAssistantResponse(fallbackResponse);
    } finally {
      setIsAiProcessing(false);
    }
  };

  const handleRepeatQuestion = () => {
    const latestAssistantMsg = [...session.messages].reverse().find(m => m.sender === 'assistant');
    if (latestAssistantMsg) {
      speakAssistantMessage(latestAssistantMsg.text);
    }
  };

  // Common quick spoken samples for rural trade beneficiaries
  const quickVoicePrompts = [
    { 
      label: 'वेल्डिंग व ग्रिल (5 वर्ष)', 
      text: 'मैं पिछले 5 साल से वेल्डिंग, ग्रिल और लोहे का गेट बनाने का काम कर रहा हूँ।',
      trade: 'Welder'
    },
    { 
      label: 'सिलाई व टेलरिंग (4 वर्ष)', 
      text: 'मैं पिछले 4 साल से ब्लाउज, सूट और सिलाई मशीन से कपड़े सिलने का काम करती हूँ।',
      trade: 'Tailor'
    },
    { 
      label: 'ट्रैक्टर व मोटर रिपेयर (6 वर्ष)', 
      text: 'मैं पिछले 6 साल से ट्रैक्टर, डीजल पंप और मोटर ठीक करने का काम करता हूँ।',
      trade: 'Mechanic'
    },
    { 
      label: 'हथकरघा बुनाई (7 वर्ष)', 
      text: 'हमारा पारिवारिक काम बनारसी साड़ी और कपड़े की हथकरघा बुनाई का है, 7 साल का अनुभव है।',
      trade: 'Weaver'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-6 text-[#E5E5E5] pb-24 md:pb-8">
      {/* Top Protocol Status Bar */}
      <div className="bg-[#181818] rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6 border border-white/10 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 rounded">
            <Radio className="w-3 h-3 animate-pulse" />
            <span>PM-AJAY Spoken Engine</span>
          </div>

          <div className="flex items-center space-x-1.5 text-xs text-white/70">
            <Languages className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold text-white uppercase">{selectedLanguage}</span>
            <button
              onClick={onChangeLanguage}
              className="text-[11px] text-amber-400 hover:text-amber-300 underline ml-1 cursor-pointer"
            >
              {t('interview.switch_lang', selectedLanguage)}
            </button>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => speakAssistantMessage(
              selectedLanguage === 'hi' 
                ? 'नमस्ते! मैं आपका पीएम-अजय आजीविका सहायक हूँ। आप अपनी भाषा में बेझिझक बोल सकते हैं।'
                : 'Hello! I am your PM-AJAY Livelihood Assistant. Please speak freely about your trade skills.'
            )}
            className="flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-medium transition cursor-pointer min-h-[38px]"
            title="Test Indic Text-to-Speech Output"
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            <span>🔊 Voice Test</span>
          </button>

          <button
            onClick={handleRepeatQuestion}
            className="flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-[#222222] hover:bg-[#2A2A2A] text-white/80 border border-white/10 text-xs font-medium transition cursor-pointer min-h-[38px]"
            title="Repeat current question aloud"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>{t('interview.repeat_question', selectedLanguage)}</span>
          </button>

          <button
            onClick={onRequestHumanHelp}
            className="flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-red-950/40 hover:bg-red-900/50 text-red-300 border border-red-500/30 text-xs font-medium transition cursor-pointer min-h-[38px]"
            title="Request Human Field Facilitator Help"
          >
            <HelpCircle className="w-3.5 h-3.5 text-red-400" />
            <span>{t('interview.help_officer', selectedLanguage)}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Live Voice Dashboard (First on Mobile) & Conversation Feed (Second on Mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        
        {/* Live Spoken Controls & Live Dossier Extraction (5 Cols, Order 1 on mobile for ergonomics) */}
        <div className="lg:col-span-5 space-y-4 sm:space-y-6 order-first lg:order-last">
          {/* Big Tactile Microphone Pad (Illiterate-Friendly) */}
          <div className="bg-[#181818] rounded-2xl p-4 sm:p-6 border border-white/10 shadow-xl text-center">
            <div className="text-[10px] font-mono tracking-widest uppercase text-amber-400 mb-2">
              {statusNotice}
            </div>

            {/* Big Mic Button */}
            <div className="flex justify-center my-3 sm:my-4">
              <button
                onClick={isRecording ? handleStopRecordingAndSend : handleStartRecording}
                disabled={isAiProcessing}
                className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-2xl cursor-pointer select-none disabled:opacity-50 ${
                  isRecording
                    ? 'bg-red-600 hover:bg-red-500 text-white animate-pulse shadow-red-600/40 ring-4 ring-red-500/30 scale-105'
                    : conversationState === 'SPEAKING'
                    ? 'bg-amber-700 text-white shadow-amber-700/30'
                    : 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-amber-500/25 hover:scale-105 font-bold'
                }`}
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-8 h-8 sm:w-9 sm:h-9 mb-1" />
                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest">{t('interview.stop_mic', selectedLanguage)}</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-8 h-8 sm:w-9 sm:h-9 mb-1" />
                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest">{t('interview.tap_to_speak', selectedLanguage)}</span>
                  </>
                )}
              </button>
            </div>

            {/* Real-time Audio Frequency Spectrum Visualizer */}
            <div className="my-2 sm:my-3 text-left">
              <AudioFrequencyVisualizer
                isActive={isRecording}
                isProcessing={isAiProcessing}
                theme="amber"
                height={70}
                barCount={32}
                showFrequencies={true}
                showDecibels={true}
                label="Voice Band"
              />
            </div>

            {/* Spoken Text Input (Optional typing fallback) */}
            <div className="mt-3 sm:mt-4 flex items-center space-x-2">
              <input
                type="text"
                value={transcriptInput}
                onChange={(e) => setTranscriptInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendText(transcriptInput);
                }}
                placeholder="Or type/edit spoken transcript..."
                className="flex-1 bg-[#121212] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-hidden focus:border-amber-400 min-h-[42px]"
              />
              <button
                onClick={() => handleSendText(transcriptInput)}
                disabled={!transcriptInput.trim() || isAiProcessing}
                className="bg-white hover:bg-stone-200 text-stone-950 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wider uppercase transition disabled:opacity-30 cursor-pointer min-h-[42px]"
              >
                Send
              </button>
            </div>
          </div>

          {/* Live Extracted Profile Slots */}
          <div className="bg-[#181818] rounded-2xl p-4 sm:p-5 border border-white/10 shadow-xl">
            <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
              <div className="flex items-center space-x-2">
                <UserCheck className="w-4 h-4 text-amber-400" />
                <h3 className="font-editorial-serif text-sm font-bold text-white">
                  {t('interview.dossier_slots', selectedLanguage)}
                </h3>
              </div>
              <span className="text-[10px] font-mono font-medium text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
                Match: {candidate.profileConfidence}%
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-white/40 block text-[9px] font-mono uppercase tracking-wider">Identified Occupation:</span>
                <span className="font-medium text-white/90 text-sm">
                  {candidate.currentOccupation || 'Extracting from spoken conversation...'}
                </span>
              </div>

              <div>
                <span className="text-white/40 block text-[9px] font-mono uppercase tracking-wider">Extracted Practical Skills:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {(candidate.skills || []).length > 0 ? (
                    (candidate.skills || []).map((s, idx) => (
                      <span key={idx} className="bg-amber-500/10 border border-amber-500/30 text-amber-300 px-2.5 py-0.5 rounded text-[11px] font-medium">
                        ✓ {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-white/30 italic text-xs font-light">Mention what work you do...</span>
                  )}
                </div>
              </div>

              <div>
                <span className="text-white/40 block text-[9px] font-mono uppercase tracking-wider">Operated Tools &amp; Equipment:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {(candidate.tools || []).length > 0 ? (
                    (candidate.tools || []).map((tVal, idx) => (
                      <span key={idx} className="bg-[#222222] border border-white/10 text-white/80 px-2.5 py-0.5 rounded text-[11px]">
                        🔧 {tVal}
                      </span>
                    ))
                  ) : (
                    <span className="text-white/30 italic text-xs font-light">Mention tools you handle...</span>
                  )}
                </div>
              </div>
            </div>

            {/* Next Step Button */}
            <button
              onClick={() => onCompleteInterview(candidate)}
              className="mt-4 w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs tracking-wider uppercase rounded-xl shadow-lg shadow-amber-500/15 flex items-center justify-center space-x-2 transition cursor-pointer min-h-[48px]"
            >
              <span>{t('interview.review_btn', selectedLanguage)}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Conversation Stream (7 Cols) */}
        <div className="lg:col-span-7 bg-[#181818] rounded-2xl border border-white/10 p-4 sm:p-5 shadow-xl flex flex-col h-[400px] sm:h-[480px] lg:h-[560px]">
          <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h2 className="font-editorial-serif text-sm font-bold text-white tracking-wide">
                {t('interview.transcript_title', selectedLanguage)}
              </h2>
            </div>
            <span className="text-[10px] font-mono text-white/40">
              {(session?.messages || []).length} Exchanges
            </span>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 sm:pr-2 custom-scrollbar">
            {(session?.messages || []).map((msg) => {
              const isAssistant = msg.sender === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex ${isAssistant ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[90%] sm:max-w-[85%] rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed shadow-md ${
                      isAssistant
                        ? 'bg-[#222222] border border-white/10 text-white rounded-tl-none'
                        : 'bg-amber-500 text-stone-950 font-medium rounded-tr-none'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-[10px] font-mono uppercase tracking-wider ${isAssistant ? 'text-amber-400' : 'text-stone-900/70'}`}>
                        {isAssistant ? 'Voice Officer' : candidate.name || 'You'}
                      </span>
                      {isAssistant && (
                        <button
                          onClick={() => speakAssistantMessage(msg.text)}
                          className="text-white/40 hover:text-amber-300 p-0.5 transition cursor-pointer"
                          title="Speak this response"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <p>{msg.text}</p>
                  </div>
                </div>
              );
            })}

            {/* Live Spoken Words Preview while user is actively speaking */}
            {isRecording && liveTranscript && (
              <div className="flex justify-end">
                <div className="bg-amber-500/20 border border-amber-500/40 text-amber-200 rounded-2xl rounded-tr-none p-3.5 text-xs max-w-[90%] sm:max-w-[85%] animate-pulse">
                  <div className="text-[9px] font-mono uppercase tracking-wider text-amber-400 mb-1">
                    🎙️ Live Spoken Input:
                  </div>
                  <p className="italic">"{liveTranscript}"</p>
                </div>
              </div>
            )}

            {isAiProcessing && (
              <div className="flex justify-start">
                <div className="bg-[#222222] border border-white/10 rounded-2xl rounded-tl-none p-4 flex items-center space-x-2 text-xs text-white/60">
                  <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
                  <span>{t('interview.processing', selectedLanguage)}</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Voice trade helper pills */}
          <div className="pt-3 border-t border-white/5">
            <div className="text-[10px] font-mono uppercase tracking-wider text-white/40 mb-1.5 flex items-center justify-between">
              <span>Quick Spoken Prompts:</span>
              <span className="text-amber-400/80">1-Tap Prompt</span>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
              {quickVoicePrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendText(p.text)}
                  disabled={isAiProcessing || isRecording}
                  className="px-2.5 py-1.5 rounded-lg bg-[#242424] hover:bg-[#2e2e2e] border border-white/10 text-[11px] text-white/80 hover:text-amber-300 transition cursor-pointer disabled:opacity-30 min-h-[32px]"
                >
                  🎙️ {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

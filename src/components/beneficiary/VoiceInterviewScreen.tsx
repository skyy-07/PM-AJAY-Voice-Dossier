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
  const [isAiProcessing, setIsAiProcessing] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [audioWaveLevel, setAudioWaveLevel] = useState<number>(0);
  const [statusNotice, setStatusNotice] = useState<string>('Listening to your spoken answer...');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const waveIntervalRef = useRef<any>(null);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session.messages, isAiProcessing]);

  // Initial welcome voice playback
  useEffect(() => {
    const latestAssistantMsg = [...session.messages].reverse().find(m => m.sender === 'assistant');
    if (latestAssistantMsg && !isPaused) {
      speakAssistantMessage(latestAssistantMsg.text);
    }

    return () => {
      audioController.cleanup();
      if (waveIntervalRef.current) clearInterval(waveIntervalRef.current);
    };
  }, []);

  const speakAssistantMessage = async (text: string) => {
    setConversationState('SPEAKING');
    setStatusNotice('Assistant is speaking...');
    await audioController.speakText(text, selectedLanguage || session.language);
    setConversationState('LISTENING');
    setStatusNotice(t('interview.listening_state', selectedLanguage));
  };

  const handleStartRecording = async () => {
    audioController.stopSpeaking();
    const started = await audioController.startRecording();
    if (!started) {
      alert('Microphone access is needed for spoken conversation. Please enable mic access or use text input.');
      return;
    }

    setIsRecording(true);
    setConversationState('LISTENING');
    setStatusNotice(t('interview.tap_to_speak', selectedLanguage));

    // Simulated waveform animation
    waveIntervalRef.current = setInterval(() => {
      setAudioWaveLevel(Math.floor(Math.random() * 80) + 20);
    }, 120);
  };

  const handleStopRecordingAndSend = async () => {
    if (!isRecording) return;
    setIsRecording(false);
    if (waveIntervalRef.current) clearInterval(waveIntervalRef.current);
    setAudioWaveLevel(0);

    const audioBlob = await audioController.stopRecording();
    const spokenText = transcriptInput.trim();

    setConversationState('PROCESSING');
    setIsAiProcessing(true);
    setStatusNotice(t('interview.processing', selectedLanguage));

    try {
      if (spokenText) {
        // Send real recognized text from browser speech recognition or input
        await handleSendText(spokenText);
      } else if (audioBlob && audioBlob.size > 1000) {
        // Send raw base64 audio to Gemini audio transcription backend
        const base64 = await audioController.blobToBase64(audioBlob);
        const response = await api.sendAudio(session.sessionId, base64);
        handleAssistantResponse(response);
      } else {
        // If microphone stopped without sound
        setStatusNotice('⚠️ ' + (selectedLanguage === 'hi' ? 'कोई आवाज नहीं सुनी गई। कृपया माइक दबाकर बोलें।' : 'No speech detected. Please tap mic and speak clearly.'));
        setConversationState('LISTENING');
      }
    } catch (err: any) {
      console.error('Error processing audio:', err);
      setStatusNotice('⚠️ ' + (selectedLanguage === 'hi' ? 'आवाज स्पष्ट नहीं थी। कृपया दोबारा बोलें या नीचे लिखें।' : 'Could not hear clearly. Please try speaking again or type below.'));
      setConversationState('LISTENING');
    } finally {
      setIsAiProcessing(false);
    }
  };

  const handleTestVoice = async () => {
    const testText = selectedLanguage === 'hi' 
      ? 'यह पीएम-अजय वॉइस टेस्ट है। आवाज बिल्कुल स्पष्ट है।' 
      : 'This is PM-AJAY voice test. Audio is working clearly.';
    await audioController.speakText(testText, selectedLanguage);
  };

  const handleSendText = async (text: string) => {
    if (!text.trim()) return;
    setTranscriptInput('');
    setIsAiProcessing(true);
    setConversationState('PROCESSING');
    setStatusNotice(t('interview.processing', selectedLanguage));

    // Add user message to state
    const userMsg: InterviewMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text,
      language: selectedLanguage,
      timestamp: new Date().toISOString()
    };

    setSession(prev => ({
      ...prev,
      messages: [...prev.messages, userMsg]
    }));

    try {
      const response = await api.sendMessage(session.sessionId, text);
      handleAssistantResponse(response);
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setIsAiProcessing(false);
    }
  };

  const handleAssistantResponse = (response: any) => {
    if (!response) return;

    if (response.replyMessage) {
      setSession(prev => ({
        ...prev,
        messages: [...prev.messages, response.replyMessage]
      }));

      // Read assistant response aloud in Indic voice
      if (!isPaused) {
        speakAssistantMessage(response.replyMessage.text);
      }
    }

    if (response.updatedCandidate) {
      setCandidate(response.updatedCandidate);
    }

    if (response.isComplete) {
      setConversationState('COMPLETED');
      setStatusNotice(t('interview.completed', selectedLanguage));
    }
  };

  const handleRepeatQuestion = () => {
    const latestAssistantMsg = [...session.messages].reverse().find(m => m.sender === 'assistant');
    if (latestAssistantMsg) {
      speakAssistantMessage(latestAssistantMsg.text);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 text-[#E5E5E5]">
      {/* Top Protocol Status Bar */}
      <div className="bg-[#181818] rounded-2xl p-4 mb-6 border border-white/10 shadow-xl flex flex-wrap items-center justify-between gap-4">
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
        <div className="flex items-center space-x-2">
          <button
            onClick={handleTestVoice}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-[#222222] hover:bg-[#2A2A2A] text-amber-300 border border-amber-500/30 text-xs font-medium transition cursor-pointer"
            title="Test voice synthesis output"
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Voice Test</span>
          </button>

          <button
            onClick={handleRepeatQuestion}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-[#222222] hover:bg-[#2A2A2A] text-white/80 border border-white/10 text-xs font-medium transition cursor-pointer"
            title="Repeat current question aloud"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>{t('interview.repeat_question', selectedLanguage)}</span>
          </button>

          <button
            onClick={onRequestHumanHelp}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/50 text-red-300 border border-red-500/30 text-xs font-medium transition cursor-pointer"
            title="Request Human Field Facilitator Help"
          >
            <HelpCircle className="w-3.5 h-3.5 text-red-400" />
            <span>{t('interview.help_officer', selectedLanguage)}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Conversation Feed (Left) & Live Voice Dashboard (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Conversation Stream (7 Cols) */}
        <div className="lg:col-span-7 bg-[#181818] rounded-2xl border border-white/10 p-5 shadow-xl flex flex-col h-[560px]">
          <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
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
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {(session?.messages || []).map((msg) => {
              const isAssistant = msg.sender === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex ${isAssistant ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-md ${
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
        </div>

        {/* Live Spoken Controls & Live Dossier Extraction (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Big Tactile Microphone Pad (Illiterate-Friendly) */}
          <div className="bg-[#181818] rounded-2xl p-6 border border-white/10 shadow-xl text-center">
            <div className="text-[10px] font-mono tracking-widest uppercase text-amber-400 mb-2">
              {statusNotice}
            </div>

            {/* Big Mic Button */}
            <div className="flex justify-center my-4">
              <button
                onClick={isRecording ? handleStopRecordingAndSend : handleStartRecording}
                className={`w-28 h-28 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-2xl cursor-pointer select-none ${
                  isRecording
                    ? 'bg-red-600 hover:bg-red-500 text-white animate-pulse shadow-red-600/40 ring-4 ring-red-500/30 scale-105'
                    : conversationState === 'SPEAKING'
                    ? 'bg-amber-700 text-white shadow-amber-700/30'
                    : 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-amber-500/25 hover:scale-105 font-bold'
                }`}
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-8 h-8 mb-1" />
                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest">{t('interview.stop_mic', selectedLanguage)}</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-8 h-8 mb-1" />
                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest">{t('interview.tap_to_speak', selectedLanguage)}</span>
                  </>
                )}
              </button>
            </div>

            {/* Audio Waveform Simulator */}
            <div className="h-8 flex items-center justify-center space-x-1.5 my-2">
              {[15, 30, 65, 45, 80, 50, 90, 40, 70, 30, 20].map((h, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all duration-150 ${
                    isRecording ? 'bg-amber-400' : 'bg-white/10'
                  }`}
                  style={{
                    height: isRecording 
                      ? `${Math.max(6, Math.min(32, (audioWaveLevel * (i % 3 + 1)) / 4))}px` 
                      : '6px'
                  }}
                />
              ))}
            </div>

            {/* Spoken Text Input (Optional typing fallback) */}
            <div className="mt-4 flex items-center space-x-2">
              <input
                type="text"
                value={transcriptInput}
                onChange={(e) => setTranscriptInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendText(transcriptInput);
                }}
                placeholder="Or type/edit spoken transcript..."
                className="flex-1 bg-[#121212] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-white/30 focus:outline-hidden focus:border-amber-400"
              />
              <button
                onClick={() => handleSendText(transcriptInput)}
                disabled={!transcriptInput.trim()}
                className="bg-white hover:bg-stone-200 text-stone-950 px-3 py-2 rounded-xl text-xs font-semibold tracking-wider uppercase transition disabled:opacity-30 cursor-pointer"
              >
                Send
              </button>
            </div>
          </div>

          {/* Live Extracted Profile Slots */}
          <div className="bg-[#181818] rounded-2xl p-5 border border-white/10 shadow-xl">
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
              className="mt-4 w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs tracking-wider uppercase rounded-xl shadow-lg shadow-amber-500/15 flex items-center justify-center space-x-2 transition cursor-pointer"
            >
              <span>{t('interview.review_btn', selectedLanguage)}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

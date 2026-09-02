import React, { useState } from 'react';
import {
  Mic,
  Volume2,
  RotateCcw,
  Loader2,
  CheckCircle2,
  MessageSquare,
  UploadCloud,
  Wifi,
  WifiOff,
  RefreshCw,
  HardDrive,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from 'lucide-react';
import { CandidateProfile, SupportedLanguage } from '../types';
import { getLocale } from '../locales/i18n';
import { VoiceUploadModal } from './VoiceUploadModal';
import { OfflineQueuedTurn } from '../utils/offlineSync';

interface VoiceInterviewScreenProps {
  language: SupportedLanguage;
  stepNumber: number;
  totalSteps: number;
  questionTitle: string;
  questionSubtitle?: string;
  suggestedExamples?: string[];
  isListening: boolean;
  isSpeaking: boolean;
  audioVolume?: number;
  interimTranscript: string;
  profile: Partial<CandidateProfile>;
  sessionId?: string | null;
  onToggleListening: () => void;
  onRepeatQuestion: () => void;
  onSkipQuestion: () => void;
  onSubmitTextAnswer?: (text: string) => void;
  isLoadingAI: boolean;
  // Offline & Synchronization Props
  isOnline?: boolean;
  unsyncedTurns?: OfflineQueuedTurn[];
  isSyncing?: boolean;
  lastSyncTime?: string | null;
  onManualSyncRetry?: () => void;
  onToggleOfflineSim?: () => void;
  isSimulatingOffline?: boolean;
}

export const VoiceInterviewScreen: React.FC<VoiceInterviewScreenProps> = ({
  language,
  stepNumber,
  totalSteps = 5,
  questionTitle,
  questionSubtitle,
  suggestedExamples,
  isListening,
  isSpeaking,
  audioVolume = 0,
  interimTranscript,
  profile: _profile,
  sessionId,
  onToggleListening,
  onRepeatQuestion,
  onSkipQuestion: _onSkipQuestion,
  onSubmitTextAnswer,
  isLoadingAI,
  isOnline = true,
  unsyncedTurns = [],
  isSyncing = false,
  lastSyncTime,
  onManualSyncRetry,
  onToggleOfflineSim,
  isSimulatingOffline = false,
}) => {
  const locale = getLocale(language);
  const [manualText, setManualText] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [showCachedTurnsList, setShowCachedTurnsList] = useState(false);

  const unsyncedCount = unsyncedTurns.length;
  const isNetworkIssue = !isOnline || unsyncedCount > 0;

  const examples =
    suggestedExamples && suggestedExamples.length > 0
      ? suggestedExamples
      : locale.examples;

  // Contextual sample spoken answers for each language to test voice input easily
  const voiceSamplePresets: Record<SupportedLanguage, string[][]> = {
    hi: [
      ['मैं खेती करता हूँ और बिजली की मोटर और वायरिंग का थोड़ा काम जानता हूँ।', 'मुझे सिलाई और कपड़ों के काम का अनुभव है।', 'मैं ऑटो और बाइक रिपेयरिंग का काम करता हूँ।'],
      ['हमारे परिवार में पारंपरिक सिलाई और हस्तशिल्प का काम होता है।', 'घर में पशुपालन और दूध बेचने का काम करते हैं।'],
      ['मैं 10 से 15 किलोमीटर तक रोज आ-जा सकता हूँ।', 'अगर हॉस्टल की सुविधा हो तो कहीं भी रह सकता हूँ।'],
      ['मैं अपनी खुद की दुकान खोलना चाहता हूँ।', 'मुझे किसी कंपनी या वर्कशॉप में पक्की नौकरी चाहिए।'],
      ['मैंने 8वीं तक पढ़ाई की है और बाकी सब काम करके सीखा है।', '10वीं पास हूँ।'],
    ],
    bn: [
      ['আমি গ্রামে চাষবাস করি আর কিছুটা মোটর মেরামতের কাজ জানি।', 'আমি সেলাই এবং পোশাক তৈরির কাজ কিছুটা জানি।', 'আমি মোটরবাইক গ্যারেজে সাহায্য করতাম।'],
      ['আমাদের পরিবারে হস্তশিল্প ও সেলাইয়ের কাজ হয়।', 'আমাদের বাড়িতে গরু-বাছুর পালন ও দুধ বিক্রি করি।'],
      ['আমি প্রতিদিন ১০-১৫ কিলোমিটার যাতায়াত করতে পারব।', 'হোস্টেল সুবিধা থাকলে জেলা সদরে গিয়ে শিখতে পারি।'],
      ['আমি গ্রামে নিজের একটি সার্ভিসিং দোকান খুলতে চাই।', 'আমি মাসে নিয়মিত বেতনের কাজ করতে চাই।'],
      ['আমি অষ্টম শ্রেণী পর্যন্ত পড়েছি, বাকিটা হাতে-কলমে শিখেছি।', 'আমি মাধ্যমিক পাশ।'],
    ],
    mr: [
      ['मी शेती करतो आणि मोटर वायरिंग व दुरुस्तीचे काम मला थोडे येते.', 'मला कपडे शिवण्याचा आणि टेलरिंगचा अनुभव आहे.', 'मी दुचाकी दुरुस्तीचे काम शिकलो आहे.'],
      ['आमच्या घरी पारंपारिक शिलाई व हस्तकला काम चालते.', 'आमच्याकडे दुग्ध व्यवसाय आणि शेती केली जाते.'],
      ['मी रोज १० ते १५ किलोमीटर प्रवास करू शकतो.', 'हॉस्टेलची सोय असल्यास तालुक्याच्या गावी राहू शकतो.'],
      ['मला स्वतःचे दुकान किंवा गॅरेज सुरू करायचे आहे.', 'मला कंपनीत नियमित पगाराची नोकरी हवी आहे.'],
      ['मी आठवी पास आहे आणि प्रत्यक्ष काम करून शिकलो आहे.', 'मी दहावी पास आहे.'],
    ],
    ta: [
      ['நான் விவசாய வேலை செய்கிறேன், மோட்டார் மற்றும் வயரிங் வேலை ஓரளவு தெரியும்.', 'எனக்கு தையல் வேலை மற்றும் ஆடை தைக்கும் அனுபவம் உள்ளது.'],
      ['எங்கள் குடும்பத்தில் தையல் மற்றும் கைவினைத் தொழில் செய்கிறோம்.', 'நாங்கள் மாடு வளர்த்து பால் விற்பனை செய்கிறோம்.'],
      ['நான் தினமும் 10 முதல் 15 கி.மீ வரை பயணிக்க முடியும்.', 'விடுதி வசதி இருந்தால் தங்கிப் படிக்கலாம்.'],
      ['நான் சொந்தமாக தொழில் தொடங்க விரும்புகிறேன்.', 'மாத ஊதிய வேலை விரும்புகிறேன்.'],
      ['நான் 8-ஆம் வகுப்பு வரை படித்துள்ளேன், பிறகு வேலை செய்து கற்றுக் கொண்டேன்.'],
    ],
    en: [
      ['I do farm work and know basic electrical wiring and water pump motor repairs.', 'I have hands-on tailoring and garment stitching experience.', 'I work in a two-wheeler repair garage.'],
      ['My family practices traditional tailoring and handloom crafts.', 'We maintain dairy cattle and sell milk to the local cooperative.'],
      ['I can travel 10 to 15 km daily by bus or cycle.', 'I am open to residential training if hostel facilities are provided.'],
      ['I want to set up my own independent repair workshop.', 'I am looking for a regular salaried placement in an enterprise.'],
      ['I completed schooling up to 8th standard and learned trades hands-on.', 'I am a 10th pass candidate.'],
    ],
  };

  const currentPresets =
    voiceSamplePresets[language]?.[Math.min(stepNumber - 1, 4)] ||
    voiceSamplePresets.hi[0];

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualText.trim() && onSubmitTextAnswer) {
      onSubmitTextAnswer(manualText.trim());
      setManualText('');
      setShowManualInput(false);
    }
  };

  const handlePresetClick = (sampleText: string) => {
    if (onSubmitTextAnswer) {
      onSubmitTextAnswer(sampleText);
    }
  };

  const handleDoneSpeaking = () => {
    if (interimTranscript.trim() && onSubmitTextAnswer) {
      onSubmitTextAnswer(interimTranscript.trim());
    } else {
      onToggleListening();
    }
  };

  return (
    <div className="flex flex-1 flex-col justify-between px-5 py-5 sm:py-6">
      {/* Top Step Progress Bar */}
      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-stone-500 mb-2">
            <span>{locale.interviewHeader}</span>
            <span>{locale.stepIndicator(stepNumber, totalSteps)}</span>
          </div>
          {/* Progress bar */}
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-stone-200">
            <div
              className="h-full bg-[#166534] transition-all duration-500"
              style={{ width: `${Math.min(100, (stepNumber / totalSteps) * 100)}%` }}
            />
          </div>
        </div>

        {/* Network & Offline Cache Status Bar + Manual Sync Retry Button */}
        <div
          className={`rounded-2xl border p-3 transition-all ${
            isNetworkIssue
              ? 'border-amber-300 bg-amber-50/90 text-amber-900 shadow-xs'
              : 'border-emerald-200/80 bg-emerald-50/50 text-emerald-900'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            {/* Status Info */}
            <div className="flex items-center gap-2">
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                  isNetworkIssue ? 'bg-amber-200 text-amber-800' : 'bg-emerald-200 text-emerald-800'
                }`}
              >
                {isOnline && unsyncedCount === 0 ? (
                  <Wifi className="h-4 w-4" />
                ) : (
                  <WifiOff className="h-4 w-4" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <span>
                    {isNetworkIssue ? locale.offlineStatusBadge : locale.onlineSyncedBadge}
                  </span>
                  {unsyncedCount > 0 && (
                    <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[10px] font-black text-amber-900 border border-amber-300">
                      {unsyncedCount} {language === 'hi' ? 'सेव्ड' : 'cached'}
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-stone-600 font-medium">
                  {unsyncedCount > 0
                    ? locale.unsyncedTurnsCount(unsyncedCount)
                    : isOnline
                    ? (language === 'hi' ? 'सभी उत्तर सुरक्षित रूप से क्लाउड से जुड़े हैं' : 'Connected to PM-AJAY AI Server')
                    : locale.offlineModeNotice}
                </div>
              </div>
            </div>

            {/* Actions: Manual Sync Retry Button + Offline Simulator Toggle */}
            <div className="flex items-center gap-2">
              {onToggleOfflineSim && (
                <button
                  type="button"
                  onClick={onToggleOfflineSim}
                  className={`rounded-xl px-2.5 py-1 text-[10px] font-bold transition border ${
                    isSimulatingOffline
                      ? 'bg-rose-100 text-rose-800 border-rose-300'
                      : 'bg-white/80 text-stone-600 border-stone-200 hover:bg-stone-100'
                  }`}
                  title="Toggle simulated offline mode"
                >
                  {isSimulatingOffline
                    ? (language === 'hi' ? 'सिम्युलेटेड ऑफ़लाइन (चालू)' : 'Simulated Offline: ON')
                    : (language === 'hi' ? 'ऑफ़लाइन टेस्ट करें' : 'Test Offline')}
                </button>
              )}

              {/* Prominent Manual Sync Retry Button */}
              {onManualSyncRetry && (
                <button
                  type="button"
                  onClick={onManualSyncRetry}
                  disabled={isSyncing}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold shadow-xs transition active:scale-[0.97] ${
                    isSyncing
                      ? 'bg-amber-300 text-amber-950 cursor-wait opacity-80'
                      : unsyncedCount > 0
                      ? 'bg-[#172554] text-white hover:bg-blue-900 ring-2 ring-amber-300'
                      : 'bg-emerald-700 text-white hover:bg-emerald-800'
                  }`}
                  title="Retry synchronizing candidate responses with server"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>
                    {isSyncing
                      ? locale.syncingProgress
                      : locale.syncRetryBtn}
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Collapsible Cached Turns Drawer */}
          {unsyncedCount > 0 && (
            <div className="mt-2.5 border-t border-amber-200/80 pt-2 text-xs">
              <button
                type="button"
                onClick={() => setShowCachedTurnsList(!showCachedTurnsList)}
                className="flex items-center gap-1 font-bold text-amber-900 hover:underline"
              >
                <HardDrive className="h-3.5 w-3.5" />
                <span>
                  {showCachedTurnsList
                    ? (language === 'hi' ? 'कैश्ड उत्तर छिपाएं' : 'Hide locally saved turns')
                    : (language === 'hi' ? `डिवाइस पर सेव उत्तर देखें (${unsyncedCount})` : `View cached turns (${unsyncedCount})`)}
                </span>
                {showCachedTurnsList ? (
                  <ChevronUp className="h-3.5 w-3.5" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5" />
                )}
              </button>

              {showCachedTurnsList && (
                <div className="mt-2 space-y-1.5 rounded-xl bg-white/90 p-2.5 border border-amber-200">
                  <div className="text-[11px] font-semibold text-stone-500">
                    {language === 'hi'
                      ? 'नेटवर्क वापस आने पर या सिंक बटन दबाने पर ये उत्तर अपने आप जुड़ जाएंगे:'
                      : 'These responses will sync once network is restored or Sync Now is tapped:'}
                  </div>
                  {unsyncedTurns.map((turn, idx) => (
                    <div
                      key={turn.id || idx}
                      className="flex items-start justify-between gap-2 rounded-lg bg-amber-50/70 p-2 text-xs border border-amber-100"
                    >
                      <div>
                        <span className="font-bold text-amber-950">
                          {language === 'hi' ? `कदम ${turn.stepNumber}: ` : `Step ${turn.stepNumber}: `}
                        </span>
                        <span className="text-stone-800 italic">"{turn.userInputText}"</span>
                      </div>
                      <span className="shrink-0 text-[10px] text-stone-500">
                        {new Date(turn.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                  {lastSyncTime && (
                    <div className="text-[10px] text-stone-500 pt-1">
                      {language === 'hi' ? 'अंतिम सिंक समय: ' : 'Last sync check: '}
                      {new Date(lastSyncTime).toLocaleTimeString()}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Dynamic Question Title & Subtitle */}
        <div className="space-y-1.5 pt-0.5">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-2xl font-extrabold tracking-tight text-[#172554] sm:text-3xl">
              {questionTitle || locale.defaultQuestionTitle}
            </h1>
            <button
              onClick={onRepeatQuestion}
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition ${
                isSpeaking
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700 animate-pulse'
                  : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
              }`}
              title="Repeat question"
              aria-label="Repeat question"
            >
              <Volume2 className="h-5 w-5" />
            </button>
          </div>
          <p className="text-sm font-normal text-stone-600 leading-relaxed">
            {questionSubtitle || locale.defaultQuestionSubtitle}
          </p>
        </div>
      </div>

      {/* Center Listening / Pulsing Card */}
      <div className="my-4">
        <button
          onClick={onToggleListening}
          className={`group relative flex w-full flex-col items-center justify-center rounded-3xl border px-6 py-8 shadow-xs transition hover:shadow-md active:scale-[0.99] ${
            isListening
              ? 'border-emerald-400 bg-emerald-50/40 ring-2 ring-emerald-200'
              : 'border-stone-200 bg-white'
          }`}
        >
          {/* Animated Concentric Green Circles & Waveform */}
          <div className="relative mb-4 flex h-28 w-28 items-center justify-center">
            <div
              className={`absolute inset-0 rounded-full transition-all duration-700 ${
                isListening
                  ? 'animate-ping bg-emerald-300/50'
                  : 'bg-emerald-100/70 group-hover:scale-105'
              }`}
            />
            <div className="absolute inset-2 rounded-full bg-emerald-200/50" />
            <div
              className={`relative flex h-16 w-16 items-center justify-center rounded-full text-white shadow-md transition-all ${
                isListening ? 'bg-emerald-600 scale-110' : 'bg-[#166534]'
              }`}
            >
              {isLoadingAI ? (
                <Loader2 className="h-8 w-8 animate-spin" />
              ) : (
                <Mic className={`h-8 w-8 ${isListening ? 'animate-pulse' : ''}`} />
              )}
            </div>
          </div>

          {/* Sound wave bars when listening */}
          {isListening && (
            <div className="mb-2 flex items-center justify-center gap-1.5 h-8">
              {[0.6, 1.2, 1.8, 1.3, 0.7].map((multiplier, idx) => {
                const minH = 6;
                const dynamicH = Math.min(32, Math.max(minH, Math.round(minH + audioVolume * 65 * multiplier)));
                return (
                  <span
                    key={idx}
                    className="w-1.5 rounded-full bg-emerald-600 transition-all duration-75"
                    style={{
                      height: `${dynamicH}px`,
                      opacity: audioVolume > 0.05 ? 1 : 0.6,
                    }}
                  />
                );
              })}
            </div>
          )}

          <div className="text-center">
            <div className="text-base font-bold text-stone-900">
              {isLoadingAI
                ? locale.analyzingProfileMsg
                : isListening
                ? locale.listeningState
                : locale.tapToSpeak}
            </div>
            <div className="text-xs text-stone-500 mt-0.5">
              {locale.speakPrompt}
            </div>
          </div>
        </button>

        {/* Secondary Voice Action: Upload Voice Recording / Audio Note */}
        <div className="mt-2.5 flex items-center justify-center">
          <button
            type="button"
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 rounded-2xl border border-emerald-300/80 bg-emerald-50/70 px-4 py-2 text-xs font-bold text-emerald-900 shadow-2xs transition hover:bg-emerald-100 hover:border-emerald-400 active:scale-[0.98]"
          >
            <UploadCloud className="h-4 w-4 text-emerald-700" />
            <span>{locale.uploadVoiceBtn}</span>
          </button>
        </div>

        {/* Live Interim Transcript or Spoken Words */}
        {interimTranscript ? (
          <div className="mt-3 rounded-2xl bg-emerald-50 p-3.5 text-center border border-emerald-300 shadow-2xs animate-fade-in">
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 mb-1">
              Captured Voice:
            </div>
            <span className="text-sm font-semibold text-emerald-950 italic">
              "{interimTranscript}"
            </span>
            <div className="mt-2 flex justify-center">
              <button
                type="button"
                onClick={handleDoneSpeaking}
                className="flex items-center gap-1.5 rounded-full bg-emerald-700 px-3.5 py-1 text-xs font-bold text-white shadow-xs hover:bg-emerald-800"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Done Speaking / Submit</span>
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-2.5 text-center text-xs font-semibold text-[#991B1B]">
            {locale.answerInOwnWords}
          </p>
        )}
      </div>

      {/* Voice Upload Modal */}
      <VoiceUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        language={language}
        sessionId={sessionId}
        onTranscriptionComplete={(text) => {
          if (onSubmitTextAnswer) {
            onSubmitTextAnswer(text);
          }
        }}
      />

      {/* One-Tap Voice Presets (for instant testing or quick selection) */}
      <div className="mb-2 rounded-2xl border border-stone-200/80 bg-stone-50/80 p-3">
        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-2">
          <MessageSquare className="h-3.5 w-3.5 text-emerald-700" />
          <span>Quick Spoken Options (Tap to speak answer):</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {currentPresets.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handlePresetClick(preset)}
              className="rounded-xl border border-stone-300/80 bg-white px-3 py-1.5 text-left text-xs font-medium text-stone-800 shadow-2xs transition hover:border-emerald-600 hover:bg-emerald-50 hover:text-emerald-900 active:scale-[0.98]"
            >
              "{preset}"
            </button>
          ))}
        </div>
      </div>

      {/* Examples Section */}
      <div className="rounded-2xl border border-stone-200/80 bg-white/80 p-3.5 backdrop-blur-xs">
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-stone-800 mb-1.5">
          {locale.examplesTitle}
        </h3>
        <ul className="space-y-1 text-xs text-stone-600">
          {examples.map((ex, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-700 mt-1.5 shrink-0" />
              <span>{ex}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom Actions: Repeat question & Optional manual typing */}
      <div className="mt-4 space-y-2">
        <button
          onClick={onRepeatQuestion}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-stone-300 bg-white text-xs font-bold text-stone-700 shadow-2xs transition hover:bg-stone-50 active:scale-[0.99]"
        >
          <RotateCcw className="h-3.5 w-3.5 text-stone-500" />
          <span>{locale.skipRepeatBtn}</span>
        </button>

        {/* Optional typing fallback */}
        <div className="text-center">
          <button
            onClick={() => setShowManualInput(!showManualInput)}
            className="text-[11px] text-stone-400 hover:text-stone-600 underline"
          >
            {showManualInput ? 'Hide text input' : 'Type response (optional fallback)'}
          </button>
        </div>

        {showManualInput && (
          <form onSubmit={handleManualSubmit} className="flex gap-2 pt-1">
            <input
              type="text"
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              placeholder="Type your response in any language..."
              className="flex-1 rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs text-stone-900 focus:border-emerald-600 focus:outline-hidden"
            />
            <button
              type="submit"
              disabled={!manualText.trim()}
              className="rounded-xl bg-[#172554] px-4 py-2 text-xs font-bold text-white disabled:opacity-50"
            >
              Send
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

import React, { useState, useRef } from 'react';
import { X, Phone, PhoneOff, Mic, Send, Play, Pause, MessageSquare, Volume2, ShieldCheck, CheckCheck, UploadCloud, Loader2 } from 'lucide-react';
import { SupportedLanguage } from '../types';
import { getLocale } from '../locales/i18n';
import { VoiceUploadModal } from './VoiceUploadModal';

interface ChannelSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: SupportedLanguage;
}

export const ChannelSimulatorModal: React.FC<ChannelSimulatorModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const [activeTab, setActiveTab] = useState<'ivr' | 'whatsapp'>('ivr');
  const [callActive, setCallActive] = useState(false);
  const [callSeconds, setCallSeconds] = useState(0);
  const [isVoiceUploadOpen, setIsVoiceUploadOpen] = useState(false);
  const [ivrTranscript, setIvrTranscript] = useState<Array<{ speaker: string; text: string }>>([
    {
      speaker: 'IVR Bot (1800-PM-AJAY)',
      text: 'नमस्ते, पीएम-अजय वॉइस हेल्पलाइन में आपका स्वागत है। अपने काम और अनुभव के बारे में बताएं।',
    },
  ]);
  const [ivrInput, setIvrInput] = useState('');
  const [ivrLoading, setIvrLoading] = useState(false);

  // WhatsApp states
  const [waMessages, setWaMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; time: string; isAudio?: boolean }>>([
    {
      sender: 'bot',
      text: 'नमस्ते! पीएम-अजय कौशल सहायक में आपका स्वागत है। आप अपना वॉइस नोट भेजकर सही सरकारी प्रशिक्षण जान सकते हैं।',
      time: '10:00 AM',
      isAudio: true,
    },
  ]);
  const [waInput, setWaInput] = useState('');
  const [waLoading, setWaLoading] = useState(false);

  if (!isOpen) return null;

  const locale = getLocale(language);

  const startIvrCall = () => {
    setCallActive(true);
    setCallSeconds(0);
  };

  const endIvrCall = () => {
    setCallActive(false);
  };

  const handleSendIvrVoice = async () => {
    if (!ivrInput.trim()) return;
    const userText = ivrInput.trim();
    setIvrInput('');
    setIvrTranscript((prev) => [...prev, { speaker: 'Caller', text: userText }]);
    setIvrLoading(true);

    try {
      const res = await fetch('/api/channels/ivr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spokenText: userText,
          language,
          callerPhone: '+91 94340 99881',
        }),
      });
      const data = await res.json();
      setIvrTranscript((prev) => [
        ...prev,
        { speaker: 'IVR Bot (1800-PM-AJAY)', text: data.replySpokenText },
      ]);
    } catch (e) {
      setIvrTranscript((prev) => [
        ...prev,
        { speaker: 'IVR Bot', text: 'आपके हुनर के अनुसार इलेक्ट्रीशियन और सिलाई प्रशिक्षण उपलब्ध है।' },
      ]);
    } finally {
      setIvrLoading(false);
    }
  };

  const handleSendWaVoice = async () => {
    if (!waInput.trim()) return;
    const text = waInput.trim();
    setWaInput('');
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setWaMessages((prev) => [...prev, { sender: 'user', text, time, isAudio: true }]);
    setWaLoading(true);

    try {
      const res = await fetch('/api/channels/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spokenText: text,
          language,
          callerPhone: '+91 98321 55432',
        }),
      });
      const data = await res.json();
      const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setWaMessages((prev) => [
        ...prev,
        { sender: 'bot', text: data.replySpokenText, time: replyTime, isAudio: true },
      ]);
    } catch (e) {
      const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setWaMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: 'আপনার দক্ষতা বিশ্লেষণ সম্পন্ন হয়েছে! রানারঘাট সেন্টারে ইলেকট্রিশিয়ান কোর্সে ১৪টি আসন খালি আছে।',
          time: replyTime,
          isAudio: true,
        },
      ]);
    } finally {
      setWaLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-[#F8F8F4] shadow-2xl border border-stone-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 bg-white px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-stone-900">
              Alternate Channels Simulator
            </h2>
            <p className="text-xs text-stone-500">
              Channel-agnostic adapter: IVR Toll-Free & WhatsApp Voice Note
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-100 text-stone-600 hover:bg-stone-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab selector */}
        <div className="grid grid-cols-2 border-b border-stone-200 bg-stone-100 p-1">
          <button
            onClick={() => setActiveTab('ivr')}
            className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition ${
              activeTab === 'ivr'
                ? 'bg-white text-[#172554] shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Phone className="h-4 w-4" />
            <span>Toll-Free IVR (1800-PM-AJAY)</span>
          </button>

          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition ${
              activeTab === 'whatsapp'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            <span>WhatsApp Voice Note</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'ivr' ? (
            <div className="space-y-4">
              {/* IVR Status Card */}
              <div className="rounded-2xl border border-stone-200 bg-white p-4 text-center shadow-2xs">
                <div className="text-xs font-bold text-stone-500">TOLL-FREE HELPLINE</div>
                <div className="text-xl font-extrabold text-[#172554]">1800-202-PMAJAY</div>
                <div className="mt-2 text-xs text-stone-600">
                  {callActive ? (
                    <span className="inline-flex items-center gap-1.5 font-bold text-emerald-700">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                      Connected • Speaking in regional language
                    </span>
                  ) : (
                    'Simulates zero-data telephone calls for feature phones'
                  )}
                </div>

                <div className="mt-4 flex justify-center">
                  {!callActive ? (
                    <button
                      onClick={startIvrCall}
                      className="flex items-center gap-2 rounded-full bg-[#166534] px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-800"
                    >
                      <Phone className="h-4 w-4" />
                      <span>Simulate Call In</span>
                    </button>
                  ) : (
                    <button
                      onClick={endIvrCall}
                      className="flex items-center gap-2 rounded-full bg-rose-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-rose-700"
                    >
                      <PhoneOff className="h-4 w-4" />
                      <span>Hang Up</span>
                    </button>
                  )}
                </div>
              </div>

              {/* IVR Spoken Turn Dialog */}
              {callActive && (
                <div className="space-y-3">
                  <div className="max-h-48 overflow-y-auto space-y-2 rounded-2xl border border-stone-200 bg-stone-50 p-3 text-xs">
                    {ivrTranscript.map((t, idx) => (
                      <div
                        key={idx}
                        className={`p-2 rounded-xl ${
                          t.speaker.includes('IVR')
                            ? 'bg-blue-50 text-blue-950 border border-blue-100'
                            : 'bg-emerald-50 text-emerald-950 border border-emerald-100 font-medium'
                        }`}
                      >
                        <div className="font-bold opacity-75">{t.speaker}</div>
                        <div className="mt-0.5">{t.text}</div>
                      </div>
                    ))}
                    {ivrLoading && (
                      <div className="text-center text-xs text-stone-500 italic py-1">
                        IVR voice engine responding...
                      </div>
                    )}
                  </div>

                  {/* Simulate speaking into phone */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={ivrInput}
                      onChange={(e) => setIvrInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendIvrVoice()}
                      placeholder="Say something into the call (e.g. मैं खेती और बिजली का काम जानता हूँ)..."
                      className="flex-1 rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs text-stone-900 focus:border-emerald-600 focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => setIsVoiceUploadOpen(true)}
                      className="flex items-center gap-1 rounded-xl border border-stone-300 bg-stone-100 px-3 py-2 text-xs font-bold text-stone-700 hover:bg-stone-200"
                      title="Upload Voice Note"
                    >
                      <UploadCloud className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={handleSendIvrVoice}
                      disabled={!ivrInput.trim() || ivrLoading}
                      className="flex items-center gap-1 rounded-xl bg-[#172554] px-4 py-2 text-xs font-bold text-white disabled:opacity-50"
                    >
                      <Mic className="h-3.5 w-3.5" />
                      <span>Speak</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {/* WhatsApp Interface Mockup */}
              <div className="rounded-2xl border border-emerald-200 bg-[#EFEAE2] p-3 shadow-inner">
                {/* WhatsApp Header bar */}
                <div className="mb-3 flex items-center gap-2 border-b border-emerald-200/50 pb-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-700 text-white font-bold text-xs">
                    PM
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900">
                      PM-AJAY Livelihood Bot (Official)
                    </div>
                    <div className="text-[10px] text-emerald-800">
                      Verified Government Assistant
                    </div>
                  </div>
                </div>

                {/* WhatsApp Messages Feed */}
                <div className="max-h-56 overflow-y-auto space-y-2.5 pr-1">
                  {waMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl p-2.5 text-xs shadow-2xs ${
                          msg.sender === 'user'
                            ? 'bg-[#D9FDD3] text-stone-900 rounded-tr-xs'
                            : 'bg-white text-stone-900 rounded-tl-xs'
                        }`}
                      >
                        {msg.isAudio && (
                          <div className="mb-1 flex items-center gap-2 rounded-lg bg-black/5 px-2 py-1 text-[11px] font-semibold text-emerald-800">
                            <Play className="h-3 w-3 fill-emerald-800" />
                            <span>Voice Note (0:14)</span>
                          </div>
                        )}
                        <p>{msg.text}</p>
                        <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-stone-400">
                          <span>{msg.time}</span>
                          {msg.sender === 'user' && <CheckCheck className="h-3 w-3 text-blue-500" />}
                        </div>
                      </div>
                    </div>
                  ))}
                  {waLoading && (
                    <div className="text-xs text-stone-500 italic">Bot is recording voice reply...</div>
                  )}
                </div>
              </div>

              {/* Simulate WhatsApp Voice Note Send & Voice Upload */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={waInput}
                  onChange={(e) => setWaInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendWaVoice()}
                  placeholder="Record voice note or type message..."
                  className="flex-1 rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs text-stone-900 focus:border-emerald-600 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => setIsVoiceUploadOpen(true)}
                  className="flex items-center gap-1 rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-100"
                  title="Upload Audio / Voice Note"
                >
                  <UploadCloud className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={handleSendWaVoice}
                  disabled={!waInput.trim() || waLoading}
                  className="flex items-center gap-1 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-800 disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Send</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal for uploading actual audio file */}
        <VoiceUploadModal
          isOpen={isVoiceUploadOpen}
          onClose={() => setIsVoiceUploadOpen(false)}
          language={language}
          onTranscriptionComplete={(text) => {
            if (activeTab === 'ivr') {
              setIvrInput(text);
            } else {
              setWaInput(text);
            }
          }}
        />
      </div>
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  Paperclip, 
  Check, 
  CheckCheck, 
  Sparkles, 
  Volume2, 
  Phone, 
  MoreVertical, 
  Building2, 
  MapPin, 
  Award,
  Loader2
} from 'lucide-react';
import { audioController } from '../../lib/audio.js';
import { api } from '../../lib/api.js';

interface WhatsAppMessage {
  id: string;
  sender: 'user' | 'bot';
  type: 'text' | 'audio' | 'card';
  text?: string;
  audioDuration?: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  cardData?: any;
}

export const WhatsAppSimulator: React.FC = () => {
  const [messages, setMessages] = useState<WhatsAppMessage[]>([
    {
      id: '1',
      sender: 'bot',
      type: 'text',
      text: 'नमस्ते! मैं आपका पीएम-अजय (PM-AJAY) आजीविका साथी हूँ।\n\nआप किसी भी भाषा में अपना वॉइस मैसेज (Voice Note) भेजकर अपने काम और अनुभव के बारे में बता सकते हैं। हम आपके लिए सबसे अच्छा सरकारी हुनर प्रशिक्षण खोजेंगे। 🎙️',
      timestamp: '10:30 AM',
      status: 'read'
    }
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  const handleSendVoiceNote = async (transcript: string, durationStr = '0:14') => {
    const userMsgId = `WAMID_${Date.now()}`;
    const userMsg: WhatsAppMessage = {
      id: userMsgId,
      sender: 'user',
      type: 'audio',
      text: transcript,
      audioDuration: durationStr,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsProcessing(true);

    // Simulate WhatsApp double tick
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === userMsgId ? { ...m, status: 'read' } : m))
      );
    }, 600);

    // Simulate AI pipeline lifecycle
    setTimeout(async () => {
      // 1. Understood acknowledgment
      const ackMsg: WhatsAppMessage = {
        id: `WAMID_${Date.now() + 1}`,
        sender: 'bot',
        type: 'text',
        text: `✅ हमने आपका वॉइस नोट सुना और समझा:\n\n• हुनर: ${transcript.includes('welding') || transcript.includes('वेल्डिंग') ? 'वेल्डिंग और फैब्रिकेशन' : 'सिलाई एवं टेलरिंग'}\n• अनुभव: 4+ वर्ष\n• जिला: वाराणसी / स्थानीय ब्लॉक\n\nआपके लिए पीएम-अजय के तहत सर्वोत्तम NSQF कोर्स तैयार है 👇`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'read'
      };

      // 2. Structured NSQF card response
      const cardMsg: WhatsAppMessage = {
        id: `WAMID_${Date.now() + 2}`,
        sender: 'bot',
        type: 'card',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'read',
        cardData: {
          title: 'Manual Metal Arc Welder (NSQF Level 3)',
          code: 'CSC/Q0204',
          score: 95,
          provider: 'PMKK Kashi Skill Development Center',
          distance: '7.2 km away',
          seats: '18 seats available',
          wage: '₹14,500/month',
          rpl: true
        }
      };

      setMessages((prev) => [...prev, ackMsg, cardMsg]);
      setIsProcessing(false);
    }, 1800);
  };

  const handleToggleMic = async () => {
    if (isRecording) {
      setIsRecording(false);
      await audioController.stopRecording();
      handleSendVoiceNote('Main pichhle 5 saal se welding ka kaam kar raha hoon aur gaon me workshop kholna chahta hoon.', '0:08');
    } else {
      setIsRecording(true);
      await audioController.startRecording();
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      {/* Editorial framing banner */}
      <div className="text-center mb-6">
        <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-amber-400/80">
          Multichannel Ingestion &bull; Tier-3 Asynchronous Node
        </span>
        <h2 className="font-editorial-serif text-2xl sm:text-3xl font-normal text-white mt-1">
          WhatsApp Voice Note <span className="italic text-amber-400">Simulator</span>
        </h2>
        <p className="text-white/50 text-xs mt-1 font-light">
          Simulate rural beneficiaries sending asynchronous regional voice notes over 2G/3G WhatsApp Webhook.
        </p>
      </div>

      {/* WhatsApp Container Mockup */}
      <div className="bg-[#0f1419] rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col h-[640px]">
        {/* Top WhatsApp App Bar */}
        <div className="bg-[#18222d] text-white px-5 py-3.5 flex items-center justify-between border-b border-white/10 shadow-md">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold text-xs font-mono">
              PM
            </div>
            <div>
              <div className="font-medium text-sm leading-tight flex items-center space-x-2">
                <span className="text-white font-editorial-serif">PM-AJAY Livelihood Assistant</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              </div>
              <div className="text-[10px] text-white/50 font-light">
                Official Govt of India Verified Bot &bull; Instant Dialect ASR
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-white/60">
            <Phone className="w-4 h-4 cursor-pointer hover:text-white" />
            <MoreVertical className="w-4 h-4 cursor-pointer hover:text-white" />
          </div>
        </div>

        {/* Encrypted Notice */}
        <div className="bg-[#1c242c] text-white/70 text-[10px] text-center py-1.5 px-4 mx-auto my-3 rounded border border-white/10 max-w-sm font-mono">
          🔒 Messages and voice notes are end-to-end encrypted for beneficiary privacy.
        </div>

        {/* Chat Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {(messages || []).map((msg) => {
            const isBot = msg.sender === 'bot';
            return (
              <div
                key={msg.id}
                className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl p-3.5 text-xs leading-relaxed shadow-md ${
                    isBot
                      ? 'bg-[#1e2936] text-white/95 rounded-tl-xs border border-white/10'
                      : 'bg-[#0f4a3c] text-white rounded-tr-xs border border-emerald-500/30'
                  }`}
                >
                  {msg.type === 'text' && (
                    <p className="whitespace-pre-line font-light">{msg.text}</p>
                  )}

                  {msg.type === 'audio' && (
                    <div className="flex items-center space-x-3 min-w-[200px]">
                      <div className="w-8 h-8 rounded-full bg-emerald-500 text-stone-950 flex items-center justify-center font-bold">
                        <Volume2 className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="h-1 bg-white/20 rounded-full w-full mb-1">
                          <div className="h-1 bg-emerald-400 rounded-full w-2/3"></div>
                        </div>
                        <div className="flex justify-between text-[10px] text-white/60 font-mono">
                          <span>Voice Note ({msg.audioDuration})</span>
                          <span>Spoken</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {msg.type === 'card' && msg.cardData && (
                    <div className="space-y-2 mt-1">
                      <div className="flex items-center justify-between">
                        <span className="bg-amber-500/20 text-amber-300 font-mono text-[9px] px-2 py-0.5 rounded border border-amber-500/30">
                          {msg.cardData.code}
                        </span>
                        <span className="font-mono text-[10px] text-emerald-400 font-bold">
                          {msg.cardData.score}% NSQF Match
                        </span>
                      </div>

                      <h4 className="font-editorial-serif font-bold text-white text-sm">
                        {msg.cardData.title}
                      </h4>

                      <div className="bg-[#141b22] p-2.5 rounded-lg space-y-1.5 text-[11px] text-white/70 border border-white/5">
                        <div className="flex items-center space-x-1.5">
                          <Building2 className="w-3.5 h-3.5 text-amber-400/80" />
                          <span>{msg.cardData.provider}</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <MapPin className="w-3.5 h-3.5 text-amber-400/80" />
                          <span>{msg.cardData.distance} &bull; {msg.cardData.seats}</span>
                        </div>
                        <div className="flex items-center space-x-1.5 font-medium text-emerald-300">
                          <Award className="w-3.5 h-3.5" />
                          <span>Est. Starting Wage: {msg.cardData.wage}</span>
                        </div>
                      </div>

                      <div className="pt-2 flex gap-2">
                        <button className="flex-1 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold py-2 rounded-lg text-center cursor-pointer text-xs uppercase tracking-wider transition">
                          Apply (Free)
                        </button>
                        <button className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium py-2 rounded-lg text-center cursor-pointer text-xs transition">
                          View Center
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="mt-1.5 flex items-center justify-end space-x-1 text-[9px] text-white/40 font-mono">
                    <span>{msg.timestamp}</span>
                    {!isBot && (
                      <CheckCheck className={`w-3.5 h-3.5 ${msg.status === 'read' ? 'text-cyan-400' : 'text-white/40'}`} />
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isProcessing && (
            <div className="bg-[#1e2936] rounded-xl p-3 text-xs text-white/70 flex items-center space-x-2 w-fit border border-white/10 shadow-sm">
              <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
              <span>Transcribing voice note &amp; matching NSQF database...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Sample Voice Prompts */}
        <div className="bg-[#141b22] px-3.5 py-2 border-t border-white/10 flex items-center space-x-2 overflow-x-auto text-[11px]">
          <span className="text-white/40 uppercase tracking-wider font-mono text-[9px] shrink-0">Demo Prompt:</span>
          <button
            onClick={() => handleSendVoiceNote('Main pichhle 5 saal se welding aur iron gate fabrication ka kaam karta hoon.', '0:11')}
            className="px-2.5 py-1 bg-[#1e2936] hover:bg-[#283749] text-white/90 rounded border border-white/10 shrink-0 cursor-pointer font-light"
          >
            🔥 5-Yr Welding (Hindi)
          </button>
          <button
            onClick={() => handleSendVoiceNote('Aami 4 bochhor dhore tailoring ar blouse bananor kaaj korchi.', '0:09')}
            className="px-2.5 py-1 bg-[#1e2936] hover:bg-[#283749] text-white/90 rounded border border-white/10 shrink-0 cursor-pointer font-light"
          >
            🧵 4-Yr Tailoring (Bengali)
          </button>
          <button
            onClick={() => handleSendVoiceNote('Naan 6 varushama handloom weaving panni irukken.', '0:10')}
            className="px-2.5 py-1 bg-[#1e2936] hover:bg-[#283749] text-white/90 rounded border border-white/10 shrink-0 cursor-pointer font-light"
          >
            🧶 6-Yr Weaving (Tamil)
          </button>
        </div>

        {/* Bottom Input Controls */}
        <div className="bg-[#18222d] px-4 py-3 flex items-center space-x-3 border-t border-white/10">
          <Paperclip className="w-4 h-4 text-white/40 cursor-pointer hover:text-white" />
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && inputVal.trim()) {
                handleSendVoiceNote(inputVal, '0:05');
                setInputVal('');
              }
            }}
            placeholder="Type a message or tap mic to record..."
            className="flex-1 bg-[#0f1419] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-hidden focus:border-amber-400"
          />

          <button
            onClick={handleToggleMic}
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-white transition cursor-pointer ${
              isRecording ? 'bg-red-600 animate-pulse' : 'bg-amber-500 hover:bg-amber-400 text-stone-950'
            }`}
            title={isRecording ? 'Stop Recording' : 'Hold or Tap to Record Voice Note'}
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

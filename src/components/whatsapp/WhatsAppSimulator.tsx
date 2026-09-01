import React, { useState, useRef, useEffect } from "react";
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
  Loader2,
  X,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Users,
  CheckCircle2,
  PhoneCall,
  Clock,
  Compass,
  FileCheck,
} from "lucide-react";
import { audioController } from "../../lib/audio.js";
import { api } from "../../lib/api.js";

interface WhatsAppMessage {
  id: string;
  sender: "user" | "bot";
  type: "text" | "audio" | "card" | "application_success";
  text?: string;
  audioDuration?: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
  cardData?: any;
}

export const WhatsAppSimulator: React.FC = () => {
  const [messages, setMessages] = useState<WhatsAppMessage[]>([
    {
      id: "1",
      sender: "bot",
      type: "text",
      text: "नमस्ते! मैं आपका पीएम-अजय (PM-AJAY) आजीविका साथी हूँ।\n\nआप किसी भी भाषा में अपना वॉइस मैसेज (Voice Note) भेजकर अपने काम और अनुभव के बारे में बता सकते हैं। हम आपके लिए सबसे अच्छा सरकारी हुनर प्रशिक्षण खोजेंगे। 🎙️",
      timestamp: "10:30 AM",
      status: "read",
    },
  ]);

  const [inputVal, setInputVal] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState<any | null>(null);
  const [appliedCardId, setAppliedCardId] = useState<string | null>(null);
  const [applicationReceipt, setApplicationReceipt] = useState<any | null>(
    null,
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const waFileInputRef = useRef<HTMLInputElement>(null);

  const handleWaFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const duration = `0:${Math.floor(Math.random() * 15) + 10}`;
    const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    
    // Process uploaded voice note
    handleSendVoiceNote(cleanName || 'Uploaded audio note', duration);
    if (waFileInputRef.current) waFileInputRef.current.value = '';
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isProcessing, isApplying]);

  const handleSendVoiceNote = async (
    transcript: string,
    durationStr = "0:14",
  ) => {
    const userMsgId = `WAMID_${Date.now()}`;
    const userMsg: WhatsAppMessage = {
      id: userMsgId,
      sender: "user",
      type: "audio",
      text: transcript,
      audioDuration: durationStr,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "sent",
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsProcessing(true);

    // Simulate WhatsApp double tick
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === userMsgId ? { ...m, status: "read" } : m)),
      );
    }, 600);

    // Simulate AI pipeline lifecycle
    setTimeout(async () => {
      const isWelder =
        transcript.toLowerCase().includes("weld") ||
        transcript.includes("वेल्डिंग");
      const isTailor =
        transcript.toLowerCase().includes("tailor") ||
        transcript.includes("सिलाई") ||
        transcript.includes("blouse");
      const isWeaver =
        transcript.toLowerCase().includes("weav") ||
        transcript.includes("बुनाई");

      let courseTitle = "Manual Metal Arc Welder (NSQF Level 3)";
      let courseCode = "CSC/Q0204";
      let centerName = "PMKK Kashi Skill Development Center";
      let tradeLabel = "वेल्डिंग और फैब्रिकेशन";
      let wageStr = "₹14,500/month";

      if (isTailor) {
        courseTitle = "Self Employed Tailor (NSQF Level 4)";
        courseCode = "AMH/Q1947";
        centerName = "Jan Shikshan Sansthan (JSS) Rural Center";
        tradeLabel = "सिलाई एवं गारमेंट टेलरिंग";
        wageStr = "₹13,800/month";
      } else if (isWeaver) {
        courseTitle = "Handloom Weaver (Carpets & Silk)";
        courseCode = "HCS/Q7301";
        centerName = "Varanasi Weavers Mega Cluster Center";
        tradeLabel = "हथकरघा एवं सिल्क बुनाई";
        wageStr = "₹16,000/month";
      }

      // 1. Understood acknowledgment
      const ackMsg: WhatsAppMessage = {
        id: `WAMID_${Date.now() + 1}`,
        sender: "bot",
        type: "text",
        text: `✅ हमने आपका वॉइस नोट सुना और समझा:\n\n• हुनर: ${tradeLabel}\n• अनुभव: 4+ वर्ष\n• जिला: वाराणसी / स्थानीय ब्लॉक\n\nआपके लिए पीएम-अजय के तहत सर्वोत्तम NSQF कोर्स तैयार है 👇`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: "read",
      };

      // 2. Structured NSQF card response
      const cardMsg: WhatsAppMessage = {
        id: `WAMID_${Date.now() + 2}`,
        sender: "bot",
        type: "card",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: "read",
        cardData: {
          title: courseTitle,
          code: courseCode,
          score: 95,
          provider: centerName,
          address: "NH-29, Near Block Development Office, Kashi, Varanasi",
          distance: "7.2 km away",
          seats: "18 seats available",
          wage: wageStr,
          rpl: true,
          batchStart: "12 Sep 2026",
          coordinator: "Shri Rajesh Sharma",
          phone: "+91 98765 43210",
        },
      };

      setMessages((prev) => [...prev, ackMsg, cardMsg]);
      setIsProcessing(false);
    }, 1800);
  };

  const handleToggleMic = async () => {
    if (isRecording) {
      setIsRecording(false);
      await audioController.stopRecording();
      handleSendVoiceNote(
        "Main pichhle 5 saal se welding ka kaam kar raha hoon aur gaon me workshop kholna chahta hoon.",
        "0:08",
      );
    } else {
      setIsRecording(true);
      await audioController.startRecording();
    }
  };

  const handleApplyFree = async (cardData: any) => {
    setIsApplying(true);
    setAppliedCardId(cardData.code);
    audioController.playChime("start");

    const appRef = `PMAJAY-WA-${Math.floor(100000 + Math.random() * 900000)}`;

    setTimeout(() => {
      audioController.playChime("success");
      setIsApplying(false);

      const receiptData = {
        ref: appRef,
        course: cardData.title,
        provider: cardData.provider,
        batchStart: cardData.batchStart || "12 Sep 2026",
        stipend: "₹1,500/month",
        toolkit: "100% Free Govt Safety & Tool Kit",
        appliedAt: new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
      };

      setApplicationReceipt(receiptData);

      const confirmationMsg: WhatsAppMessage = {
        id: `WAMID_CONFIRM_${Date.now()}`,
        sender: "bot",
        type: "text",
        text: `🎉 *बधाई हो! आपका आवेदन सफलतापूर्वक दर्ज हो गया है!*\n\n📋 *आवेदन क्रमांक (Ref):* \`${appRef}\`\n🎯 *कोर्स:* ${cardData.title}\n🏫 *प्रशिक्षण केंद्र:* ${cardData.provider}\n📅 *बैच प्रारंभ:* ${cardData.batchStart || "12 Sep 2026"}\n\n✅ *आपको क्या मिलेगा:*\n1. नि:शुल्क NSQF लेवल 3 सरकारी प्रमाण पत्र\n2. 100% नि:शुल्क टूलकिट और सेफ्टी किट\n3. ₹1,500 मासिक यात्रा व आजीविका भत्ता\n\nप्रशिक्षण केंद्र समन्वयक *${cardData.coordinator || "Shri Rajesh Sharma"}* शीघ्र ही आपके नंबर पर संपर्क करेंगे। विवरण SMS द्वारा भी भेज दिया गया है। 📱`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: "read",
      };

      setMessages((prev) => [...prev, confirmationMsg]);
    }, 1200);
  };

  const handleViewCenter = (cardData: any) => {
    setSelectedCenter(cardData);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      {/* Editorial framing banner */}
      <div className="text-center mb-6">
        <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-amber-400/80">
          Multichannel Ingestion &bull; Tier-3 Asynchronous Node
        </span>
        <h2 className="font-editorial-serif text-2xl sm:text-3xl font-normal text-white mt-1">
          WhatsApp Voice Note{" "}
          <span className="italic text-amber-400">Simulator</span>
        </h2>
        <p className="text-white/50 text-xs mt-1 font-light">
          Simulate rural beneficiaries sending asynchronous regional voice notes
          over 2G/3G WhatsApp Webhook.
        </p>
      </div>

      {/* WhatsApp Container Mockup */}
      <div className="bg-[#0f1419] rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col h-[640px] relative">
        {/* Top WhatsApp App Bar */}
        <div className="bg-[#18222d] text-white px-5 py-3.5 flex items-center justify-between border-b border-white/10 shadow-md">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold text-xs font-mono">
              PM
            </div>
            <div>
              <div className="font-medium text-sm leading-tight flex items-center space-x-2">
                <span className="text-yellow-400 font-editorial-serif">
                  PM-AJAY Livelihood Assistant
                </span>
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
        <div className="bg-[#1c242c] text-white/70 text-[10px] text-center py-1.5 px-4 mx-auto my-2 rounded border border-white/10 max-w-sm font-mono">
          🔒 Messages and voice notes are end-to-end encrypted for beneficiary
          privacy.
        </div>

        {/* Chat Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar">
          {(messages || []).map((msg) => {
            const isBot = msg.sender === "bot";
            return (
              <div
                key={msg.id}
                className={`flex ${isBot ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg p-3.5 text-xs leading-relaxed shadow-md ${
                    isBot
                      ? "bg-[#1e2936] text-white/95 rounded-tl-xs border border-white/10"
                      : "bg-[#0f4a3c] text-white rounded-tr-xs border border-emerald-500/30"
                  }`}
                >
                  {msg.type === "text" && (
                    <p className="whitespace-pre-line font-light">{msg.text}</p>
                  )}

                  {msg.type === "audio" && (
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

                  {msg.type === "card" && msg.cardData && (
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
                          <Building2 className="w-3.5 h-3.5 text-amber-400/80 shrink-0" />
                          <span className="truncate">
                            {msg.cardData.provider}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <MapPin className="w-3.5 h-3.5 text-amber-400/80 shrink-0" />
                          <span>
                            {msg.cardData.distance} &bull; {msg.cardData.seats}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1.5 font-medium text-emerald-300">
                          <Award className="w-3.5 h-3.5 shrink-0" />
                          <span>Est. Starting Wage: {msg.cardData.wage}</span>
                        </div>
                      </div>

                      {/* Interactive Buttons with Action Handlers */}
                      <div className="pt-2 flex gap-2">
                        <button
                          onClick={() => handleApplyFree(msg.cardData)}
                          disabled={
                            isApplying || appliedCardId === msg.cardData.code
                          }
                          className="flex-1 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-2 rounded-lg text-center cursor-pointer text-xs uppercase tracking-wider transition shadow-sm hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1"
                        >
                          {isApplying && appliedCardId === msg.cardData.code ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Applying...</span>
                            </>
                          ) : appliedCardId === msg.cardData.code ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-950" />
                              <span>Applied</span>
                            </>
                          ) : (
                            <span>Apply (Free)</span>
                          )}
                        </button>
                        <button
                          onClick={() => handleViewCenter(msg.cardData)}
                          className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium py-2 rounded-lg text-center cursor-pointer text-xs transition border border-white/10 hover:border-amber-400/50 flex items-center justify-center space-x-1"
                        >
                          <Building2 className="w-3.5 h-3.5 text-amber-400" />
                          <span>View Center</span>
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="mt-1.5 flex items-center justify-end space-x-1 text-[9px] text-white/40 font-mono">
                    <span>{msg.timestamp}</span>
                    {!isBot && (
                      <CheckCheck
                        className={`w-3.5 h-3.5 ${msg.status === "read" ? "text-cyan-400" : "text-white/40"}`}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isProcessing && (
            <div className="bg-[#1e2936] rounded-lg p-3 text-xs text-white/70 flex items-center space-x-2 w-fit border border-white/10 shadow-sm">
              <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
              <span>
                Transcribing voice note &amp; matching NSQF database...
              </span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Sample Voice Prompts */}
        <div className="bg-[#141b22] px-3.5 py-2 border-t border-white/10 flex items-center space-x-2 overflow-x-auto text-[11px]">
          <span className="text-white/40 uppercase tracking-wider font-mono text-[9px] shrink-0">
            Demo Prompt:
          </span>
          <button
            onClick={() =>
              handleSendVoiceNote(
                "Main pichhle 5 saal se welding aur iron gate fabrication ka kaam karta hoon.",
                "0:11",
              )
            }
            className="px-2.5 py-1 bg-[#1e2936] hover:bg-[#283749] text-white/90 rounded border border-white/10 shrink-0 cursor-pointer font-light transition"
          >
            🔥 5-Yr Welding (Hindi)
          </button>
          <button
            onClick={() =>
              handleSendVoiceNote(
                "Aami 4 bochhor dhore tailoring ar blouse bananor kaaj korchi.",
                "0:09",
              )
            }
            className="px-2.5 py-1 bg-[#1e2936] hover:bg-[#283749] text-white/90 rounded border border-white/10 shrink-0 cursor-pointer font-light transition"
          >
            🧵 4-Yr Tailoring (Bengali)
          </button>
          <button
            onClick={() =>
              handleSendVoiceNote(
                "Naan 6 varushama handloom weaving panni irukken.",
                "0:10",
              )
            }
            className="px-2.5 py-1 bg-[#1e2936] hover:bg-[#283749] text-white/90 rounded border border-white/10 shrink-0 cursor-pointer font-light transition"
          >
            🧶 6-Yr Weaving (Tamil)
          </button>
        </div>

        {/* Bottom Input Controls */}
        <div className="bg-[#18222d] px-4 py-3 flex items-center space-x-3 border-t border-white/10">
          <input
            type="file"
            ref={waFileInputRef}
            accept="audio/*,video/webm,audio/wav,audio/mp3,audio/m4a,audio/ogg"
            className="hidden"
            onChange={handleWaFileUpload}
          />
          <button
            type="button"
            onClick={() => waFileInputRef.current?.click()}
            className="text-white/40 hover:text-amber-400 p-1 cursor-pointer transition"
            title="Upload Audio File from device"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && inputVal.trim()) {
                handleSendVoiceNote(inputVal, "0:05");
                setInputVal("");
              }
            }}
            placeholder="Type a message or tap mic to record..."
            className="flex-1 bg-[#0f1419] border border-white/10 rounded-lg px-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-hidden focus:border-amber-400"
          />

          <button
            onClick={handleToggleMic}
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-white transition cursor-pointer ${
              isRecording
                ? "bg-red-600 animate-pulse"
                : "bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold"
            }`}
            title={
              isRecording
                ? "Stop Recording"
                : "Hold or Tap to Record Voice Note"
            }
          >
            {isRecording ? (
              <MicOff className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Training Center Detail Modal */}
        {selectedCenter && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-[#141d27] border border-white/15 rounded-2xl w-full max-h-[90%] overflow-y-auto p-5 text-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-5 h-5 text-amber-400" />
                  <h3 className="font-editorial-serif font-bold text-base text-white">
                    Training Center Details
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedCenter(null)}
                  className="p-1 rounded-lg bg-white/5 hover:bg-white/15 text-white/70 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="text-[10px] font-mono uppercase text-amber-400 tracking-wider">
                    Authorized PM-AJAY Skill Hub
                  </div>
                  <div className="text-base font-bold text-white mt-0.5">
                    {selectedCenter.provider}
                  </div>
                  <div className="flex items-center space-x-1 text-white/60 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>
                      {selectedCenter.address ||
                        "Near Block Development Office, Kashi, Varanasi"}
                    </span>
                  </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 bg-[#0d131a] p-3 rounded-xl border border-white/5">
                  <div>
                    <span className="text-[10px] text-white/40 block">
                      Distance &amp; Travel
                    </span>
                    <span className="font-semibold text-white">
                      {selectedCenter.distance || "7.2 km"} (Direct Bus)
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/40 block">
                      Next Batch Start
                    </span>
                    <span className="font-semibold text-amber-300">
                      {selectedCenter.batchStart || "12 Sep 2026"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/40 block">
                      Available Seats
                    </span>
                    <span className="font-semibold text-emerald-400">
                      {selectedCenter.seats || "18 Seats Left"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/40 block">
                      Monthly Stipend
                    </span>
                    <span className="font-semibold text-emerald-400">
                      ₹1,500 / month
                    </span>
                  </div>
                </div>

                {/* Facilities Included */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-mono uppercase text-white/50 tracking-wider">
                    Center Amenities &amp; Government Provisions:
                  </div>
                  <ul className="space-y-1.5 text-[11px] text-white/80">
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>
                        100% Free Toolkits &amp; Safety Equipment upon
                        enrollment
                      </span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>
                        Air-cooled modern technical workshop with high-grade
                        simulators
                      </span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>
                        Biometric attendance with direct DBT bank stipend
                        linkage
                      </span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>
                        Guaranteed placement facilitation with registered local
                        MSMEs
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Coordinator details */}
                <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-amber-300 font-mono">
                      Block Skill Coordinator
                    </div>
                    <div className="font-bold text-white text-xs">
                      {selectedCenter.coordinator || "Shri Rajesh Sharma"}
                    </div>
                    <div className="text-[11px] text-white/70">
                      {selectedCenter.phone || "+91 98765 43210"}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      audioController.playChime("start");
                      alert(
                        `Connecting call to Block Officer: ${selectedCenter.coordinator || "Shri Rajesh Sharma"} (${selectedCenter.phone || "+91 98765 43210"})`,
                      );
                    }}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg text-xs font-bold flex items-center space-x-1 cursor-pointer transition"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call Officer</span>
                  </button>
                </div>

                {/* Actions */}
                <div className="pt-2 flex space-x-2">
                  <button
                    onClick={() => {
                      handleApplyFree(selectedCenter);
                      setSelectedCenter(null);
                    }}
                    className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center space-x-1.5"
                  >
                    <FileCheck className="w-4 h-4" />
                    <span>Apply for this Center</span>
                  </button>
                  <button
                    onClick={() => setSelectedCenter(null)}
                    className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white font-medium rounded-xl text-xs transition cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Application Success Modal */}
        {applicationReceipt && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-[#141d27] border border-emerald-500/40 rounded-2xl w-full p-5 text-white shadow-2xl text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  Application Confirmed
                </span>
                <h3 className="font-editorial-serif font-bold text-lg text-white mt-1">
                  PM-AJAY Enrollment Pass
                </h3>
                <p className="text-white/60 text-xs mt-0.5">
                  Your seat has been provisionally reserved for free training.
                </p>
              </div>

              <div className="bg-[#0d131a] p-3.5 rounded-xl border border-white/5 text-left space-y-2 text-xs font-mono">
                <div className="flex justify-between border-b border-white/5 pb-1.5">
                  <span className="text-white/40">Ref Number:</span>
                  <span className="text-amber-400 font-bold">
                    {applicationReceipt.ref}
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1.5">
                  <span className="text-white/40">Course:</span>
                  <span className="text-white truncate max-w-[180px]">
                    {applicationReceipt.course}
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1.5">
                  <span className="text-white/40">Center:</span>
                  <span className="text-white truncate max-w-[180px]">
                    {applicationReceipt.provider}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Batch Date:</span>
                  <span className="text-emerald-400">
                    {applicationReceipt.batchStart}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setApplicationReceipt(null)}
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold rounded-xl text-xs uppercase tracking-wider transition cursor-pointer"
              >
                Back to WhatsApp Chat
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

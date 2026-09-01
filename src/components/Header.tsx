import React, { useState, useRef, useEffect } from "react";
import {
  Mic,
  MessageSquare,
  Monitor,
  ShieldCheck,
  Globe,
  Sparkles,
  HelpCircle,
  Sun,
  Moon,
  ChevronDown,
  Volume2,
  VolumeX,
  Layers,
  StopCircle,
  Smartphone,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SupportedLanguage, UserRole } from "../types.js";
import { t, getScreenNarration } from "../lib/translations.js";
import { useTheme } from "../context/ThemeContext.js";
import { audioController } from "../lib/audio.js";

interface HeaderProps {
  currentView: string;
  onSelectView: (view: string) => void;
  selectedLanguage: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
  currentRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  onOpenDemo: () => void;
  onOpenEscalationModal: () => void;
}

interface NavChannelItem {
  id: string;
  view: string;
  labelKey: string;
  description: string;
  icon: typeof Mic;
  badge: string;
  accentBg: string;
  accentText: string;
  accentBorder: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onSelectView,
  selectedLanguage,
  onSelectLanguage,
  currentRole,
  onChangeRole,
  onOpenDemo,
  onOpenEscalationModal,
}) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  // Dropdown states
  const [isChannelDropdownOpen, setIsChannelDropdownOpen] = useState(false);
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const channelDropdownRef = useRef<HTMLDivElement>(null);
  const toolsDropdownRef = useRef<HTMLDivElement>(null);

  // Subscribe to audio controller for TalkBack status
  useEffect(() => {
    const unsubscribe = audioController.subscribeTalkBack((status) => {
      setIsSpeaking(status.isSpeaking);
    });
    return () => unsubscribe();
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        channelDropdownRef.current &&
        !channelDropdownRef.current.contains(e.target as Node)
      ) {
        setIsChannelDropdownOpen(false);
      }
      if (
        toolsDropdownRef.current &&
        !toolsDropdownRef.current.contains(e.target as Node)
      ) {
        setIsToolsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Active channel determination
  const getActiveTab = (): string => {
    if (currentView === "mobile") return "mobile";
    if (currentView.startsWith("admin")) return "admin";
    if (currentView === "whatsapp") return "whatsapp";
    if (currentView === "kiosk") return "kiosk";
    return "beneficiary";
  };

  const activeTab = getActiveTab();

  const channels: NavChannelItem[] = [
    {
      id: "mobile",
      view: "mobile",
      labelKey: "header.mobile_ux",
      description: "7-screen mobile UX flow with TalkBack and voice controls",
      icon: Smartphone,
      badge: "Mobile App",
      accentBg: "bg-indigo-500/10",
      accentText: "text-indigo-400",
      accentBorder: "border-indigo-500/30",
    },
    {
      id: "beneficiary",
      view: "beneficiary_interview",
      labelKey: "header.spoken_intake",
      description:
        "Dialect-aware conversational voice intake & live AI extraction",
      icon: Mic,
      badge: "Voice Call",
      accentBg: "bg-orange-500/10",
      accentText: "text-orange-500",
      accentBorder: "border-orange-500/30",
    },
    {
      id: "whatsapp",
      view: "whatsapp",
      labelKey: "header.whatsapp",
      description: "Conversational audio messaging, notes & multimodal intake",
      icon: MessageSquare,
      badge: "WhatsApp Bot",
      accentBg: "bg-emerald-500/10",
      accentText: "text-emerald-500",
      accentBorder: "border-emerald-500/30",
    },
    {
      id: "kiosk",
      view: "kiosk",
      labelKey: "header.kiosk",
      description: "Field facilitator offline storage & periodic sync queue",
      icon: Monitor,
      badge: "Offline Field",
      accentBg: "bg-sky-500/10",
      accentText: "text-sky-500",
      accentBorder: "border-sky-500/30",
    },
    {
      id: "admin",
      view: "admin",
      labelKey: "header.governance",
      description:
        "District monitoring, PM-AJAY allocation & escalation console",
      icon: ShieldCheck,
      badge: "Admin & Audit",
      accentBg: "bg-amber-500/10",
      accentText: "text-amber-500",
      accentBorder: "border-amber-500/30",
    },
  ];

  const currentChannel =
    channels.find((c) => c.id === activeTab) || channels[0];
  const CurrentIcon = currentChannel.icon;

  const handleReadAloud = async () => {
    if (isSpeaking) {
      audioController.stopSpeaking();
    } else {
      const narration = getScreenNarration(currentView, selectedLanguage);
      await audioController.speakText(narration, selectedLanguage);
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-200 ${
        isDark
          ? "bg-[#0b1329]/95 backdrop-blur-md border-b border-white/10 shadow-xs text-white"
          : "bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs text-slate-800"
      }`}
    >
      {/* Top Editorial Ribbon */}
      <div
        className={`${
          isDark
            ? "bg-[#070d1d] text-slate-400 border-b border-white/5"
            : "bg-slate-100/90 text-slate-600 border-b border-slate-200"
        } text-[10px] tracking-[0.2em] uppercase px-4 sm:px-6 py-1 flex items-center justify-between transition-colors`}
      >
        <div className="flex items-center space-x-2 truncate">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 inline-block shrink-0"></span>
          <span
            className={`font-medium tracking-wider truncate ${isDark ? "text-slate-300" : "text-slate-700"}`}
          >
            {t("header.banner", selectedLanguage)}
          </span>
        </div>
        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={onOpenDemo}
            className="flex items-center space-x-1.5 text-orange-500 hover:text-orange-400 font-medium transition-colors cursor-pointer tracking-widest text-[10px]"
          >
            <Sparkles className="w-3 h-3" />
            <span className="hidden sm:inline">
              {t("header.dossier", selectedLanguage)}
            </span>
            <span className="sm:hidden">Dossier</span>
          </button>
        </div>
      </div>

      {/* Main Single-Line Bar with Dropbox Navigation */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand Identity */}
        <div
          onClick={() => onSelectView("landing")}
          className="flex items-center space-x-2.5 cursor-pointer group select-none shrink-0"
        >
          <div className="w-9 h-9 rounded-lg bg-orange-500 text-white flex items-center justify-center shadow-xs transition-transform duration-200 group-hover:scale-105">
            <Mic className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </div>

          <div>
            <div className="flex items-center space-x-1.5">
              <h1
                className={`font-bold text-sm sm:text-base tracking-tight leading-tight transition-colors ${
                  isDark
                    ? "text-white group-hover:text-orange-200"
                    : "text-slate-900 group-hover:text-orange-600"
                }`}
              >
                PM-AJAY <span className="hidden xs:inline">Voice Dossier</span>
              </h1>
              <span className="border border-orange-500/30 bg-orange-500/10 text-orange-500 text-[8px] font-mono font-bold px-1.5 py-0.2 rounded uppercase">
                NSQF
              </span>
            </div>
            <p
              className={`hidden md:block text-[10px] tracking-normal font-normal ${isDark ? "text-slate-400" : "text-slate-500"}`}
            >
              {t("header.subtitle", selectedLanguage)}
            </p>
          </div>
        </div>

        {/* Center: THE CHANNEL DROPBOX SELECTOR (hidden on mobile, handled by bottom bar) */}
        <div className="relative hidden md:block" ref={channelDropdownRef}>
          <button
            onClick={() => setIsChannelDropdownOpen(!isChannelDropdownOpen)}
            className={`flex w-full sm:w-auto items-center justify-center sm:justify-start space-x-2 px-3 py-1.5 rounded-lg border font-medium text-xs transition-all duration-150 cursor-pointer shadow-xs ${
              isDark
                ? "bg-[#101b38] border-white/15 text-white hover:bg-white/10 hover:border-orange-500/50"
                : "bg-slate-100 border-slate-200 text-slate-900 hover:bg-slate-200/80 hover:border-orange-500/50"
            }`}
            aria-label="Select Intake Channel or Mode"
            title="Switch Channel / Intake Mode"
          >
            <div
              className={`p-1 rounded ${currentChannel.accentBg} ${currentChannel.accentText}`}
            >
              <CurrentIcon className="w-3.5 h-3.5" />
            </div>

            <div className="text-left">
              <span className="text-[9px] block uppercase tracking-wider font-mono opacity-50 leading-none">
                Channel / Mode
              </span>
              <span className="font-semibold text-xs tracking-tight">
                {t(currentChannel.labelKey, selectedLanguage)}
              </span>
            </div>

            <ChevronDown
              className={`w-3.5 h-3.5 opacity-60 transition-transform duration-200 ${
                isChannelDropdownOpen ? "rotate-180 text-orange-500" : ""
              }`}
            />
          </button>

          {/* Dropbox Animated Flyout Menu */}
          <AnimatePresence>
            {isChannelDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className={`absolute left-0 sm:left-1/2 sm:-translate-x-1/2 mt-2 w-72 sm:w-80 rounded-lg border shadow-xl p-1.5 z-50 overflow-hidden ${
                  isDark
                    ? "bg-[#0f172a] border-white/15 text-white shadow-black/60"
                    : "bg-white border-slate-200 text-slate-900 shadow-slate-300/60"
                }`}
              >
                <div
                  className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider border-b mb-1 ${
                    isDark
                      ? "text-slate-400 border-white/10"
                      : "text-slate-500 border-slate-100"
                  }`}
                >
                  Select PM-AJAY Intake Channel
                </div>

                <div className="space-y-1">
                  {channels.map((ch) => {
                    const Icon = ch.icon;
                    const isSelected = activeTab === ch.id;

                    return (
                      <button
                        key={ch.id}
                        onClick={() => {
                          onSelectView(ch.view);
                          setIsChannelDropdownOpen(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-lg flex items-start space-x-3 transition-colors cursor-pointer ${
                          isSelected
                            ? isDark
                              ? "bg-white/10 border border-white/10"
                              : "bg-orange-50 border border-orange-200/80"
                            : isDark
                              ? "hover:bg-white/5"
                              : "hover:bg-slate-100"
                        }`}
                      >
                        <div
                          className={`p-2 rounded-lg shrink-0 mt-0.5 ${ch.accentBg} ${ch.accentText}`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-xs font-bold tracking-tight ${isSelected ? "text-orange-500" : ""}`}
                            >
                              {t(ch.labelKey, selectedLanguage)}
                            </span>
                            <span
                              className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${ch.accentBg} ${ch.accentText} ${ch.accentBorder}`}
                            >
                              {ch.badge}
                            </span>
                          </div>
                          <p
                            className={`text-[11px] leading-snug mt-0.5 truncate ${
                              isDark ? "text-slate-400" : "text-slate-500"
                            }`}
                          >
                            {ch.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Controls: Streamlined Toolbar */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          {/* Quick 7-Screen Mobile UX Button (visible on md+) */}
          <button
            onClick={() => onSelectView("mobile")}
            className={`hidden md:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-xs ${
              currentView === "mobile"
                ? "bg-indigo-600 text-white border-indigo-500 shadow-indigo-500/20 ring-2 ring-indigo-400"
                : isDark
                  ? "bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border-indigo-500/40"
                  : "bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border-indigo-200"
            }`}
            title="Open 7-Screen Mobile App UX (PDF Design)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="text-[11px] uppercase tracking-wider">
              Mobile UX
            </span>
          </button>

          {/* Quick TalkBack Read Aloud Button */}
          <button
            onClick={handleReadAloud}
            className={`p-2 rounded-xl border transition-colors duration-150 cursor-pointer flex items-center justify-center min-w-[36px] min-h-[36px] ${
              isSpeaking
                ? "bg-amber-500 text-slate-950 border-amber-400 animate-pulse"
                : isDark
                  ? "bg-[#101b38] border-white/10 text-amber-400 hover:bg-white/5"
                  : "bg-slate-100 border-slate-200 text-amber-600 hover:bg-slate-200/70"
            }`}
            title={
              isSpeaking ? "Stop voice reading" : "Read screen aloud (TalkBack)"
            }
            aria-label="Read screen aloud"
          >
            {isSpeaking ? (
              <StopCircle className="w-3.5 h-3.5" />
            ) : (
              <Volume2 className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl border transition-colors duration-150 cursor-pointer flex items-center justify-center min-w-[36px] min-h-[36px] ${
              isDark
                ? "bg-[#101b38] border-white/10 text-amber-400 hover:bg-white/5"
                : "bg-slate-100 border-slate-200 text-indigo-600 hover:bg-slate-200/70"
            }`}
            title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
            aria-label="Toggle Theme"
          >
            {isDark ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-indigo-600" />
            )}
          </button>

          {/* Language Compact Dropdown */}
          <div
            className={`relative flex items-center border rounded-xl px-2 py-1.5 text-xs transition-colors duration-150 min-h-[36px] ${
              isDark
                ? "bg-[#101b38] border-white/10 text-white hover:border-white/20"
                : "bg-slate-100 border-slate-200 text-slate-800 hover:border-slate-300"
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-orange-500 mr-1 shrink-0 opacity-90" />
            <select
              value={selectedLanguage}
              onChange={(e) =>
                onSelectLanguage(e.target.value as SupportedLanguage)
              }
              aria-label="Select preferred language"
              className={`bg-transparent font-medium text-xs focus:outline-hidden cursor-pointer pr-3.5 appearance-none max-w-[65px] sm:max-w-none ${
                isDark ? "text-white" : "text-slate-800"
              }`}
            >
              <option
                value="hi"
                className={
                  isDark ? "bg-[#0b1329] text-white" : "bg-white text-slate-900"
                }
              >
                हिन्दी
              </option>
              <option
                value="bn"
                className={
                  isDark ? "bg-[#0b1329] text-white" : "bg-white text-slate-900"
                }
              >
                বাংলা
              </option>
              <option
                value="mr"
                className={
                  isDark ? "bg-[#0b1329] text-white" : "bg-white text-slate-900"
                }
              >
                मराठी
              </option>
              <option
                value="ta"
                className={
                  isDark ? "bg-[#0b1329] text-white" : "bg-white text-slate-900"
                }
              >
                தமிழ்
              </option>
              <option
                value="te"
                className={
                  isDark ? "bg-[#0b1329] text-white" : "bg-white text-slate-900"
                }
              >
                తెలుగు
              </option>
              <option
                value="kn"
                className={
                  isDark ? "bg-[#0b1329] text-white" : "bg-white text-slate-900"
                }
              >
                ಕನ್ನಡ
              </option>
              <option
                value="ml"
                className={
                  isDark ? "bg-[#0b1329] text-white" : "bg-white text-slate-900"
                }
              >
                മലയാളം
              </option>
              <option
                value="gu"
                className={
                  isDark ? "bg-[#0b1329] text-white" : "bg-white text-slate-900"
                }
              >
                ગુજરાતી
              </option>
              <option
                value="pa"
                className={
                  isDark ? "bg-[#0b1329] text-white" : "bg-white text-slate-900"
                }
              >
                ਪੰਜਾਬੀ
              </option>
              <option
                value="or"
                className={
                  isDark ? "bg-[#0b1329] text-white" : "bg-white text-slate-900"
                }
              >
                ଓଡ଼ିଆ
              </option>
              <option
                value="as"
                className={
                  isDark ? "bg-[#0b1329] text-white" : "bg-white text-slate-900"
                }
              >
                অসমীয়া
              </option>
              <option
                value="en"
                className={
                  isDark ? "bg-[#0b1329] text-white" : "bg-white text-slate-900"
                }
              >
                English
              </option>
              <option
                value="auto"
                className={
                  isDark ? "bg-[#0b1329] text-white" : "bg-white text-slate-900"
                }
              >
                ⚡ Auto
              </option>
            </select>
            <ChevronDown className="w-3 h-3 opacity-50 absolute right-1 pointer-events-none" />
          </div>

          {/* Quick Human Help Button */}
          <button
            onClick={onOpenEscalationModal}
            className="flex items-center space-x-1 bg-red-500/10 text-red-500 hover:bg-red-500/15 border border-red-500/25 px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0 min-h-[36px]"
            title="Request human officer assistance"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block"></span>
            <HelpCircle className="w-3.5 h-3.5 text-red-500" />
            <span className="hidden sm:inline text-[10px] tracking-wider uppercase font-medium">
              Help
            </span>
          </button>

          {/* Extra Options & Role Dropbox Menu */}
          <div className="relative" ref={toolsDropdownRef}>
            <button
              onClick={() => setIsToolsDropdownOpen(!isToolsDropdownOpen)}
              className={`p-2 rounded-xl border transition-colors duration-150 cursor-pointer flex items-center justify-center min-w-[36px] min-h-[36px] ${
                isToolsDropdownOpen
                  ? "bg-orange-500/20 border-orange-500/40 text-orange-400"
                  : isDark
                    ? "bg-[#101b38] border-white/10 text-slate-300 hover:bg-white/5"
                    : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200/70"
              }`}
              title="System Roles & Quick Tools"
              aria-label="Open System Options"
            >
              <Layers className="w-3.5 h-3.5" />
            </button>

            {/* Tools Dropdown Box */}
            <AnimatePresence>
              {isToolsDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className={`absolute right-0 mt-2 w-64 rounded-lg border shadow-xl p-3 z-50 space-y-3 ${
                    isDark
                      ? "bg-[#0f172a] border-white/15 text-white shadow-black/60"
                      : "bg-white border-slate-200 text-slate-900 shadow-slate-300/60"
                  }`}
                >
                  <div
                    className={`text-[10px] font-mono uppercase tracking-wider border-b pb-1.5 ${
                      isDark
                        ? "text-slate-400 border-white/10"
                        : "text-slate-500 border-slate-100"
                    }`}
                  >
                    System Role &amp; Evaluator Tools
                  </div>

                  {/* Role Selector */}
                  <div>
                    <label
                      className={`block text-[11px] font-medium mb-1 ${
                        isDark ? "text-slate-300" : "text-slate-700"
                      }`}
                    >
                      Simulated Role:
                    </label>
                    <select
                      value={currentRole}
                      onChange={(e) => {
                        onChangeRole(e.target.value as UserRole);
                      }}
                      className={`w-full border rounded-lg px-2.5 py-1.5 text-xs font-medium focus:outline-hidden ${
                        isDark
                          ? "bg-[#16203a] border-white/15 text-white"
                          : "bg-slate-100 border-slate-200 text-slate-900"
                      }`}
                    >
                      <option value="beneficiary">
                        Beneficiary (Aspirant)
                      </option>
                      <option value="field_worker">Field Facilitator</option>
                      <option value="district_admin">
                        District PM-AJAY Officer
                      </option>
                      <option value="state_admin">
                        State Skill Mission Director
                      </option>
                      <option value="super_admin">National Super Admin</option>
                    </select>
                  </div>

                  {/* 1-Click Interactive Dossier */}
                  <button
                    onClick={() => {
                      setIsToolsDropdownOpen(false);
                      onOpenDemo();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg bg-orange-500/10 border border-orange-500/25 text-orange-500 hover:bg-orange-500/15 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <span className="flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{t("header.dossier", selectedLanguage)}</span>
                    </span>
                    <span className="text-[10px] font-mono font-bold">
                      SAMPLE DATA
                    </span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

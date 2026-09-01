import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  Smartphone, 
  MessageSquare, 
  Monitor, 
  ShieldCheck, 
  Volume2, 
  StopCircle,
  Globe,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { SupportedLanguage } from '../../types.js';
import { useTheme } from '../../context/ThemeContext.js';
import { audioController } from '../../lib/audio.js';
import { getScreenNarration } from '../../lib/translations.js';

interface MobileBottomNavProps {
  currentView: string;
  onSelectView: (view: string) => void;
  selectedLanguage: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
  onOpenDemo: () => void;
  onOpenEscalationModal: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  onSelectView,
  selectedLanguage,
  onSelectLanguage,
  onOpenDemo,
  onOpenEscalationModal
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showLanguageSheet, setShowLanguageSheet] = useState(false);

  useEffect(() => {
    const unsubscribe = audioController.subscribeTalkBack((status) => {
      setIsSpeaking(status.isSpeaking);
    });
    return () => unsubscribe();
  }, []);

  const handleReadAloud = async () => {
    if (isSpeaking) {
      audioController.stopSpeaking();
    } else {
      const narration = getScreenNarration(currentView, selectedLanguage);
      await audioController.speakText(narration, selectedLanguage);
    }
  };

  const navItems = [
    {
      id: 'voice',
      views: ['landing', 'beneficiary_consent', 'beneficiary_language', 'beneficiary_interview', 'beneficiary_confirm', 'beneficiary_recommendations'],
      targetView: 'landing',
      label: 'Voice',
      nativeLabel: 'आवाज़',
      icon: Mic,
      badge: 'Live AI',
      color: 'text-orange-500',
      activeBg: 'bg-orange-500/15 text-orange-500'
    },
    {
      id: 'mobile_app',
      views: ['mobile'],
      targetView: 'mobile',
      label: 'App UX',
      nativeLabel: 'ऐप',
      icon: Smartphone,
      badge: '7-Screen',
      color: 'text-indigo-400',
      activeBg: 'bg-indigo-500/15 text-indigo-400'
    },
    {
      id: 'whatsapp',
      views: ['whatsapp'],
      targetView: 'whatsapp',
      label: 'WhatsApp',
      nativeLabel: 'वॉट्सऐप',
      icon: MessageSquare,
      badge: 'Bot',
      color: 'text-emerald-500',
      activeBg: 'bg-emerald-500/15 text-emerald-500'
    },
    {
      id: 'kiosk',
      views: ['kiosk'],
      targetView: 'kiosk',
      label: 'Kiosk',
      nativeLabel: 'कियोस्क',
      icon: Monitor,
      badge: 'Offline',
      color: 'text-sky-400',
      activeBg: 'bg-sky-500/15 text-sky-400'
    },
    {
      id: 'admin',
      views: ['admin'],
      targetView: 'admin',
      label: 'Admin',
      nativeLabel: 'प्रशासन',
      icon: ShieldCheck,
      badge: 'Gov',
      color: 'text-amber-500',
      activeBg: 'bg-amber-500/15 text-amber-500'
    }
  ];

  const languages: { code: SupportedLanguage; name: string; native: string }[] = [
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা' },
    { code: 'mr', name: 'Marathi', native: 'मराठी' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
    { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
    { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
    { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ' },
    { code: 'as', name: 'Assamese', native: 'অসমীয়া' },
    { code: 'en', name: 'English', native: 'English' },
    { code: 'auto', name: 'Auto Detect', native: '⚡ Auto' }
  ];

  return (
    <>
      {/* Floating Action Controls on Mobile (Above Bottom Bar) */}
      <div className="fixed bottom-[68px] right-3 z-40 flex items-center space-x-2 md:hidden">
        {/* TalkBack Floating Button */}
        <button
          onClick={handleReadAloud}
          aria-label="Read screen aloud"
          className={`flex items-center space-x-1.5 px-3 py-2 rounded-full shadow-lg border backdrop-blur-md transition-all active:scale-95 cursor-pointer ${
            isSpeaking
              ? 'bg-amber-500 text-slate-950 border-amber-400 animate-pulse font-bold'
              : isDark
                ? 'bg-[#121c36]/90 border-amber-500/30 text-amber-400 shadow-black/40'
                : 'bg-white/90 border-amber-300 text-amber-600 shadow-amber-500/15 font-semibold'
          }`}
        >
          {isSpeaking ? <StopCircle className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          <span className="text-[11px] font-bold">
            {isSpeaking ? 'Stop' : 'Listen'}
          </span>
        </button>

        {/* Language Floating Selector Button */}
        <button
          onClick={() => setShowLanguageSheet(true)}
          aria-label="Change Language"
          className={`p-2.5 rounded-full shadow-lg border backdrop-blur-md transition-all active:scale-95 cursor-pointer flex items-center justify-center ${
            isDark
              ? 'bg-[#121c36]/90 border-white/20 text-orange-400 shadow-black/40'
              : 'bg-white/90 border-slate-300 text-orange-600 shadow-slate-300/40'
          }`}
        >
          <Globe className="w-4 h-4" />
        </button>
      </div>

      {/* Main Sticky Bottom Navigation Bar (md:hidden) */}
      <nav 
        aria-label="Mobile Navigation"
        className={`fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-xl transition-colors duration-200 md:hidden select-none safe-area-pb ${
          isDark 
            ? 'bg-[#090f20]/95 border-white/10 text-slate-300 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]' 
            : 'bg-white/95 border-slate-200 text-slate-700 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]'
        }`}
      >
        <div className="grid grid-cols-5 h-16 items-center px-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.views.includes(currentView);

            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.targetView)}
                className={`flex flex-col items-center justify-center h-full relative py-1 transition-all duration-150 cursor-pointer active:scale-95 ${
                  isActive ? 'font-bold' : 'opacity-70 hover:opacity-100'
                }`}
              >
                {/* Active Indicator Top Pill */}
                {isActive && (
                  <span className="absolute top-0 w-8 h-1 rounded-b-full bg-orange-500 shadow-xs shadow-orange-500/50" />
                )}

                {/* Icon Container with active styling */}
                <div className={`p-1 rounded-xl transition-all ${isActive ? item.activeBg : ''}`}>
                  <Icon className={`w-5 h-5 ${isActive ? item.color : 'text-current'}`} />
                </div>

                {/* Label */}
                <span className={`text-[10px] leading-tight mt-0.5 tracking-tight ${
                  isActive ? (isDark ? 'text-white' : 'text-slate-900') : ''
                }`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Language Bottom Sheet for Mobile */}
      {showLanguageSheet && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs md:hidden animate-fadeIn">
          <div 
            className="fixed inset-0"
            onClick={() => setShowLanguageSheet(false)}
          />

          <div className={`relative w-full max-h-[80vh] rounded-t-3xl border-t p-5 flex flex-col z-10 shadow-2xl transition-all ${
            isDark ? 'bg-[#0f172a] border-white/20 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            {/* Sheet Handle */}
            <div className="w-12 h-1.5 bg-slate-400/40 rounded-full mx-auto mb-4" />

            <div className="flex items-center justify-between pb-3 border-b border-slate-200/20 mb-3">
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-orange-500" />
                <h3 className="font-bold text-base">Select Spoken Language</h3>
              </div>
              <button 
                onClick={() => setShowLanguageSheet(false)}
                className="text-xs font-bold text-orange-500 hover:text-orange-400 p-1"
              >
                Done
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 overflow-y-auto max-h-[55vh] py-2">
              {languages.map((lang) => {
                const isSelected = selectedLanguage === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onSelectLanguage(lang.code);
                      audioController.playChime('start');
                      setShowLanguageSheet(false);
                    }}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all active:scale-98 cursor-pointer ${
                      isSelected
                        ? 'bg-orange-500 text-white border-orange-400 shadow-md font-bold'
                        : isDark
                          ? 'bg-slate-800/60 border-white/10 text-slate-200 hover:bg-slate-800'
                          : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-bold">{lang.native}</div>
                      <div className={`text-[11px] ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                        {lang.name}
                      </div>
                    </div>
                    {isSelected && <span className="text-xs font-bold">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

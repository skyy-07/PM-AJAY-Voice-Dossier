import React from 'react';
import { 
  Mic, 
  MessageSquare, 
  Monitor, 
  ShieldCheck, 
  Sparkles, 
  Award, 
  TrendingUp, 
  MapPin, 
  ArrowRight,
  CheckCircle2,
  Cpu,
  Volume2,
  Smartphone
} from 'lucide-react';
import { SupportedLanguage } from '../../types.js';
import { t } from '../../lib/translations.js';
import { audioController } from '../../lib/audio.js';
import { useTheme } from '../../context/ThemeContext.js';

interface LandingPageProps {
  onStartVoice: () => void;
  onOpenWhatsApp: () => void;
  onOpenKiosk: () => void;
  onOpenAdmin: () => void;
  onOpenMobile?: () => void;
  onSelectSample: (sampleType: 'welder' | 'tailor' | 'tractor' | 'weaver') => void;
  selectedLanguage: SupportedLanguage;
  onSelectLanguage?: (lang: SupportedLanguage) => void;
  hasGivenConsent?: boolean;
  onToggleConsent?: (granted: boolean) => void;
}

const TOP_LANGUAGES: { code: SupportedLanguage; name: string; native: string }[] = [
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'en', name: 'English', native: 'English' },
  { code: 'auto', name: 'Auto Detect', native: '⚡ Auto' }
];

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartVoice,
  onOpenWhatsApp,
  onOpenKiosk,
  onOpenAdmin,
  onOpenMobile,
  onSelectSample,
  selectedLanguage,
  onSelectLanguage,
  hasGivenConsent = false,
  onToggleConsent
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const readCardAloud = (text: string) => {
    audioController.speakText(text, selectedLanguage);
  };

  const handleLanguageClick = (langCode: SupportedLanguage) => {
    if (onSelectLanguage) {
      onSelectLanguage(langCode);
    }
  };

  return (
    <div className={`min-h-[calc(100vh-80px)] transition-colors duration-200 ${
      isDark ? 'bg-[#0a1120] text-slate-100' : 'bg-slate-50 text-slate-800'
    } pb-20`}>
      {/* Hero Section */}
      <section className={`relative overflow-hidden pt-12 sm:pt-16 pb-16 sm:pb-24 border-b ${
        isDark 
          ? 'bg-gradient-to-b from-[#162a56] via-[#102044] to-[#0a1120] border-blue-900/40 text-white' 
          : 'bg-gradient-to-b from-[#eaf2ff] via-[#f1f6ff] to-slate-50 border-blue-100 text-slate-900'
      }`}>
        {/* Background Ambient Radial Glows */}
        <div className={`absolute top-0 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none ${
          isDark ? 'bg-blue-500/10' : 'bg-blue-400/20'
        }`} />
        <div className={`absolute bottom-0 left-10 w-72 h-72 rounded-full blur-3xl pointer-events-none ${
          isDark ? 'bg-amber-500/5' : 'bg-amber-400/15'
        }`} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Top Government of India Pill Badge */}
              <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full border text-xs font-medium tracking-wide backdrop-blur-md transition-all select-none shadow-xs ${
                isDark 
                  ? 'bg-white/10 border-white/20 text-white/90 shadow-black/20' 
                  : 'bg-blue-600/10 border-blue-600/20 text-blue-900 shadow-blue-500/10'
              }">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                <span>Government of India &bull; PM-AJAY Programme</span>
              </div>

              {/* Huge Bold Headline matching exact screenshot */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1]">
                <span className={isDark ? 'text-white' : 'text-slate-900'}>
                  Your skills can
                </span>
                <br />
                <span className="text-orange-500 font-extrabold">
                  build your future.
                </span>
              </h1>

              {/* Subtitle */}
              <p className={`text-base sm:text-lg max-w-xl font-normal leading-relaxed ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}>
                Talk to our voice assistant in your language and discover skilling and livelihood opportunities suited to your experience.
              </p>

              {/* Action Buttons Row matching mobile-first layout */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3.5">
                {/* Primary Button - Full width on mobile for thumb reach */}
                <button
                  id="hero-talk-btn"
                  onClick={onStartVoice}
                  className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold px-6 sm:px-7 py-4 sm:py-3.5 rounded-2xl shadow-lg shadow-orange-500/30 flex items-center justify-center space-x-2.5 text-base transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer min-h-[48px]"
                >
                  <Mic className="w-5 h-5 text-white animate-pulse" />
                  <span>Talk to the Assistant</span>
                </button>

                {/* Secondary Actions Grid for Mobile */}
                <div className="grid grid-cols-3 sm:flex sm:items-center gap-2 sm:gap-3">
                  {/* Voice Note Button */}
                  <button
                    id="hero-voicenote-btn"
                    onClick={onOpenWhatsApp}
                    className={`font-semibold px-3 sm:px-5 py-3 sm:py-3.5 rounded-2xl border backdrop-blur-md flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 text-xs sm:text-sm transition-all duration-200 active:scale-95 cursor-pointer min-h-[48px] ${
                      isDark 
                        ? 'bg-white/10 hover:bg-white/15 border-white/20 text-white' 
                        : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800 shadow-xs'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                    <span>WhatsApp</span>
                  </button>

                  {/* Kiosk Button */}
                  <button
                    id="hero-kiosk-btn"
                    onClick={onOpenKiosk}
                    className={`font-semibold px-3 sm:px-5 py-3 sm:py-3.5 rounded-2xl border backdrop-blur-md flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 text-xs sm:text-sm transition-all duration-200 active:scale-95 cursor-pointer min-h-[48px] ${
                      isDark 
                        ? 'bg-white/10 hover:bg-white/15 border-white/20 text-white' 
                        : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800 shadow-xs'
                    }`}
                  >
                    <Monitor className="w-4 h-4 text-sky-400" />
                    <span>Kiosk</span>
                  </button>

                  {/* Mobile App Button */}
                  {onOpenMobile && (
                    <button
                      id="hero-mobile-btn"
                      onClick={onOpenMobile}
                      className={`font-semibold px-3 sm:px-5 py-3 sm:py-3.5 rounded-2xl border backdrop-blur-md flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 text-xs sm:text-sm transition-all duration-200 active:scale-95 cursor-pointer min-h-[48px] ${
                        isDark 
                          ? 'bg-indigo-500/20 hover:bg-indigo-500/30 border-indigo-500/40 text-indigo-200' 
                          : 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-900 shadow-xs'
                      }`}
                    >
                      <Smartphone className="w-4 h-4 text-indigo-400" />
                      <span>App UX</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Localized Audio Trigger Tip */}
              <div className="pt-2 flex items-center space-x-2 text-xs opacity-75">
                <button
                  onClick={() => readCardAloud("Your skills can build your future. Talk to our voice assistant in your language and discover skilling and livelihood opportunities suited to your experience.")}
                  className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md border transition ${
                    isDark 
                      ? 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300' 
                      : 'bg-slate-200/60 border-slate-300 hover:bg-slate-200 text-slate-700'
                  }`}
                  title="Listen to this section in your language"
                >
                  <Volume2 className="w-3.5 h-3.5 text-amber-500" />
                  <span>{t('talkback.listen_screen', selectedLanguage)}</span>
                </button>
              </div>
            </div>

            {/* Right Hero Visual: Concentric Radiating Rings + Microphone Orb + Equalizer */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative py-6 select-none">
              
              {/* Concentric Radar Rings */}
              <div className="relative w-72 h-72 sm:w-88 sm:h-88 flex items-center justify-center">
                
                {/* Outer Ring 3 */}
                <div className={`absolute w-full h-full rounded-full border animate-radar-pulse ${
                  isDark ? 'border-white/10 bg-blue-500/5' : 'border-blue-300/40 bg-blue-500/5'
                }`} />

                {/* Outer Ring 2 */}
                <div className={`absolute w-3/4 h-3/4 rounded-full border ${
                  isDark ? 'border-white/15' : 'border-blue-400/30'
                }`} />

                {/* Outer Ring 1 */}
                <div className={`absolute w-1/2 h-1/2 rounded-full border ${
                  isDark ? 'border-white/20' : 'border-blue-500/30'
                }`} />

                {/* Central Microphone Orb */}
                <div 
                  onClick={onStartVoice}
                  className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center relative shadow-2xl transition-transform hover:scale-105 cursor-pointer backdrop-blur-md border-2 group ${
                    isDark 
                      ? 'bg-white/10 border-white/30 text-white shadow-blue-500/20' 
                      : 'bg-blue-600/10 border-blue-500/40 text-blue-600 shadow-blue-500/30'
                  }`}
                  title="Click to start voice session"
                >
                  <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center ${
                    isDark ? 'bg-white/15' : 'bg-blue-600'
                  }`}>
                    <Mic className="w-9 h-9 text-white mb-0.5 group-hover:scale-110 transition-transform" />
                    <span className="text-[9px] font-bold text-white/90 uppercase tracking-wider">Start</span>
                  </div>
                </div>
              </div>

              {/* Static Audio Indicator in Ready / Standby State */}
              <div className="mt-4 flex flex-col items-center space-y-2">
                <div className="flex items-center space-x-1.5 h-6 opacity-60">
                  <span className="w-1.5 h-2 bg-blue-400/80 rounded-full"></span>
                  <span className="w-1.5 h-3 bg-blue-400/90 rounded-full"></span>
                  <span className="w-1.5 h-4 bg-white rounded-full"></span>
                  <span className="w-1.5 h-5 bg-blue-300 rounded-full"></span>
                  <span className="w-1.5 h-4 bg-orange-400 rounded-full"></span>
                  <span className="w-1.5 h-5 bg-blue-400 rounded-full"></span>
                  <span className="w-1.5 h-3 bg-blue-300/90 rounded-full"></span>
                  <span className="w-1.5 h-2 bg-blue-400/70 rounded-full"></span>
                </div>

                <div className={`flex items-center space-x-2 text-xs font-medium ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span>Microphone in Standby &bull; Tap Start to Speak</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Quick Interactive Personas Benchmarks Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className={`rounded-2xl p-4 border shadow-xl flex flex-wrap items-center justify-between gap-3 ${
          isDark 
            ? 'bg-[#111c33] border-white/10 text-white' 
            : 'bg-white border-slate-200 text-slate-800 shadow-slate-200/80'
        }`}>
          <div className="flex items-center space-x-2 px-2 text-xs font-mono uppercase tracking-wider text-amber-500 font-bold">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span>{t('landing.benchmarks', selectedLanguage)}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onSelectSample('welder')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition cursor-pointer flex items-center space-x-1.5 ${
                isDark 
                  ? 'bg-slate-800/80 hover:bg-slate-700 border-white/10 hover:border-amber-400 text-white' 
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-200 hover:border-amber-500 text-slate-800'
              }`}
            >
              <span>🔥 {t('landing.welder', selectedLanguage)}</span>
              <span className="opacity-50 text-[10px]">(Ramesh)</span>
            </button>
            <button
              onClick={() => onSelectSample('tailor')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition cursor-pointer flex items-center space-x-1.5 ${
                isDark 
                  ? 'bg-slate-800/80 hover:bg-slate-700 border-white/10 hover:border-amber-400 text-white' 
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-200 hover:border-amber-500 text-slate-800'
              }`}
            >
              <span>🧵 {t('landing.tailor', selectedLanguage)}</span>
              <span className="opacity-50 text-[10px]">(Sushila)</span>
            </button>
            <button
              onClick={() => onSelectSample('tractor')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition cursor-pointer flex items-center space-x-1.5 ${
                isDark 
                  ? 'bg-slate-800/80 hover:bg-slate-700 border-white/10 hover:border-amber-400 text-white' 
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-200 hover:border-amber-500 text-slate-800'
              }`}
            >
              <span>🚜 {t('landing.tractor', selectedLanguage)}</span>
              <span className="opacity-50 text-[10px]">(Santosh)</span>
            </button>
            <button
              onClick={() => onSelectSample('weaver')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition cursor-pointer flex items-center space-x-1.5 ${
                isDark 
                  ? 'bg-slate-800/80 hover:bg-slate-700 border-white/10 hover:border-amber-400 text-white' 
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-200 hover:border-amber-500 text-slate-800'
              }`}
            >
              <span>🧶 {t('landing.weaver', selectedLanguage)}</span>
              <span className="opacity-50 text-[10px]">(Murugan)</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3 Primary Channel Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Voice Call / IVR */}
          <div 
            onClick={onStartVoice}
            className={`group relative rounded-2xl p-7 border shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between cursor-pointer ${
              isDark 
                ? 'bg-[#111c33] border-white/10 hover:border-amber-500/50' 
                : 'bg-white border-slate-200 hover:border-amber-500/50'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Mic className="w-6 h-6" />
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      readCardAloud(`${t('landing.card_ivr_title', selectedLanguage)}. ${t('landing.card_ivr_desc', selectedLanguage)}`);
                    }}
                    className={`p-1 rounded transition ${
                      isDark ? 'bg-white/5 hover:bg-amber-500/20 text-white/60 hover:text-amber-400' : 'bg-slate-100 hover:bg-amber-500/20 text-slate-500 hover:text-amber-600'
                    }`}
                    title="Speak card aloud"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <span className="text-[10px] tracking-[0.2em] uppercase font-mono font-bold text-amber-500 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded">
                    {t('landing.card_ivr_badge', selectedLanguage)}
                  </span>
                </div>
              </div>
              <h2 className={`text-xl font-bold group-hover:text-amber-500 transition ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {t('landing.card_ivr_title', selectedLanguage)}
              </h2>
              <p className={`mt-2 text-xs sm:text-sm leading-relaxed font-normal ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {t('landing.card_ivr_desc', selectedLanguage)}
              </p>

              <ul className={`mt-6 space-y-2.5 text-xs border-t pt-4 ${isDark ? 'text-slate-400 border-white/10' : 'text-slate-500 border-slate-100'}`}>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>{t('landing.card_ivr_b1', selectedLanguage)}</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>{t('landing.card_ivr_b2', selectedLanguage)}</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>{t('landing.card_ivr_b3', selectedLanguage)}</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-200/10 flex items-center justify-between text-amber-500 text-xs tracking-wider uppercase font-bold">
              <span>{t('landing.card_ivr_cta', selectedLanguage)}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>

          {/* Card 2: WhatsApp Voice Note */}
          <div 
            onClick={onOpenWhatsApp}
            className={`group relative rounded-2xl p-7 border shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between cursor-pointer ${
              isDark 
                ? 'bg-[#111c33] border-white/10 hover:border-emerald-500/50' 
                : 'bg-white border-slate-200 hover:border-emerald-500/50'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      readCardAloud(`${t('landing.card_wa_title', selectedLanguage)}. ${t('landing.card_wa_desc', selectedLanguage)}`);
                    }}
                    className={`p-1 rounded transition ${
                      isDark ? 'bg-white/5 hover:bg-emerald-500/20 text-white/60 hover:text-emerald-400' : 'bg-slate-100 hover:bg-emerald-500/20 text-slate-500 hover:text-emerald-600'
                    }`}
                    title="Speak card aloud"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <span className="text-[10px] tracking-[0.2em] uppercase font-mono font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded">
                    {t('landing.card_wa_badge', selectedLanguage)}
                  </span>
                </div>
              </div>
              <h2 className={`text-xl font-bold group-hover:text-emerald-500 transition ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {t('landing.card_wa_title', selectedLanguage)}
              </h2>
              <p className={`mt-2 text-xs sm:text-sm leading-relaxed font-normal ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {t('landing.card_wa_desc', selectedLanguage)}
              </p>

              <ul className={`mt-6 space-y-2.5 text-xs border-t pt-4 ${isDark ? 'text-slate-400 border-white/10' : 'text-slate-500 border-slate-100'}`}>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>{t('landing.card_wa_b1', selectedLanguage)}</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>{t('landing.card_wa_b2', selectedLanguage)}</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>{t('landing.card_wa_b3', selectedLanguage)}</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-200/10 flex items-center justify-between text-emerald-500 text-xs tracking-wider uppercase font-bold">
              <span>{t('landing.card_wa_cta', selectedLanguage)}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>

          {/* Card 3: Offline Kiosk */}
          <div 
            onClick={onOpenKiosk}
            className={`group relative rounded-2xl p-7 border shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between cursor-pointer ${
              isDark 
                ? 'bg-[#111c33] border-white/10 hover:border-sky-500/50' 
                : 'bg-white border-slate-200 hover:border-sky-500/50'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Monitor className="w-6 h-6" />
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      readCardAloud(`${t('landing.card_kiosk_title', selectedLanguage)}. ${t('landing.card_kiosk_desc', selectedLanguage)}`);
                    }}
                    className={`p-1 rounded transition ${
                      isDark ? 'bg-white/5 hover:bg-sky-500/20 text-white/60 hover:text-sky-400' : 'bg-slate-100 hover:bg-sky-500/20 text-slate-500 hover:text-sky-600'
                    }`}
                    title="Speak card aloud"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <span className="text-[10px] tracking-[0.2em] uppercase font-mono font-bold text-sky-500 bg-sky-500/10 border border-sky-500/30 px-2.5 py-1 rounded">
                    {t('landing.card_kiosk_badge', selectedLanguage)}
                  </span>
                </div>
              </div>
              <h2 className={`text-xl font-bold group-hover:text-sky-500 transition ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {t('landing.card_kiosk_title', selectedLanguage)}
              </h2>
              <p className={`mt-2 text-xs sm:text-sm leading-relaxed font-normal ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {t('landing.card_kiosk_desc', selectedLanguage)}
              </p>

              <ul className={`mt-6 space-y-2.5 text-xs border-t pt-4 ${isDark ? 'text-slate-400 border-white/10' : 'text-slate-500 border-slate-100'}`}>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                  <span>{t('landing.card_kiosk_b1', selectedLanguage)}</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                  <span>{t('landing.card_kiosk_b2', selectedLanguage)}</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                  <span>{t('landing.card_kiosk_b3', selectedLanguage)}</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-200/10 flex items-center justify-between text-sky-500 text-xs tracking-wider uppercase font-bold">
              <span>{t('landing.card_kiosk_cta', selectedLanguage)}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* Secondary Action: District & State PM-AJAY Governance Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className={`rounded-2xl p-7 sm:p-9 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border relative overflow-hidden ${
          isDark 
            ? 'bg-[#111c33] border-white/10 text-white' 
            : 'bg-white border-slate-200 text-slate-900 shadow-slate-200/80'
        }`}>
          <div className="space-y-2 text-left relative z-10">
            <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/30 text-amber-500 text-[10px] font-mono tracking-[0.2em] uppercase px-3 py-1 rounded font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t('landing.gov_badge', selectedLanguage)}</span>
            </div>
            <h3 className={`text-2xl sm:text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {t('landing.gov_title', selectedLanguage)}
            </h3>
            <p className={`text-xs sm:text-sm max-w-2xl leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {t('landing.gov_desc', selectedLanguage)}
            </p>
          </div>

          <button
            onClick={onOpenAdmin}
            className={`shrink-0 font-bold px-6 py-3.5 rounded-xl shadow-lg transition flex items-center space-x-2 cursor-pointer text-xs tracking-wider uppercase relative z-10 ${
              isDark 
                ? 'bg-white hover:bg-slate-200 text-slate-950' 
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <span>{t('landing.gov_cta', selectedLanguage)}</span>
          </button>
        </div>
      </section>

      {/* Architectural Pillars / Trust Badges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className={`p-5 rounded-2xl border ${
            isDark ? 'bg-[#111c33]/70 border-white/5 text-white' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <Award className="w-5 h-5 text-amber-500 mx-auto mb-2" />
            <div className="text-xs font-bold tracking-wide uppercase">{t('landing.badge1_title', selectedLanguage)}</div>
            <div className={`text-[11px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('landing.badge1_desc', selectedLanguage)}</div>
          </div>
          <div className={`p-5 rounded-2xl border ${
            isDark ? 'bg-[#111c33]/70 border-white/5 text-white' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <Cpu className="w-5 h-5 text-amber-500 mx-auto mb-2" />
            <div className="text-xs font-bold tracking-wide uppercase">{t('landing.badge2_title', selectedLanguage)}</div>
            <div className={`text-[11px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('landing.badge2_desc', selectedLanguage)}</div>
          </div>
          <div className={`p-5 rounded-2xl border ${
            isDark ? 'bg-[#111c33]/70 border-white/5 text-white' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <TrendingUp className="w-5 h-5 text-amber-500 mx-auto mb-2" />
            <div className="text-xs font-bold tracking-wide uppercase">{t('landing.badge3_title', selectedLanguage)}</div>
            <div className={`text-[11px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('landing.badge3_desc', selectedLanguage)}</div>
          </div>
          <div className={`p-5 rounded-2xl border ${
            isDark ? 'bg-[#111c33]/70 border-white/5 text-white' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <MapPin className="w-5 h-5 text-amber-500 mx-auto mb-2" />
            <div className="text-xs font-bold tracking-wide uppercase">{t('landing.badge4_title', selectedLanguage)}</div>
            <div className={`text-[11px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('landing.badge4_desc', selectedLanguage)}</div>
          </div>
        </div>
      </section>
    </div>
  );
};

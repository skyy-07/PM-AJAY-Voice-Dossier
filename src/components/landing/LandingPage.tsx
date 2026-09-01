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
  Volume2
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

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartVoice,
  onOpenWhatsApp,
  onOpenKiosk,
  onOpenAdmin,
  onSelectSample,
  selectedLanguage
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const readCardAloud = (text: string) => {
    audioController.speakText(text, selectedLanguage);
  };

  return (
    <div className={`min-h-[calc(100vh-80px)] transition-colors duration-200 ${
      isDark ? 'bg-[#101a32] text-slate-100' : 'bg-[#ebdfa1] text-[#173f46]'
    } pb-20`}>
      {/* Hero Section */}
      <section className={`relative overflow-hidden pt-12 sm:pt-16 pb-16 sm:pb-24 border-b ${
        isDark 
          ? 'bg-gradient-to-br from-[#1e2c55] via-[#172646] to-[#0f1830] border-[#31446f] text-white'
          : 'bg-gradient-to-br from-[#ebdfa1] via-[#ebdfa1] to-[#ebdea0] border-[#d9c985] text-[#173f46]'
      }`}>
        {/* Background Ambient Radial Glows */}
        <div className={`absolute top-0 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none ${
          isDark ? 'bg-[#70a69b]/10' : 'bg-[#76a994]/25'
        }`} />
        <div className={`absolute bottom-0 left-10 w-72 h-72 rounded-full blur-3xl pointer-events-none ${
          isDark ? 'bg-[#e6aa4b]/10' : 'bg-[#d8753b]/15'
        }`} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Top Government of India Pill Badge */}
              <div className={`inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full border text-xs font-medium tracking-wide backdrop-blur-md transition-all select-none shadow-xs ${
                isDark 
                  ? 'bg-white/10 border-white/20 text-white/90 shadow-black/20' 
                  : 'bg-[#173f46]/8 border-[#173f46]/20 text-[#173f46] shadow-[#173f46]/10'
              }`}>
                <span className="w-2 h-2 rounded-full bg-[#d8753b] animate-pulse"></span>
                <span>Government of India &bull; PM-AJAY Programme</span>
              </div>

              {/* Huge Bold Headline matching exact screenshot */}
              <h1 className="font-editorial-serif text-5xl sm:text-6xl md:text-7xl font-medium tracking-[-0.04em] leading-[.98]">
                  <span className={isDark ? 'text-[#f4f0e8]' : 'text-[#173f46]'}>
                  Your skills can
                </span>
                <br />
                <span className="text-orange-500 font-extrabold">
                  build your future.
                </span>
              </h1>

              {/* Subtitle */}
              <p className={`text-base sm:text-lg max-w-xl font-normal leading-relaxed ${
                isDark ? 'text-[#d0e0da]' : 'text-[#49676a]'
              }`}>
                Talk to our voice assistant in your language and discover skilling and livelihood opportunities suited to your experience.
              </p>

              {/* Action Buttons Row matching screenshot */}
              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                {/* Primary Button */}
                <button
                  id="hero-talk-btn"
                  onClick={onStartVoice}
                  className="bg-[#d8753b] hover:bg-[#bd5f2f] text-white font-bold px-7 py-3.5 rounded-2xl shadow-lg shadow-[#d8753b]/25 flex items-center space-x-2.5 text-base transition-all duration-200 transform hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer"
                >
                  <Mic className="w-5 h-5 text-white" />
                  <span>Talk to the Assistant</span>
                </button>

                {/* Voice Note Button */}
                <button
                  id="hero-voicenote-btn"
                  onClick={onOpenWhatsApp}
                  className={`font-semibold px-5 py-3.5 rounded-2xl border backdrop-blur-md flex items-center space-x-2 text-sm transition-all duration-200 transform hover:scale-[1.02] cursor-pointer ${
                    isDark 
                      ? 'bg-white/10 hover:bg-white/15 border-white/20 text-white' 
                      : 'bg-[#f8f5ef] hover:bg-white border-[#c9d1c8] text-[#173f46] shadow-sm'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>Voice Note</span>
                </button>

                {/* Kiosk Button */}
                <button
                  id="hero-kiosk-btn"
                  onClick={onOpenKiosk}
                  className={`font-semibold px-5 py-3.5 rounded-2xl border backdrop-blur-md flex items-center space-x-2 text-sm transition-all duration-200 transform hover:scale-[1.02] cursor-pointer ${
                    isDark 
                      ? 'bg-white/10 hover:bg-white/15 border-white/20 text-white' 
                      : 'bg-[#f8f5ef] hover:bg-white border-[#c9d1c8] text-[#173f46] shadow-sm'
                  }`}
                >
                  <Monitor className="w-4 h-4 text-sky-400" />
                  <span>Kiosk</span>
                </button>
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
                    isDark ? 'border-[#9bc6ba]/20 bg-[#9bc6ba]/5' : 'border-[#4b8b87]/35 bg-[#4b8b87]/5'
                }`} />

                {/* Outer Ring 2 */}
                <div className={`absolute w-3/4 h-3/4 rounded-full border ${
                    isDark ? 'border-white/15' : 'border-[#4b8b87]/30'
                }`} />

                {/* Outer Ring 1 */}
                <div className={`absolute w-1/2 h-1/2 rounded-full border ${
                    isDark ? 'border-white/20' : 'border-[#4b8b87]/30'
                }`} />

                {/* Central Microphone Orb */}
                <div 
                  onClick={onStartVoice}
                  className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center relative shadow-2xl transition-transform hover:scale-105 cursor-pointer backdrop-blur-md border-2 ${
                    isDark 
                      ? 'bg-white/10 border-white/30 text-white shadow-blue-500/20' 
                      : 'bg-[#4b8b87]/10 border-[#4b8b87]/40 text-[#2f6d69] shadow-[#4b8b87]/30'
                  }`}
                >
                  <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center ${
                    isDark ? 'bg-white/15' : 'bg-[#2f6d69]'
                  }`}>
                    <Mic className={`w-10 h-10 ${isDark ? 'text-white' : 'text-white'}`} />
                  </div>
                </div>
              </div>

              {/* Animated Live Audio Equalizer Waveform */}
              <div className="mt-4 flex flex-col items-center space-y-2">
                <div className="flex items-center space-x-1.5 h-8">
                   <span className="w-1.5 bg-[#70a69b] rounded-full animate-eq-1"></span>
                   <span className="w-1.5 bg-[#70a69b] rounded-full animate-eq-2"></span>
                   <span className="w-1.5 bg-[#f4f0e8] rounded-full animate-eq-3"></span>
                   <span className="w-1.5 bg-[#9bc6ba] rounded-full animate-eq-4"></span>
                   <span className="w-1.5 bg-[#e6aa4b] rounded-full animate-eq-5"></span>
                   <span className="w-1.5 bg-[#70a69b] rounded-full animate-eq-6"></span>
                   <span className="w-1.5 bg-[#9bc6ba] rounded-full animate-eq-7"></span>
                   <span className="w-1.5 bg-[#70a69b] rounded-full animate-eq-8"></span>
                </div>

                <div className={`flex items-center space-x-2 text-xs font-medium ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Listening in your language...</span>
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
          ? 'bg-[#173f46] border-white/10 text-white' 
          : 'bg-[#fbf8f1] border-[#d6ccbc] text-[#173f46] shadow-[#173f46]/10'
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
                ? 'bg-[#12383c] hover:bg-[#205359] border-white/10 hover:border-[#e6aa4b] text-white' 
                : 'bg-[#eee7da] hover:bg-[#e4dacb] border-[#d6ccbc] hover:border-[#d8753b] text-[#173f46]'
              }`}
            >
              <span className="flex items-center gap-1.5"><Mic className="w-3 h-3 text-[#d8753b]" />{t('landing.welder', selectedLanguage)}</span>
              <span className="opacity-50 text-[10px]">(Ramesh)</span>
            </button>
            <button
              onClick={() => onSelectSample('tailor')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition cursor-pointer flex items-center space-x-1.5 ${
                isDark 
                ? 'bg-[#12383c] hover:bg-[#205359] border-white/10 hover:border-[#e6aa4b] text-white' 
                : 'bg-[#eee7da] hover:bg-[#e4dacb] border-[#d6ccbc] hover:border-[#d8753b] text-[#173f46]'
              }`}
            >
              <span className="flex items-center gap-1.5"><MessageSquare className="w-3 h-3 text-[#3f7773]" />{t('landing.tailor', selectedLanguage)}</span>
              <span className="opacity-50 text-[10px]">(Sushila)</span>
            </button>
            <button
              onClick={() => onSelectSample('tractor')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition cursor-pointer flex items-center space-x-1.5 ${
                isDark 
                ? 'bg-[#12383c] hover:bg-[#205359] border-white/10 hover:border-[#e6aa4b] text-white' 
                : 'bg-[#eee7da] hover:bg-[#e4dacb] border-[#d6ccbc] hover:border-[#d8753b] text-[#173f46]'
              }`}
            >
              <span className="flex items-center gap-1.5"><Monitor className="w-3 h-3 text-[#537e9d]" />{t('landing.tractor', selectedLanguage)}</span>
              <span className="opacity-50 text-[10px]">(Santosh)</span>
            </button>
            <button
              onClick={() => onSelectSample('weaver')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition cursor-pointer flex items-center space-x-1.5 ${
                isDark 
                ? 'bg-[#12383c] hover:bg-[#205359] border-white/10 hover:border-[#e6aa4b] text-white' 
                : 'bg-[#eee7da] hover:bg-[#e4dacb] border-[#d6ccbc] hover:border-[#d8753b] text-[#173f46]'
              }`}
            >
              <span className="flex items-center gap-1.5"><Award className="w-3 h-3 text-[#b47a38]" />{t('landing.weaver', selectedLanguage)}</span>
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
               ? 'bg-[#173f46] border-white/10 hover:border-[#e6aa4b]/60' 
               : 'bg-[#fbf8f1] border-[#d6ccbc] hover:border-[#d8753b]/60'
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
               ? 'bg-[#173f46] border-white/10 hover:border-[#70a69b]/60' 
               : 'bg-[#fbf8f1] border-[#d6ccbc] hover:border-[#3f7773]/60'
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
               ? 'bg-[#173f46] border-white/10 hover:border-[#7aa9b6]/60' 
               : 'bg-[#fbf8f1] border-[#d6ccbc] hover:border-[#537e9d]/60'
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
               ? 'bg-[#173f46] border-white/10 text-white' 
               : 'bg-[#fbf8f1] border-[#d6ccbc] text-[#173f46] shadow-[#173f46]/10'
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
            isDark ? 'bg-[#173f46]/70 border-white/5 text-white' : 'bg-[#fbf8f1] border-[#d6ccbc] text-[#173f46]'
          }`}>
            <Award className="w-5 h-5 text-amber-500 mx-auto mb-2" />
            <div className="text-xs font-bold tracking-wide uppercase">{t('landing.badge1_title', selectedLanguage)}</div>
            <div className={`text-[11px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('landing.badge1_desc', selectedLanguage)}</div>
          </div>
          <div className={`p-5 rounded-2xl border ${
            isDark ? 'bg-[#173f46]/70 border-white/5 text-white' : 'bg-[#fbf8f1] border-[#d6ccbc] text-[#173f46]'
          }`}>
            <Cpu className="w-5 h-5 text-amber-500 mx-auto mb-2" />
            <div className="text-xs font-bold tracking-wide uppercase">{t('landing.badge2_title', selectedLanguage)}</div>
            <div className={`text-[11px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('landing.badge2_desc', selectedLanguage)}</div>
          </div>
          <div className={`p-5 rounded-2xl border ${
            isDark ? 'bg-[#173f46]/70 border-white/5 text-white' : 'bg-[#fbf8f1] border-[#d6ccbc] text-[#173f46]'
          }`}>
            <TrendingUp className="w-5 h-5 text-amber-500 mx-auto mb-2" />
            <div className="text-xs font-bold tracking-wide uppercase">{t('landing.badge3_title', selectedLanguage)}</div>
            <div className={`text-[11px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t('landing.badge3_desc', selectedLanguage)}</div>
          </div>
          <div className={`p-5 rounded-2xl border ${
            isDark ? 'bg-[#173f46]/70 border-white/5 text-white' : 'bg-[#fbf8f1] border-[#d6ccbc] text-[#173f46]'
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

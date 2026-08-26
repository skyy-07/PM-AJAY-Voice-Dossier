import React from 'react';
import { Sparkles, ArrowRight, ArrowLeft, Check, Volume2 } from 'lucide-react';
import { SupportedLanguage, LanguageOption } from '../../types.js';
import { t } from '../../lib/translations.js';
import { audioController } from '../../lib/audio.js';

interface LanguageSelectScreenProps {
  selectedLanguage: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
  onProceed: () => void;
  onBack: () => void;
}

const LANGUAGES: LanguageOption[] = [
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', locale: 'hi-IN', script: 'Devanagari' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', locale: 'bn-IN', script: 'Bengali' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', locale: 'mr-IN', script: 'Devanagari' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', locale: 'ta-IN', script: 'Tamil' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', locale: 'te-IN', script: 'Telugu' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', locale: 'kn-IN', script: 'Kannada' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', locale: 'ml-IN', script: 'Malayalam' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', locale: 'gu-IN', script: 'Gujarati' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', locale: 'pa-IN', script: 'Gurmukhi' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', locale: 'or-IN', script: 'Odia' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', locale: 'as-IN', script: 'Bengali-Assamese' },
  { code: 'en', name: 'English (Indian)', nativeName: 'English', locale: 'en-IN', script: 'Latin' },
];

export const LanguageSelectScreen: React.FC<LanguageSelectScreenProps> = ({
  selectedLanguage,
  onSelectLanguage,
  onProceed,
  onBack
}) => {
  const handleSelectAndSpeak = (code: SupportedLanguage, nativeName: string) => {
    onSelectLanguage(code);
    audioController.speakText(nativeName, code);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <button 
        onClick={onBack}
        className="flex items-center space-x-2 text-white/50 hover:text-white text-xs tracking-wider uppercase font-medium mb-6 transition cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t('lang.back', selectedLanguage)}</span>
      </button>

      <div className="text-center max-w-xl mx-auto mb-8">
        <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-amber-400/80">
          {t('lang.eyebrow', selectedLanguage)}
        </span>
        <h2 className="font-editorial-serif text-2xl sm:text-4xl font-normal text-white mt-1">
          {t('lang.title', selectedLanguage)}
        </h2>
        <p className="text-white/60 text-xs sm:text-sm mt-2 font-light">
          {t('lang.desc', selectedLanguage)}
        </p>
      </div>

      {/* Auto Detect Card */}
      <div 
        onClick={() => {
          onSelectLanguage('auto');
          onProceed();
        }}
        className={`mb-6 p-5 rounded-2xl border transition-all cursor-pointer shadow-xl flex items-center justify-between ${
          selectedLanguage === 'auto'
            ? 'bg-amber-500 text-stone-950 border-amber-400'
            : 'bg-[#181818] hover:bg-[#202020] border-white/10 text-white'
        }`}
      >
        <div className="flex items-center space-x-4">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${selectedLanguage === 'auto' ? 'bg-stone-950 text-amber-400' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'}`}>
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="text-left">
            <div className="font-semibold text-sm sm:text-base">{t('lang.autodetect_title', selectedLanguage)}</div>
            <div className={`text-xs ${selectedLanguage === 'auto' ? 'text-stone-900/80' : 'text-white/50'}`}>
              {t('lang.autodetect_desc', selectedLanguage)}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 font-semibold text-xs tracking-wider uppercase">
          <span>{t('lang.start_spoken', selectedLanguage)}</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>

      {/* 12 Language Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
        {LANGUAGES.map((lang) => {
          const isSelected = selectedLanguage === lang.code;
          return (
            <div
              key={lang.code}
              onClick={() => handleSelectAndSpeak(lang.code, lang.nativeName)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between h-28 relative group ${
                isSelected
                  ? 'bg-amber-500/15 border-amber-500 shadow-lg shadow-amber-950/40 text-white'
                  : 'bg-[#181818] hover:bg-[#222222] border-white/10 text-white/80'
              }`}
            >
              {isSelected && (
                <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold text-white leading-tight font-editorial-serif">
                    {lang.nativeName}
                  </div>
                  <Volume2 className="w-3.5 h-3.5 text-white/30 group-hover:text-amber-400 transition" />
                </div>
                <div className="text-xs text-white/50 mt-0.5 font-light">
                  {lang.name}
                </div>
              </div>

              <div className="text-[9px] text-white/30 font-mono uppercase tracking-wider">
                {lang.script}
              </div>
            </div>
          );
        })}
      </div>

      {/* Proceed Button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={onProceed}
          className="px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs tracking-wider uppercase rounded-xl shadow-xl shadow-amber-500/15 flex items-center space-x-2 transition cursor-pointer hover:scale-105"
        >
          <span>{t('lang.confirm_btn', selectedLanguage)}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

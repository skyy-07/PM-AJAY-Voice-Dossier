import React, { useState } from 'react';
import { ShieldCheck, Volume2, CheckCircle2, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { SupportedLanguage } from '../../types.js';
import { audioController } from '../../lib/audio.js';
import { t } from '../../lib/translations.js';

interface ConsentScreenProps {
  selectedLanguage: SupportedLanguage;
  onConsentGiven: () => void;
  onBack: () => void;
}

export const ConsentScreen: React.FC<ConsentScreenProps> = ({
  selectedLanguage,
  onConsentGiven,
  onBack
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const consentText = t('consent.statement', selectedLanguage);

  const handlePlayAudio = async () => {
    setIsPlayingAudio(true);
    await audioController.speakText(consentText, selectedLanguage);
    setIsPlayingAudio(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <button 
        onClick={onBack}
        className="flex items-center space-x-2 text-white/50 hover:text-white text-xs tracking-wider uppercase font-medium mb-6 transition cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t('consent.back', selectedLanguage)}</span>
      </button>

      <div className="bg-[#181818] rounded-2xl p-6 sm:p-9 border border-white/10 shadow-2xl">
        {/* Header Icon */}
        <div className="w-14 h-14 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-6 mx-auto">
          <ShieldCheck className="w-8 h-8" />
        </div>

        <div className="text-center mb-6">
          <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-amber-400/80">
            {t('consent.badge', selectedLanguage)}
          </span>
          <h2 className="font-editorial-serif text-2xl sm:text-3xl font-normal text-white mt-1">
            {t('consent.title', selectedLanguage)}
          </h2>
          <p className="text-xs text-white/40 mt-1 font-light">
            {t('consent.subtitle', selectedLanguage)}
          </p>
        </div>

        {/* Spoken Audio Banner */}
        <div className="bg-[#202020] border border-white/10 rounded-xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <button
              onClick={handlePlayAudio}
              className={`w-11 h-11 rounded-lg flex items-center justify-center text-white transition cursor-pointer ${
                isPlayingAudio ? 'bg-amber-600 animate-pulse' : 'bg-amber-600 hover:bg-amber-500'
              }`}
              title="Hear consent in selected language"
            >
              <Volume2 className="w-5 h-5" />
            </button>
            <div>
              <div className="text-xs font-semibold text-white">
                {isPlayingAudio 
                  ? t('consent.audio_broadcasting', selectedLanguage) 
                  : t('consent.audio_banner', selectedLanguage)}
              </div>
              <div className="text-[11px] text-white/50">
                {t('consent.audio_sub', selectedLanguage)}
              </div>
            </div>
          </div>
        </div>

        {/* Statement Box */}
        <div className="mt-6 bg-[#141414] border border-white/10 rounded-xl p-5 text-white/80 text-sm leading-relaxed">
          <p className="font-medium text-white mb-2 leading-relaxed">
            {consentText}
          </p>

          <div className="mt-4 pt-4 border-t border-white/10 space-y-2.5 text-xs text-white/50">
            <div className="flex items-center space-x-2">
              <Lock className="w-3.5 h-3.5 text-amber-400/80 shrink-0" />
              <span>{t('consent.sec1', selectedLanguage)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400/80 shrink-0" />
              <span>{t('consent.sec2', selectedLanguage)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400/80 shrink-0" />
              <span>{t('consent.sec3', selectedLanguage)}</span>
            </div>
          </div>
        </div>

        {/* Checkbox */}
        <label className="mt-6 flex items-start space-x-3 cursor-pointer select-none bg-[#202020] p-4 rounded-xl border border-white/5">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-amber-500 rounded border-white/20 focus:ring-amber-500 cursor-pointer"
          />
          <span className="text-xs font-normal text-white/90 leading-relaxed">
            {t('consent.agree_label', selectedLanguage)}
          </span>
        </label>

        {/* Continue Button */}
        <button
          onClick={() => {
            if (agreed) onConsentGiven();
          }}
          disabled={!agreed}
          className={`mt-8 w-full py-4 rounded-xl font-semibold text-xs tracking-wider uppercase shadow-xl flex items-center justify-center space-x-2 transition cursor-pointer ${
            agreed 
              ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-amber-500/20 hover:scale-[1.01]' 
              : 'bg-[#222222] text-white/20 border border-white/5 cursor-not-allowed'
          }`}
        >
          <span>{t('consent.continue_btn', selectedLanguage)}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

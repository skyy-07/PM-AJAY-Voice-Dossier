import React from 'react';
import { ShieldCheck, Check, X, Volume2, Mic } from 'lucide-react';
import { SupportedLanguage } from '../types';
import { getLocale } from '../locales/i18n';

interface ConsentScreenProps {
  language: SupportedLanguage;
  onAgree: () => void;
  onDecline: () => void;
  onSpeakNarration: () => void;
  isSpeaking: boolean;
  isListening: boolean;
}

export const ConsentScreen: React.FC<ConsentScreenProps> = ({
  language,
  onAgree,
  onDecline,
  onSpeakNarration,
  isSpeaking,
  isListening,
}) => {
  const locale = getLocale(language);

  return (
    <div className="flex flex-1 flex-col justify-between px-5 py-6 sm:py-8">
      {/* Top Header */}
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-emerald-700" />
            <h1 className="text-2xl font-extrabold tracking-tight text-[#172554] sm:text-3xl">
              {locale.consentTitle}
            </h1>
          </div>
          <button
            onClick={onSpeakNarration}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition ${
              isSpeaking
                ? 'border-emerald-500 bg-emerald-50 text-emerald-700 animate-pulse'
                : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
            }`}
            title="Listen to consent terms"
            aria-label="Narrate consent"
          >
            <Volume2 className="h-5 w-5" />
          </button>
        </div>

        <p className="text-base font-normal leading-relaxed text-stone-600">
          {locale.consentBody}
        </p>
      </div>

      {/* Voice Prompt Box */}
      <div className="my-6 rounded-3xl border border-emerald-200 bg-emerald-50/50 p-6 text-center shadow-xs">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
          <Mic className={`h-7 w-7 ${isListening ? 'animate-bounce text-emerald-600' : ''}`} />
        </div>
        <p className="text-sm font-semibold text-emerald-900">
          {locale.consentSpokenPrompt}
        </p>
        <p className="text-xs text-emerald-700/80 mt-1">
          (Say "Yes" or "हाँ" or tap the button below)
        </p>
      </div>

      {/* Decision Buttons */}
      <div className="space-y-3">
        <button
          onClick={onAgree}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#166534] text-base font-bold text-white shadow-md transition hover:bg-[#14532d] active:scale-[0.99]"
        >
          <Check className="h-5 w-5" />
          <span>{locale.consentAgreeBtn}</span>
        </button>

        <button
          onClick={onDecline}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-stone-300 bg-white text-sm font-semibold text-stone-700 shadow-2xs transition hover:bg-stone-50 active:scale-[0.99]"
        >
          <X className="h-4 w-4 text-stone-500" />
          <span>{locale.consentDeclineBtn}</span>
        </button>
      </div>
    </div>
  );
};

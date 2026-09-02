import React from 'react';
import { Mic, PhoneCall, CheckCircle2, Sparkles, Volume2, HardDrive, ArrowRight, X } from 'lucide-react';
import { SupportedLanguage } from '../types';
import { getLocale } from '../locales/i18n';
import { CachedInterviewSession } from '../utils/offlineSync';

interface EntryScreenProps {
  language: SupportedLanguage;
  onStartVoice: () => void;
  onOpenChannelSimulator: () => void;
  onSpeakNarration: () => void;
  isSpeaking: boolean;
  cachedSession?: CachedInterviewSession | null;
  onResumeCachedSession?: () => void;
  onDiscardCachedSession?: () => void;
}

export const EntryScreen: React.FC<EntryScreenProps> = ({
  language,
  onStartVoice,
  onOpenChannelSimulator,
  onSpeakNarration,
  isSpeaking,
  cachedSession,
  onResumeCachedSession,
  onDiscardCachedSession,
}) => {
  const locale = getLocale(language);

  return (
    <div className="flex flex-1 flex-col justify-between px-5 py-6 sm:py-8">
      {/* Top Hero Text */}
      <div className="space-y-3 pt-2">
        <div className="flex items-start justify-between">
          <h1 className="text-3xl font-extrabold tracking-tight text-[#172554] sm:text-4xl">
            {locale.heroTitle}
          </h1>
          <button
            onClick={onSpeakNarration}
            className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition ${
              isSpeaking
                ? 'border-emerald-500 bg-emerald-50 text-emerald-700 animate-pulse'
                : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
            }`}
            title="Listen to page"
            aria-label="Narrate page"
          >
            <Volume2 className="h-5 w-5" />
          </button>
        </div>
        <p className="text-base font-normal leading-relaxed text-stone-600">
          {locale.heroSubtitle}
        </p>
      </div>

      {/* Cached Session Restoration Banner if available */}
      {cachedSession && !cachedSession.isComplete && onResumeCachedSession && (
        <div className="my-2 rounded-2xl border border-amber-300 bg-amber-50/95 p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-200 text-amber-900">
                <HardDrive className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold text-amber-950">
                  {locale.resumeSavedInterviewBtn} (Step {cachedSession.stepNumber}/5)
                </div>
                <div className="text-xs text-stone-700 leading-snug">
                  {locale.resumeSavedInterviewNotice}
                </div>
                <div className="text-[11px] text-stone-500">
                  Saved at {new Date(cachedSession.lastSavedAt).toLocaleTimeString()}
                </div>
              </div>
            </div>
            {onDiscardCachedSession && (
              <button
                onClick={onDiscardCachedSession}
                className="text-stone-400 hover:text-stone-600 p-1"
                title={locale.discardSavedInterviewBtn}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={onResumeCachedSession}
              className="flex items-center gap-1.5 rounded-xl bg-amber-700 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-amber-800"
            >
              <span>{locale.resumeSavedInterviewBtn}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
            {onDiscardCachedSession && (
              <button
                onClick={onDiscardCachedSession}
                className="rounded-xl border border-amber-300 bg-white px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50"
              >
                {locale.discardSavedInterviewBtn}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Central Tap-to-Speak Card matching PDF Page 1 */}
      <div className="my-6">
        <button
          onClick={onStartVoice}
          className="group relative flex w-full flex-col items-center justify-center rounded-3xl border border-stone-200 bg-white px-6 py-12 shadow-sm transition-all hover:shadow-md active:scale-[0.99]"
        >
          {/* Animated Concentric Green Circles */}
          <div className="relative mb-6 flex h-32 w-32 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-emerald-100/70 transition-transform group-hover:scale-110" />
            <div className="absolute inset-3 rounded-full bg-emerald-200/50" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#166534] text-white shadow-md transition-transform group-hover:scale-105">
              <Mic className="h-8 w-8" />
            </div>
          </div>

          <span className="text-lg font-bold text-stone-900 group-hover:text-emerald-800">
            {locale.tapToSpeak}
          </span>
        </button>
      </div>

      {/* Action Buttons & Bottom Meta */}
      <div className="space-y-3.5">
        {/* Primary: Start with Voice */}
        <button
          onClick={onStartVoice}
          className="flex h-14 w-full items-center justify-center rounded-2xl bg-[#172554] text-base font-bold text-white shadow-md transition hover:bg-[#1e3a8a] active:scale-[0.99]"
        >
          {locale.startWithVoice}
        </button>

        {/* Secondary: Call IVR / Send voice note */}
        <button
          onClick={onOpenChannelSimulator}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl border border-stone-300 bg-white text-base font-semibold text-stone-800 shadow-xs transition hover:bg-stone-50 active:scale-[0.99]"
        >
          <PhoneCall className="h-4 w-4 text-stone-500" />
          <span>{locale.callIvrOption}</span>
        </button>

        {/* Footnote tags matching PDF Page 1 */}
        <div className="pt-4 flex flex-col items-center justify-center gap-1.5 text-center text-xs font-medium text-stone-500">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>{locale.worksWithoutInternet}</span>
          </div>
          <div>{locale.designedForLowLiteracy}</div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Volume2, Check, Circle, Dot, PhoneCall, Sparkles, RefreshCw } from 'lucide-react';
import { EnrollmentProgress, SupportedLanguage } from '../types';
import { getLocale } from '../locales/i18n';

interface ProgressTrackerScreenProps {
  language: SupportedLanguage;
  progress: EnrollmentProgress;
  onSpeakNarration: () => void;
  isSpeaking: boolean;
  onRefresh: () => void;
}

export const ProgressTrackerScreen: React.FC<ProgressTrackerScreenProps> = ({
  language,
  progress,
  onSpeakNarration,
  isSpeaking,
  onRefresh,
}) => {
  const locale = getLocale(language);

  return (
    <div className="flex flex-1 flex-col justify-between px-5 py-6 sm:py-8">
      {/* Top Header */}
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#172554] sm:text-4xl">
              Electrician training
            </h1>
            <p className="text-sm font-semibold text-stone-600">
              PM-AJAY Skill Center (Ranaghat)
            </p>
          </div>

          <button
            onClick={onSpeakNarration}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition ${
              isSpeaking
                ? 'border-emerald-500 bg-emerald-50 text-emerald-700 animate-pulse'
                : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
            }`}
            title="Listen to training progress"
            aria-label="Narrate progress"
          >
            <Volume2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Status Card matching PDF Page 7 */}
      <div className="my-5 space-y-4">
        <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-xs">
          <div className="text-xs font-semibold text-stone-500">
            {locale.currentStatusLabel}
          </div>
          <div className="mt-1 text-xl font-extrabold text-[#166534]">
            {locale.trainingInProgress}
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-stone-200">
              <div
                className="h-full bg-[#166534] transition-all duration-700"
                style={{ width: `${progress?.percentComplete || 60}%` }}
              />
            </div>
            <div className="mt-2 text-right text-xs font-bold text-[#166534]">
              {locale.percentComplete(progress?.percentComplete || 60)}
            </div>
          </div>
        </div>

        {/* Milestone Steps Timeline matching PDF Page 7 */}
        <div className="rounded-3xl border border-stone-200/80 bg-white/70 p-5 shadow-2xs">
          <div className="space-y-4 text-xs font-semibold">
            {/* Step 1: Enrollment confirmed */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-stone-900">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-[#166534]">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <span>{locale.enrollmentConfirmed}</span>
              </div>
              <span className="text-stone-500 font-medium">
                {progress?.confirmedDate || '12 Aug'}
              </span>
            </div>

            {/* Step 2: Training started */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-stone-900">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-[#166534]">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <span>{locale.trainingStarted}</span>
              </div>
              <span className="text-stone-500 font-medium">
                {progress?.trainingStartDate || '18 Aug'}
              </span>
            </div>

            {/* Step 3: 60% training completed (Current milestone) */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-stone-900">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                  <span className="h-2 w-2 rounded-full bg-amber-600" />
                </span>
                <span className="font-bold">
                  {locale.trainingCompletedStep(progress?.percentComplete || 60)}
                </span>
              </div>
              <span className="font-bold text-amber-700">
                {locale.todayStatus}
              </span>
            </div>

            {/* Step 4: Certification (Upcoming) */}
            <div className="flex items-center justify-between opacity-70">
              <div className="flex items-center gap-2.5 text-stone-700">
                <Circle className="h-4 w-4 text-stone-400" />
                <span>{locale.certificationStep}</span>
              </div>
              <span className="text-stone-400 font-medium">
                {locale.upcomingStatus}
              </span>
            </div>

            {/* Step 5: Employment follow-up (Upcoming) */}
            <div className="flex items-center justify-between opacity-70">
              <div className="flex items-center gap-2.5 text-stone-700">
                <Circle className="h-4 w-4 text-stone-400" />
                <span>{locale.employmentFollowUpStep}</span>
              </div>
              <span className="text-stone-400 font-medium">
                {locale.upcomingStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Note Box matching PDF Page 7 */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-3.5 text-center text-xs font-semibold text-emerald-900">
          {locale.postTrainingCallNote}
        </div>
      </div>

      {/* Footnote matching PDF Page 7 */}
      <div className="pt-2 text-center text-xs font-medium text-stone-500">
        {locale.updatesByVoiceNote}
      </div>
    </div>
  );
};

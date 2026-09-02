import React from 'react';
import { Volume2, MapPin, Calendar, Users, Award, PhoneCall, Check, Sparkles } from 'lucide-react';
import { Recommendation, SupportedLanguage, TrainingCenter } from '../types';
import { getLocale } from '../locales/i18n';

interface TrainingCenterDetailScreenProps {
  language: SupportedLanguage;
  center: TrainingCenter;
  selectedRecommendation?: Recommendation;
  onConfirmEnrollment: () => void;
  onRequestCallback: () => void;
  onSpeakNarration: () => void;
  isSpeaking: boolean;
}

export const TrainingCenterDetailScreen: React.FC<TrainingCenterDetailScreenProps> = ({
  language,
  center,
  selectedRecommendation,
  onConfirmEnrollment,
  onRequestCallback,
  onSpeakNarration,
  isSpeaking,
}) => {
  const locale = getLocale(language);

  const tradeTitle = selectedRecommendation
    ? selectedRecommendation.trade.localizedNames?.[language] || selectedRecommendation.trade.tradeName
    : 'Electrician';

  const nsqfLevel = selectedRecommendation?.trade.nsqfLevel || 4;

  return (
    <div className="flex flex-1 flex-col justify-between px-5 py-6 sm:py-8">
      {/* Top Center Title & Distance/Time */}
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#172554] sm:text-3xl">
              {center.name || locale.skillCenterTitle}
            </h1>
            <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-stone-600">
              <MapPin className="h-4 w-4 text-emerald-700 shrink-0" />
              <span>{locale.travelEstimate(center.distanceKm, center.travelTimeMinutes)}</span>
            </div>
          </div>

          <button
            onClick={onSpeakNarration}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition ${
              isSpeaking
                ? 'border-emerald-500 bg-emerald-50 text-emerald-700 animate-pulse'
                : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
            }`}
            title="Listen to center details"
            aria-label="Narrate center"
          >
            <Volume2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Program Details Card matching PDF Page 6 */}
      <div className="my-5 space-y-4">
        <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-xs">
          <div className="flex items-start justify-between">
            <div>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                {selectedRecommendation?.jobRole?.category === 'self_employment'
                  ? 'Self-Employment Grant'
                  : 'PM-AJAY Livelihood Pathway'}
              </span>
              <h2 className="mt-1 text-lg font-black text-stone-900">
                {tradeTitle} — NSQF Level {nsqfLevel}
              </h2>
            </div>
            <span className="text-sm font-black text-emerald-800">
              {selectedRecommendation?.jobRole?.salaryRange || selectedRecommendation?.trade.expectedMonthlyEarning}
            </span>
          </div>

          <div className="mt-4 grid gap-2.5 sm:grid-cols-2 text-xs font-semibold text-stone-700 border-t border-stone-100 pt-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-stone-400 shrink-0" />
              <span>{locale.nextBatchLabel}: {center.nextBatchDate}</span>
            </div>

            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-stone-400 shrink-0" />
              <span className="text-emerald-700 font-bold">
                {locale.seatsAvailableLabel(center.seatsAvailable)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-stone-400 shrink-0" />
              <span>{locale.trainingSupportAvailable}</span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-rose-500 shrink-0" />
              <span>{center.address}</span>
            </div>
          </div>

          {/* Hiring Linkage & Employers */}
          {(selectedRecommendation?.jobRole?.hiringEmployers || selectedRecommendation?.trade.hiringEmployers) && (
            <div className="mt-3 rounded-2xl bg-stone-50 p-3 text-xs border border-stone-100">
              <span className="font-bold text-stone-900">
                {language === 'hi' ? 'स्थानीय भर्ती व प्लेसमेंट पार्टनर: ' : 'Local Placement Partners: '}
              </span>
              <span className="text-stone-700 font-medium">
                {(selectedRecommendation.jobRole?.hiringEmployers || selectedRecommendation.trade.hiringEmployers)?.join(', ')}
              </span>
            </div>
          )}
        </div>

        {/* What happens next? (3 Steps) matching PDF Page 6 */}
        <div className="rounded-3xl border border-stone-200/80 bg-white/70 p-5 backdrop-blur-xs">
          <h3 className="text-sm font-bold text-stone-900 mb-3">
            {locale.whatHappensNextTitle}
          </h3>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-xs font-semibold text-stone-800">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-900 font-bold">
                1
              </span>
              <span>{locale.step1}</span>
            </div>

            <div className="flex items-center gap-3 text-xs font-semibold text-stone-800">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-900 font-bold">
                2
              </span>
              <span>{locale.step2}</span>
            </div>

            <div className="flex items-center gap-3 text-xs font-semibold text-stone-800">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-900 font-bold">
                3
              </span>
              <span>{locale.step3}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons matching PDF Page 6 */}
      <div className="space-y-3">
        <button
          onClick={onConfirmEnrollment}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#172554] text-base font-bold text-white shadow-md transition hover:bg-[#1e3a8a] active:scale-[0.99]"
        >
          <Check className="h-5 w-5" />
          <span>{locale.confirmEnrollmentBtn}</span>
        </button>

        <button
          onClick={onRequestCallback}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-stone-300 bg-white text-sm font-semibold text-stone-800 shadow-2xs transition hover:bg-stone-50 active:scale-[0.99]"
        >
          <PhoneCall className="h-4 w-4 text-stone-500" />
          <span>{locale.callMeBackBtn}</span>
        </button>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Volume2,
  Sparkles,
  MapPin,
  CheckCircle2,
  ChevronRight,
  Briefcase,
  Building2,
  Wrench,
  Clock,
  IndianRupee,
  Compass,
  ArrowUpRight,
  TrendingUp,
  LayoutGrid,
} from 'lucide-react';
import { CandidateProfile, RealJobRole, Recommendation, SupportedLanguage } from '../types';
import { getLocale } from '../locales/i18n';
import { RealJobsCatalogueModal } from './RealJobsCatalogueModal';
import { NSQFCareerPathway } from './NSQFCareerPathway';

interface RecommendationsScreenProps {
  language: SupportedLanguage;
  recommendations: Recommendation[];
  candidateDistrict?: string;
  profile?: CandidateProfile;
  onSelectRecommendation: (rec: Recommendation) => void;
  onSeeTrainingCenters: () => void;
  onSpeakRecommendation: (rec: Recommendation) => void;
  onSpeakNarration: () => void;
  isSpeaking: boolean;
}

export const RecommendationsScreen: React.FC<RecommendationsScreenProps> = ({
  language,
  recommendations,
  candidateDistrict = 'Nadia',
  profile,
  onSelectRecommendation,
  onSeeTrainingCenters,
  onSpeakRecommendation,
  onSpeakNarration,
  isSpeaking,
}) => {
  const locale = getLocale(language);
  const [isCatalogueOpen, setIsCatalogueOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'cards' | 'pathway'>('cards');
  const [selectedPathwayTrade, setSelectedPathwayTrade] = useState<Recommendation | undefined>(
    recommendations[0]
  );

  return (
    <div className="flex flex-1 flex-col justify-between px-5 py-6 sm:py-8">
      {/* Top Header */}
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-[#172554] sm:text-3xl">
                {locale.basedOnWhatYouToldMe}
              </h1>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                {language === 'hi' ? 'वास्तविक रोजगार' : 'Verified Real Jobs'}
              </span>
            </div>
            <p className="mt-1 text-sm font-normal leading-relaxed text-stone-600">
              {language === 'hi'
                ? 'आपके बताए गए हुनर और स्थानीय क्षेत्र (जिला/ब्लॉक) के आधार पर अनुशंसित कार्य'
                : locale.recommendationsSubtitle}
            </p>
          </div>

          <button
            onClick={onSpeakNarration}
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition ${
              isSpeaking
                ? 'border-emerald-500 bg-emerald-50 text-emerald-700 animate-pulse'
                : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
            }`}
            title="Listen to recommendations"
            aria-label="Narrate recommendations"
          >
            <Volume2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mode View Tabs */}
      <div className="mt-4 grid grid-cols-2 gap-1.5 rounded-2xl bg-stone-200/70 p-1">
        <button
          onClick={() => setActiveTab('cards')}
          className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition shadow-xs ${
            activeTab === 'cards'
              ? 'bg-white text-[#172554] shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <LayoutGrid className="h-3.5 w-3.5" />
          <span>
            {language === 'hi'
              ? `अनुशंसित कोर्स (${recommendations.length})`
              : language === 'bn'
              ? `সুপারিশকৃত কোর্স (${recommendations.length})`
              : `Recommended Courses (${recommendations.length})`}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('pathway')}
          className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition shadow-xs ${
            activeTab === 'pathway'
              ? 'bg-[#172554] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
          <span>
            {language === 'hi'
              ? 'NSQF करियर मार्ग'
              : language === 'bn'
              ? 'NSQF ক্যারিয়ার নকশা'
              : 'NSQF Career Pathway'}
          </span>
        </button>
      </div>

      {/* Main Content Area based on activeTab */}
      {activeTab === 'cards' ? (
        <>
          {/* Ranked Recommendations List matching PDF Page 5 & Real Jobs Requirements */}
          <div className="my-4 space-y-4">
            {recommendations.map((rec, index) => {
              const localizedName =
                rec.jobRole?.localizedJobTitles?.[language] ||
                rec.trade.localizedNames?.[language] ||
                rec.trade.tradeName;
              const localizedDesc =
                rec.explanation?.[language] ||
                rec.jobRole?.localizedDescriptions?.[language] ||
                rec.trade.localizedDescriptions?.[language];
              const hiringList = rec.jobRole?.hiringEmployers || rec.trade.hiringEmployers || [];
              const dutiesList = rec.jobRole?.keyDuties || rec.trade.keyDuties || [];
              const toolsList = rec.jobRole?.toolsEquipment || rec.trade.toolsEquipment || [];
              const vacancies = rec.jobRole?.activeVacanciesCount || rec.trade.activeVacanciesCount || 12;
              const salary = rec.jobRole?.salaryRange || rec.trade.expectedMonthlyEarning;
              const isOnlineMode = (rec.jobRole && rec.jobRole.distanceKm === 0) || rec.distanceKm === 0 || rec.trainingCenter?.distanceKm === 0;
              const locationDetail = isOnlineMode
                ? (language === 'hi' ? '100% ऑनलाइन कोर्स • घर बैठे सीखें व काम करें' : '100% Online Course • Learn & Work from Home')
                : rec.jobRole
                ? `${rec.jobRole.locationName}, ${rec.jobRole.district} (${rec.jobRole.distanceKm} km)`
                : `${rec.trainingCenter.name}, ${rec.trainingCenter.district} (${rec.distanceKm} km)`;

              return (
                <div
                  key={rec.id}
                  onClick={() => onSelectRecommendation(rec)}
                  className="relative cursor-pointer rounded-3xl border border-stone-200 bg-white p-5 shadow-xs transition hover:border-emerald-400 hover:shadow-md active:scale-[0.99]"
                >
                  {/* Header: Rank + Trade Title + Audio speaker button */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#172554] text-xs font-black text-white">
                        {index + 1}
                      </span>
                      <div>
                        <h2 className="text-lg font-black text-stone-900 leading-snug sm:text-xl">
                          {localizedName}
                        </h2>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs font-semibold text-stone-600">
                          <span className="rounded-md bg-stone-100 px-2 py-0.5 text-stone-700">
                            NSQF Level {rec.trade.nsqfLevel}
                          </span>
                          <span>•</span>
                          <span className="text-emerald-700 font-bold">
                            {locale.estimatedDemand(rec.trade.demandLevel)}
                          </span>
                          <span>•</span>
                          <span className="rounded-md bg-emerald-50 px-2 py-0.5 font-bold text-emerald-800 border border-emerald-200">
                            {vacancies} {language === 'hi' ? 'सक्रिय पद' : 'Active Vacancies'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSpeakRecommendation(rec);
                      }}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      title="Listen to this course details"
                      aria-label="Listen"
                    >
                      <Volume2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Real Earnings & Location Factor Pill */}
                  <div className="mt-3 grid gap-2 sm:grid-cols-2 rounded-2xl bg-stone-50 p-3 text-xs border border-stone-100">
                    <div className="flex items-center gap-1.5 font-bold text-stone-900">
                      <IndianRupee className="h-4 w-4 text-emerald-700 shrink-0" />
                      <span>{salary}</span>
                      <span className="text-[11px] font-normal text-stone-500">
                        ({rec.jobRole?.dailyWage || 'Monthly earnings'})
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 font-semibold text-stone-700">
                      <MapPin className="h-4 w-4 text-rose-500 shrink-0" />
                      <span className="truncate">{locationDetail}</span>
                    </div>
                  </div>

                  {/* Conversational Explanation Note */}
                  <p className="mt-3 text-xs font-medium leading-relaxed text-stone-700">
                    {localizedDesc}
                  </p>

                  {/* Real Duties Preview */}
                  {dutiesList.length > 0 && (
                    <div className="mt-3 space-y-1 border-t border-stone-100 pt-2.5">
                      <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                        {language === 'hi' ? 'वास्तविक कार्य (Daily Duties):' : 'Key On-the-Job Duties:'}
                      </div>
                      <ul className="space-y-1 text-xs text-stone-600">
                        {dutiesList.slice(0, 2).map((duty, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-emerald-600 font-bold">•</span>
                            <span>{duty}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Local Hiring Employers */}
                  {hiringList.length > 0 && (
                    <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-stone-600">
                      <Building2 className="h-3.5 w-3.5 text-stone-400 shrink-0" />
                      <span className="font-semibold text-stone-700">
                        {language === 'hi' ? 'कंपनियां:' : 'Hiring in your district:'}
                      </span>
                      <span className="text-stone-600 font-medium">
                        {hiringList.slice(0, 2).join(', ')}
                        {hiringList.length > 2 ? ` (+${hiringList.length - 2} more)` : ''}
                      </span>
                    </div>
                  )}

                  {/* Match Reason Tags & Best Match Badge + Pathway Quick Action */}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-stone-100 pt-3">
                    <div className="flex flex-wrap gap-1.5">
                      {rec.matchReasonTags?.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="rounded-md bg-stone-100 px-2 py-0.5 text-[11px] font-semibold text-stone-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPathwayTrade(rec);
                          setActiveTab('pathway');
                        }}
                        className="inline-flex items-center gap-1 rounded-xl bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-800 border border-blue-200 hover:bg-blue-100"
                      >
                        <TrendingUp className="h-3.5 w-3.5" />
                        <span>{language === 'hi' ? 'करियर मार्ग' : 'NSQF Pathway'}</span>
                      </button>

                      {rec.isBestMatch && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-[#166534] border border-emerald-200">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {locale.bestMatchBadge}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Embedded NSQF Career Pathway for Top Recommendation */}
          <NSQFCareerPathway
            recommendations={recommendations}
            selectedRecommendation={selectedPathwayTrade || recommendations[0]}
            profile={profile}
            language={language}
            onSelectTrade={(trade) => setSelectedPathwayTrade(trade)}
          />
        </>
      ) : (
        /* Dedicated NSQF Career Progression Tab */
        <div className="my-2 space-y-4">
          <NSQFCareerPathway
            recommendations={recommendations}
            selectedRecommendation={selectedPathwayTrade || recommendations[0]}
            profile={profile}
            language={language}
            onSelectTrade={(trade) => setSelectedPathwayTrade(trade)}
          />
        </div>
      )}

      {/* Directory Launcher & Action Buttons */}
      <div className="space-y-3 pt-2">
        {/* Browse Exhaustive Directory Button */}
        <button
          onClick={() => setIsCatalogueOpen(true)}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border-2 border-[#172554] bg-white text-sm font-bold text-[#172554] shadow-xs transition hover:bg-stone-50 active:scale-[0.99]"
        >
          <Compass className="h-4 w-4 text-[#172554]" />
          <span>
            {language === 'hi'
              ? 'संपूर्ण वास्तविक रोजगार निर्देशिका देखें (17+ नौकरियां)'
              : language === 'bn'
              ? 'সম্পূর্ণ চাকরির তালিকা দেখুন (১৭+ বাস্তব কাজ)'
              : 'Explore Exhaustive Real Jobs Catalogue (17+ Roles)'}
          </span>
          <ArrowUpRight className="h-4 w-4 text-[#172554]" />
        </button>

        {/* Primary Action Button to Training Centers */}
        <button
          onClick={onSeeTrainingCenters}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#172554] text-base font-bold text-white shadow-md transition hover:bg-[#1e3a8a] active:scale-[0.99]"
        >
          <span>{locale.seeTrainingCentersBtn}</span>
          <ChevronRight className="h-5 w-5" />
        </button>

        <p className="text-center text-xs text-stone-500 font-medium">
          {locale.listenToOptionsTip}
        </p>
      </div>

      {/* Exhaustive Real Jobs Catalogue Modal */}
      <RealJobsCatalogueModal
        isOpen={isCatalogueOpen}
        onClose={() => setIsCatalogueOpen(false)}
        language={language}
        candidateDistrict={candidateDistrict}
        onSelectJob={(job) => {
          setIsCatalogueOpen(false);
          // Find matching recommendation or create synthetic selection
          const existingRec = recommendations.find((r) => r.tradeId === job.tradeId);
          if (existingRec) {
            onSelectRecommendation(existingRec);
          } else {
            // Pick training center
            onSeeTrainingCenters();
          }
        }}
        onSpeakText={(text) => {
          if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = language === 'hi' ? 'hi-IN' : language === 'bn' ? 'bn-IN' : 'en-IN';
            window.speechSynthesis.speak(utterance);
          }
        }}
      />
    </div>
  );
};


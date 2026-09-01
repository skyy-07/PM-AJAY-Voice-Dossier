import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Award, 
  MapPin, 
  TrendingUp, 
  CheckCircle2, 
  Sparkles, 
  Volume2, 
  Building2, 
  Calendar, 
  Phone, 
  ArrowRight, 
  ArrowLeft,
  Briefcase,
  Layers,
  Zap,
  Check
} from 'lucide-react';
import { CandidateProfile, Recommendation, SupportedLanguage } from '../../types.js';
import { api } from '../../lib/api.js';
import { audioController } from '../../lib/audio.js';
import { DistrictDemandChart } from './DistrictDemandChart.js';
import { t } from '../../lib/translations.js';

interface RecommendationsScreenProps {
  candidate: CandidateProfile;
  selectedLanguage: SupportedLanguage;
  onRestart: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08
    }
  }
};

const cardVariants: any = {
  hidden: { opacity: 0, y: 14 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

export const RecommendationsScreen: React.FC<RecommendationsScreenProps> = ({
  candidate,
  selectedLanguage,
  onRestart
}) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRecIndex, setSelectedRecIndex] = useState(0);
  const [appliedStatuses, setAppliedStatuses] = useState<{ [key: string]: boolean }>({});
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    loadRecommendations();
  }, [candidate.candidateId]);

  const loadRecommendations = async () => {
    setIsLoading(true);
    try {
      const res = await api.generateRecommendations(candidate.candidateId);
      setRecommendations(res?.recommendations || []);
    } catch (err) {
      console.error('Failed to load recommendations:', err);
      setRecommendations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = async (rec: Recommendation) => {
    try {
      await api.updateRecommendationStatus(rec.id, 'applied');
      setAppliedStatuses({ ...appliedStatuses, [rec.id]: true });
    } catch (err) {
      console.error('Error applying to recommendation:', err);
    }
  };

  const handleSpeakOverview = async () => {
    if (recommendations.length === 0) return;
    const topRec = recommendations[0];
    const speechText = `${topRec.qualificationPackTitle}, NSQF Level ${topRec.nsqfLevel}. ${topRec.trainingProvider.name}, ${topRec.nearestCenterDistanceKm} km. ${t('rec.starting_wage', selectedLanguage)} ₹${topRec.economicDemand.avgMonthlyWage}.`;

    setIsSpeaking(true);
    await audioController.speakText(speechText, selectedLanguage);
    setIsSpeaking(false);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-4 animate-bounce">
          <Sparkles className="w-8 h-8" />
        </div>
        <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-amber-400/80">
          Synthesizing NSQF Registry
        </span>
        <h3 className="font-editorial-serif text-2xl sm:text-3xl font-normal text-white mt-1">
          Matching with 85+ NSQF Qualification Packs...
        </h3>
        <p className="text-white/50 text-xs sm:text-sm mt-2 max-w-md mx-auto font-light">
          Calculating local district demand, nearest PMKK centers in {candidate.location.district}, and prior learning credits.
        </p>
      </div>
    );
  }

  const activeRec = recommendations[selectedRecIndex] || recommendations[0];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="max-w-6xl mx-auto px-4 sm:px-6 py-8"
    >
      {/* Top Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="bg-[#181818] rounded-2xl p-6 sm:p-8 border border-white/10 text-white shadow-2xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div>
          <div className="inline-flex items-center space-x-2 bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-mono uppercase tracking-wider px-3 py-1 rounded mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('rec.banner_badge', selectedLanguage)}</span>
          </div>
          <h2 className="font-editorial-serif text-2xl sm:text-4xl font-normal tracking-tight text-white">
            {t('rec.banner_title', selectedLanguage)}
          </h2>
          <p className="text-white/60 text-xs sm:text-sm mt-1.5 max-w-2xl font-light">
            {t('rec.banner_desc', selectedLanguage)}
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={handleSpeakOverview}
            className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-stone-950 px-5 py-3 rounded-xl text-xs font-semibold tracking-wider uppercase shadow-xl transition cursor-pointer active:scale-95"
          >
            <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-pulse' : ''}`} />
            <span>{isSpeaking ? 'Speaking...' : t('rec.listen_overview', selectedLanguage)}</span>
          </button>
        </div>
      </motion.div>

      {/* Top 3 Tab Selector */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
      >
        {(recommendations || []).map((rec, idx) => {
          const isSelected = selectedRecIndex === idx;
          const isApplied = appliedStatuses[rec.id];

          return (
            <motion.div
              key={rec.id}
              variants={cardVariants}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setSelectedRecIndex(idx)}
              className={`p-5 rounded-xl border transition-all cursor-pointer relative ${
                isSelected
                  ? 'bg-[#222222] border-amber-500 shadow-xl shadow-amber-500/5 ring-1 ring-amber-500/30'
                  : 'bg-[#181818] hover:bg-[#1F1F1F] border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded">
                  Pathway #{idx + 1}
                </span>
                <span className="text-[11px] font-bold text-white/70">
                  NSQF {rec.nsqfLevel}
                </span>
              </div>

              <h3 className="font-editorial-serif font-bold text-white text-base leading-tight mb-2">
                {rec.qualificationPackTitle}
              </h3>

              <div className="flex items-center space-x-2 text-xs text-white/50 mb-3">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{rec.nearestCenterDistanceKm} km away</span>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-white/40">Expected Wage:</span>
                <span className="font-mono font-bold text-emerald-400">
                  ₹{(rec.economicDemand?.avgMonthlyWage || 14000).toLocaleString('en-IN')}/mo
                </span>
              </div>

              {isApplied && (
                <div className="absolute top-2 right-2 bg-emerald-500 text-stone-950 rounded-full p-1">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Selected Recommendation Details Matrix */}
      <AnimatePresence mode="wait">
        {activeRec && (
          <motion.div
            key={activeRec.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="bg-[#181818] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl mb-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Column 1: Why We Recommended */}
              <div className="bg-[#141414] border border-white/10 rounded-xl p-5">
                <h4 className="font-editorial-serif font-bold text-white text-sm mb-3 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>{t('rec.why_title', selectedLanguage)}</span>
                </h4>
                <p className="text-xs text-white/70 leading-relaxed font-light mb-4">
                  {activeRec.matchRationale}
                </p>
                <div className="space-y-2 pt-3 border-t border-white/5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-white/50">Suitability Match:</span>
                    <span className="font-mono font-semibold text-emerald-400">{activeRec.matchScore}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Sector Council:</span>
                    <span className="text-white/80">{activeRec.sectorSkillCouncil}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">RPL Pathway:</span>
                    <span className="text-amber-300 font-semibold">{activeRec.rplFastTrackEligible ? 'Fast-Track Eligible' : 'Standard Cohort'}</span>
                  </div>
                </div>
              </div>

              {/* Column 2: Recognized Skills vs Bridge Skills */}
              <div className="bg-[#141414] border border-white/10 rounded-xl p-5">
                <h4 className="font-editorial-serif font-bold text-white text-sm mb-3 flex items-center space-x-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>{t('rec.skills_title', selectedLanguage)}</span>
                </h4>

                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-emerald-400 tracking-wider">
                      {t('rec.recognized_skills', selectedLanguage)}
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(activeRec.recognizedPriorSkills || []).map((s, idx) => (
                        <span key={idx} className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[11px]">
                          ✓ {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase text-amber-400 tracking-wider">
                      {t('rec.bridge_skills', selectedLanguage)}
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(activeRec.skillsToDevelop || []).map((s, idx) => (
                        <span key={idx} className="bg-[#222222] border border-white/10 text-white/80 px-2 py-0.5 rounded text-[11px]">
                          + {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Column 3: District Economic Demand & Wages */}
              <div className="bg-[#141414] border border-white/10 rounded-xl p-5">
                <h4 className="font-editorial-serif font-bold text-white text-sm mb-3 flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                  <span>{t('rec.demand_title', selectedLanguage)}</span>
                </h4>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-white/50">{t('rec.district_score', selectedLanguage)}</span>
                    <span className="font-mono font-semibold text-white">{activeRec.economicDemand?.demandScore || 85} / 100</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/50">{t('rec.vacancies', selectedLanguage)}</span>
                    <span className="font-mono font-semibold text-emerald-400">{activeRec.economicDemand?.estimatedVacancies || 20} Openings</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/50">{t('rec.starting_wage', selectedLanguage)}</span>
                    <span className="font-mono font-semibold text-amber-300">₹{(activeRec.economicDemand?.avgMonthlyWage || 14000).toLocaleString('en-IN')}/mo</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/50">{t('rec.top_employers', selectedLanguage)}</span>
                    <span className="font-medium text-white/80 truncate max-w-[130px]">
                      {(activeRec.economicDemand?.topEmployers || ['District MSME Hub']).slice(0, 2).join(', ')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* D3.js Local District Job Demand Chart */}
            <DistrictDemandChart
              recommendations={recommendations}
              selectedRecIndex={selectedRecIndex}
              onSelectRec={(idx) => setSelectedRecIndex(idx)}
              districtName={candidate.location?.district}
            />

            {/* Nearest Training Center Box */}
            <div className="bg-[#141414] border border-white/10 rounded-xl p-5 mb-6">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-editorial-serif font-bold text-white text-sm">
                      {t('rec.nearest_center', selectedLanguage)} {activeRec.trainingProvider.name}
                    </h4>
                    <p className="text-xs text-white/50 font-light">
                      {activeRec.trainingProvider.type} &bull; Affiliated with {activeRec.trainingProvider.affiliatedSSC}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono px-3 py-1 rounded">
                    {activeRec.trainingProvider.availableSeats} {t('rec.seats_available', selectedLanguage)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-white/60 pt-3 border-t border-white/5 font-light">
                <div className="flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400/80 shrink-0" />
                  <span>{activeRec.trainingProvider.address} ({activeRec.nearestCenterDistanceKm} km)</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400/80 shrink-0" />
                  <span>{t('rec.next_batch', selectedLanguage)} {activeRec.trainingProvider.nextBatchStartDate}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Phone className="w-3.5 h-3.5 text-amber-400/80 shrink-0" />
                  <span>{t('rec.helpline', selectedLanguage)} {activeRec.trainingProvider.phone}</span>
                </div>
              </div>
            </div>

            {/* Action CTA Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
              <button
                onClick={onRestart}
                className="flex items-center space-x-2 text-white/50 hover:text-white text-xs font-semibold tracking-wider uppercase transition cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t('rec.new_assessment', selectedLanguage)}</span>
              </button>

              <button
                onClick={() => handleApply(activeRec)}
                disabled={appliedStatuses[activeRec.id]}
                className={`w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-xs tracking-wider uppercase shadow-xl flex items-center justify-center space-x-2 transition cursor-pointer ${
                  appliedStatuses[activeRec.id]
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-emerald-500/20'
                    : 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-amber-500/20 hover:scale-[1.02]'
                }`}
              >
                {appliedStatuses[activeRec.id] ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{t('rec.enrolled_success', selectedLanguage)}</span>
                  </>
                ) : (
                  <>
                    <span>{t('rec.enroll_btn', selectedLanguage)}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

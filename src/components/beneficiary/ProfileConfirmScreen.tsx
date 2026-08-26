import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Volume2, 
  Edit3, 
  ArrowRight, 
  ArrowLeft, 
  MapPin, 
  Briefcase, 
  Wrench, 
  Compass,
  Check
} from 'lucide-react';
import { CandidateProfile, SupportedLanguage } from '../../types.js';
import { audioController } from '../../lib/audio.js';
import { api } from '../../lib/api.js';
import { t } from '../../lib/translations.js';

interface ProfileConfirmScreenProps {
  candidate: CandidateProfile;
  selectedLanguage: SupportedLanguage;
  onConfirm: () => void;
  onBack: () => void;
}

export const ProfileConfirmScreen: React.FC<ProfileConfirmScreenProps> = ({
  candidate,
  selectedLanguage,
  onConfirm,
  onBack
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<CandidateProfile>(candidate);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const totalExperienceYears = (profile.experience || []).reduce((acc, e) => acc + (e.yearsOfExperience || 0), 0) || 5;

  const spokenSummaryText = `${t('confirm.title', selectedLanguage)}. ${profile.name || ''}. ${t('confirm.occupation_title', selectedLanguage)} ${profile.currentOccupation || 'व्यावहारिक काम'}, ${totalExperienceYears} वर्ष. ${t('confirm.tools_title', selectedLanguage)} ${(profile.tools || []).join(', ') || 'औज़ार'}. ${t('confirm.mobility_title', selectedLanguage)} ${profile.mobility?.maxDistanceKm || 15} km.`;

  const handleSpeakSummary = async () => {
    setIsSpeaking(true);
    await audioController.speakText(spokenSummaryText, selectedLanguage);
    setIsSpeaking(false);
  };

  const handleSaveAndConfirm = async () => {
    setIsGenerating(true);
    try {
      await api.confirmProfile(profile.candidateId);
      onConfirm();
    } catch (err) {
      console.error('Error confirming profile:', err);
      onConfirm();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button 
        onClick={onBack}
        className="flex items-center space-x-1.5 text-white/50 hover:text-white text-xs uppercase tracking-wider font-medium mb-6 transition cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t('confirm.back', selectedLanguage)}</span>
      </button>

      <div className="bg-[#181818] rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-editorial-serif text-white tracking-tight font-normal">
            {t('confirm.title', selectedLanguage)}
          </h2>
          <p className="text-xs text-white/50 mt-1 font-light">
            {t('confirm.subtitle', selectedLanguage)}
          </p>
        </div>

        {/* Spoken Audio Banner */}
        <div className="bg-[#202020] border border-amber-500/20 rounded-2xl p-4 mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleSpeakSummary}
              className={`w-11 h-11 rounded-xl flex items-center justify-center text-white transition cursor-pointer ${
                isSpeaking ? 'bg-amber-600 animate-pulse' : 'bg-amber-600 hover:bg-amber-500'
              }`}
              title="Hear voice summary"
            >
              <Volume2 className="w-5 h-5" />
            </button>
            <div>
              <div className="text-xs font-bold text-white">
                {isSpeaking ? 'Speaking profile summary...' : t('confirm.listen_summary', selectedLanguage)}
              </div>
              <div className="text-[11px] text-white/40">
                AI audio read-out of your understood skills
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-[#262626] text-white/80 border border-white/10 text-xs font-bold hover:bg-[#303030] transition cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'View Mode' : t('confirm.correct_btn', selectedLanguage)}</span>
          </button>
        </div>

        {/* Structured Understanding Cards */}
        {!isEditing ? (
          <div className="space-y-3.5">
            {/* Card 1: Experience & Occupation */}
            <div className="bg-[#141414] border border-white/10 rounded-2xl p-4 flex items-start space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-white/40 font-mono uppercase tracking-wider">
                  {t('confirm.occupation_title', selectedLanguage)}
                </div>
                <div className="text-base font-bold text-white mt-0.5">
                  {profile.currentOccupation || 'Informal Practical Trade Work'}
                </div>
                <div className="text-xs text-white/60 mt-1">
                  • Approx <span className="font-bold text-amber-400">{totalExperienceYears} years</span> of practical hands-on experience
                </div>
              </div>
            </div>

            {/* Card 2: Tools & Skills */}
            <div className="bg-[#141414] border border-white/10 rounded-2xl p-4 flex items-start space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-white/40 font-mono uppercase tracking-wider">
                  {t('confirm.tools_title', selectedLanguage)}
                </div>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {(profile.tools || []).length > 0 ? (
                    (profile.tools || []).map((tVal, idx) => (
                      <span key={idx} className="bg-[#202020] border border-white/10 px-2.5 py-1 rounded-lg text-xs font-semibold text-white/90">
                        🔧 {tVal}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-white/50">Workshop Tools, Equipment</span>
                  )}
                </div>
              </div>
            </div>

            {/* Card 3: Location & Mobility */}
            <div className="bg-[#141414] border border-white/10 rounded-2xl p-4 flex items-start space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-white/40 font-mono uppercase tracking-wider">
                  {t('confirm.mobility_title', selectedLanguage)}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  {profile.location?.village || 'Gram Panchayat'}, {profile.location?.district || 'District'} ({profile.location?.state || 'State'})
                </div>
                <div className="text-xs text-white/60 mt-1">
                  • Radius: <span className="font-bold text-amber-400">Within {profile.mobility?.maxDistanceKm || 15} km</span>
                </div>
              </div>
            </div>

            {/* Card 4: Livelihood Preference */}
            <div className="bg-[#141414] border border-white/10 rounded-2xl p-4 flex items-start space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-white/40 font-mono uppercase tracking-wider">
                  {t('confirm.training_title', selectedLanguage)}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  {profile.selfEmploymentInterest 
                    ? 'Start own micro-enterprise / village workshop' 
                    : 'Formal wage employment in local enterprise'}
                </div>
                <div className="text-xs text-emerald-400 font-semibold mt-1">
                  ✓ Eligible for PM-AJAY stipend & NSQF Certification
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Manual Inline Editor */
          <div className="space-y-4 bg-[#141414] p-5 rounded-2xl border border-white/10">
            <h4 className="font-bold text-white text-sm">Edit Profile Attributes</h4>

            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1">Beneficiary Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full bg-[#202020] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1">Primary Occupation</label>
              <input
                type="text"
                value={profile.currentOccupation}
                onChange={(e) => setProfile({ ...profile, currentOccupation: e.target.value })}
                className="w-full bg-[#202020] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-amber-500 text-stone-950 rounded-xl text-xs font-bold cursor-pointer"
            >
              Save Edits
            </button>
          </div>
        )}

        {/* Confirmation CTA */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={onBack}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#222222] hover:bg-[#2c2c2c] text-white/70 font-bold text-xs transition cursor-pointer"
          >
            {t('confirm.back', selectedLanguage)}
          </button>

          <button
            onClick={handleSaveAndConfirm}
            disabled={isGenerating}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs tracking-wider uppercase shadow-xl flex items-center justify-center space-x-2 transition cursor-pointer hover:scale-105"
          >
            {isGenerating ? (
              <span>Matching NSQF Pathways...</span>
            ) : (
              <>
                <span>{t('confirm.generate_btn', selectedLanguage)}</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

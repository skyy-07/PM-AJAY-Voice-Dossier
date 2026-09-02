import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ReferenceDot,
} from 'recharts';
import {
  TrendingUp,
  Award,
  Briefcase,
  Sparkles,
  ChevronRight,
  Volume2,
  CheckCircle2,
  Calendar,
  IndianRupee,
  Layers,
  ArrowRight,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { CandidateProfile, NSQFPathwayMilestone, Recommendation, SupportedLanguage } from '../types';
import { generateNSQFPathway } from '../data/nsqfPathways';

interface NSQFCareerPathwayProps {
  recommendations: Recommendation[];
  selectedRecommendation?: Recommendation;
  profile?: CandidateProfile;
  language: SupportedLanguage;
  onSelectTrade?: (rec: Recommendation) => void;
}

export const NSQFCareerPathway: React.FC<NSQFCareerPathwayProps> = ({
  recommendations,
  selectedRecommendation,
  profile,
  language,
  onSelectTrade,
}) => {
  // Current active trade for pathway inspection
  const activeRec = selectedRecommendation || recommendations[0] || null;

  // Selected stage index (0 to 3) for deep dive card
  const [activeStageIndex, setActiveStageIndex] = useState<number>(1); // default to Stage 1 (Certified Course)
  const [isSpeakingPathway, setIsSpeakingPathway] = useState(false);
  const [viewMetric, setViewMetric] = useState<'both' | 'salary' | 'nsqf'>('both');

  const pathwayData = useMemo(() => {
    if (!activeRec) return null;
    return generateNSQFPathway(activeRec, profile, language);
  }, [activeRec, profile, language]);

  if (!activeRec || !pathwayData) return null;

  // Prepare chart dataset
  const chartData = pathwayData.milestones.map((m, idx) => {
    const localizedTimeframe = m.localizedTimeframes[language] || m.timeframe;
    const localizedRole = m.localizedTitles[language] || m.jobRoleTitle;

    return {
      index: idx,
      stageKey: m.stageKey,
      stageLabel: idx === 0 ? 'Start' : idx === 1 ? 'Course (3 Mo)' : idx === 2 ? 'Lead (1-2 Yr)' : 'Master (3-5 Yr)',
      fullLabel: localizedTimeframe,
      monthlySalary: m.monthlyEarning,
      salaryThousands: Math.round(m.monthlyEarning / 1000),
      nsqfLevel: m.nsqfLevel,
      roleTitle: localizedRole,
      earningDisplay: m.earningDisplay,
      qpCode: m.qpCode || 'Baseline',
      isCurrent: m.isCurrentRecommendation,
      isBaseline: m.isCurrentBaseline,
    };
  });

  const activeMilestone = pathwayData.milestones[activeStageIndex] || pathwayData.milestones[1];

  // Spoken narration handler
  const handleSpeakPathway = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    if (isSpeakingPathway) {
      setIsSpeakingPathway(false);
      return;
    }

    const advice =
      pathwayData.personalizedAdvice?.[language] ||
      pathwayData.personalizedAdvice?.hi ||
      `NSQF career pathway for ${activeRec.trade.tradeName}.`;

    const utterance = new SpeechSynthesisUtterance(advice);
    utterance.lang = language === 'hi' ? 'hi-IN' : language === 'bn' ? 'bn-IN' : language === 'mr' ? 'mr-IN' : language === 'ta' ? 'ta-IN' : 'en-IN';
    utterance.rate = 0.92;

    utterance.onstart = () => setIsSpeakingPathway(true);
    utterance.onend = () => setIsSpeakingPathway(false);
    utterance.onerror = () => setIsSpeakingPathway(false);

    window.speechSynthesis.speak(utterance);
  };

  // Custom Chart Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-xl border border-stone-200 bg-stone-900/95 p-3 text-white shadow-xl backdrop-blur-xs max-w-[220px]">
          <div className="flex items-center justify-between gap-2 border-b border-stone-700 pb-1.5">
            <span className="text-[11px] font-bold text-amber-400">
              {data.fullLabel}
            </span>
            <span className="rounded-md bg-emerald-700/80 px-1.5 py-0.5 text-[10px] font-bold text-white">
              NSQF Level {data.nsqfLevel}
            </span>
          </div>
          <p className="mt-1.5 text-xs font-bold text-stone-100 leading-tight">
            {data.roleTitle}
          </p>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-stone-400 font-medium">Monthly:</span>
            <span className="font-extrabold text-emerald-400">{data.earningDisplay}</span>
          </div>
          {data.qpCode && data.qpCode !== 'Baseline' && (
            <div className="mt-1 flex items-center justify-between text-[10px] text-stone-400">
              <span>QP Code:</span>
              <span className="font-mono text-stone-300">{data.qpCode}</span>
            </div>
          )}
          {data.isCurrent && (
            <div className="mt-2 rounded-sm bg-emerald-600/90 py-0.5 text-center text-[10px] font-bold text-white">
              ★ Suggested PM-AJAY Course
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mt-6 rounded-3xl border-2 border-emerald-900/20 bg-gradient-to-b from-emerald-50/60 via-white to-stone-50/80 p-4 sm:p-5 shadow-xs transition">
      {/* Header section with NSQF Badge & Audio Button */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#172554] text-white shadow-xs">
            <TrendingUp className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-black text-stone-900 sm:text-lg">
                {language === 'hi'
                  ? 'NSQF करियर प्रगति मार्ग (Career Pathway)'
                  : language === 'bn'
                  ? 'NSQF ক্যারিয়ার অগ্রগতি নকশা (Career Pathway)'
                  : language === 'mr'
                  ? 'NSQF करिअर प्रगती मार्ग (Career Pathway)'
                  : language === 'ta'
                  ? 'NSQF தொழில் வளர்ச்சி பாதை (Career Pathway)'
                  : 'NSQF Career Progression Pathway'}
              </h3>
              <span className="rounded-full bg-emerald-100 border border-emerald-300 px-2 py-0.5 text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider">
                {pathwayData.growthMultiplier}
              </span>
            </div>
            <p className="text-xs text-stone-600 mt-0.5">
              {language === 'hi'
                ? 'जानिए यह 3-महीने का कोर्स भविष्य में कैसे बड़ी नौकरी व स्वरोजगार तक ले जाता है'
                : language === 'bn'
                ? 'দেখুন কীভাবে এই ৩ মাসের কোর্স আপনাকে ভবিষ্যৎ উন্নত পদে নিয়ে যাবে'
                : 'Interactive projection showing skill qualification levels and salary progression.'}
            </p>
          </div>
        </div>

        {/* Listen to Career Narration */}
        <button
          onClick={handleSpeakPathway}
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition ${
            isSpeakingPathway
              ? 'border-emerald-500 bg-emerald-100 text-emerald-800 animate-pulse'
              : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-100'
          }`}
          title="Listen to career progression audio"
          aria-label="Narrate career pathway"
        >
          <Volume2 className="h-4 w-4" />
        </button>
      </div>

      {/* Trade Selector Tabs if multiple recommendations exist */}
      {recommendations.length > 1 && (
        <div className="mt-4 flex flex-wrap items-center gap-1.5 border-b border-stone-200/80 pb-3">
          <span className="text-[11px] font-bold text-stone-500 mr-1">
            {language === 'hi' ? 'मार्ग चुनें:' : 'Select Trade:'}
          </span>
          {recommendations.map((rec, rIdx) => {
            const isSelected = rec.tradeId === activeRec.tradeId;
            const title =
              rec.jobRole?.localizedJobTitles?.[language] ||
              rec.trade.localizedNames?.[language] ||
              rec.trade.tradeName;

            return (
              <button
                key={rec.id}
                onClick={() => {
                  if (onSelectTrade) onSelectTrade(rec);
                }}
                className={`flex items-center gap-1 rounded-xl px-2.5 py-1 text-xs font-bold transition ${
                  isSelected
                    ? 'bg-[#172554] text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <span>#{rIdx + 1} {title}</span>
                {rec.isBestMatch && <Sparkles className="h-3 w-3 text-amber-300 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}

      {/* Candidate Profile Tailoring Banner */}
      <div className="mt-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/70 p-3 text-xs">
        <div className="flex items-start gap-2">
          <UserCheck className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-amber-900 leading-relaxed font-medium">
            <span className="font-bold">
              {language === 'hi' ? 'आपके प्रोफाइल के अनुसार:' : 'Personalized for you: '}
            </span>
            {pathwayData.personalizedAdvice?.[language] || pathwayData.personalizedAdvice?.hi}
          </div>
        </div>
      </div>

      {/* Metric Toggle & Chart Controls */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs font-bold text-stone-700">
          <Layers className="h-3.5 w-3.5 text-emerald-700" />
          <span>{language === 'hi' ? 'प्रगति वक्र (Progression Curve)' : 'Progression Curve'}</span>
        </div>

        <div className="flex items-center gap-1 rounded-lg bg-stone-100 p-0.5 text-[11px] font-semibold text-stone-600">
          <button
            onClick={() => setViewMetric('both')}
            className={`rounded-md px-2 py-0.5 transition ${
              viewMetric === 'both' ? 'bg-white font-bold text-stone-900 shadow-xs' : 'hover:text-stone-900'
            }`}
          >
            {language === 'hi' ? 'संयुक्त' : 'Combined'}
          </button>
          <button
            onClick={() => setViewMetric('salary')}
            className={`rounded-md px-2 py-0.5 transition ${
              viewMetric === 'salary' ? 'bg-white font-bold text-emerald-800 shadow-xs' : 'hover:text-stone-900'
            }`}
          >
            {language === 'hi' ? 'मासिक आय (₹)' : 'Income (₹)'}
          </button>
          <button
            onClick={() => setViewMetric('nsqf')}
            className={`rounded-md px-2 py-0.5 transition ${
              viewMetric === 'nsqf' ? 'bg-white font-bold text-blue-800 shadow-xs' : 'hover:text-stone-900'
            }`}
          >
            {language === 'hi' ? 'NSQF स्तर' : 'NSQF Level'}
          </button>
        </div>
      </div>

      {/* Recharts Visual Area Chart */}
      <div className="mt-2 h-56 w-full rounded-2xl bg-white p-2 border border-stone-200/80 shadow-xs">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 18, right: 12, left: -14, bottom: 0 }}
            onClick={(state) => {
              if (state && state.activeTooltipIndex !== undefined) {
                setActiveStageIndex(state.activeTooltipIndex);
              }
            }}
          >
            <defs>
              <linearGradient id="salaryGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#166534" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#166534" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="nsqfGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.01} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />

            <XAxis
              dataKey="stageLabel"
              tick={{ fontSize: 11, fill: '#475569', fontWeight: 600 }}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
            />

            {/* Left Y Axis: Monthly Salary (in thousands) */}
            {(viewMetric === 'both' || viewMetric === 'salary') && (
              <YAxis
                yAxisId="salary"
                orientation="left"
                domain={[0, 70]}
                tick={{ fontSize: 10, fill: '#166534', fontWeight: 700 }}
                tickFormatter={(val) => `₹${val}k`}
                tickLine={false}
                axisLine={false}
              />
            )}

            {/* Right Y Axis: NSQF Level (1 to 8) */}
            {(viewMetric === 'both' || viewMetric === 'nsqf') && (
              <YAxis
                yAxisId="nsqf"
                orientation="right"
                domain={[0, 8]}
                tick={{ fontSize: 10, fill: '#1e40af', fontWeight: 700 }}
                tickFormatter={(val) => `L${val}`}
                tickLine={false}
                axisLine={false}
              />
            )}

            <Tooltip content={<CustomTooltip />} />

            {/* Suggested Course Milestone Marker Line */}
            <ReferenceLine
              x="Course (3 Mo)"
              stroke="#166534"
              strokeDasharray="3 3"
              yAxisId="salary"
              label={{
                value: '★ Suggested Course',
                position: 'top',
                fill: '#166534',
                fontSize: 10,
                fontWeight: 800,
              }}
            />

            {/* Monthly Salary Area */}
            {(viewMetric === 'both' || viewMetric === 'salary') && (
              <Area
                yAxisId="salary"
                type="monotone"
                dataKey="salaryThousands"
                name="Monthly Income (₹ Thousands)"
                stroke="#166534"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#salaryGradient)"
                activeDot={{ r: 6, fill: '#166534', stroke: '#ffffff', strokeWidth: 2 }}
              />
            )}

            {/* NSQF Skill Level Line/Area */}
            {(viewMetric === 'both' || viewMetric === 'nsqf') && (
              <Line
                yAxisId="nsqf"
                type="monotone"
                dataKey="nsqfLevel"
                name="NSQF Level"
                stroke="#2563eb"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#2563eb', stroke: '#ffffff', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: '#2563eb', stroke: '#ffffff', strokeWidth: 2 }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Interactive 4-Stage Pathway Timeline Selector */}
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {pathwayData.milestones.map((m, idx) => {
          const isSelected = activeStageIndex === idx;
          const isTargetCourse = m.isCurrentRecommendation;
          const localizedTitle = m.localizedTitles[language] || m.jobRoleTitle;
          const localizedTime = m.localizedTimeframes[language] || m.timeframe;

          return (
            <button
              key={m.stageKey}
              onClick={() => setActiveStageIndex(idx)}
              className={`flex flex-col justify-between rounded-2xl border p-2.5 text-left transition ${
                isSelected
                  ? 'border-2 border-[#172554] bg-[#172554] text-white shadow-md scale-[1.02]'
                  : isTargetCourse
                  ? 'border-2 border-emerald-500 bg-emerald-50/70 text-stone-900 hover:bg-emerald-100/60'
                  : 'border-stone-200 bg-white text-stone-800 hover:bg-stone-50'
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <span
                  className={`rounded-md px-1.5 py-0.5 text-[10px] font-extrabold ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : isTargetCourse
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-100 text-stone-700'
                  }`}
                >
                  NSQF L{m.nsqfLevel}
                </span>
                <span
                  className={`text-[10px] font-semibold truncate ${
                    isSelected ? 'text-emerald-300' : 'text-stone-500'
                  }`}
                >
                  {localizedTime}
                </span>
              </div>

              <div className="mt-2">
                <div
                  className={`text-xs font-bold line-clamp-2 leading-tight ${
                    isSelected ? 'text-white' : 'text-stone-900'
                  }`}
                >
                  {localizedTitle}
                </div>
                <div
                  className={`mt-1 text-xs font-black ${
                    isSelected ? 'text-emerald-300' : 'text-emerald-800'
                  }`}
                >
                  {m.earningDisplay}
                </div>
              </div>

              {isTargetCourse && (
                <div
                  className={`mt-1.5 rounded-sm py-0.5 text-center text-[9px] font-black uppercase tracking-wider ${
                    isSelected ? 'bg-emerald-500 text-white' : 'bg-emerald-200/80 text-emerald-900'
                  }`}
                >
                  ★ {language === 'hi' ? 'सुझाया गया कोर्स' : 'Suggested Course'}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Deep-Dive Stage Detail Card */}
      <div className="mt-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-xs">
        <div className="flex items-start justify-between gap-2 border-b border-stone-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-[#172554] px-2 py-0.5 text-xs font-bold text-white">
                Stage {activeStageIndex}: NSQF Level {activeMilestone.nsqfLevel}
              </span>
              {activeMilestone.qpCode && activeMilestone.qpCode !== 'Baseline' && (
                <span className="rounded-md bg-stone-100 px-2 py-0.5 text-[11px] font-mono font-semibold text-stone-600">
                  QP: {activeMilestone.qpCode}
                </span>
              )}
              {activeMilestone.isCurrentRecommendation && (
                <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
                  {language === 'hi' ? 'निशुल्क PM-AJAY प्रशिक्षण' : 'Free PM-AJAY Skill Course'}
                </span>
              )}
            </div>
            <h4 className="mt-1.5 text-sm font-extrabold text-stone-900 sm:text-base">
              {activeMilestone.localizedTitles[language] || activeMilestone.jobRoleTitle}
            </h4>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] font-bold text-stone-500 block uppercase">
              {language === 'hi' ? 'अपेक्षित मासिक आय' : 'Expected Income'}
            </span>
            <span className="text-base font-black text-emerald-700">
              {activeMilestone.earningDisplay}
            </span>
          </div>
        </div>

        {/* Duties & Deliverables */}
        <div className="mt-3">
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
            {language === 'hi'
              ? 'इस स्तर पर प्रमुख कार्य व जिम्मेदारियां:'
              : language === 'bn'
              ? 'এই স্তরের মূল দায়িত্ব ও কার্যাবলী:'
              : 'Core On-the-Job Capabilities at this Level:'}
          </div>
          <ul className="mt-1.5 space-y-1.5 text-xs text-stone-700">
            {(activeMilestone.localizedDuties[language] || activeMilestone.duties).map((duty, dIdx) => (
              <li key={dIdx} className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{duty}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Key Competencies / Credentials Pills */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-stone-100 pt-2.5">
          <span className="text-[11px] font-semibold text-stone-500">
            {language === 'hi' ? 'दक्षता:' : 'Competencies:'}
          </span>
          {activeMilestone.keyCompetencies.map((comp, cIdx) => (
            <span
              key={cIdx}
              className="rounded-lg bg-stone-100 px-2 py-0.5 text-[11px] font-semibold text-stone-700"
            >
              {comp}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

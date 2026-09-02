import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Search,
  MapPin,
  Briefcase,
  Wrench,
  Building2,
  Volume2,
  CheckCircle,
  SlidersHorizontal,
  Navigation,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  IndianRupee,
  ShieldCheck,
} from 'lucide-react';
import { RealJobRole, SupportedLanguage } from '../types';
import { getLocale } from '../locales/i18n';

interface RealJobsCatalogueModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: SupportedLanguage;
  candidateDistrict?: string;
  onSelectJob: (job: RealJobRole) => void;
  onSpeakText: (text: string) => void;
}

export const RealJobsCatalogueModal: React.FC<RealJobsCatalogueModalProps> = ({
  isOpen,
  onClose,
  language,
  candidateDistrict = 'Nadia',
  onSelectJob,
  onSpeakText,
}) => {
  const locale = getLocale(language);

  const [jobs, setJobs] = useState<RealJobRole[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>(candidateDistrict);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(50);
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [activeJobDetail, setActiveJobDetail] = useState<RealJobRole | null>(null);

  // Fetch jobs catalogue from server API
  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);

    const queryParams = new URLSearchParams();
    if (selectedDistrict && selectedDistrict !== 'all') {
      queryParams.set('district', selectedDistrict);
    }
    if (selectedCategory && selectedCategory !== 'all') {
      queryParams.set('category', selectedCategory);
    }
    if (maxDistanceKm < 50) {
      queryParams.set('maxDistance', String(maxDistanceKm));
    }
    if (searchQuery.trim()) {
      queryParams.set('search', searchQuery.trim());
    }

    fetch(`/api/jobs/catalogue?${queryParams.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.jobs) {
          setJobs(data.jobs);
        }
      })
      .catch((err) => console.error('Failed to load real jobs catalogue:', err))
      .finally(() => setLoading(false));
  }, [isOpen, selectedDistrict, selectedCategory, maxDistanceKm, searchQuery]);

  // Unique list of sectors
  const sectors = useMemo(() => {
    const set = new Set<string>();
    jobs.forEach((j) => set.add(j.sector));
    return Array.from(set);
  }, [jobs]);

  // Filtered jobs by sector
  const displayedJobs = useMemo(() => {
    if (selectedSector === 'all') return jobs;
    return jobs.filter((j) => j.sector === selectedSector);
  }, [jobs, selectedSector]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/70 p-3 backdrop-blur-xs sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative flex h-[92vh] w-full max-w-5xl flex-col rounded-3xl bg-stone-50 shadow-2xl overflow-hidden border border-stone-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-700 text-white shadow-sm">
              <Briefcase className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-stone-900 sm:text-2xl">
                  {language === 'hi'
                    ? 'वास्तविक स्थानीय रोजगार एवं कार्य निर्देशिका'
                    : language === 'bn'
                    ? 'বাস্তব স্থানীয় চাকরি ও কাজের বিস্তারিত তালিকা'
                    : language === 'mr'
                    ? 'प्रत्यक्ष स्थानिक रोजगार व कामांची यादी'
                    : language === 'ta'
                    ? 'உண்மையான உள்ளூர் வேலைவாய்ப்பு பட்டியல்'
                    : 'Exhaustive Real-World Jobs & Livelihood Directory'}
                </h2>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                  {displayedJobs.length} {language === 'hi' ? 'नौकरियां' : 'Jobs'}
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium">
                {language === 'hi'
                  ? 'पीएम-अजय (PM-AJAY) के तहत आपके जिले, ब्लॉक व कौशल से जुड़ी वास्तविक नौकरियां'
                  : 'Verified ground-level livelihood roles with local hiring employers, duties, tools & distance'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-100 text-stone-600 hover:bg-stone-200 transition"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filter Bar & Search */}
        <div className="grid gap-3 border-b border-stone-200 bg-white px-6 py-3 sm:grid-cols-12">
          {/* Search Input */}
          <div className="relative sm:col-span-4">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === 'hi'
                  ? 'काम, हुनर या कंपनी खोजें...'
                  : language === 'bn'
                  ? 'কাজের নাম, দক্ষতা খুঁজুন...'
                  : 'Search job title, duty, tools, employers...'
              }
              className="w-full rounded-xl border border-stone-200 bg-stone-50 py-2 pl-9 pr-3 text-xs text-stone-900 placeholder:text-stone-400 focus:border-emerald-600 focus:bg-white focus:outline-hidden"
            />
          </div>

          {/* District Selector (Location factor) */}
          <div className="flex items-center gap-1.5 sm:col-span-3">
            <MapPin className="h-4 w-4 text-stone-400 shrink-0" />
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-2.5 py-2 text-xs font-semibold text-stone-800 focus:border-emerald-600 focus:bg-white focus:outline-hidden"
            >
              <option value="all">📍 All Districts / सभी जिले</option>
              <option value="Nadia">📍 Nadia (West Bengal)</option>
              <option value="Purba Bardhaman">📍 Purba Bardhaman (WB)</option>
              <option value="Pune">📍 Pune (Maharashtra)</option>
              <option value="Madurai">📍 Madurai (Tamil Nadu)</option>
              <option value="Varanasi">📍 Varanasi (Uttar Pradesh)</option>
            </select>
          </div>

          {/* Employment Type Selector */}
          <div className="flex items-center gap-1.5 sm:col-span-3">
            <SlidersHorizontal className="h-4 w-4 text-stone-400 shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-2.5 py-2 text-xs font-semibold text-stone-800 focus:border-emerald-600 focus:bg-white focus:outline-hidden"
            >
              <option value="all">⚡ All Pathways (Self & Wage)</option>
              <option value="wage_employment">💼 Wage Employment (पगारदार नौकरी)</option>
              <option value="self_employment">🏪 Self-Employment (स्व-रोजगार / दुकान)</option>
              <option value="hybrid">🔄 Hybrid (दोनों विकल्प)</option>
            </select>
          </div>

          {/* Max Distance Slider / Select */}
          <div className="flex items-center gap-1 sm:col-span-2">
            <Navigation className="h-4 w-4 text-stone-400 shrink-0" />
            <select
              value={maxDistanceKm}
              onChange={(e) => setMaxDistanceKm(Number(e.target.value))}
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-2.5 py-2 text-xs font-semibold text-stone-800 focus:border-emerald-600 focus:bg-white focus:outline-hidden"
            >
              <option value={10}>Max 10 km (Near)</option>
              <option value={20}>Max 20 km (Local)</option>
              <option value={35}>Max 35 km (District)</option>
              <option value={50}>Any Distance (50km+)</option>
            </select>
          </div>
        </div>

        {/* Sector Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto border-b border-stone-200 bg-stone-100/70 px-6 py-2.5 no-scrollbar">
          <button
            onClick={() => setSelectedSector('all')}
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition ${
              selectedSector === 'all'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-200/80 border border-stone-200'
            }`}
          >
            All Sectors ({jobs.length})
          </button>
          {sectors.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSector(s)}
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition ${
                selectedSector === s
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:bg-stone-200/80 border border-stone-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Main Content: Split Grid / Detail View */}
        <div className="flex flex-1 overflow-hidden">
          {/* Jobs List (Left / Main) */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {loading ? (
              <div className="flex h-64 flex-col items-center justify-center gap-3 text-stone-500">
                <div className="h-8 w-8 animate-spin rounded-full border-3 border-emerald-600 border-t-transparent" />
                <p className="text-sm font-medium">
                  {language === 'hi'
                    ? 'वास्तविक नौकरियों की सूची लोड हो रही है...'
                    : 'Loading verified real job roles...'}
                </p>
              </div>
            ) : displayedJobs.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center gap-2 text-stone-500">
                <p className="text-sm font-semibold">
                  {language === 'hi'
                    ? 'इस खोज के लिए कोई नौकरी नहीं मिली।'
                    : 'No matching real job roles found for your filter criteria.'}
                </p>
                <p className="text-xs">Try increasing commute distance or changing sector filter.</p>
              </div>
            ) : (
              displayedJobs.map((job) => {
                const localizedTitle =
                  job.localizedJobTitles?.[language] || job.jobTitle;
                const localizedDesc =
                  job.localizedDescriptions?.[language] || job.jobDescription;
                const isSelected = activeJobDetail?.id === job.id;

                return (
                  <div
                    key={job.id}
                    onClick={() => setActiveJobDetail(job)}
                    className={`group cursor-pointer rounded-2xl border bg-white p-5 transition hover:shadow-md ${
                      isSelected
                        ? 'border-emerald-600 ring-2 ring-emerald-600/20 bg-emerald-50/20'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-extrabold text-stone-900 group-hover:text-emerald-900">
                            {localizedTitle}
                          </h3>
                          <span className="rounded-md bg-stone-100 px-2 py-0.5 text-[11px] font-bold text-stone-700">
                            NSQF {job.nsqfLevel} • {job.nsqfQpCode}
                          </span>
                          {job.activeVacanciesCount > 0 && (
                            <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
                              {job.activeVacanciesCount} {language === 'hi' ? 'खाली पद' : 'Vacancies'}
                            </span>
                          )}
                        </div>

                        {/* Location, Commute & Sector Info */}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-stone-600 pt-0.5">
                          <span className="flex items-center gap-1 font-semibold text-emerald-800">
                            <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                            {job.distanceKm === 0 ? (
                              <span className="rounded-sm bg-emerald-100 px-1.5 py-0.5 text-emerald-900 font-bold">
                                100% Online / Remote Mode
                              </span>
                            ) : (
                              `${job.district} (${job.block}) • ${job.distanceKm} km away`
                            )}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-stone-600">
                            <Clock className="h-3.5 w-3.5 text-stone-400" />
                            {job.distanceKm === 0 ? 'Anytime Self-Paced & Live' : `~${job.travelTimeMinutes} mins (${job.commuteMode.split('/')[0]})`}
                          </span>
                          <span>•</span>
                          <span className="font-semibold text-stone-700">
                            {job.sector}
                          </span>
                        </div>
                      </div>

                      {/* Right Salary Badge & Voice speaker */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSpeakText(
                              `${localizedTitle}. ${localizedDesc}. Expected monthly earnings: ${job.salaryRange}. Location: ${job.district}, ${job.distanceKm} kilometers away.`
                            );
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-stone-600 hover:bg-emerald-100 hover:text-emerald-700"
                          title="Listen in your language"
                        >
                          <Volume2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Realistic Description */}
                    <p className="mt-2.5 text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {localizedDesc}
                    </p>

                    {/* Key Real Duties Chips */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {job.keyDuties.slice(0, 3).map((duty, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center rounded-md bg-stone-100 px-2 py-1 text-[11px] font-medium text-stone-700"
                        >
                          • {duty}
                        </span>
                      ))}
                      {job.keyDuties.length > 3 && (
                        <span className="inline-flex items-center text-[11px] font-bold text-stone-500 pl-1">
                          +{job.keyDuties.length - 3} more duties
                        </span>
                      )}
                    </div>

                    {/* Footer: Earnings & Employers */}
                    <div className="mt-4 flex flex-wrap items-center justify-between border-t border-stone-100 pt-3 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-stone-900">
                        <IndianRupee className="h-3.5 w-3.5 text-emerald-700" />
                        <span>{job.salaryRange}</span>
                        <span className="text-[11px] font-normal text-stone-500">
                          ({job.dailyWage || 'Monthly earnings'})
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectJob(job);
                          }}
                          className="flex items-center gap-1 rounded-xl bg-[#172554] px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-[#1e3a8a]"
                        >
                          <span>{language === 'hi' ? 'यह नौकरी चुनें' : 'Choose This Role'}</span>
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Expanded Job Inspection Sidebar (Right) */}
          {activeJobDetail && (
            <div className="hidden lg:flex w-96 flex-col border-l border-stone-200 bg-white p-5 overflow-y-auto">
              <div className="flex items-start justify-between">
                <div>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                    {activeJobDetail.category === 'self_employment'
                      ? 'Self-Employment'
                      : activeJobDetail.category === 'wage_employment'
                      ? 'Wage Employment'
                      : 'Hybrid Pathway'}
                  </span>
                  <h3 className="mt-2 text-lg font-black text-stone-900">
                    {activeJobDetail.localizedJobTitles?.[language] ||
                      activeJobDetail.jobTitle}
                  </h3>
                  <p className="text-xs text-stone-500 font-medium">
                    {activeJobDetail.sector} • NSQF Level {activeJobDetail.nsqfLevel}
                  </p>
                </div>
                <button
                  onClick={() => setActiveJobDetail(null)}
                  className="text-stone-400 hover:text-stone-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Monthly Wage & Daily Wage Card */}
              <div className="mt-4 rounded-2xl bg-emerald-50 p-4 border border-emerald-100">
                <div className="text-xs font-semibold text-emerald-800">
                  {language === 'hi' ? 'अपेक्षित मासिक आमदनी' : 'Expected Livelihood Income'}
                </div>
                <div className="mt-1 text-xl font-black text-emerald-950">
                  {activeJobDetail.salaryRange}
                </div>
                {activeJobDetail.dailyWage && (
                  <div className="mt-0.5 text-xs text-emerald-700 font-medium">
                    Daily Wage Rate: {activeJobDetail.dailyWage}
                  </div>
                )}
              </div>

              {/* Location & Commute Details */}
              <div className="mt-4 space-y-2 rounded-2xl bg-stone-50 p-3.5 border border-stone-200 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-stone-900">
                  <MapPin className="h-4 w-4 text-emerald-600" />
                  <span>
                    {activeJobDetail.locationName}, {activeJobDetail.district}
                  </span>
                </div>
                <div className="text-stone-600">
                  <strong>Distance:</strong> {activeJobDetail.distanceKm} km from candidate area
                </div>
                <div className="text-stone-600">
                  <strong>Commute:</strong> {activeJobDetail.commuteMode} (~{activeJobDetail.travelTimeMinutes} mins)
                </div>
                {activeJobDetail.hostelAvailable && (
                  <div className="flex items-center gap-1 font-semibold text-emerald-700">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Free Hostel accommodation available at training hub</span>
                  </div>
                )}
              </div>

              {/* Verified Hiring Employers */}
              <div className="mt-4 space-y-2">
                <h4 className="flex items-center gap-1.5 text-xs font-bold text-stone-900 uppercase tracking-wide">
                  <Building2 className="h-3.5 w-3.5 text-stone-600" />
                  <span>
                    {language === 'hi'
                      ? 'सत्यापित भर्तीकर्ता एवं कंपनियां'
                      : 'Verified Hiring Employers'}
                  </span>
                </h4>
                <div className="space-y-1.5">
                  {activeJobDetail.hiringEmployers.map((emp, i) => (
                    <div
                      key={i}
                      className="rounded-xl bg-stone-100 px-3 py-1.5 text-xs font-semibold text-stone-800 flex items-center gap-1.5"
                    >
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>{emp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Real Tools & Equipment */}
              <div className="mt-4 space-y-2">
                <h4 className="flex items-center gap-1.5 text-xs font-bold text-stone-900 uppercase tracking-wide">
                  <Wrench className="h-3.5 w-3.5 text-stone-600" />
                  <span>
                    {language === 'hi' ? 'उपयोग होने वाले वास्तविक औजार' : 'Tools & Equipment Mastered'}
                  </span>
                </h4>
                <div className="rounded-xl border border-stone-200 bg-stone-50 p-3 text-xs text-stone-700 leading-relaxed font-medium">
                  {activeJobDetail.toolsEquipment.join(', ')}
                </div>
              </div>

              {/* Complete Duties */}
              <div className="mt-4 space-y-2">
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wide">
                  {language === 'hi' ? 'दैनिक कार्य एवं जिम्मेदारियां' : 'Daily Job Duties & Scope'}
                </h4>
                <ul className="space-y-1.5 text-xs text-stone-600">
                  {activeJobDetail.keyDuties.map((d, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-stone-200">
                <button
                  onClick={() => onSelectJob(activeJobDetail)}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-700 text-sm font-bold text-white shadow-md transition hover:bg-emerald-800"
                >
                  <span>
                    {language === 'hi'
                      ? 'इस नौकरी हेतु प्रशिक्षण चुनें'
                      : 'Enroll in this Livelihood Pathway'}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

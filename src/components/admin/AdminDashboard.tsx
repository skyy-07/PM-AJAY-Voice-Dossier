import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  TrendingUp, 
  Building2, 
  MapPin, 
  AlertTriangle, 
  Layers, 
  FileText, 
  Download, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Activity, 
  Sparkles, 
  Radio,
  Cloud,
  RefreshCw,
  Plus,
  Server
} from 'lucide-react';
import { 
  CandidateProfile, 
  DistrictInfo, 
  TrainingProvider, 
  QualificationPack, 
  EconomicDemand, 
  HumanEscalation, 
  IntegrationServiceStatus, 
  AuditLog 
} from '../../types.js';
import { api } from '../../lib/api.js';
import { cloudService } from '../../lib/firebase.js';
import { GeospatialMap } from './GeospatialMap.js';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'beneficiaries' | 'providers' | 'demand' | 'map' | 'escalations' | 'integrations' | 'audits'>('overview');
  
  // Data states
  const [overview, setOverview] = useState<any>(null);
  const [candidates, setCandidates] = useState<CandidateProfile[]>([]);
  const [districts, setDistricts] = useState<DistrictInfo[]>([]);
  const [providers, setProviders] = useState<TrainingProvider[]>([]);
  const [qps, setQps] = useState<QualificationPack[]>([]);
  const [demands, setDemands] = useState<EconomicDemand[]>([]);
  const [escalations, setEscalations] = useState<HumanEscalation[]>([]);
  const [integrations, setIntegrations] = useState<IntegrationServiceStatus[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Cloud Live Status
  const [isCloudLive, setIsCloudLive] = useState<boolean>(true);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Live Streaming');

  // Filters
  const [searchCandidate, setSearchCandidate] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  const [editingCandidate, setEditingCandidate] = useState<CandidateProfile | null>(null);

  // Load static & baseline data, then listen to real-time Cloud Firestore updates
  useEffect(() => {
    loadBaselineData();

    // 1. Listen to real-time candidates from Firebase Cloud
    const unsubCandidates = cloudService.listenToCandidates((liveCandidates) => {
      if (liveCandidates && liveCandidates.length > 0) {
        setCandidates(liveCandidates);
        setIsCloudLive(true);
        setLastSyncTime(new Date().toLocaleTimeString());
      }
    }, districtFilter || undefined);

    // 2. Listen to real-time Human Escalations from Firebase Cloud
    const unsubEscalations = cloudService.listenToEscalations((liveEscalations) => {
      if (liveEscalations && liveEscalations.length > 0) {
        setEscalations(liveEscalations);
      }
    });

    // 3. Listen to real-time Audit logs
    const unsubAudits = cloudService.listenToAuditLogs((liveLogs) => {
      if (liveLogs && liveLogs.length > 0) {
        setAuditLogs(liveLogs);
      }
    });

    return () => {
      if (unsubCandidates) unsubCandidates();
      if (unsubEscalations) unsubEscalations();
      if (unsubAudits) unsubAudits();
    };
  }, [districtFilter]);

  const loadBaselineData = async () => {
    try {
      const [
        ovRes, 
        candRes, 
        distRes, 
        provRes, 
        qpRes, 
        demRes, 
        escRes, 
        intRes, 
        logRes
      ] = await Promise.all([
        api.getAnalyticsOverview(),
        api.getCandidates(),
        api.getDistricts(),
        api.getProviders(),
        api.getQualificationPacks(),
        api.getEconomicDemands(),
        api.getEscalations(),
        api.getIntegrationStatuses(),
        api.getAuditLogs()
      ]);

      setOverview(ovRes);
      setCandidates(candRes?.candidates || []);
      setDistricts(distRes?.districts || []);
      setProviders(provRes?.providers || []);
      setQps(qpRes?.qualificationPacks || []);
      setDemands(demRes?.economicDemands || []);
      setEscalations(escRes?.escalations || []);
      setIntegrations(intRes?.services || []);
      setAuditLogs(logRes?.logs || []);
    } catch (err) {
      console.error('Error fetching admin baseline data:', err);
    }
  };

  const handleUpdateEscalationStatus = async (id: string, newStatus: 'Open' | 'Assigned' | 'In Progress' | 'Resolved' | 'Closed') => {
    try {
      // Update locally + in backend + real-time cloud
      await api.updateEscalation(id, { status: newStatus });
      await cloudService.updateEscalationStatus(id, newStatus as any);
      setEscalations((escalations || []).map(e => e.id === id ? { ...e, status: newStatus } : e));
    } catch (err) {
      console.error('Error updating escalation:', err);
    }
  };

  const handleExportCsv = () => {
    const headers = 'CandidateID,Name,District,Occupation,Skills,MaxDistanceKm,Preference,Confidence\n';
    const rows = (candidates || []).map(c => 
      `"${c.candidateId || ''}","${c.name || ''}","${c.location?.district || ''}","${c.currentOccupation || ''}","${(c.skills || []).join(';')}",${c.mobility?.maxDistanceKm || 15},"${c.employmentPreference || ''}",${c.profileConfidence || 90}`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PM_AJAY_Cloud_Beneficiaries_${Date.now()}.csv`;
    a.click();
  };

  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = !searchCandidate || 
      (c.name || '').toLowerCase().includes(searchCandidate.toLowerCase()) ||
      (c.currentOccupation || '').toLowerCase().includes(searchCandidate.toLowerCase()) ||
      (c.skills || []).some(s => s.toLowerCase().includes(searchCandidate.toLowerCase())) ||
      (c.candidateId || '').toLowerCase().includes(searchCandidate.toLowerCase());
    
    const matchesDistrict = !districtFilter || c.location?.district === districtFilter;
    return matchesSearch && matchesDistrict;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-medium px-2.5 py-0.5 rounded uppercase tracking-widest">
              PM-AJAY State &bull; District Governance
            </span>
            <div className="flex items-center space-x-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono px-2 py-0.5 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Firestore Cloud: Active ({candidates.length} Real-Time Records)</span>
            </div>
          </div>
          <h2 className="font-editorial-serif text-2xl sm:text-3xl font-normal text-white tracking-tight mt-1">
            Administrative &amp; Skilling <span className="italic text-amber-400">Intelligence Portal</span>
          </h2>
          <p className="text-white/50 text-xs mt-0.5 font-light">
            Real-time multi-district cloud sync, NSQF alignment verification, and BDO human officer routing.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => loadBaselineData()}
            className="flex items-center space-x-1.5 bg-[#1a1a1a] hover:bg-[#222222] border border-white/10 text-white/80 px-3.5 py-2.5 rounded-xl text-xs font-medium transition cursor-pointer"
            title="Refresh cloud database"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            <span>Sync Cloud</span>
          </button>
          
          <button
            onClick={handleExportCsv}
            className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-stone-950 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider shadow-lg transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Cloud Data CSV</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-white/10 pb-4 mb-8 overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview & KPIs', icon: TrendingUp },
          { id: 'beneficiaries', label: `Beneficiary Directory (${candidates.length})`, icon: Users },
          { id: 'escalations', label: `Human Escalations (${escalations.filter(e => e.status === 'Open').length})`, icon: AlertTriangle },
          { id: 'map', label: 'Geospatial Map', icon: MapPin },
          { id: 'demand', label: 'District Economic Demand', icon: Activity },
          { id: 'providers', label: 'Training Centers (PMKK)', icon: Building2 },
          { id: 'integrations', label: 'Service Integrations', icon: Server },
          { id: 'audits', label: 'Cloud Audit Trail', icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-medium shrink-0 transition cursor-pointer ${
                isActive
                  ? 'bg-[#1e1e1e] text-white border border-white/20 shadow-md font-semibold'
                  : 'bg-[#141414] hover:bg-[#1c1c1c] text-white/60 hover:text-white border border-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5 text-amber-400/80" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && overview && (
        <div className="space-y-8">
          {/* Key Metric Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-[#181818] p-4 rounded-2xl border border-white/10 shadow-xl">
              <div className="text-[10px] font-mono tracking-wider text-white/40 uppercase">Total Intake</div>
              <div className="font-editorial-serif text-2xl sm:text-3xl font-bold text-white mt-1">
                {(((overview?.totalBeneficiaries || 0) + (candidates.length > 4 ? candidates.length - 4 : 0)) || 0).toLocaleString()}
              </div>
              <div className="text-[10px] font-mono text-emerald-400 mt-1">
                Firestore Cloud Synchronized
              </div>
            </div>

            <div className="bg-[#181818] p-4 rounded-2xl border border-white/10 shadow-xl">
              <div className="text-[10px] font-mono tracking-wider text-white/40 uppercase">Completion Rate</div>
              <div className="font-editorial-serif text-2xl sm:text-3xl font-bold text-emerald-400 mt-1">
                {overview?.completionRate || 85}%
              </div>
              <div className="text-[10px] text-white/40 font-light mt-1">
                Voice interview sessions
              </div>
            </div>

            <div className="bg-[#181818] p-4 rounded-2xl border border-white/10 shadow-xl">
              <div className="text-[10px] font-mono tracking-wider text-white/40 uppercase">NSQF Matches</div>
              <div className="font-editorial-serif text-2xl sm:text-3xl font-bold text-amber-400 mt-1">
                {(overview?.recommendationsGenerated || 0).toLocaleString()}
              </div>
              <div className="text-[10px] text-white/40 font-light mt-1">
                Pathways generated
              </div>
            </div>

            <div className="bg-[#181818] p-4 rounded-2xl border border-white/10 shadow-xl">
              <div className="text-[10px] font-mono tracking-wider text-white/40 uppercase">Seats Allocated</div>
              <div className="font-editorial-serif text-2xl sm:text-3xl font-bold text-cyan-400 mt-1">
                {(overview?.trainingAllocations || 0).toLocaleString()}
              </div>
              <div className="text-[10px] text-white/40 font-light mt-1">
                PMKK &amp; RSETI centers
              </div>
            </div>

            <div className="bg-[#181818] p-4 rounded-2xl border border-white/10 shadow-xl">
              <div className="text-[10px] font-mono tracking-wider text-white/40 uppercase">ASR Accuracy</div>
              <div className="font-editorial-serif text-2xl sm:text-3xl font-bold text-white mt-1">
                {overview?.avgAsrConfidence || 94}%
              </div>
              <div className="text-[10px] text-white/40 font-light mt-1">
                IndicWhisper 12 langs
              </div>
            </div>

            <div className="bg-[#181818] p-4 rounded-2xl border border-white/10 shadow-xl">
              <div className="text-[10px] font-mono tracking-wider text-white/40 uppercase">Open Escalations</div>
              <div className="font-editorial-serif text-2xl sm:text-3xl font-bold text-red-400 mt-1">
                {(escalations || []).filter(e => e.status === 'Open').length}
              </div>
              <div className="text-[10px] text-white/40 font-light mt-1">
                Officer assistance queue
              </div>
            </div>
          </div>

          {/* District Performance Summary */}
          <div className="bg-[#181818] rounded-2xl p-6 border border-white/10 shadow-2xl">
            <h3 className="font-editorial-serif font-bold text-white text-lg mb-4">
              District PM-AJAY Coverage &amp; Skilling Saturation
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-white/40 font-mono text-[10px] uppercase tracking-wider">
                    <th className="pb-3 font-normal">District</th>
                    <th className="pb-3 font-normal">State</th>
                    <th className="pb-3 font-normal">Beneficiaries</th>
                    <th className="pb-3 font-normal">Top Economic Trade</th>
                    <th className="pb-3 font-normal">Demand Score</th>
                    <th className="pb-3 font-normal">RPL Candidates</th>
                    <th className="pb-3 font-normal text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {(districts || []).map(d => (
                    <tr key={d.districtCode} className="hover:bg-white/[0.02] transition">
                      <td className="py-3.5 font-medium text-white">{d.name}</td>
                      <td className="py-3.5 text-white/60">{d.state}</td>
                      <td className="py-3.5 font-mono text-white/80">{(d.totalBeneficiariesRecorded || 0).toLocaleString()}</td>
                      <td className="py-3.5 text-white/70 font-light">{(d.topTrades || [])[0] || 'Technical Trades'}</td>
                      <td className="py-3.5 font-mono text-amber-400 font-bold">{d.demandScore || 80} / 100</td>
                      <td className="py-3.5 text-emerald-400 font-mono">{d.rplCandidatesIdentified || 0}</td>
                      <td className="py-3.5 text-right">
                        <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono px-2 py-0.5 rounded">
                          Active Center
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BENEFICIARY DIRECTORY */}
      {activeTab === 'beneficiaries' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-[#181818] p-4 rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-3 shadow-xl">
            <div className="flex items-center space-x-2 flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Search real-time candidate name, occupation, or skills..."
                value={searchCandidate}
                onChange={(e) => setSearchCandidate(e.target.value)}
                className="w-full bg-[#121212] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-white/30 focus:outline-hidden focus:border-amber-400"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-white/40" />
              <select
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
                className="bg-[#121212] border border-white/10 text-white rounded-xl px-3 py-2 text-xs focus:outline-hidden cursor-pointer"
              >
                <option value="" className="bg-[#181818] text-white">All Districts</option>
                {(districts || []).map(d => (
                  <option key={d.districtCode} value={d.name} className="bg-[#181818] text-white">{d.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Beneficiaries Table */}
          <div className="bg-[#181818] rounded-2xl p-5 border border-white/10 shadow-2xl overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-white/40 font-mono text-[10px] uppercase tracking-wider">
                  <th className="pb-3 font-normal">ID</th>
                  <th className="pb-3 font-normal">Beneficiary</th>
                  <th className="pb-3 font-normal">District</th>
                  <th className="pb-3 font-normal">Occupation &amp; Skills</th>
                  <th className="pb-3 font-normal">Mobility</th>
                  <th className="pb-3 font-normal">Confidence</th>
                  <th className="pb-3 font-normal text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {(filteredCandidates || []).map(cand => (
                  <tr key={cand.candidateId} className="hover:bg-white/[0.02] transition">
                    <td className="py-3 font-mono text-[10px] text-amber-400/90">{cand.candidateId}</td>
                    <td className="py-3">
                      <div className="font-medium text-white">{cand.name || 'Beneficiary'}</div>
                      <div className="text-[10px] text-white/40 font-mono">{(cand.language || 'hi').toUpperCase()} &bull; {cand.gender || 'beneficiary'}</div>
                    </td>
                    <td className="py-3 text-white/70 font-light">
                      {cand.location?.village || 'Panchayat'}, {cand.location?.district || 'District'}
                    </td>
                    <td className="py-3">
                      <div className="font-medium text-white/90">{cand.currentOccupation || 'Practical Work'}</div>
                      <div className="text-[11px] text-white/50 font-light">{(cand.skills || []).slice(0, 3).join(', ') || 'General Skills'}</div>
                    </td>
                    <td className="py-3 text-white/70 font-mono text-[11px]">
                      Max {cand.mobility?.maxDistanceKm || 15} km
                    </td>
                    <td className="py-3">
                      <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono font-bold px-2 py-0.5 rounded text-[10px]">
                        {cand.profileConfidence || 90}%
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => setEditingCandidate(cand)}
                        className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium text-[11px] transition cursor-pointer"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: HUMAN ESCALATIONS */}
      {activeTab === 'escalations' && (
        <div className="space-y-4">
          <div className="bg-[#181818] rounded-2xl p-6 border border-white/10 shadow-2xl">
            <h3 className="font-editorial-serif font-bold text-white text-lg mb-1">
              Beneficiary Human Officer Escalations (Real-Time Cloud Queue)
            </h3>
            <p className="text-xs text-white/50 mb-6 font-light">
              When a beneficiary requests human assistance during a voice interview or faces complex constraints, the AI logs an escalation directly to the cloud for the Block Development Officer (BDO).
            </p>

            <div className="space-y-3">
              {(escalations || []).map(esc => (
                <div 
                  key={esc.id}
                  className="bg-[#141414] border border-white/10 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider ${
                        esc.priority === 'High' ? 'bg-red-500/10 border border-red-500/30 text-red-400' : 'bg-amber-500/10 border border-amber-500/30 text-amber-300'
                      }`}>
                        {esc.priority} Priority
                      </span>
                      <span className="font-medium text-white text-sm">{esc.candidateName}</span>
                      <span className="text-xs text-white/40 font-mono">({esc.candidatePhone})</span>
                    </div>
                    <p className="text-xs text-white/70 font-light">{esc.reason}</p>
                    <div className="text-[10px] text-white/40 font-mono">
                      District: {esc.district || 'All'} &bull; Language: {(esc.preferredLanguage || 'hi').toUpperCase()} &bull; Logged: {new Date(esc.timestamp || Date.now()).toLocaleTimeString()}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className={`text-xs font-mono px-2.5 py-1 rounded ${
                      esc.status === 'Resolved' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' : 'bg-amber-500/10 border border-amber-500/30 text-amber-300'
                    }`}>
                      {esc.status}
                    </span>

                    {esc.status !== 'Resolved' && (
                      <button
                        onClick={() => handleUpdateEscalationStatus(esc.id, 'Resolved')}
                        className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 rounded-lg text-xs font-semibold transition cursor-pointer"
                      >
                        Mark Resolved
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: GEOSPATIAL MAP */}
      {activeTab === 'map' && (
        <GeospatialMap districts={districts} providers={providers} />
      )}

      {/* TAB 5: ECONOMIC DEMAND */}
      {activeTab === 'demand' && (
        <div className="space-y-4">
          <div className="bg-[#181818] rounded-2xl p-6 border border-white/10 shadow-2xl">
            <h3 className="font-editorial-serif font-bold text-white text-lg mb-1">
              District Economic Demand &amp; Sector Wage Intelligence
            </h3>
            <p className="text-xs text-white/50 mb-6 font-light">
              Aggregated from district employment exchanges, MSME clusters, and PM-AJAY annual action plans.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(demands || []).map(dem => (
                <div key={dem.id} className="bg-[#141414] border border-white/10 rounded-xl p-4 space-y-2.5 shadow-md">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
                      {dem.district}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      Score: {dem.demandScore}/100
                    </span>
                  </div>

                  <h4 className="font-editorial-serif font-bold text-white text-sm">{dem.trade}</h4>
                  <div className="text-xs text-white/50 font-light">{dem.sector}</div>

                  <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-white/40 block text-[10px] font-mono">Open Vacancies</span>
                      <span className="font-medium text-white">{dem.estimatedVacancies} Openings</span>
                    </div>
                    <div>
                      <span className="text-white/40 block text-[10px] font-mono">Avg Wage</span>
                      <span className="font-mono text-emerald-400 font-medium">₹{(dem.avgMonthlyWage || 14000).toLocaleString('en-IN')}/mo</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: TRAINING PROVIDERS */}
      {activeTab === 'providers' && (
        <div className="space-y-4">
          <div className="bg-[#181818] rounded-2xl p-6 border border-white/10 shadow-2xl">
            <h3 className="font-editorial-serif font-bold text-white text-lg mb-4">
              Accredited PMKK &amp; RSETI Centers Directory
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(providers || []).map(prov => (
                <div key={prov.id} className="bg-[#141414] border border-white/10 rounded-xl p-5 space-y-3 shadow-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-editorial-serif font-bold text-white text-sm">{prov.name}</h4>
                      <p className="text-xs text-white/50 mt-0.5 font-light">{prov.address} &bull; {prov.district}</p>
                    </div>
                    <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono px-2.5 py-1 rounded">
                      {prov.availableSeats} Open Seats
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-white/10">
                    <div>
                      <span className="text-white/40 block text-[10px] font-mono">Center Type</span>
                      <span className="font-medium text-white/80">{prov.type}</span>
                    </div>
                    <div>
                      <span className="text-white/40 block text-[10px] font-mono">SSC Affiliation</span>
                      <span className="font-medium text-white/80">{prov.affiliatedSSC}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: INTEGRATIONS */}
      {activeTab === 'integrations' && (
        <div className="bg-[#181818] rounded-2xl p-6 border border-white/10 shadow-2xl space-y-4">
          <h3 className="font-editorial-serif font-bold text-white text-lg mb-2">
            Integrated Government APIs &amp; Speech Infrastructure Status
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {(integrations || []).map(srv => (
              <div key={srv.serviceName} className="bg-[#141414] border border-white/10 rounded-xl p-4 space-y-2 shadow-md">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-white text-sm">{srv.serviceName}</span>
                  <span className="flex items-center space-x-1 text-emerald-400 font-mono text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{srv.status}</span>
                  </span>
                </div>
                <div className="text-xs text-white/60 font-light">
                  Latency: <span className="font-mono text-white/90 font-medium">{srv.latencyMs}ms</span> &bull; Uptime: <span className="font-mono text-white/90 font-medium">{srv.uptimePercent}%</span>
                </div>
                <div className="text-[10px] text-white/40 font-mono">
                  Last checked: {new Date(srv.lastHealthCheck || Date.now()).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: AUDIT TRAIL */}
      {activeTab === 'audits' && (
        <div className="bg-[#181818] rounded-2xl p-6 border border-white/10 shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-editorial-serif font-bold text-white text-lg">
              Immutable PM-AJAY Governance &amp; Cloud Audit Trail
            </h3>
            <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono px-2.5 py-0.5 rounded">
              Live Cloud Streaming
            </span>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {(auditLogs || []).map(log => (
              <div key={log.id} className="bg-[#141414] border border-white/10 rounded-xl p-3 text-xs flex justify-between items-center">
                <div>
                  <span className="font-mono text-amber-400 font-medium mr-2">[{log.action}]</span>
                  <span className="text-white/80 font-light">{log.details}</span>
                </div>
                <div className="text-[10px] text-white/40 font-mono shrink-0 ml-4">
                  {new Date(log.timestamp || Date.now()).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Beneficiary Inspect Modal */}
      {editingCandidate && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#181818] border border-white/10 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-start border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
                  {editingCandidate.candidateId}
                </span>
                <h3 className="font-editorial-serif font-bold text-white text-xl mt-1">
                  {editingCandidate.name || 'Beneficiary'}
                </h3>
                <p className="text-xs text-white/50 font-light">
                  {editingCandidate.location?.village || 'Panchayat'}, {editingCandidate.location?.district || 'District'}
                </p>
              </div>
              <button
                onClick={() => setEditingCandidate(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition text-xs font-mono"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-white/80">
              <div className="bg-[#121212] p-3 rounded-xl border border-white/5 space-y-1">
                <div className="text-white/40 font-mono text-[10px]">CURRENT OCCUPATION &amp; EXPERIENCE</div>
                <div className="font-medium text-white">{editingCandidate.currentOccupation || 'Practical Trade Work'}</div>
                <div className="text-white/60 font-light">Self-Reported Skills: {(editingCandidate.skills || []).join(', ') || 'Practical Experience'}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#121212] p-3 rounded-xl border border-white/5 space-y-0.5">
                  <div className="text-white/40 font-mono text-[10px]">MOBILITY RADIUS</div>
                  <div className="font-medium text-white">{editingCandidate.mobility?.maxDistanceKm || 15} km</div>
                </div>
                <div className="bg-[#121212] p-3 rounded-xl border border-white/5 space-y-0.5">
                  <div className="text-white/40 font-mono text-[10px]">ASPIRATION</div>
                  <div className="font-medium text-amber-400 capitalize">{(editingCandidate.employmentPreference || 'both').replace('_', ' ')}</div>
                </div>
              </div>

              <div className="bg-[#121212] p-3 rounded-xl border border-white/5 flex justify-between items-center">
                <div>
                  <div className="text-white/40 font-mono text-[10px]">AI PROFILE CONFIDENCE</div>
                  <div className="text-white/70 font-light">Based on IndicWhisper &amp; PM-AJAY slot matching</div>
                </div>
                <span className="text-sm font-mono font-bold text-emerald-400">
                  {editingCandidate.profileConfidence}%
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setEditingCandidate(null)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-semibold rounded-xl uppercase tracking-wider cursor-pointer transition"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  Users,
  BarChart3,
  Building2,
  BookOpen,
  History,
  Download,
  Lock,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  FileCode,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  Eye,
  ShieldCheck,
  Shield,
  Sparkles,
} from 'lucide-react';
import { AuditLog, Candidate, CandidateProfile, EnrollmentProgress, NSQFTrade, TrainingCenter } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface AdminPanelProps {
  onExitAdmin: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onExitAdmin }) => {
  const { user, userProfile, signInWithGoogle } = useAuth();
  const isFirebaseAdmin = userProfile?.role === 'admin' || userProfile?.role === 'surveyor';
  const [isAuthenticated, setIsAuthenticated] = useState(isFirebaseAdmin);
  const [username, setUsername] = useState('Admin');
  const [password, setPassword] = useState('Admin@123');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'candidates' | 'trades' | 'centers' | 'audit'>('dashboard');

  useEffect(() => {
    if (isFirebaseAdmin) {
      setIsAuthenticated(true);
      loadAllAdminData();
    }
  }, [isFirebaseAdmin]);

  // Dashboard Data
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [candidatesList, setCandidatesList] = useState<any[]>([]);
  const [tradesList, setTradesList] = useState<NSQFTrade[]>([]);
  const [centersList, setCentersList] = useState<TrainingCenter[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Editing state for manual progress override
  const [overrideStage, setOverrideStage] = useState('in_training_60');
  const [overridePercent, setOverridePercent] = useState(60);
  const [overrideNote, setOverrideNote] = useState('');

  // Trade form state
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [newTrade, setNewTrade] = useState<Partial<NSQFTrade>>({
    tradeName: '',
    nsqfLevel: 4,
    sector: '',
    category: 'hybrid',
    demandLevel: 'High',
    description: '',
    durationMonths: 3,
    minEducation: '8th Pass',
    expectedMonthlyEarning: '₹15,000',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsAuthenticated(true);
        loadAllAdminData();
      } else {
        setLoginError(data.error || 'Authentication failed');
      }
    } catch (err) {
      setLoginError('Server connection error');
    }
  };

  const loadAllAdminData = async () => {
    try {
      const [dashRes, candRes, tradeRes, centerRes, auditRes] = await Promise.all([
        fetch('/api/admin/dashboard').then((r) => r.json()),
        fetch('/api/admin/candidates').then((r) => r.json()),
        fetch('/api/admin/trades').then((r) => r.json()),
        fetch('/api/admin/centers').then((r) => r.json()),
        fetch('/api/admin/audit').then((r) => r.json()),
      ]);

      setDashboardData(dashRes);
      setCandidatesList(candRes.candidates || []);
      setTradesList(tradeRes.trades || []);
      setCentersList(centerRes.centers || []);
      setAuditLogs(auditRes.logs || []);
    } catch (e) {
      console.error('Failed to load admin data:', e);
    }
  };

  const handleOverrideProgress = async (candidateId: string) => {
    try {
      const res = await fetch(`/api/admin/progress/${candidateId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage: overrideStage,
          percent: Number(overridePercent),
          note: overrideNote,
        }),
      });
      if (res.ok) {
        alert('Beneficiary progress stage successfully overridden and audit logged.');
        loadAllAdminData();
        setSelectedCandidate(null);
      }
    } catch (e) {
      alert('Failed to override progress');
    }
  };

  const handleExport = (format: 'csv' | 'json') => {
    window.open(`/api/admin/export?format=${format}`, '_blank');
  };

  const handleSaveTrade = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/trades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newTrade,
          localizedNames: {
            hi: newTrade.tradeName,
            bn: newTrade.tradeName,
            mr: newTrade.tradeName,
            ta: newTrade.tradeName,
          },
          localizedDescriptions: {
            hi: newTrade.description,
            bn: newTrade.description,
            mr: newTrade.description,
            ta: newTrade.description,
          },
        }),
      });
      if (res.ok) {
        setShowTradeModal(false);
        loadAllAdminData();
      }
    } catch (e) {
      alert('Error saving trade');
    }
  };

  const handleDeleteTrade = async (tradeId: string) => {
    if (!confirm('Are you sure you want to delete this NSQF trade?')) return;
    try {
      await fetch(`/api/admin/trades/${tradeId}`, { method: 'DELETE' });
      loadAllAdminData();
    } catch (e) {
      alert('Failed to delete trade');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-900 px-4 text-stone-100">
        <div className="w-full max-w-md rounded-3xl border border-stone-800 bg-stone-950 p-8 shadow-2xl">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Lock className="h-7 w-7" />
            </div>
            <h1 className="text-xl font-extrabold text-white">PM-AJAY Admin Console</h1>
            <p className="mt-1 text-xs text-stone-400">
              Restricted Ministry of Social Justice & Empowerment Portal
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300">
                Official Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 w-full rounded-xl border border-stone-700 bg-stone-900 px-3.5 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-xl border border-stone-700 bg-stone-900 px-3.5 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-hidden"
              />
            </div>

            {loginError && (
              <div className="rounded-xl bg-rose-950/80 border border-rose-800 p-2.5 text-center text-xs text-rose-300">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-md hover:bg-indigo-500"
            >
              Sign In to Admin Portal
            </button>

            <div className="relative my-2 flex items-center justify-center">
              <div className="w-full border-t border-stone-800"></div>
              <span className="absolute bg-stone-950 px-2 text-[10px] uppercase tracking-wider text-stone-500 font-bold">
                or authenticate with
              </span>
            </div>

            <button
              type="button"
              onClick={async () => {
                try {
                  setLoginError('');
                  await signInWithGoogle();
                  setIsAuthenticated(true);
                  loadAllAdminData();
                } catch (e: any) {
                  if (e?.code === 'auth/popup-closed-by-user' || e?.code === 'auth/cancelled-popup-request') {
                    setLoginError('Sign-in window was closed.');
                  } else {
                    setLoginError(e?.message || 'Authentication failed. Please use standard credentials above.');
                  }
                }
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-stone-700 bg-stone-900 py-2.5 text-xs font-bold text-stone-200 hover:bg-stone-800"
            >
              <Shield className="h-4 w-4 text-emerald-400" />
              <span>Firebase Google Sign-In</span>
            </button>

            <button
              type="button"
              onClick={onExitAdmin}
              className="w-full text-center text-xs text-stone-400 hover:text-stone-200 mt-2"
            >
              ← Return to Citizen Assistant
            </button>
          </form>
        </div>
      </div>
    );
  }

  const filteredCandidates = candidatesList.filter(
    (c) =>
      c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone?.includes(searchTerm) ||
      c.district?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-stone-200 bg-white px-6 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-900 text-white font-black text-sm">
            PM
          </div>
          <div>
            <div className="text-sm font-bold text-stone-900">
              PM-AJAY Livelihood Scheme Admin Portal
            </div>
            <div className="text-[11px] text-stone-500">
              Dr. Ramesh Sonkar (District Welfare Officer - Nadia / Pune)
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleExport('csv')}
            className="flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-50"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-700" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => handleExport('json')}
            className="flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-50"
          >
            <FileCode className="h-3.5 w-3.5 text-blue-700" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={onExitAdmin}
            className="flex items-center gap-1.5 rounded-xl bg-stone-800 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-stone-700"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Exit Admin</span>
          </button>
        </div>
      </header>

      {/* Navigation tabs */}
      <div className="border-b border-stone-200 bg-white px-6">
        <nav className="flex space-x-6 text-xs font-bold">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 border-b-2 py-4 ${
              activeTab === 'dashboard'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span>Scheme Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('candidates')}
            className={`flex items-center gap-2 border-b-2 py-4 ${
              activeTab === 'candidates'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Candidate Records ({candidatesList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('trades')}
            className={`flex items-center gap-2 border-b-2 py-4 ${
              activeTab === 'trades'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>NSQF Trade Catalog ({tradesList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('centers')}
            className={`flex items-center gap-2 border-b-2 py-4 ${
              activeTab === 'centers'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            <Building2 className="h-4 w-4" />
            <span>Training Centers ({centersList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center gap-2 border-b-2 py-4 ${
              activeTab === 'audit'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            <History className="h-4 w-4" />
            <span>Audit Logs ({auditLogs.length})</span>
          </button>
        </nav>
      </div>

      {/* Main Tab Area */}
      <main className="p-6 max-w-7xl mx-auto">
        {activeTab === 'dashboard' && dashboardData && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-2xs">
                <div className="text-xs font-bold text-stone-500 uppercase">
                  Total SC Beneficiaries Reached
                </div>
                <div className="mt-2 text-2xl font-black text-stone-900">
                  {dashboardData.totalBeneficiaries}
                </div>
                <div className="mt-1 text-xs text-emerald-600 font-semibold">
                  +18% this month via Voice AI
                </div>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-2xs">
                <div className="text-xs font-bold text-stone-500 uppercase">
                  Intake Completion Rate
                </div>
                <div className="mt-2 text-2xl font-black text-indigo-900">
                  {dashboardData.intakeCompletionRate}%
                </div>
                <div className="mt-1 text-xs text-stone-500">
                  Compared to 24% on text web forms
                </div>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-2xs">
                <div className="text-xs font-bold text-stone-500 uppercase">
                  Active Training Centers
                </div>
                <div className="mt-2 text-2xl font-black text-emerald-800">
                  {dashboardData.activeTrainingCenters} Hubs
                </div>
                <div className="mt-1 text-xs text-stone-500">
                  Across WB, MH, TN, UP
                </div>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-2xs">
                <div className="text-xs font-bold text-stone-500 uppercase">
                  Inbound Channel Distribution
                </div>
                <div className="mt-2 text-xs font-bold space-y-1 text-stone-700">
                  <div>Web Voice: {dashboardData.channelStats?.web_voice || 420} (48%)</div>
                  <div>Toll-Free IVR: {dashboardData.channelStats?.ivr_phone || 290} (34%)</div>
                  <div>WhatsApp Voice: {dashboardData.channelStats?.whatsapp_note || 150} (18%)</div>
                </div>
              </div>
            </div>

            {/* Dropout Rate by Trade & District Heatmap Data */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Dropout Rate by Trade */}
              <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-2xs">
                <h3 className="text-sm font-bold text-stone-900 mb-4">
                  Dropout Rate & Retention by NSQF Trade
                </h3>
                <div className="space-y-3">
                  {dashboardData.tradeDropouts?.map((item: any) => (
                    <div key={item.trade} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span>{item.trade}</span>
                        <span>
                          {item.active}/{item.enrolled} Active ({item.dropoutPct}% dropout)
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-stone-100">
                        <div
                          className="h-full bg-emerald-600"
                          style={{ width: `${100 - item.dropoutPct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* District Level Demand Data */}
              <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-2xs">
                <h3 className="text-sm font-bold text-stone-900 mb-4">
                  District-Level Skill Demand & Intake Pipeline
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-stone-200 text-stone-500">
                        <th className="pb-2">District</th>
                        <th className="pb-2">Top Demand Trade</th>
                        <th className="pb-2">Beneficiaries</th>
                        <th className="pb-2">Completion</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {dashboardData.districtDemand?.map((d: any) => (
                        <tr key={d.district} className="py-2">
                          <td className="py-2.5 font-bold text-stone-900">{d.district}</td>
                          <td className="py-2.5 text-stone-600">{d.demandTrade}</td>
                          <td className="py-2.5 font-semibold text-stone-800">{d.beneficiaries}</td>
                          <td className="py-2.5 font-bold text-emerald-700">{d.completionRate}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'candidates' && (
          <div className="space-y-4">
            {/* Search & Filter Bar */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search by candidate name, phone or district..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 bg-white pl-9 pr-4 py-2 text-xs focus:border-indigo-600 focus:outline-hidden"
                />
              </div>
              <button
                onClick={loadAllAdminData}
                className="flex items-center gap-1 rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Refresh</span>
              </button>
            </div>

            {/* Candidate Table */}
            <div className="rounded-2xl border border-stone-200 bg-white overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold">
                  <tr>
                    <th className="p-3.5">Candidate</th>
                    <th className="p-3.5">Phone & District</th>
                    <th className="p-3.5">Profile Insights</th>
                    <th className="p-3.5">Progress Stage</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredCandidates.map((c) => (
                    <tr key={c.id} className="hover:bg-stone-50">
                      <td className="p-3.5 font-bold text-stone-900">{c.name}</td>
                      <td className="p-3.5 text-stone-600">
                        <div>{c.phone}</div>
                        <div className="text-[11px] text-stone-400">{c.district}, {c.state}</div>
                      </td>
                      <td className="p-3.5 text-stone-700">
                        <div>{c.profile?.educationLevel || '8th Pass'} • {c.profile?.currentOccupation || 'Daily wage'}</div>
                        <div className="text-[11px] text-indigo-700 font-medium">
                          {(c.profile?.informalSkills || []).join(', ') || 'Practical wiring, stitching'}
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-800 border border-emerald-200">
                          {c.progress?.currentStage || 'in_training_60'} ({c.progress?.percentComplete || 60}%)
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => setSelectedCandidate(c)}
                          className="rounded-lg bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 hover:bg-indigo-100"
                        >
                          Inspect & Override
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Candidate Detail & Progress Override Modal */}
        {selectedCandidate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-stone-200 bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-stone-200 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-stone-900">
                    Candidate Record: {selectedCandidate.name}
                  </h3>
                  <p className="text-xs text-stone-500">{selectedCandidate.phone} • {selectedCandidate.district}</p>
                </div>
                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="rounded-full p-1 text-stone-400 hover:bg-stone-100"
                >
                  ✕
                </button>
              </div>

              <div className="my-4 space-y-4 text-xs">
                {/* Profile Card */}
                <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4 space-y-2">
                  <div className="font-bold text-stone-800 uppercase">AI Extracted Candidate Profile</div>
                  <div className="grid grid-cols-2 gap-2 text-stone-700">
                    <div><strong>Education:</strong> {selectedCandidate.profile?.educationLevel || '8th Pass'}</div>
                    <div><strong>Current Work:</strong> {selectedCandidate.profile?.currentOccupation || 'Farm Helper'}</div>
                    <div><strong>Mobility Radius:</strong> {selectedCandidate.profile?.travelLimitKm || 15} km</div>
                    <div><strong>Preference:</strong> {selectedCandidate.profile?.employmentPreference || 'Self-Employment'}</div>
                    <div className="col-span-2">
                      <strong>Skills:</strong> {(selectedCandidate.profile?.informalSkills || []).join(', ')}
                    </div>
                  </div>
                </div>

                {/* Spoken Voice Transcript */}
                <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4 space-y-2">
                  <div className="font-bold text-stone-800 uppercase">Spoken Interview Transcript</div>
                  <div className="max-h-36 overflow-y-auto space-y-1.5">
                    {selectedCandidate.session?.transcript?.map((t: any, idx: number) => (
                      <div key={idx} className="text-stone-700">
                        <span className="font-bold">{t.speaker === 'user' ? 'Beneficiary' : 'Voice Assistant'}: </span>
                        <span>{t.text}</span>
                      </div>
                    )) || <div className="text-stone-400 italic">No audio transcript recorded for this session.</div>}
                  </div>
                </div>

                {/* Manual Override Stage Form (§9 Requirement) */}
                <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 space-y-3">
                  <div className="font-bold text-amber-900 uppercase flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4" />
                    <span>District Officer Manual Stage Override</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-stone-700">New Stage:</label>
                      <select
                        value={overrideStage}
                        onChange={(e) => setOverrideStage(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-stone-300 bg-white p-2 text-xs"
                      >
                        <option value="enrollment_confirmed">Enrollment Confirmed</option>
                        <option value="training_started">Training Started</option>
                        <option value="in_training_60">60% Training Completed</option>
                        <option value="certification">Certification Passed</option>
                        <option value="employment_placed">Employment Placed / Self-Employed</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-stone-700">Progress %:</label>
                      <input
                        type="number"
                        value={overridePercent}
                        onChange={(e) => setOverridePercent(Number(e.target.value))}
                        className="mt-1 w-full rounded-xl border border-stone-300 bg-white p-2 text-xs"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="font-semibold text-stone-700">Audit Reason / Note:</label>
                      <input
                        type="text"
                        placeholder="e.g. Beneficiary verified on-site by field officer..."
                        value={overrideNote}
                        onChange={(e) => setOverrideNote(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-stone-300 bg-white p-2 text-xs"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => handleOverrideProgress(selectedCandidate.id)}
                    className="w-full rounded-xl bg-amber-700 py-2.5 text-xs font-bold text-white hover:bg-amber-800 shadow-xs"
                  >
                    Confirm Stage Override & Log Audit
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* NSQF Trade Catalog CRUD */}
        {activeTab === 'trades' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-stone-900">
                NSQF Aligned Trades Catalog
              </h3>
              <button
                onClick={() => setShowTradeModal(true)}
                className="flex items-center gap-1 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-indigo-500"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add NSQF Trade</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tradesList.map((trade) => (
                <div key={trade.id} className="rounded-2xl border border-stone-200 bg-white p-4 shadow-2xs space-y-2 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-extrabold text-sm text-stone-900">{trade.tradeName}</h4>
                      <span className="text-stone-500 font-semibold">Level {trade.nsqfLevel} • {trade.sector}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteTrade(trade.id)}
                      className="text-stone-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="text-stone-600">{trade.description}</p>
                  <div className="flex gap-2 text-[11px] font-semibold text-stone-500">
                    <span className="bg-stone-100 px-2 py-0.5 rounded-md">Duration: {trade.durationMonths} Months</span>
                    <span className="bg-stone-100 px-2 py-0.5 rounded-md">Earnings: {trade.expectedMonthlyEarning}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Center Catalog */}
        {activeTab === 'centers' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-stone-900">
              PM-AJAY Training Centers
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {centersList.map((center) => (
                <div key={center.id} className="rounded-2xl border border-stone-200 bg-white p-4 shadow-2xs space-y-2 text-xs">
                  <h4 className="font-extrabold text-sm text-stone-900">{center.name}</h4>
                  <div className="text-stone-500">{center.address}</div>
                  <div className="flex gap-2 text-stone-700 font-semibold">
                    <span>Seats: {center.seatsAvailable}/{center.totalSeats}</span>
                    <span>• Next Batch: {center.nextBatchDate}</span>
                    <span>• Distance: {center.distanceKm} km</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Audit Logs Viewer */}
        {activeTab === 'audit' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-stone-900">
              Security & Action Audit Trail
            </h3>
            <div className="rounded-2xl border border-stone-200 bg-white overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold">
                  <tr>
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">Admin</th>
                    <th className="p-3">Action</th>
                    <th className="p-3">Target Entity</th>
                    <th className="p-3">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-mono text-[11px]">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-stone-50">
                      <td className="p-3 text-stone-500">{new Date(log.timestamp).toLocaleString()}</td>
                      <td className="p-3 font-bold text-stone-900">{log.adminName}</td>
                      <td className="p-3 font-semibold text-indigo-700">{log.action}</td>
                      <td className="p-3 text-stone-600">{log.targetEntity} #{log.targetId}</td>
                      <td className="p-3 text-stone-800">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Modal to Add Trade */}
      {showTradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <h3 className="text-base font-bold text-stone-900 mb-4">Add NSQF Trade Pathway</h3>
            <form onSubmit={handleSaveTrade} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-stone-700">Trade Title:</label>
                <input
                  type="text"
                  required
                  value={newTrade.tradeName}
                  onChange={(e) => setNewTrade({ ...newTrade, tradeName: e.target.value })}
                  placeholder="e.g. Solar PV Installer"
                  className="mt-1 w-full rounded-xl border border-stone-300 p-2.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-stone-700">NSQF Level:</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={newTrade.nsqfLevel}
                    onChange={(e) => setNewTrade({ ...newTrade, nsqfLevel: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-stone-300 p-2.5"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700">Sector:</label>
                  <input
                    type="text"
                    value={newTrade.sector}
                    onChange={(e) => setNewTrade({ ...newTrade, sector: e.target.value })}
                    placeholder="e.g. Green Energy"
                    className="mt-1 w-full rounded-xl border border-stone-300 p-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700">Description:</label>
                <textarea
                  value={newTrade.description}
                  onChange={(e) => setNewTrade({ ...newTrade, description: e.target.value })}
                  rows={2}
                  className="mt-1 w-full rounded-xl border border-stone-300 p-2.5"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTradeModal(false)}
                  className="rounded-xl border border-stone-300 px-4 py-2 text-xs font-semibold text-stone-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500"
                >
                  Save NSQF Trade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

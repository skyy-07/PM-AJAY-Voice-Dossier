import React, { useState } from 'react';
import { ShieldCheck, Lock, User as UserIcon, Key, AlertCircle, Building2, Sparkles, LogIn, Eye, EyeOff } from 'lucide-react';
import { User, UserRole } from '../../types.js';
import { api } from '../../lib/api.js';
import { useTheme } from '../../context/ThemeContext.js';

interface AdminLoginModalProps {
  onLoginSuccess: (user: User, token: string) => void;
  onCancel?: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onLoginSuccess, onCancel }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [loginMode, setLoginMode] = useState<'credentials' | 'quick'>('credentials');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('district_admin');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick Evaluator Presets
  const quickPresets = [
    {
      id: 'USR-DIST',
      name: 'R. K. Mishra',
      title: 'District PM-AJAY Nodal Officer',
      district: 'Varanasi, UP',
      role: 'district_admin' as UserRole,
      badgeColor: 'bg-amber-500/10 text-amber-500 border-amber-500/30'
    },
    {
      id: 'USR-ADMIN',
      name: 'Dr. Alok Verma (IAS)',
      title: 'State Skill Mission Director',
      district: 'Uttar Pradesh',
      role: 'state_admin' as UserRole,
      badgeColor: 'bg-blue-500/10 text-blue-500 border-blue-500/30'
    },
    {
      id: 'USR-SUPER',
      name: 'National PM-AJAY Cell',
      title: 'MoSJ&E Super Administrator',
      district: 'New Delhi (HQ)',
      role: 'super_admin' as UserRole,
      badgeColor: 'bg-purple-500/10 text-purple-500 border-purple-500/30'
    }
  ];

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const result = await api.adminLogin({
        username: username || undefined,
        password: password || undefined,
        role: selectedRole
      });
      onLoginSuccess(result.user, result.token);
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid username or security passcode.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = async (userId: string, role: UserRole) => {
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const result = await api.adminLogin({ userId, role });
      onLoginSuccess(result.user, result.token);
    } catch (err: any) {
      setErrorMsg(err.message || 'Quick authentication failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className={`w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden transition-colors ${
        isDark 
          ? 'bg-[#0e172a]/95 border-white/10 text-white shadow-black/80' 
          : 'bg-white/95 border-slate-200 text-slate-900 shadow-slate-300/80'
      }`}>
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-amber-700 p-6 text-white text-center relative">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg mb-3">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <div className="inline-flex items-center space-x-1.5 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase mb-1">
            <Lock className="w-3 h-3 text-amber-300" />
            <span>Govt of India Portal</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">PM-AJAY Governance Portal</h2>
          <p className="text-xs opacity-90 font-medium mt-1">
            Secure Access for Scheme Officers &amp; District Administrators
          </p>
        </div>

        {/* Mode Selector Switch */}
        <div className={`p-4 border-b flex items-center justify-between gap-2 text-xs font-semibold ${
          isDark ? 'bg-[#090f1d] border-white/10' : 'bg-slate-50 border-slate-200'
        }`}>
          <button
            type="button"
            onClick={() => { setLoginMode('credentials'); setErrorMsg(null); }}
            className={`flex-1 py-2 px-3 rounded-lg border transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
              loginMode === 'credentials'
                ? 'bg-orange-500 text-white border-orange-400 shadow-xs'
                : isDark ? 'bg-white/5 border-white/10 text-slate-400 hover:text-white' : 'bg-white border-slate-200 text-slate-600'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Passcode Login</span>
          </button>
          <button
            type="button"
            onClick={() => { setLoginMode('quick'); setErrorMsg(null); }}
            className={`flex-1 py-2 px-3 rounded-lg border transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
              loginMode === 'quick'
                ? 'bg-orange-500 text-white border-orange-400 shadow-xs'
                : isDark ? 'bg-white/5 border-white/10 text-slate-400 hover:text-white' : 'bg-white border-slate-200 text-slate-600'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>1-Click Evaluator</span>
          </button>
        </div>

        {/* Body Area */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs flex items-start space-x-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {loginMode === 'credentials' ? (
            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Official ID / Email
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-3 top-3 opacity-50" />
                  <input
                    type="text"
                    placeholder="e.g. varanasi.admin@pmajay.gov.in"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500 ${
                      isDark 
                        ? 'bg-[#152037] border-white/15 text-white placeholder-slate-500' 
                        : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                    }`}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className={`block text-xs font-semibold uppercase tracking-wider ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Security Passcode
                  </label>
                  <span className="text-[10px] text-amber-500 font-mono">Demo: pmajay2026</span>
                </div>
                <div className="relative">
                  <Key className="w-4 h-4 absolute left-3 top-3 opacity-50" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter passcode (pmajay2026)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-9 pr-10 py-2.5 rounded-xl border text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500 ${
                      isDark 
                        ? 'bg-[#152037] border-white/15 text-white placeholder-slate-500' 
                        : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 opacity-60 hover:opacity-100 transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Jurisdiction Role
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className={`w-full px-3 py-2.5 rounded-xl border text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-orange-500 ${
                    isDark 
                      ? 'bg-[#152037] border-white/15 text-white' 
                      : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                >
                  <option value="district_admin">District PM-AJAY Officer (Varanasi / District Level)</option>
                  <option value="state_admin">State Skill Mission Director (State Level)</option>
                  <option value="super_admin">National Super Administrator (Ministry of Social Justice)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-sm shadow-lg shadow-orange-500/25 flex items-center justify-center space-x-2 cursor-pointer transition disabled:opacity-50 mt-2"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Authenticate &amp; Launch Console</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-3">
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'} mb-2`}>
                Select an evaluator persona below for instant 1-click access to the PM-AJAY Governance Console:
              </p>
              {quickPresets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleQuickLogin(preset.id, preset.role)}
                  disabled={isSubmitting}
                  className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                    isDark
                      ? 'bg-[#131d33] border-white/10 hover:bg-white/10 hover:border-orange-500/50'
                      : 'bg-slate-50 border-slate-200 hover:bg-orange-50 hover:border-orange-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-lg bg-orange-500/10 text-orange-500 border border-orange-500/20 flex items-center justify-center shrink-0">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs group-hover:text-orange-500 transition-colors">
                        {preset.name}
                      </div>
                      <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {preset.title} &bull; <span className="font-mono text-[10px]">{preset.district}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase shrink-0 ${preset.badgeColor}`}>
                    Quick Login
                  </span>
                </button>
              ))}
            </div>
          )}

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className={`w-full mt-4 text-center text-xs font-semibold hover:underline cursor-pointer ${
                isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Return to Public Intake Portal
            </button>
          )}
        </div>

        {/* Footer Note */}
        <div className={`px-6 py-3 border-t text-[10px] text-center font-mono ${
          isDark ? 'bg-[#090f1d] border-white/5 text-slate-500' : 'bg-slate-100 border-slate-200 text-slate-400'
        }`}>
          NIC End-to-End Encrypted &bull; Audit Trail Active
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  X,
  LogIn,
  UserPlus,
  Shield,
  User,
  Mail,
  Lock,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Users,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SupportedLanguage } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: SupportedLanguage;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, language }) => {
  const {
    user,
    userProfile,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signInGuest,
    logout,
    updateRole,
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup' | 'profile'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [selectedRole, setSelectedRole] = useState<'candidate' | 'surveyor' | 'admin'>('candidate');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const isHindi = language === 'hi';
  const isBengali = language === 'bn';

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
      onClose();
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
        setErrorMsg(
          isHindi
            ? 'साइन-इन विंडो बंद कर दी गई थी। कृपया पुनः प्रयास करें या नीचे ईमेल / त्वरित प्रवेश का उपयोग करें।'
            : isBengali
            ? 'সাইন-ইন উইন্ডো বন্ধ করা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।'
            : 'Sign-in window was closed. Click again to retry or use Email / Quick Guest Access.'
        );
      } else if (err.code === 'auth/popup-blocked') {
        setErrorMsg(
          isHindi
            ? 'ब्राउज़र ने पॉपअप विंडो को ब्लॉक कर दिया। कृपया पॉपअप की अनुमति दें या ईमेल से साइन इन करें।'
            : 'Popup was blocked by your browser. Please allow popups or use Email / Quick Access.'
        );
      } else if (err.code === 'auth/unauthorized-domain') {
        setErrorMsg(
          isHindi
            ? 'वर्तमान डोमेन अधिकृत नहीं है। कृपया ईमेल या त्वरित अतिथि प्रवेश का उपयोग करें।'
            : 'Domain not yet authorized in Firebase Console. Please use Email login or Quick Guest Access.'
        );
      } else {
        setErrorMsg(err.message || (isHindi ? 'गूगल साइन इन असफल रहा।' : 'Google sign-in could not be completed.'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestSignIn = async () => {
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      await signInGuest();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Guest sign-in failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      if (mode === 'signup') {
        if (!displayName.trim()) {
          throw new Error(isHindi ? 'कृपया अपना नाम दर्ज करें' : 'Please enter your name');
        }
        await signUpWithEmail(email, password, displayName, selectedRole);
      } else {
        await signInWithEmail(email, password);
      }
      onClose();
    } catch (err: any) {
      let msg = err.message || 'Authentication failed';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        msg = isHindi ? 'अमान्य ईमेल या पासवर्ड।' : 'Invalid email or password.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = isHindi ? 'यह ईमेल पहले से पंजीकृत है।' : 'Email already registered. Please sign in.';
      } else if (err.code === 'auth/weak-password') {
        msg = isHindi ? 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।' : 'Password should be at least 6 characters.';
      }
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl transition-all">
        {/* Header */}
        <div className="bg-[#172554] p-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-emerald-400">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-black tracking-tight">
                  {user
                    ? isHindi
                      ? 'पीएम-अजय उपयोगकर्ता प्रोफ़ाइल'
                      : 'PM-AJAY User Account'
                    : isHindi
                    ? 'लॉगिन / साइन इन करें'
                    : 'Sign In / Register'}
                </h2>
                <p className="text-[11px] text-blue-200">
                  {isHindi
                    ? 'सुरक्षित प्रमाणीकरण (Firebase Auth)'
                    : 'Secure Authentication & Cloud Sync'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-white/80 hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5">
          {user ? (
            /* Logged in state */
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-2xl bg-stone-50 p-4 border border-stone-200">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Avatar"
                    className="h-12 w-12 rounded-full border-2 border-emerald-500 object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#172554] text-lg font-black text-white">
                    {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate font-bold text-stone-900">
                      {user.displayName || (user.isAnonymous ? 'Guest Beneficiary' : user.email)}
                    </span>
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-300">
                      {userProfile?.role === 'surveyor'
                        ? 'Surveyor'
                        : userProfile?.role === 'admin'
                        ? 'Admin'
                        : 'Beneficiary'}
                    </span>
                  </div>
                  <div className="truncate text-xs text-stone-500">
                    {user.email || 'Anonymous Guest Session'}
                  </div>
                </div>
              </div>

              {/* Role Switcher */}
              <div className="space-y-1.5 rounded-2xl bg-blue-50/60 p-3 border border-blue-100">
                <label className="text-xs font-bold text-stone-700">
                  {isHindi ? 'अपनी भूमिका चुनें (Role):' : 'Select Account Role:'}
                </label>
                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  {(['candidate', 'surveyor', 'admin'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => updateRole(r)}
                      className={`rounded-xl py-1.5 text-xs font-bold transition capitalize ${
                        userProfile?.role === r
                          ? 'bg-[#172554] text-white shadow-xs'
                          : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {r === 'candidate' ? (isHindi ? 'लाभार्थी' : 'Candidate') : r === 'surveyor' ? (isHindi ? 'सर्वेक्षक' : 'Surveyor') : 'Admin'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Logout & Actions */}
              <div className="pt-2">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 py-3 text-xs font-bold text-rose-700 transition hover:bg-rose-100"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{isHindi ? 'लॉग आउट करें (Sign Out)' : 'Sign Out'}</span>
                </button>
              </div>
            </div>
          ) : (
            /* Sign in / Sign up state */
            <div className="space-y-4">
              {/* Tab Switcher */}
              <div className="grid grid-cols-2 gap-1 rounded-2xl bg-stone-100 p-1">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMsg(null);
                  }}
                  className={`rounded-xl py-2 text-xs font-bold transition ${
                    mode === 'login'
                      ? 'bg-white text-[#172554] shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {isHindi ? 'साइन इन (Login)' : 'Sign In'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrorMsg(null);
                  }}
                  className={`rounded-xl py-2 text-xs font-bold transition ${
                    mode === 'signup'
                      ? 'bg-white text-[#172554] shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {isHindi ? 'नया खाता (Register)' : 'New Account'}
                </button>
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-2.5 text-xs font-medium text-rose-700 border border-rose-200">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Google Sign-in Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2.5 rounded-2xl border border-stone-300 bg-white py-3 text-xs font-bold text-stone-800 shadow-xs transition hover:bg-stone-50 active:scale-[0.99] disabled:opacity-50"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>
                  {isHindi ? 'Google खाते से साइन इन करें' : 'Continue with Google'}
                </span>
              </button>

              <div className="relative flex items-center justify-center">
                <div className="w-full border-t border-stone-200"></div>
                <span className="absolute bg-white px-3 text-[11px] font-semibold text-stone-400 uppercase">
                  {isHindi ? 'या ईमेल से' : 'or with email'}
                </span>
              </div>

              {/* Email Form */}
              <form onSubmit={handleEmailSubmit} className="space-y-3">
                {mode === 'signup' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        {isHindi ? 'पूरा नाम' : 'Full Name'}
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
                        <input
                          type="text"
                          required
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          placeholder={isHindi ? 'जैसे: राहुल कुमार' : 'e.g. Ramesh Chandra'}
                          className="w-full rounded-2xl border border-stone-200 py-2.5 pl-9 pr-3 text-xs focus:border-blue-600 focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        {isHindi ? 'भूमिका (Role)' : 'Role'}
                      </label>
                      <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value as any)}
                        className="w-full rounded-2xl border border-stone-200 py-2.5 px-3 text-xs focus:border-blue-600 focus:outline-hidden"
                      >
                        <option value="candidate">
                          {isHindi ? 'उम्मीदवार / लाभार्थी (Candidate)' : 'Beneficiary / Candidate'}
                        </option>
                        <option value="surveyor">
                          {isHindi ? 'फील्ड सर्वेक्षक / मोबिलाइज़र (Field Surveyor)' : 'Field Surveyor / Mobilizer'}
                        </option>
                        <option value="admin">
                          {isHindi ? 'प्रशासनिक अधिकारी (Admin / Officer)' : 'Admin / Training Officer'}
                        </option>
                      </select>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {isHindi ? 'ईमेल पता' : 'Email Address'}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="beneficiary@pmajay.gov.in"
                      className="w-full rounded-2xl border border-stone-200 py-2.5 pl-9 pr-3 text-xs focus:border-blue-600 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {isHindi ? 'पासवर्ड' : 'Password'}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-2xl border border-stone-200 py-2.5 pl-9 pr-3 text-xs focus:border-blue-600 focus:outline-hidden"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#172554] py-3 text-xs font-bold text-white shadow-md transition hover:bg-blue-900 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : mode === 'signup' ? (
                    <UserPlus className="h-4 w-4" />
                  ) : (
                    <LogIn className="h-4 w-4" />
                  )}
                  <span>
                    {isSubmitting
                      ? isHindi
                        ? 'प्रतीक्षा करें...'
                        : 'Authenticating...'
                      : mode === 'signup'
                      ? isHindi
                        ? 'खाता बनाएं'
                        : 'Create Account'
                      : isHindi
                      ? 'लॉगिन करें'
                      : 'Sign In'}
                  </span>
                </button>
              </form>

              {/* Instant Guest / Beneficiary Fast Track Button */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleGuestSignIn}
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-50 py-2.5 text-xs font-bold text-emerald-800 border border-emerald-200 transition hover:bg-emerald-100"
                >
                  <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                  <span>
                    {isHindi
                      ? 'त्वरित लाभार्थी प्रवेश (बिना पासवर्ड तुरंत शुरू करें)'
                      : 'Quick Guest Access (Start Without Password)'}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

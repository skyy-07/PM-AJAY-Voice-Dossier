import React, { useState } from 'react';
import {
  Shield,
  LogIn,
  UserPlus,
  Mail,
  Lock,
  User,
  Loader2,
  AlertCircle,
  Sparkles,
  Volume2,
  Globe,
  CheckCircle2,
  Building2,
  Radio,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SupportedLanguage } from '../types';
import { SUPPORTED_LANGUAGES, getLocale } from '../locales/i18n';

interface LoginScreenProps {
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onOpenAdmin: () => void;
  onSpeakNarration?: (text: string) => void;
  isSpeaking?: boolean;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  language,
  onLanguageChange,
  onOpenAdmin,
  onSpeakNarration,
  isSpeaking,
}) => {
  const {
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signInGuest,
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [selectedRole, setSelectedRole] = useState<'candidate' | 'surveyor' | 'admin'>('candidate');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);

  const locale = getLocale(language);
  const isHindi = language === 'hi';
  const isBengali = language === 'bn';

  const getSpokenPrompt = () => {
    switch (language) {
      case 'hi':
        return 'प्रधानमंत्री अजय आजीविका सहायक में आपका स्वागत है। ऐप शुरू करने के लिए कृपया अपने गूगल खाते, ईमेल या त्वरित लाभार्थी बटन से लॉगिन करें।';
      case 'bn':
        return 'পিএম-অজয় জীবিকা সহায়কে স্বাগতম। অনুগ্রহ করে গুগল বা ইমেল দিয়ে লগইন করুন।';
      case 'mr':
        return 'पीएम-अजय उपजीविका सहाय्यकामध्ये आपले स्वागत आहे. कृपया लॉगिन करा.';
      case 'ta':
        return 'பிரதமர்-அஜய் வாழ்வாதார உதவியாளருக்கு வரவேற்கிறோம். தயவுசெய்து உள்நுழையவும்.';
      case 'en':
      default:
        return 'Welcome to PM-AJAY Voice Livelihood Assistant. Please sign in with Google, Email, or Quick Guest Access to begin.';
    }
  };

  const handleVoiceNarration = () => {
    if (onSpeakNarration) {
      onSpeakNarration(getSpokenPrompt());
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
        setErrorMsg(
          isHindi
            ? 'साइन-इन विंडो बंद कर दी गई थी। कृपया पुनः प्रयास करें या नीचे त्वरित प्रवेश का उपयोग करें।'
            : isBengali
            ? 'সাইন-ইন উইন্ডো বন্ধ করা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।'
            : 'Sign-in window was closed. Try again or use Quick Guest Access below.'
        );
      } else if (err.code === 'auth/popup-blocked') {
        setErrorMsg(
          isHindi
            ? 'ब्राउज़र ने पॉपअप विंडो को ब्लॉक कर दिया। कृपया पॉपअप की अनुमति दें या ईमेल से साइन इन करें।'
            : 'Popup blocked by your browser. Please allow popups or use Email / Quick Access.'
        );
      } else {
        setErrorMsg(err.message || 'Google sign-in could not be completed.');
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
    } catch (err: any) {
      let msg = err.message || 'Authentication failed';
      if (
        err.code === 'auth/invalid-credential' ||
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/wrong-password'
      ) {
        msg = isHindi
          ? 'अमान्य ईमेल या पासवर्ड। कृपया जाँच करें।'
          : 'Invalid email or password. Please try again.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = isHindi
          ? 'यह ईमेल पहले से पंजीकृत है। कृपया लॉगिन करें।'
          : 'Email already registered. Please switch to Sign In.';
      } else if (err.code === 'auth/weak-password') {
        msg = isHindi
          ? 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।'
          : 'Password must be at least 6 characters.';
      }
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
      {/* Top Bar: Language + Audio */}
      <div className="space-y-4">
        <div className="flex items-center justify-end gap-1.5">
          {/* Audio narration button */}
          <button
            type="button"
            onClick={handleVoiceNarration}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
              isSpeaking
                ? 'bg-emerald-600 text-white animate-pulse'
                : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
            }`}
            title="Listen to Instructions"
          >
            <Volume2 className="h-4 w-4" />
          </button>

          {/* Language Selector Dropdown trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowLanguagePicker(!showLanguagePicker)}
              className="flex items-center gap-1 rounded-full bg-white border border-stone-300 px-2.5 py-1 text-xs font-bold text-stone-800 shadow-xs hover:bg-stone-50"
            >
              <Globe className="h-3.5 w-3.5 text-stone-500" />
              <span>{SUPPORTED_LANGUAGES.find((l) => l.code === language)?.nativeName || 'हिन्दी'}</span>
            </button>

            {showLanguagePicker && (
              <div className="absolute right-0 top-9 z-50 w-36 rounded-2xl bg-white p-1.5 shadow-xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
                {SUPPORTED_LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => {
                      onLanguageChange(l.code);
                      setShowLanguagePicker(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-semibold ${
                      language === l.code
                        ? 'bg-[#172554] text-white'
                        : 'text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <span>{l.nativeName}</span>
                    <span className="text-[10px] opacity-75">{l.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Hero Banner / Welcome Header */}
        <div className="text-center pt-1 pb-2">
          <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#172554] text-white shadow-lg shadow-blue-950/20">
            <Shield className="h-8 w-8 text-amber-400" />
          </div>
          <h1 className="text-xl font-black text-stone-900 tracking-tight sm:text-2xl">
            {isHindi
              ? 'पीएम-अजय आजीविका सहायक'
              : isBengali
              ? 'পিএম-অজয় জীবিকা সহায়ক'
              : 'PM-AJAY Voice Assistant'}
          </h1>
          <p className="mt-1 text-xs text-stone-600 font-medium max-w-xs mx-auto">
            {isHindi
              ? 'निःशुल्क कौशल प्रशिक्षण और रोजगार सहायता पोर्टल'
              : 'Sign in to access AI Voice Skill Assessment & NSQF Career Mapping'}
          </p>
        </div>

        {/* Auth Card */}
        <div className="rounded-3xl bg-white p-4 sm:p-5 shadow-md border border-stone-200/80">
          {/* Sign In / Sign Up Toggle */}
          <div className="grid grid-cols-2 gap-1 rounded-2xl bg-stone-100 p-1 mb-4">
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
              {isHindi ? 'लॉगिन (Sign In)' : 'Sign In'}
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
            <div className="mb-3 flex items-center gap-2 rounded-xl bg-rose-50 p-2.5 text-xs font-medium text-rose-700 border border-rose-200">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Google Sign In */}
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

          <div className="relative my-3 flex items-center justify-center">
            <div className="w-full border-t border-stone-200"></div>
            <span className="absolute bg-white px-2.5 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
              {isHindi ? 'या ईमेल से' : 'or with email'}
            </span>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-2.5">
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {isHindi ? 'पूरा नाम' : 'Full Name'}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
                    <input
                      type="text"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder={isHindi ? 'उदा: सुरेश मंडल' : 'e.g. Ramesh Chandra'}
                      className="w-full rounded-2xl border border-stone-200 py-2 pl-9 pr-3 text-xs focus:border-blue-600 focus:outline-hidden"
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
                    className="w-full rounded-2xl border border-stone-200 py-2 px-3 text-xs focus:border-blue-600 focus:outline-hidden bg-stone-50"
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
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="beneficiary@pmajay.gov.in"
                  className="w-full rounded-2xl border border-stone-200 py-2 pl-9 pr-3 text-xs focus:border-blue-600 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {isHindi ? 'पासवर्ड' : 'Password'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-stone-200 py-2 pl-9 pr-3 text-xs focus:border-blue-600 focus:outline-hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#172554] py-3 text-xs font-bold text-white shadow-md transition hover:bg-blue-900 disabled:opacity-50 mt-1"
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
                    ? 'नया खाता बनाएं'
                    : 'Create Account'
                  : isHindi
                  ? 'लॉगिन करें'
                  : 'Sign In'}
              </span>
            </button>
          </form>

          {/* Instant Guest / Beneficiary Fast Track Button */}
          <div className="pt-3">
            <button
              type="button"
              onClick={handleGuestSignIn}
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-50 py-2.5 text-xs font-bold text-emerald-800 border border-emerald-200 transition hover:bg-emerald-100 active:scale-[0.99]"
            >
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              <span>
                {isHindi
                  ? 'त्वरित लाभार्थी प्रवेश (बिना पासवर्ड तुरंत शुरू करें)'
                  : 'Quick Beneficiary Entry (Start Without Password)'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer link for Admin Portal */}
      <div className="pt-4 text-center">
        <div className="rounded-2xl bg-stone-900/5 p-3 border border-stone-200 flex items-center justify-between">
          <div className="text-left">
            <div className="text-[11px] font-bold text-stone-800">
              {isHindi ? 'प्रशासनिक अधिकारी पोर्टल' : 'Ministry Admin Portal'}
            </div>
            <div className="text-[10px] text-stone-500">
              Login ID: <span className="font-mono font-bold text-stone-700">Admin</span> | Password: <span className="font-mono font-bold text-stone-700">Admin@123</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenAdmin}
            className="flex items-center gap-1 rounded-xl bg-stone-900 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-stone-800 transition shrink-0"
          >
            <span>Admin</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
        <p className="mt-2 text-[10px] text-stone-400 font-medium">
          PM-AJAY GIA Grant &bull; Zero Tuition Fee &bull; National Skill Qualification Framework
        </p>
      </div>
    </div>
  );
};

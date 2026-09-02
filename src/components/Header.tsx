import React from 'react';
import { Volume2, VolumeX, Globe, Shield, RefreshCw, User, LogIn } from 'lucide-react';
import { SupportedLanguage } from '../types';
import { SUPPORTED_LANGUAGES } from '../locales/i18n';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  title: string;
  currentLanguage: SupportedLanguage;
  onOpenLanguage: () => void;
  onOpenTalkBack: () => void;
  isSpeaking: boolean;
  onToggleSpeech: () => void;
  onResetApp: () => void;
  onOpenAdmin?: () => void;
  onOpenAuth?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  currentLanguage,
  onOpenLanguage,
  onOpenTalkBack,
  isSpeaking,
  onToggleSpeech,
  onResetApp,
  onOpenAdmin,
  onOpenAuth,
}) => {
  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage);
  const { user, userProfile } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-[#172554] text-white shadow-md">
      <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-3 sm:px-4">
        {/* Title */}
        <div className="flex items-center gap-2">
          <button
            onClick={onResetApp}
            className="text-left font-bold tracking-tight text-white hover:opacity-90"
            title="Return to Home"
          >
            <span className="text-sm sm:text-base font-extrabold">{title}</span>
          </button>
        </div>

        {/* Action icons & language selector */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* User Auth Button */}
          {onOpenAuth && (
            <button
              onClick={onOpenAuth}
              className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold transition ${
                user
                  ? 'bg-emerald-600/90 text-white hover:bg-emerald-500'
                  : 'bg-white/15 text-white hover:bg-white/25 border border-white/20'
              }`}
              title={user ? `Signed in as ${user.displayName || user.email}` : 'Sign In with Firebase'}
            >
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="avatar"
                  className="h-4 w-4 rounded-full object-cover"
                />
              ) : user ? (
                <div className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-800 text-[10px] font-bold">
                  {user.displayName?.charAt(0) || 'U'}
                </div>
              ) : (
                <LogIn className="h-3.5 w-3.5 text-blue-200" />
              )}
              <span className="max-w-[70px] sm:max-w-[85px] truncate text-[11px]">
                {user ? user.displayName?.split(' ')[0] || (user.isAnonymous ? 'Guest' : 'Account') : 'Login'}
              </span>
            </button>
          )}

          {/* Quick Talkback toggle / audio status */}
          <button
            onClick={onToggleSpeech}
            className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full transition-all ${
              isSpeaking
                ? 'bg-emerald-500 text-white animate-pulse'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
            title={isSpeaking ? 'Stop speaking (Barge in)' : 'Listen again'}
            aria-label="Voice audio control"
          >
            {isSpeaking ? <Volume2 className="h-4 w-4" /> : <Volume2 className="h-4 w-4 opacity-80" />}
          </button>

          {/* Language Pill */}
          <button
            onClick={onOpenLanguage}
            className="flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold text-white transition hover:bg-white/25"
            title="Change Language"
          >
            <Globe className="h-3.5 w-3.5" />
            <span className="text-[11px]">{currentLangObj?.nativeName || 'हिन्दी'}</span>
          </button>

          {/* Talkback Menu trigger */}
          <button
            onClick={onOpenTalkBack}
            className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            title="Talk-Back Voice Controls"
            aria-label="Talk-back controls"
          >
            <span className="text-xs font-bold">🎤</span>
          </button>
        </div>
      </div>
    </header>
  );
};

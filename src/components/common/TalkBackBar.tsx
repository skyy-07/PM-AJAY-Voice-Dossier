import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Radio, Sparkles, StopCircle, ChevronUp, ChevronDown } from 'lucide-react';
import { SupportedLanguage } from '../../types.js';
import { audioController } from '../../lib/audio.js';
import { t, getScreenNarration } from '../../lib/translations.js';
import { useTheme } from '../../context/ThemeContext.js';

interface TalkBackBarProps {
  currentView: string;
  selectedLanguage: SupportedLanguage;
}

export const TalkBackBar: React.FC<TalkBackBarProps> = ({
  currentView,
  selectedLanguage
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeText, setActiveText] = useState('');
  const [talkBackEnabled, setTalkBackEnabled] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const unsubscribe = audioController.subscribeTalkBack((status) => {
      setIsSpeaking(status.isSpeaking);
      setActiveText(status.activeText);
    });
    return () => unsubscribe();
  }, []);

  const handleReadCurrentScreen = async () => {
    if (isSpeaking) {
      audioController.stopSpeaking();
    } else {
      const narration = getScreenNarration(currentView, selectedLanguage);
      await audioController.speakText(narration, selectedLanguage);
    }
  };

  const handleToggleTalkBack = () => {
    const next = !talkBackEnabled;
    setTalkBackEnabled(next);
    audioController.setTalkBackEnabled(next);
    if (!next) {
      audioController.stopSpeaking();
    } else {
      audioController.speakText(
        t('talkback.enabled', selectedLanguage),
        selectedLanguage
      );
    }
  };

  if (isCollapsed) {
    return (
      <div className={`border-b px-4 sm:px-6 py-1 transition-colors duration-200 text-xs flex justify-between items-center ${
        isDark ? 'bg-[#090f20] border-amber-500/20 text-white/60' : 'bg-amber-50/40 border-amber-200/50 text-slate-600'
      }`}>
        <div className="flex items-center space-x-2 text-[11px]">
          <Volume2 className="w-3.5 h-3.5 text-amber-500" />
          <span>Voice TalkBack: {talkBackEnabled ? 'Active' : 'Muted'}</span>
          {isSpeaking && <span className="text-amber-400 font-mono text-[10px] animate-pulse">● Speaking</span>}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleReadCurrentScreen}
            className="text-amber-500 hover:text-amber-400 text-[11px] font-medium cursor-pointer"
          >
            {isSpeaking ? 'Stop Audio' : 'Read Screen'}
          </button>
          <button
            onClick={() => setIsCollapsed(false)}
            className="p-1 hover:bg-white/10 rounded cursor-pointer text-amber-500"
            title="Expand Voice Bar"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`border-b px-3 sm:px-6 py-1.5 transition-colors duration-200 shadow-xs ${
      isDark 
        ? 'bg-[#0b1329] border-amber-500/20 text-white' 
        : 'bg-amber-50/60 border-amber-200/60 text-slate-800'
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Left: Indicator & Quick Action for illiterate users */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleReadCurrentScreen}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide transition cursor-pointer shadow-xs ${
              isSpeaking
                ? 'bg-amber-500 text-stone-950 animate-pulse border border-amber-400'
                : isDark
                  ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40'
                  : 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20'
            }`}
            title="Read whole screen aloud"
          >
            {isSpeaking ? (
              <>
                <StopCircle className="w-3.5 h-3.5 text-stone-950" />
                <span>{t('talkback.stop', selectedLanguage)}</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5" />
                <span>{t('talkback.listen_screen', selectedLanguage)}</span>
              </>
            )}
          </button>

          <span className={`hidden sm:inline-flex items-center space-x-1.5 text-[11px] ${
            isDark ? 'text-white/60' : 'text-slate-600'
          }`}>
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>
              {isSpeaking
                ? t('talkback.speaking', selectedLanguage)
                : t('talkback.active', selectedLanguage)}
            </span>
          </span>
        </div>

        {/* Right: Toggle Voice Guide ON/OFF & Collapse */}
        <div className="flex items-center space-x-2 text-xs">
          {isSpeaking && (
            <div className="hidden md:flex items-center space-x-1 px-2.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-500 text-[10px] font-mono animate-pulse">
              <Radio className="w-3 h-3 animate-spin" />
              <span className="truncate max-w-[180px]">
                {activeText.slice(0, 30)}...
              </span>
            </div>
          )}

          <button
            onClick={handleToggleTalkBack}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition cursor-pointer ${
              talkBackEnabled
                ? isDark
                  ? 'bg-white/10 text-amber-400 border-amber-500/30 hover:bg-white/15'
                  : 'bg-white text-amber-700 border-amber-300 hover:bg-amber-50 shadow-xs'
                : isDark
                  ? 'bg-white/5 text-white/40 border-white/10 hover:text-white/70'
                  : 'bg-slate-100 text-slate-400 border-slate-200 hover:text-slate-700'
            }`}
          >
            {talkBackEnabled ? (
              <>
                <Volume2 className="w-3 h-3 text-amber-500" />
                <span className="hidden xs:inline">{t('talkback.enabled', selectedLanguage)}</span>
                <span className="xs:hidden">Voice ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3 h-3 opacity-50" />
                <span className="hidden xs:inline">{t('talkback.disabled', selectedLanguage)}</span>
                <span className="xs:hidden">Voice OFF</span>
              </>
            )}
          </button>

          <button
            onClick={() => setIsCollapsed(true)}
            className={`p-1 rounded-md border transition cursor-pointer opacity-60 hover:opacity-100 ${
              isDark ? 'border-white/10 text-white/60 hover:bg-white/5' : 'border-slate-200 text-slate-500 hover:bg-slate-100'
            }`}
            title="Minimize accessibility banner"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};


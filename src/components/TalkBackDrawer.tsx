import React from 'react';
import { X, Volume2, HelpCircle, Mic, Check, RotateCcw, Gauge, Square, CornerDownLeft } from 'lucide-react';
import { SupportedLanguage, TalkBackAction } from '../types';
import { getLocale } from '../locales/i18n';

interface TalkBackDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  language: SupportedLanguage;
  onAction: (action: TalkBackAction) => void;
  isListening: boolean;
  isSpeaking: boolean;
  isSlower: boolean;
}

export const TalkBackDrawer: React.FC<TalkBackDrawerProps> = ({
  isOpen,
  onClose,
  language,
  onAction,
  isListening,
  isSpeaking,
  isSlower,
}) => {
  if (!isOpen) return null;

  const locale = getLocale(language);
  const { actions } = locale;

  const handleActionClick = (action: TalkBackAction) => {
    onAction(action);
    if (action !== 'slower' && action !== 'speak') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-3xl bg-[#FBFBFA] shadow-2xl border border-stone-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 bg-white px-5 py-4">
          <div>
            <h2 className="text-xl font-bold text-stone-900">{locale.talkBackHeader}</h2>
            <p className="text-xs text-stone-500">{locale.talkBackSubtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-100 text-stone-600 hover:bg-stone-200"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Live Listening Banner */}
        <div className="bg-emerald-50 px-4 py-2 border-b border-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-800">
            <span className="flex h-2.5 w-2.5 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 ${isListening ? 'block' : 'hidden'}`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isListening ? 'bg-emerald-600' : 'bg-stone-400'}`}></span>
            </span>
            <span>{isListening ? locale.listeningState : 'Spoken command recognition ready'}</span>
          </div>
          {isSlower && (
            <span className="text-[11px] font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
              Slower (0.75x)
            </span>
          )}
        </div>

        {/* Controls List matching PDF Page 4 layout */}
        <div className="flex-1 space-y-2.5 overflow-y-auto p-4">
          {/* Hear again */}
          <button
            onClick={() => handleActionClick('hear_again')}
            className="flex w-full items-center justify-between rounded-2xl border border-stone-200 bg-white p-3.5 text-left transition hover:bg-stone-50 active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <Volume2 className="h-5 w-5" />
              </div>
              <div>
                <div className="font-bold text-stone-900">{actions.hearAgain.title}</div>
                <div className="text-xs text-stone-500">{actions.hearAgain.desc}</div>
              </div>
            </div>
          </button>

          {/* Repeat question */}
          <button
            onClick={() => handleActionClick('repeat_question')}
            className="flex w-full items-center justify-between rounded-2xl border border-stone-200 bg-white p-3.5 text-left transition hover:bg-stone-50 active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                <HelpCircle className="h-5 w-5" />
              </div>
              <div>
                <div className="font-bold text-stone-900">{actions.repeatQuestion.title}</div>
                <div className="text-xs text-stone-500">{actions.repeatQuestion.desc}</div>
              </div>
            </div>
          </button>

          {/* Speak (Primary Highlighted Card) */}
          <button
            onClick={() => handleActionClick('speak')}
            className="flex w-full items-center justify-between rounded-2xl bg-[#172554] p-4 text-left text-white shadow-md transition hover:bg-[#1E3A8A] active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 text-white">
                <Mic className={`h-6 w-6 ${isListening ? 'animate-bounce text-emerald-400' : ''}`} />
              </div>
              <div>
                <div className="text-base font-extrabold">{actions.speak.title}</div>
                <div className="text-xs text-blue-200">{actions.speak.desc}</div>
              </div>
            </div>
            {isListening && (
              <span className="rounded-full bg-emerald-500 px-2.5 py-1 text-xs font-bold text-white animate-pulse">
                Active
              </span>
            )}
          </button>

          {/* Yes & No Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => handleActionClick('yes')}
              className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-3 text-left transition hover:bg-stone-50 active:scale-[0.99]"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                <Check className="h-5 w-5" />
              </div>
              <div>
                <div className="font-bold text-stone-900">{actions.yes.title}</div>
                <div className="text-[11px] text-stone-500">{actions.yes.desc}</div>
              </div>
            </button>

            <button
              onClick={() => handleActionClick('no')}
              className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-3 text-left transition hover:bg-stone-50 active:scale-[0.99]"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 text-rose-700">
                <X className="h-5 w-5" />
              </div>
              <div>
                <div className="font-bold text-stone-900">{actions.no.title}</div>
                <div className="text-[11px] text-stone-500">{actions.no.desc}</div>
              </div>
            </button>
          </div>

          {/* Go back */}
          <button
            onClick={() => handleActionClick('go_back')}
            className="flex w-full items-center justify-between rounded-2xl border border-stone-200 bg-white p-3.5 text-left transition hover:bg-stone-50 active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <CornerDownLeft className="h-5 w-5" />
              </div>
              <div>
                <div className="font-bold text-stone-900">{actions.goBack.title}</div>
                <div className="text-xs text-stone-500">{actions.goBack.desc}</div>
              </div>
            </div>
          </button>

          {/* Slower & Stop Listening Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => handleActionClick('slower')}
              className={`flex items-center gap-2.5 rounded-2xl border p-3 text-left transition active:scale-[0.99] ${
                isSlower
                  ? 'border-amber-400 bg-amber-50 text-amber-900'
                  : 'border-stone-200 bg-white text-stone-900 hover:bg-stone-50'
              }`}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
                <Gauge className="h-5 w-5" />
              </div>
              <div>
                <div className="font-bold">{actions.slower.title}</div>
                <div className="text-[10px] opacity-75">{isSlower ? '0.75x Active' : actions.slower.desc}</div>
              </div>
            </button>

            <button
              onClick={() => handleActionClick('stop_listening')}
              className="flex items-center gap-2.5 rounded-2xl border border-rose-200 bg-rose-50/50 p-3 text-left text-rose-900 transition hover:bg-rose-100 active:scale-[0.99]"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-100 text-rose-700">
                <Square className="h-4 w-4 fill-rose-700" />
              </div>
              <div>
                <div className="font-bold text-rose-700">{actions.stopListening.title}</div>
                <div className="text-[10px] text-rose-600">{actions.stopListening.desc}</div>
              </div>
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="border-t border-stone-200 bg-stone-50 p-3.5 text-center text-xs text-stone-600">
          <p className="font-medium">{locale.recommendedControlsNote}</p>
        </div>
      </div>
    </div>
  );
};

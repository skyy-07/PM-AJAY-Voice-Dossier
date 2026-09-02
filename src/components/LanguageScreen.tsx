import React, { useState, useRef } from 'react';
import { Check, Info, Volume2, Sparkles, Mic, Loader2, Radio } from 'lucide-react';
import { LanguageDetectionResult, SupportedLanguage } from '../types';
import { SUPPORTED_LANGUAGES, getLocale } from '../locales/i18n';

interface LanguageScreenProps {
  selectedLanguage: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
  onContinue: () => void;
  onSpeakNarration: () => void;
  isSpeaking: boolean;
}

export const LanguageScreen: React.FC<LanguageScreenProps> = ({
  selectedLanguage,
  onSelectLanguage,
  onContinue,
  onSpeakNarration,
  isSpeaking,
}) => {
  const locale = getLocale(selectedLanguage);

  // Auto-detect states
  const [isDetecting, setIsDetecting] = useState(false);
  const [autoDetectedInfo, setAutoDetectedInfo] = useState<LanguageDetectionResult | null>(null);
  const [autoDetectMode, setAutoDetectMode] = useState(false);
  const [detectionError, setDetectionError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  // Quick speech-based language detection handler
  const handleStartAutoDetect = async () => {
    setDetectionError(null);
    setIsDetecting(true);
    setAutoDetectMode(true);

    if (typeof window === 'undefined') return;
    const win = window as any;
    const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      // Fallback: prompt sample utterance or direct API check
      setDetectionError('Voice recognition not supported in this browser. Please select below.');
      setIsDetecting(false);
      return;
    }

    try {
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = false;
      recognition.interimResults = false;
      // Default to general Indian multilingual or Hindi recognizer for initial phonetic capture
      recognition.lang = 'hi-IN';

      recognition.onresult = async (event: any) => {
        const spokenText = event.results[0][0]?.transcript || '';
        if (spokenText.trim()) {
          try {
            const res = await fetch('/api/language/detect', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ text: spokenText }),
            });
            const result: LanguageDetectionResult = await res.json();
            setAutoDetectedInfo(result);
            onSelectLanguage(result.detectedLanguage);
          } catch (e) {
            console.error('Detection API error:', e);
          }
        }
        setIsDetecting(false);
      };

      recognition.onerror = (e: any) => {
        console.warn('Auto-detect speech error:', e);
        setIsDetecting(false);
      };

      recognition.onend = () => {
        setIsDetecting(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn('Failed to start speech recognition for detection:', err);
      setIsDetecting(false);
    }
  };

  const handleTestPreset = async (presetText: string) => {
    setIsDetecting(true);
    setDetectionError(null);
    try {
      const res = await fetch('/api/language/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: presetText }),
      });
      const result: LanguageDetectionResult = await res.json();
      setAutoDetectedInfo(result);
      onSelectLanguage(result.detectedLanguage);
    } catch (e) {
      console.error('Preset detection error:', e);
    } finally {
      setIsDetecting(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col justify-between px-5 py-6 sm:py-8">
      {/* Top Header & Subtitle */}
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <h1 className="text-3xl font-extrabold tracking-tight text-[#172554] sm:text-4xl">
            {locale.whichLanguageTitle}
          </h1>
          <button
            onClick={onSpeakNarration}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition ${
              isSpeaking
                ? 'border-emerald-500 bg-emerald-50 text-emerald-700 animate-pulse'
                : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
            }`}
            title="Listen to page"
            aria-label="Narrate page"
          >
            <Volume2 className="h-5 w-5" />
          </button>
        </div>
        <p className="text-base font-normal leading-relaxed text-stone-600">
          {locale.whichLanguageSubtitle}
        </p>
      </div>

      {/* Auto-Detect Language Hero Feature Card */}
      <div className="mt-4 rounded-2xl border-2 border-dashed border-[#166534]/50 bg-emerald-50/40 p-4 transition">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#166534] text-white shadow-xs">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <span>{locale.autoDetectTitle || 'Auto-Detect Spoken Language'}</span>
                {autoDetectedInfo && (
                  <span className="rounded-full bg-[#166534] px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                    {Math.round((autoDetectedInfo.confidence || 0.95) * 100)}% Match
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-600 mt-0.5">
                {locale.autoDetectSubtitle || 'Speak in your mother tongue; we will automatically identify your language.'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Button for Voice Detection */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            onClick={handleStartAutoDetect}
            disabled={isDetecting}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition shadow-xs ${
              isDetecting
                ? 'bg-amber-500 text-white animate-pulse'
                : 'bg-[#166534] text-white hover:bg-[#14532d] active:scale-95'
            }`}
          >
            {isDetecting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{locale.detectingLanguage || 'Listening & detecting language...'}</span>
              </>
            ) : (
              <>
                <Mic className="h-4 w-4" />
                <span>{locale.speakToDetectBtn || 'Speak to Auto-Detect'}</span>
              </>
            )}
          </button>

          {/* Quick Clickable Audio Samples for One-Tap Auto Detection */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-medium text-stone-500 mr-1">Or test phrases:</span>
            <button
              onClick={() => handleTestPreset('আমি সেলাই ও মোটর কাজ শিখতে চাই')}
              className="rounded-lg border border-emerald-200 bg-white px-2 py-1 text-[11px] font-medium text-emerald-800 hover:bg-emerald-50"
            >
              বাংলা (Bengali)
            </button>
            <button
              onClick={() => handleTestPreset('मला गावात स्वतःचे दुकान किंवा गॅरेज सुरू करायचे आहे')}
              className="rounded-lg border border-emerald-200 bg-white px-2 py-1 text-[11px] font-medium text-emerald-800 hover:bg-emerald-50"
            >
              मराठी (Marathi)
            </button>
            <button
              onClick={() => handleTestPreset('நான் சுயதொழில் பயிற்சி பெற விரும்புகிறேன்')}
              className="rounded-lg border border-emerald-200 bg-white px-2 py-1 text-[11px] font-medium text-emerald-800 hover:bg-emerald-50"
            >
              தமிழ் (Tamil)
            </button>
            <button
              onClick={() => handleTestPreset('मुझे बिजली वायरिंग और मोटर रिपेयरिंग का काम सीखना है')}
              className="rounded-lg border border-emerald-200 bg-white px-2 py-1 text-[11px] font-medium text-emerald-800 hover:bg-emerald-50"
            >
              हिन्दी (Hindi)
            </button>
          </div>
        </div>

        {autoDetectedInfo && (
          <div className="mt-2.5 flex items-center gap-2 rounded-lg bg-emerald-100/70 px-3 py-1.5 text-xs font-semibold text-emerald-900">
            <Check className="h-4 w-4 shrink-0 text-emerald-700" />
            <span>
              Detected: {autoDetectedInfo.nativeName} ({autoDetectedInfo.languageName})
              {autoDetectedInfo.sampleText ? ` — "${autoDetectedInfo.sampleText}"` : ''}
            </span>
          </div>
        )}

        {detectionError && (
          <div className="mt-2 text-xs text-amber-700">{detectionError}</div>
        )}
      </div>

      {/* Language Cards List matching PDF Page 2 */}
      <div className="my-5 space-y-2.5">
        {SUPPORTED_LANGUAGES.map((lang) => {
          const isSelected = selectedLanguage === lang.code;
          return (
            <button
              key={lang.code}
              onClick={() => {
                setAutoDetectedInfo(null);
                onSelectLanguage(lang.code);
              }}
              className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition-all ${
                isSelected
                  ? 'border-2 border-[#166534] bg-emerald-50/40 shadow-xs'
                  : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-stone-900">
                    {lang.nativeName}
                  </span>
                  <span className="text-xs text-stone-500">
                    {lang.name}
                  </span>
                </div>
              </div>

              {isSelected ? (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#166534] text-white">
                  <Check className="h-4 w-4" />
                </div>
              ) : (
                <div className="h-6 w-6 rounded-full border border-stone-300" />
              )}
            </button>
          );
        })}
      </div>

      {/* Action Button, Caption & Tip Box */}
      <div className="space-y-4">
        <button
          onClick={onContinue}
          className="flex h-14 w-full items-center justify-center rounded-2xl bg-[#172554] text-base font-bold text-white shadow-md transition hover:bg-[#1e3a8a] active:scale-[0.99]"
        >
          {locale.continueBtn}
        </button>

        <p className="text-center text-xs text-stone-500 font-medium">
          {locale.changeLanguageLater}
        </p>

        {/* Tip Box matching PDF Page 2 */}
        <div className="rounded-2xl border border-stone-200 bg-white p-4 text-left shadow-2xs">
          <div className="flex items-start gap-2.5">
            <Info className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-stone-900">Tip</div>
              <div className="text-xs text-stone-600 mt-0.5">
                {locale.speakNormallyTip}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

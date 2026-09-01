import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  PhoneCall, 
  Volume2, 
  Check, 
  ChevronRight, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  RotateCcw, 
  VolumeX, 
  AlertCircle,
  HelpCircle,
  Sparkles,
  Smartphone
} from 'lucide-react';
import { audioController } from '../../lib/audio.js';
import { SupportedLanguage } from '../../types.js';
import { AudioFrequencyVisualizer } from '../common/AudioFrequencyVisualizer.js';
import { userPreferences } from '../../lib/userPreferences.js';

export type MobileScreen = 
  | 'home'
  | 'language'
  | 'interview'
  | 'voice_controls'
  | 'recommendations'
  | 'training_center'
  | 'progress';

interface MobileAppExperienceProps {
  initialScreen?: MobileScreen;
  onExit?: () => void;
}

export const MobileAppExperience: React.FC<MobileAppExperienceProps> = ({
  initialScreen = 'home',
  onExit
}) => {
  const [currentScreen, setCurrentScreen] = useState<MobileScreen>(initialScreen);
  const [selectedLang, setSelectedLang] = useState<'hi' | 'bn' | 'mr' | 'ta' | 'te' | 'en'>(() => {
    const saved = userPreferences.getLanguage();
    if (['hi', 'bn', 'mr', 'ta', 'te', 'en'].includes(saved)) {
      return saved as any;
    }
    return 'hi';
  });
  const [isListening, setIsListening] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [interviewStep, setInterviewStep] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState<number>(0.92);
  const [statusNotice, setStatusNotice] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<'electrician' | 'tailor'>('electrician');
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [phoneFrameMode, setPhoneFrameMode] = useState<boolean>(false);

  // Subscribe to TalkBack voice state
  useEffect(() => {
    const unsub = audioController.subscribeTalkBack((status) => {
      setIsSpeaking(status.isSpeaking);
    });
    return () => unsub();
  }, []);

  // Voice utterance helper with Indian language localization
  const speakText = async (text: string, langCode: string = selectedLang) => {
    try {
      setIsSpeaking(true);
      await audioController.speakText(text, langCode);
    } catch {
      // ignore
    } finally {
      setIsSpeaking(false);
    }
  };

  // Toggle voice recognition
  const toggleListening = async () => {
    if (isListening) {
      audioController.stopSpeechRecognition();
      await audioController.stopRecording();
      setIsListening(false);
      setStatusNotice('Recording finished');
      if (currentScreen === 'home') {
        setCurrentScreen('language');
      } else if (currentScreen === 'interview') {
        if (interviewStep < 5) {
          setInterviewStep(prev => prev + 1);
        } else {
          setCurrentScreen('recommendations');
        }
      }
    } else {
      audioController.stopSpeaking();
      audioController.playChime('start');
      setLiveTranscript('');
      setIsListening(true);
      setStatusNotice('Listening...');
      
      const started = await audioController.startRecording();
      audioController.startSpeechRecognition(
        selectedLang,
        (interimText) => {
          setLiveTranscript(interimText);
        },
        (finalText) => {
          setLiveTranscript(finalText);
        },
        (error) => {
          console.warn('Speech recognition notice:', error);
        }
      );
    }
  };

  // Questions for Step 1/5
  const interviewQuestions = [
    {
      step: 1,
      title: "Tell me about your work.",
      subtitle: "For example: farming, stitching, driving, repairing, selling, or any other skill.",
      reassurance: "You can answer in your own words.",
      examples: [
        "What work do you do now?",
        "What have you learned by doing?",
        "How far can you travel for training?"
      ],
      ttsText: "Tell me about your work. For example: farming, stitching, driving, repairing, selling, or any other skill."
    },
    {
      step: 2,
      title: "How many years of experience do you have?",
      subtitle: "Tell us about how long you have been practicing your trade or daily work.",
      reassurance: "Informal or family experience also counts.",
      examples: [
        "Did you learn from family or a master craftsman?",
        "Do you own basic tools or equipment?",
        "Have you done repairs for neighbors or clients?"
      ],
      ttsText: "How many years of experience do you have in this craft or work?"
    },
    {
      step: 3,
      title: "What are your preferred working hours and travel limits?",
      subtitle: "How far can you commute to a nearby PM-AJAY training center or workplace?",
      reassurance: "We will prioritize centers within your block.",
      examples: [
        "Can you travel up to 5 to 10 kilometers?",
        "Do you prefer morning, afternoon, or evening batches?",
        "Do you have access to a bicycle or local bus?"
      ],
      ttsText: "What are your preferred working hours and travel limits for training?"
    },
    {
      step: 4,
      title: "What income or livelihood goals do you want to achieve?",
      subtitle: "Tell us if you want wage employment or to start your own micro-enterprise.",
      reassurance: "PM-AJAY provides financial toolkits and stipend support.",
      examples: [
        "Do you want a certificate to apply for company jobs?",
        "Do you want a subsidized loan toolkit for your shop?",
        "Are you looking for supplementary household income?"
      ],
      ttsText: "What income or livelihood goals do you want to achieve with this certificate?"
    },
    {
      step: 5,
      title: "Confirming your profile summary.",
      subtitle: "We have mapped your skills to NSQF Level 4 and Level 3 opportunities.",
      reassurance: "Your details are ready for district center matching.",
      examples: [
        "Verified hands-on trade skills",
        "District center matching in progress",
        "Free PM-AJAY certification aligned"
      ],
      ttsText: "Thank you. Your details are captured. Let's see your recommended skill courses."
    }
  ];

  const currentQ = interviewQuestions[interviewStep - 1] || interviewQuestions[0];

  const languageOptions = [
    { code: 'hi', native: 'हिन्दी', label: 'Hindi', voiceGreeting: 'नमस्ते! आप अपनी भाषा में बेझिझक बोल सकते हैं।' },
    { code: 'bn', native: 'বাংলা', label: 'Bengali', voiceGreeting: 'নমস্কার! আপনি আপনার মাতৃভাষায় কথা বলতে পারেন।' },
    { code: 'mr', native: 'मराठी', label: 'Marathi', voiceGreeting: 'नमस्कार! तुम्ही तुमच्या भाषेत बोलू शकता.' },
    { code: 'ta', native: 'தமிழ்', label: 'Tamil', voiceGreeting: 'வணக்கம்! உங்கள் சொந்த மொழியில் பேசலாம்.' },
    { code: 'te', native: 'తెలుగు', label: 'Telugu', voiceGreeting: 'నమస్కారం! మీరు మీ స్వంత భాషలో మాట్లాడవచ్చు.' },
    { code: 'en', native: 'English', label: 'English', voiceGreeting: 'Hello! You can speak freely in your language.' }
  ];

  return (
    <div className="w-full bg-[#e9ebe3] min-h-screen py-4 sm:py-8 px-2 sm:px-4 flex flex-col items-center justify-start font-sans">
      
      {/* Top Screen Selector Bar for Fast Switching & Demonstration */}
      <div className="w-full max-w-md mb-4 bg-white rounded-2xl p-2.5 shadow-sm border border-slate-200 flex flex-col gap-2">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center space-x-1.5">
            <Smartphone className="w-4 h-4 text-[#1b2a4a]" />
            <span className="text-xs font-bold text-[#1b2a4a] uppercase tracking-wider">Mobile UX Flow (7 Screens)</span>
          </div>
          {onExit && (
            <button 
              onClick={onExit}
              className="text-[11px] text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
            >
              Exit Mobile View
            </button>
          )}
        </div>

        {/* 7 Screen Nav Tabs */}
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-1 text-center">
          {[
            { id: 'home', label: '1. Home' },
            { id: 'language', label: '2. Lang' },
            { id: 'interview', label: '3. Voice' },
            { id: 'voice_controls', label: '4. Controls' },
            { id: 'recommendations', label: '5. Match' },
            { id: 'training_center', label: '6. Center' },
            { id: 'progress', label: '7. Progress' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                audioController.stopSpeaking();
                setCurrentScreen(item.id as MobileScreen);
              }}
              className={`py-1 px-1.5 rounded-lg text-[10px] font-semibold transition cursor-pointer ${
                currentScreen === item.id 
                  ? 'bg-[#1b2a4a] text-white shadow-xs' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Authentically Styled Mobile Container matching the exact PDF layout */}
      <div className="w-full max-w-[390px] bg-[#f6f7f2] rounded-[32px] overflow-hidden shadow-2xl border-4 border-slate-800/20 flex flex-col min-h-[780px] relative">
        
        {/* ========================================================================= */}
        {/* PAGE 1: HOME SCREEN (PDF Page 1)                                          */}
        {/* ========================================================================= */}
        {currentScreen === 'home' && (
          <div className="flex-1 flex flex-col justify-between">
            {/* Dark Navy Header */}
            <div className="bg-[#1b2a4a] text-white px-6 pt-5 pb-4">
              <h1 className="text-base font-bold tracking-tight">PM-AJAY Voice Assistant</h1>
            </div>

            {/* Content Area */}
            <div className="px-6 py-6 flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-[28px] leading-[34px] font-extrabold text-[#1b2a4a] tracking-tight">
                  Find the right skill<br />for your future.
                </h2>
                <p className="text-[#64748b] text-[15px] leading-relaxed mt-2.5 font-normal">
                  No forms. No complicated apps.<br />Just talk in your language.
                </p>

                {/* Central White Mic Card */}
                <div 
                  onClick={toggleListening}
                  className="mt-8 bg-white rounded-2xl p-7 flex flex-col items-center justify-center shadow-xs border border-slate-200/70 cursor-pointer hover:border-emerald-300 transition group"
                >
                  <div className={`w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isListening 
                      ? 'bg-[#d2f4e3] ring-8 ring-[#e6f9f0] scale-105' 
                      : 'bg-[#e2f0e8] group-hover:scale-105'
                  }`}>
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center transition ${
                      isListening ? 'bg-[#15803d] animate-pulse' : 'bg-[#1e7e4e]'
                    }`}>
                      <Mic className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div className="mt-5 text-[#1b2a4a] font-bold text-lg">
                    {isListening ? 'Listening...' : 'Tap to speak'}
                  </div>
                  {liveTranscript && (
                    <div className="mt-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full text-center max-w-[240px] truncate">
                      "{liveTranscript}"
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-6">
                <button
                  onClick={() => {
                    audioController.playChime('start');
                    setCurrentScreen('language');
                  }}
                  className="w-full bg-[#1b2a4a] hover:bg-[#15223c] text-white py-4 rounded-xl font-bold text-[15px] shadow-sm transition cursor-pointer text-center"
                >
                  Start with voice
                </button>

                <button
                  onClick={() => {
                    audioController.speakText('PM-AJAY IVR Helpline: Call 1800-11-2026 for voice assistance in 12 regional languages.', selectedLang);
                  }}
                  className="w-full bg-white hover:bg-slate-50 text-[#1b2a4a] border border-slate-300/80 py-4 rounded-xl font-semibold text-[15px] transition cursor-pointer text-center"
                >
                  Call IVR / Send voice note
                </button>

                {/* Footnotes */}
                <div className="pt-5 text-center space-y-1.5 pb-2">
                  <div className="text-[#3b5e4a] text-xs font-semibold">
                    Works without internet
                  </div>
                  <div className="text-[#64748b] text-xs">
                    Designed for low-literacy access
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PAGE 2: LANGUAGE SELECTION (PDF Page 2)                                   */}
        {/* ========================================================================= */}
        {currentScreen === 'language' && (
          <div className="flex-1 flex flex-col justify-between">
            {/* Header */}
            <div className="bg-[#1b2a4a] text-white px-6 pt-5 pb-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setCurrentScreen('home')}
                  className="text-white/80 hover:text-white cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <h1 className="text-base font-bold tracking-tight">Choose your language</h1>
              </div>
              <button 
                onClick={() => speakText("Please select your preferred language to speak with the assistant.")}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-[26px] leading-[32px] font-extrabold text-[#1b2a4a] tracking-tight">
                  Which language should I use?
                </h2>
                <p className="text-[#64748b] text-[14px] leading-relaxed mt-2 font-normal">
                  You can speak naturally in your regional language or dialect.
                </p>

                {/* Language Cards */}
                <div className="mt-5 space-y-2.5">
                  {languageOptions.map((lang) => {
                    const isSelected = selectedLang === lang.code;
                    return (
                      <div
                        key={lang.code}
                        onClick={() => {
                          setSelectedLang(lang.code as any);
                          userPreferences.setLanguage(lang.code as any);
                          speakText(lang.voiceGreeting, lang.code);
                        }}
                        className={`px-5 py-3.5 rounded-xl border flex items-center justify-between transition cursor-pointer ${
                          isSelected
                            ? 'bg-[#f4faf6] border-[#1e7e4e] shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="text-[17px] font-bold text-[#1b2a4a]">
                          {lang.native}
                        </div>
                        <div className="text-[14px] text-[#64748b] font-medium">
                          {lang.label}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Section */}
              <div className="pt-4 space-y-3 pb-2">
                <button
                  onClick={() => {
                    audioController.playChime('start');
                    setCurrentScreen('interview');
                  }}
                  className="w-full bg-[#1b2a4a] hover:bg-[#15223c] text-white py-4 rounded-xl font-bold text-[15px] shadow-sm transition cursor-pointer text-center"
                >
                  Continue
                </button>

                <div className="text-center text-[#64748b] text-xs">
                  Language can be changed later.
                </div>

                {/* Tip Card */}
                <div className="bg-white rounded-xl p-3.5 border border-slate-200 text-left">
                  <div className="text-xs font-bold text-[#b91c1c] uppercase tracking-wider">
                    Tip
                  </div>
                  <div className="text-xs text-[#334155] mt-0.5 leading-relaxed font-normal">
                    Speak normally, you do not need to read or type.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PAGE 3: VOICE INTERVIEW (PDF Page 3)                                      */}
        {/* ========================================================================= */}
        {currentScreen === 'interview' && (
          <div className="flex-1 flex flex-col justify-between">
            {/* Header */}
            <div className="bg-[#1b2a4a] text-white px-6 pt-5 pb-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setCurrentScreen('language')}
                  className="text-white/80 hover:text-white cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <h1 className="text-base font-bold tracking-tight">Voice interview</h1>
              </div>
              <div className="text-sm font-bold text-white/90">
                {interviewStep} / 5
              </div>
            </div>

            {/* Green Progress Bar */}
            <div className="w-full bg-slate-200 h-1.5">
              <div 
                className="bg-[#1e7e4e] h-1.5 transition-all duration-300"
                style={{ width: `${(interviewStep / 5) * 100}%` }}
              />
            </div>

            {/* Body */}
            <div className="px-6 py-4 flex-1 flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="flex items-start justify-between">
                  <h2 className="text-[24px] leading-[30px] font-extrabold text-[#1b2a4a] tracking-tight flex-1">
                    {currentQ.title}
                  </h2>
                  <button 
                    onClick={() => speakText(currentQ.ttsText)}
                    className="p-1.5 text-[#1b2a4a]/70 hover:text-[#1b2a4a] rounded-lg bg-slate-100 cursor-pointer ml-2"
                    title="Listen aloud"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-[#64748b] text-[13px] leading-relaxed mt-1.5">
                  {currentQ.subtitle}
                </p>

                {/* Central Listening / Speaking Mic Box */}
                <div 
                  onClick={toggleListening}
                  className="mt-4 bg-white rounded-2xl p-6 flex flex-col items-center justify-center shadow-xs border border-slate-200 cursor-pointer group"
                >
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                    isListening ? 'bg-[#d2f4e3] ring-6 ring-[#e6f9f0]' : 'bg-[#e2f0e8]'
                  }`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isListening ? 'bg-[#15803d] animate-pulse' : 'bg-[#1e7e4e]'
                    }`}>
                      <Mic className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  <div className="mt-3 text-[#1b2a4a] font-bold text-base">
                    {isListening ? 'Listening…' : 'Tap to speak'}
                  </div>
                  <div className="text-xs text-[#64748b] mt-0.5">
                    {isListening ? 'Speak for as long as you need.' : 'Speak for as long as you need.'}
                  </div>

                  {liveTranscript && (
                    <div className="mt-2 text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 text-center w-full">
                      "{liveTranscript}"
                    </div>
                  )}

                  {/* Real-time Frequency Spectrum Visualizer */}
                  <div className="w-full mt-3">
                    <AudioFrequencyVisualizer
                      isActive={isListening}
                      isProcessing={false}
                      theme="emerald"
                      height={56}
                      barCount={28}
                      showFrequencies={true}
                      showDecibels={true}
                      label="Live Mic"
                    />
                  </div>
                </div>

                {/* Reassurance Badge */}
                <div className="mt-3 bg-[#fbebe8] text-[#8c3b32] text-xs font-semibold py-2 px-3 rounded-lg text-center">
                  {currentQ.reassurance}
                </div>

                {/* Examples Section */}
                <div className="mt-4 bg-white/70 rounded-xl p-3.5 border border-slate-200/80">
                  <div className="text-xs font-bold text-[#1b2a4a] mb-2">
                    Examples of what I may ask
                  </div>
                  <ul className="space-y-1.5 text-xs text-[#475569]">
                    {currentQ.examples.map((ex, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-[#1b2a4a] font-bold">•</span>
                        <span>{ex}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Buttons */}
              <div className="pt-3 space-y-2 pb-1">
                {isListening ? (
                  <button
                    onClick={toggleListening}
                    className="w-full bg-[#15803d] hover:bg-[#166534] text-white py-3.5 rounded-xl font-bold text-[14px] shadow-sm transition cursor-pointer text-center"
                  >
                    Done speaking (Next)
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        speakText(currentQ.ttsText);
                      }}
                      className="w-full bg-white hover:bg-slate-50 text-[#1b2a4a] border border-slate-300 py-3 rounded-xl font-semibold text-xs transition cursor-pointer text-center"
                    >
                      Repeat question
                    </button>
                    <button
                      onClick={() => {
                        if (interviewStep < 5) {
                          setInterviewStep(prev => prev + 1);
                        } else {
                          setCurrentScreen('recommendations');
                        }
                      }}
                      className="w-full bg-[#1b2a4a] text-white py-3 rounded-xl font-semibold text-xs transition cursor-pointer text-center"
                    >
                      {interviewStep < 5 ? 'Next question →' : 'See results →'}
                    </button>
                  </div>
                )}

                <button
                  onClick={() => setCurrentScreen('voice_controls')}
                  className="w-full text-center text-xs text-[#1e7e4e] font-semibold hover:underline py-1 cursor-pointer"
                >
                  View Voice & Talk-back Controls Guide →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PAGE 4: TALK-BACK / VOICE CONTROLS (PDF Page 4)                            */}
        {/* ========================================================================= */}
        {currentScreen === 'voice_controls' && (
          <div className="flex-1 flex flex-col justify-between">
            {/* Header */}
            <div className="bg-[#1b2a4a] text-white px-6 pt-5 pb-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setCurrentScreen('interview')}
                  className="text-white/80 hover:text-white cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <h1 className="text-base font-bold tracking-tight">Talk-back / Voice controls</h1>
              </div>
              <button 
                onClick={() => speakText("You can control everything by voice with these short commands.")}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-4 flex-1 flex flex-col justify-between overflow-y-auto">
              <div>
                <p className="text-[#64748b] text-[13px] leading-relaxed">
                  Use short, clear actions. Keep the main action large.
                </p>

                {/* Voice Control Buttons List */}
                <div className="mt-3.5 space-y-2">
                  {[
                    { 
                      action: 'Hear again', 
                      desc: 'Repeat the last spoken answer', 
                      primary: false,
                      color: 'text-[#1b2a4a]',
                      onClick: () => speakText("Repeating your previous response.")
                    },
                    { 
                      action: 'Repeat question', 
                      desc: 'Ask the assistant to repeat', 
                      primary: false,
                      color: 'text-[#1b2a4a]',
                      onClick: () => speakText(currentQ.ttsText)
                    },
                    { 
                      action: 'Speak', 
                      desc: 'Start your voice response', 
                      primary: true, 
                      color: 'text-white',
                      onClick: () => {
                        setCurrentScreen('interview');
                        toggleListening();
                      }
                    },
                    { 
                      action: 'Yes', 
                      desc: 'Confirm / continue', 
                      primary: false,
                      color: 'text-[#1e7e4e]',
                      onClick: () => {
                        audioController.playChime('success');
                        setCurrentScreen('recommendations');
                      }
                    },
                    { 
                      action: 'No', 
                      desc: 'Decline / choose another option', 
                      primary: false,
                      color: 'text-[#334155]',
                      onClick: () => speakText("Option declined. Let us try another.")
                    },
                    { 
                      action: 'Go back', 
                      desc: 'Return to the previous step', 
                      primary: false,
                      color: 'text-[#1b2a4a]',
                      onClick: () => setCurrentScreen('interview')
                    },
                    { 
                      action: 'Slower', 
                      desc: 'Speak more slowly', 
                      primary: false,
                      color: 'text-[#1b2a4a]',
                      onClick: () => {
                        setAudioSpeed(0.80);
                        speakText("I will now speak more slowly and clearly.");
                      }
                    },
                    { 
                      action: 'Stop listening', 
                      desc: 'End voice capture', 
                      primary: false,
                      color: 'text-[#b91c1c]',
                      onClick: () => {
                        audioController.stopSpeechRecognition();
                        audioController.stopSpeaking();
                        setIsListening(false);
                      }
                    }
                  ].map((btn, idx) => (
                    <div
                      key={idx}
                      onClick={btn.onClick}
                      className={`px-4 py-3 rounded-xl border flex items-center justify-between transition cursor-pointer ${
                        btn.primary 
                          ? 'bg-[#1b2a4a] border-[#1b2a4a] text-white shadow-xs' 
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className={`font-bold text-[15px] ${btn.color}`}>
                        {btn.action}
                      </div>
                      <div className={`text-xs ${btn.primary ? 'text-white/80' : 'text-[#64748b]'}`}>
                        {btn.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Recommended note */}
              <div className="pt-3 pb-2">
                <div className="text-xs text-[#334155] font-semibold mb-1">
                  Recommended for interview screens:
                </div>
                <div className="text-xs text-[#64748b]">
                  Hear again &bull; Repeat question &bull; Speak &bull; Go back
                </div>

                <button
                  onClick={() => setCurrentScreen('interview')}
                  className="mt-3 w-full bg-[#1b2a4a] text-white py-3.5 rounded-xl font-bold text-xs shadow-sm cursor-pointer text-center"
                >
                  Return to Interview
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PAGE 5: RECOMMENDATIONS (PDF Page 5)                                      */}
        {/* ========================================================================= */}
        {currentScreen === 'recommendations' && (
          <div className="flex-1 flex flex-col justify-between">
            {/* Header */}
            <div className="bg-[#1b2a4a] text-white px-6 pt-5 pb-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setCurrentScreen('interview')}
                  className="text-white/80 hover:text-white cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <h1 className="text-base font-bold tracking-tight">Your recommendations</h1>
              </div>
              <button 
                onClick={() => speakText("Based on what you told me, here are your matched trade skills and training courses.")}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 flex-1 flex flex-col justify-between overflow-y-auto">
              <div>
                <h2 className="text-[26px] leading-[32px] font-extrabold text-[#1b2a4a] tracking-tight">
                  Based on what you told me
                </h2>
                <p className="text-[#64748b] text-[13px] leading-relaxed mt-2 font-normal">
                  These options match your skills, travel limits, and local job demand.
                </p>

                {/* Option 1: Electrician */}
                <div 
                  onClick={() => {
                    setSelectedCourse('electrician');
                    speakText("Option 1: Electrician, NSQF Level 4. High local demand. Training center is 8.4 kilometers away.");
                  }}
                  className={`mt-4 bg-white rounded-2xl p-5 border transition cursor-pointer ${
                    selectedCourse === 'electrician' ? 'border-[#1e7e4e] ring-2 ring-[#e6f4ea] shadow-xs' : 'border-slate-200'
                  }`}
                >
                  <div className="text-[19px] font-bold text-[#1b2a4a]">
                    1 Electrician
                  </div>
                  <div className="text-xs text-[#475569] font-medium mt-1">
                    NSQF Level 4 &bull; High local demand
                  </div>
                  <div className="text-xs text-[#334155] mt-2">
                    Training center <span className="font-semibold">8.4 km away</span>
                  </div>
                  <div className="text-xs text-[#334155] mt-0.5">
                    Estimated local opportunities: <span className="font-semibold text-[#1e7e4e]">High</span>
                  </div>

                  <div className="mt-3.5 inline-block bg-[#e6f4ea] text-[#1e7e4e] text-xs font-bold px-3 py-1 rounded-full">
                    Best match
                  </div>
                </div>

                {/* Option 2: Tailor / Stitching */}
                <div 
                  onClick={() => {
                    setSelectedCourse('tailor');
                    speakText("Option 2: Tailor and Stitching, NSQF Level 3. Nearby demand. Training center is 5.2 kilometers away.");
                  }}
                  className={`mt-3 bg-white rounded-2xl p-5 border transition cursor-pointer ${
                    selectedCourse === 'tailor' ? 'border-[#1e7e4e] ring-2 ring-[#e6f4ea] shadow-xs' : 'border-slate-200'
                  }`}
                >
                  <div className="text-[19px] font-bold text-[#1b2a4a]">
                    2 Tailor / Stitching
                  </div>
                  <div className="text-xs text-[#475569] font-medium mt-1">
                    NSQF Level 3 &bull; Nearby demand
                  </div>
                  <div className="text-xs text-[#334155] mt-2">
                    Training center <span className="font-semibold">5.2 km away</span>
                  </div>
                  <div className="text-xs text-[#334155] mt-0.5">
                    Good option for home-based work
                  </div>
                </div>
              </div>

              {/* Bottom Action */}
              <div className="pt-5 space-y-2 pb-2">
                <button
                  onClick={() => {
                    audioController.playChime('start');
                    setCurrentScreen('training_center');
                  }}
                  className="w-full bg-[#1b2a4a] hover:bg-[#15223c] text-white py-4 rounded-xl font-bold text-[15px] shadow-sm transition cursor-pointer text-center"
                >
                  See training centers
                </button>

                <div className="text-center text-[#64748b] text-xs">
                  You can listen to each option
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PAGE 6: TRAINING CENTER DETAILS (PDF Page 6)                              */}
        {/* ========================================================================= */}
        {currentScreen === 'training_center' && (
          <div className="flex-1 flex flex-col justify-between">
            {/* Header */}
            <div className="bg-[#1b2a4a] text-white px-6 pt-5 pb-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setCurrentScreen('recommendations')}
                  className="text-white/80 hover:text-white cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <h1 className="text-base font-bold tracking-tight">Training center</h1>
              </div>
              <button 
                onClick={() => speakText("PM-AJAY Skill Center, 8.4 kilometers away. Electrician NSQF Level 4 batch starts on 12 September.")}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 flex-1 flex flex-col justify-between overflow-y-auto">
              <div>
                <h2 className="text-[26px] leading-[32px] font-extrabold text-[#1b2a4a] tracking-tight">
                  PM-AJAY Skill Center
                </h2>
                <p className="text-[#64748b] text-[14px] leading-relaxed mt-1 font-medium">
                  8.4 km &bull; Approx. 22 min
                </p>

                {/* Course Details Card */}
                <div className="mt-4 bg-white rounded-2xl p-5 border border-slate-200">
                  <div className="text-[17px] font-bold text-[#1b2a4a]">
                    Electrician — NSQF Level 4
                  </div>
                  <div className="text-xs text-[#334155] mt-2.5 space-y-1">
                    <div>Next batch: <span className="font-semibold text-[#1b2a4a]">12 September</span></div>
                    <div>Seats available: <span className="font-semibold text-[#1e7e4e]">14</span></div>
                    <div className="text-[#1e7e4e] font-semibold mt-1">Training support available</div>
                  </div>
                </div>

                {/* What happens next Stepper */}
                <div className="mt-6">
                  <div className="text-[17px] font-bold text-[#1b2a4a] mb-3">
                    What happens next?
                  </div>

                  <div className="space-y-3">
                    {[
                      { num: 1, text: 'Confirm your interest' },
                      { num: 2, text: 'We guide your enrollment' },
                      { num: 3, text: 'Start training at the center' }
                    ].map((step) => (
                      <div key={step.num} className="flex items-center space-x-3 bg-white/60 p-3 rounded-xl border border-slate-200/70">
                        <div className="w-7 h-7 rounded-full bg-[#1b2a4a] text-white flex items-center justify-center font-bold text-xs">
                          {step.num}
                        </div>
                        <div className="text-xs font-semibold text-[#1b2a4a]">
                          {step.text}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 space-y-2.5 pb-2">
                <button
                  onClick={() => {
                    setIsEnrolled(true);
                    audioController.playChime('success');
                    speakText("Enrollment confirmed. You are registered for the Electrician training batch.");
                    setCurrentScreen('progress');
                  }}
                  className="w-full bg-[#1b2a4a] hover:bg-[#15223c] text-white py-4 rounded-xl font-bold text-[15px] shadow-sm transition cursor-pointer text-center"
                >
                  Confirm enrollment help
                </button>

                <button
                  onClick={() => {
                    speakText("We have scheduled a call back for you from the district coordinator.");
                    alert("A representative will call your phone shortly.");
                  }}
                  className="w-full bg-white hover:bg-slate-50 text-[#1b2a4a] border border-slate-300 py-3.5 rounded-xl font-semibold text-[14px] transition cursor-pointer text-center"
                >
                  Call me back / Ask a question
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PAGE 7: MY PROGRESS (PDF Page 7)                                          */}
        {/* ========================================================================= */}
        {currentScreen === 'progress' && (
          <div className="flex-1 flex flex-col justify-between">
            {/* Header */}
            <div className="bg-[#1b2a4a] text-white px-6 pt-5 pb-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setCurrentScreen('training_center')}
                  className="text-white/80 hover:text-white cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <h1 className="text-base font-bold tracking-tight">My progress</h1>
              </div>
              <button 
                onClick={() => speakText("Your training is sixty percent complete. Next milestone is certification.")}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 flex-1 flex flex-col justify-between overflow-y-auto">
              <div>
                <h2 className="text-[26px] leading-[32px] font-extrabold text-[#1b2a4a] tracking-tight">
                  Electrician training
                </h2>
                <p className="text-[#64748b] text-[14px] leading-relaxed mt-1 font-medium">
                  PM-AJAY Skill Center
                </p>

                {/* Status Box */}
                <div className="mt-4 bg-white rounded-2xl p-5 border border-slate-200">
                  <div className="text-xs text-[#64748b] font-medium">
                    Current status
                  </div>
                  <div className="text-[20px] font-bold text-[#1e7e4e] mt-1">
                    Training in progress
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4">
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#1e7e4e] h-2 w-[60%] rounded-full" />
                    </div>
                    <div className="text-right text-xs font-bold text-[#1e7e4e] mt-1.5">
                      60% complete
                    </div>
                  </div>
                </div>

                {/* Milestones List */}
                <div className="mt-5 space-y-3.5 px-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2.5 text-[#1b2a4a] font-semibold">
                      <Check className="w-4 h-4 text-[#1e7e4e] stroke-[3]" />
                      <span>Enrollment confirmed</span>
                    </div>
                    <div className="text-[#64748b]">12 Aug</div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2.5 text-[#1b2a4a] font-semibold">
                      <Check className="w-4 h-4 text-[#1e7e4e] stroke-[3]" />
                      <span>Training started</span>
                    </div>
                    <div className="text-[#64748b]">18 Aug</div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold">
                    <div className="flex items-center space-x-2.5 text-[#1b2a4a]">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#d97706] inline-block ml-0.5 mr-0.5" />
                      <span>60% training completed</span>
                    </div>
                    <div className="text-[#d97706]">Today</div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#94a3b8]">
                    <div className="flex items-center space-x-2.5">
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-slate-300 inline-block" />
                      <span>Certification</span>
                    </div>
                    <div>Upcoming</div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#94a3b8]">
                    <div className="flex items-center space-x-2.5">
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-slate-300 inline-block" />
                      <span>Employment follow-up</span>
                    </div>
                    <div>Upcoming</div>
                  </div>
                </div>

                {/* Green Notification Callout */}
                <div className="mt-6 bg-[#eaf5f0] text-[#1a5b3a] rounded-xl p-3.5 text-xs font-medium border border-emerald-200/60 leading-relaxed">
                  We will call after training to ask about your job.
                </div>
              </div>

              {/* Bottom Footnote & Restart */}
              <div className="pt-5 space-y-2 pb-2 text-center">
                <div className="text-[#64748b] text-xs">
                  All updates can be given by voice.
                </div>
                <button
                  onClick={() => setCurrentScreen('home')}
                  className="w-full bg-white hover:bg-slate-50 text-[#1b2a4a] border border-slate-300 py-3 rounded-xl font-semibold text-xs transition cursor-pointer text-center"
                >
                  Start New Beneficiary Search
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

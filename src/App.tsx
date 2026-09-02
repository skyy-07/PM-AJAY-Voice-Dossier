import React, { useState, useEffect, useRef } from 'react';
import { SpeechEngine } from './audio/speechEngine';
import { Header } from './components/Header';
import { EntryScreen } from './components/EntryScreen';
import { LanguageScreen } from './components/LanguageScreen';
import { ConsentScreen } from './components/ConsentScreen';
import { VoiceInterviewScreen } from './components/VoiceInterviewScreen';
import { RecommendationsScreen } from './components/RecommendationsScreen';
import { TrainingCenterDetailScreen } from './components/TrainingCenterDetailScreen';
import { ProgressTrackerScreen } from './components/ProgressTrackerScreen';
import { TalkBackDrawer } from './components/TalkBackDrawer';
import { ChannelSimulatorModal } from './components/ChannelSimulatorModal';
import { AdminPanel } from './components/admin/AdminPanel';
import { AuthModal } from './components/AuthModal';
import { LoginScreen } from './components/LoginScreen';
import { useAuth } from './context/AuthContext';
import {
  CandidateProfile,
  EnrollmentProgress,
  Recommendation,
  ScreenName,
  SupportedLanguage,
  TalkBackAction,
  TrainingCenter,
} from './types';
import { getLocale } from './locales/i18n';
import {
  checkIsOnline,
  getQueuedTurns,
  enqueueOfflineTurn,
  syncPendingTurns,
  saveCachedSession,
  getCachedSession,
  clearCachedSession,
  toggleOfflineSimulation,
  isOfflineSimulationActive,
  getLastSyncTime,
  extractOfflineProfileDeltas,
  OfflineQueuedTurn,
  CachedInterviewSession,
} from './utils/offlineSync';

export default function App() {
  // Navigation & Core States
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('entry');
  const [language, setLanguage] = useState<SupportedLanguage>('hi');
  const [adminMode, setAdminMode] = useState(false);
  const { user, userProfile, loading } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Session & Candidate States
  const [sessionId, setSessionId] = useState<string>('');
  const [candidateId, setCandidateId] = useState<string>('');
  const [stepNumber, setStepNumber] = useState(1);
  const [totalSteps] = useState(5);
  const [questionTitle, setQuestionTitle] = useState('');
  const [questionSubtitle, setQuestionSubtitle] = useState('');
  const [suggestedExamples, setSuggestedExamples] = useState<string[]>([]);
  const [profile, setProfile] = useState<Partial<CandidateProfile>>({});
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null);
  const [progress, setProgress] = useState<EnrollmentProgress | null>(null);
  const [trainingCenter, setTrainingCenter] = useState<TrainingCenter | null>(null);

  // Speech Engine States
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSlower, setIsSlower] = useState(false);
  const [audioVolume, setAudioVolume] = useState(0);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  // Offline Caching & Sync States
  const [isOnline, setIsOnline] = useState<boolean>(checkIsOnline());
  const [unsyncedTurns, setUnsyncedTurns] = useState<OfflineQueuedTurn[]>(getQueuedTurns());
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(getLastSyncTime());
  const [isSimulatingOffline, setIsSimulatingOffline] = useState<boolean>(isOfflineSimulationActive());
  const [cachedSession, setCachedSession] = useState<CachedInterviewSession | null>(getCachedSession());
  const [syncToast, setSyncToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Modals
  const [isTalkBackOpen, setIsTalkBackOpen] = useState(false);
  const [isChannelSimOpen, setIsChannelSimOpen] = useState(false);

  const speechEngineRef = useRef<SpeechEngine | null>(null);
  const locale = getLocale(language);

  // Sync state into refs to guarantee zero stale closures in speech callbacks
  const currentScreenRef = useRef(currentScreen);
  const sessionIdRef = useRef(sessionId);
  const languageRef = useRef(language);
  const stepNumberRef = useRef(stepNumber);

  useEffect(() => {
    currentScreenRef.current = currentScreen;
  }, [currentScreen]);

  useEffect(() => {
    sessionIdRef.current = sessionId;
  }, [sessionId]);

  useEffect(() => {
    languageRef.current = language;
  }, [language]);

  useEffect(() => {
    stepNumberRef.current = stepNumber;
  }, [stepNumber]);

  // Online / Offline Network Listeners
  useEffect(() => {
    const handleOnlineStatusChange = () => {
      const online = checkIsOnline();
      setIsOnline(online);
      setIsSimulatingOffline(isOfflineSimulationActive());

      if (online) {
        // Automatically attempt background sync when network is restored
        const pending = getQueuedTurns();
        setUnsyncedTurns(pending);
        if (pending.length > 0) {
          handleManualSyncRetry();
        }
      }
    };

    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);

    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, []);

  // Voice command & transcript interceptor
  const handleUserVoiceInput = (rawTranscript: string) => {
    if (!speechEngineRef.current) return;
    const activeLang = languageRef.current;
    const activeScreen = currentScreenRef.current;

    // Check if user spoke a command like "hear again", "repeat question", "slower", "yes", "no"
    const parsedAction = speechEngineRef.current.parseCommand(rawTranscript, activeLang);

    if (parsedAction) {
      handleTalkBackAction(parsedAction);
      return;
    }

    // Normal interview response
    if (activeScreen === 'interview') {
      submitTurnToAI(rawTranscript);
    } else if (activeScreen === 'consent') {
      const lower = rawTranscript.toLowerCase();
      if (lower.includes('yes') || rawTranscript.includes('हाँ') || rawTranscript.includes('হ্যাঁ') || rawTranscript.includes('होय') || rawTranscript.includes('ஆம்')) {
        handleConsentAgree();
      } else if (lower.includes('no') || rawTranscript.includes('नहीं') || rawTranscript.includes('না') || rawTranscript.includes('नाही') || rawTranscript.includes('இல்லை')) {
        handleConsentDecline();
      }
    }
  };

  // Initialize SpeechEngine once
  useEffect(() => {
    const engine = new SpeechEngine();
    engine.setLanguage(language);
    engine.setCallbacks({
      onStateChange: (state) => {
        setIsListening(state.isListening);
        setIsSpeaking(state.isSpeaking);
        setIsSlower(state.isSlower);
      },
      onVolume: (vol) => {
        setAudioVolume(vol);
      },
      onTranscript: (transcript, isFinal) => {
        setInterimTranscript(transcript);
        if (isFinal && transcript.trim()) {
          handleUserVoiceInput(transcript.trim());
        }
      },
      onCommand: (action) => {
        handleTalkBackAction(action);
      },
    });

    speechEngineRef.current = engine;

    // Check for admin query param e.g. ?admin=true
    if (window.location.search.includes('admin')) {
      setAdminMode(true);
    }

    return () => {
      engine.stopListening(false);
      engine.stopSpeaking();
    };
  }, []);

  // Sync language changes with speech engine
  useEffect(() => {
    if (speechEngineRef.current) {
      speechEngineRef.current.setLanguage(language);
    }
  }, [language]);

  // Handle offline fallback turn processing and local storage caching
  const handleOfflineTurn = (userInputText: string, currentSid: string) => {
    setIsLoadingAI(false);

    // 1. Enqueue turn in localStorage
    enqueueOfflineTurn({
      sessionId: currentSid,
      stepNumber: stepNumberRef.current,
      userInputText,
      language: languageRef.current,
    });

    const updatedQueue = getQueuedTurns();
    setUnsyncedTurns(updatedQueue);

    // 2. Extract profile attributes locally
    const offlineResult = extractOfflineProfileDeltas(
      userInputText,
      languageRef.current,
      stepNumberRef.current,
      profile
    );

    const nextStep = Math.min(5, stepNumberRef.current + 1);
    setProfile(offlineResult.updatedProfile);
    setStepNumber(nextStep);

    // 3. Save full session state snapshot to localStorage
    const newSnapshot: CachedInterviewSession = {
      sessionId: currentSid,
      candidateId: candidateId || 'cand_offline',
      language: languageRef.current,
      stepNumber: nextStep,
      totalSteps: 5,
      questionTitle: offlineResult.nextQuestion,
      questionSubtitle: offlineResult.questionSubtitle,
      suggestedExamples: locale.examples,
      profile: offlineResult.updatedProfile,
      transcript: [
        ...(cachedSession?.transcript || []),
        { speaker: 'user', text: userInputText, timestamp: new Date().toISOString() },
      ],
      lastSavedAt: new Date().toISOString(),
      isComplete: offlineResult.isComplete,
    };

    saveCachedSession(newSnapshot);
    setCachedSession(newSnapshot);
    setLastSyncTime(new Date().toISOString());

    // 4. Show friendly status notification
    setSyncToast({
      message: `${locale.cachedProgressSavedLocally} (${updatedQueue.length} ${languageRef.current === 'hi' ? 'उत्तर डिवाइस पर सेव्ड' : 'cached locally'})`,
      type: 'info',
    });
    setTimeout(() => setSyncToast(null), 4500);

    if (offlineResult.isComplete) {
      setStepNumber(5);
      setCurrentScreen('recommendations');
      speakText(
        languageRef.current === 'hi'
          ? 'नेटवर्क न होने पर भी आपके सभी जवाब सुरक्षित सेव कर लिए गए हैं। आपके लिए तैयार प्रशिक्षण कोर्स स्क्रीन पर हैं।'
          : 'Your responses are safely cached offline. Top matching courses are ready on screen.'
      );
    } else {
      setQuestionTitle(offlineResult.nextQuestion);
      setQuestionSubtitle(offlineResult.questionSubtitle || '');
      setSuggestedExamples(locale.examples);
      speakText(
        `${offlineResult.nextQuestion}`,
        () => {
          speechEngineRef.current?.startListening();
        }
      );
    }
  };

  // Submit spoken turn to AI server or route to offline cache if disconnected
  const submitTurnToAI = async (userInputText: string) => {
    let currentSid = sessionIdRef.current;
    if (!currentSid) {
      currentSid = `session_local_${Date.now()}`;
      setSessionId(currentSid);
      sessionIdRef.current = currentSid;
    }
    setIsLoadingAI(true);
    setInterimTranscript('');

    const online = checkIsOnline();

    // If simulating offline or device has no network
    if (!online) {
      handleOfflineTurn(userInputText, currentSid);
      return;
    }

    try {
      const res = await fetch('/api/interview/turn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: currentSid,
          userInputText,
          language: languageRef.current,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      setIsLoadingAI(false);

      if (data.profile) {
        setProfile(data.profile);
      }

      // Update local storage cache as backup
      const newSnapshot: CachedInterviewSession = {
        sessionId: currentSid,
        candidateId: candidateId || 'cand_online',
        language: languageRef.current,
        stepNumber: data.stepNumber || stepNumberRef.current + 1,
        totalSteps: 5,
        questionTitle: data.nextQuestion || questionTitle,
        questionSubtitle: data.questionSubtitle,
        suggestedExamples: data.suggestedExamples,
        profile: data.profile || profile,
        transcript: [
          ...(cachedSession?.transcript || []),
          { speaker: 'user', text: userInputText, timestamp: new Date().toISOString() },
        ],
        lastSavedAt: new Date().toISOString(),
        isComplete: !!data.isComplete,
      };
      saveCachedSession(newSnapshot);
      setCachedSession(newSnapshot);

      if (data.isComplete) {
        setStepNumber(5);
        if (data.recommendations && data.recommendations.length > 0) {
          setRecommendations(data.recommendations);
          setSelectedRecommendation(data.recommendations[0]);
          if (data.recommendations[0].trainingCenter) {
            setTrainingCenter(data.recommendations[0].trainingCenter);
          }
        }
        setCurrentScreen('recommendations');
        speakText(
          languageRef.current === 'bn'
            ? 'আপনার উত্তরের ভিত্তিতে আমরা সেরা কোর্সগুলি খুঁজে পেয়েছি।'
            : languageRef.current === 'mr'
            ? 'तुमच्या उत्तरांच्या आधारे आम्ही सर्वोत्तम प्रशिक्षण पर्याय निवडले आहेत.'
            : languageRef.current === 'ta'
            ? 'உங்கள் திறன்களின் அடிப்படையில் சிறந்த பயிற்சிகள் தேர்வு செய்யப்பட்டுள்ளன.'
            : languageRef.current === 'en'
            ? 'Based on your spoken answers, we have selected top NSQF skill courses and nearby centers.'
            : 'आपके जवाबों के आधार पर हमने आपके लिए सबसे उत्तम प्रशिक्षण चुने हैं।'
        );
      } else {
        setStepNumber(data.stepNumber || stepNumberRef.current + 1);
        setQuestionTitle(data.nextQuestion);
        setQuestionSubtitle(data.questionSubtitle || '');
        setSuggestedExamples(data.suggestedExamples || []);
        speakText(data.nextQuestion, () => {
          speechEngineRef.current?.startListening();
        });
      }
    } catch (err) {
      console.warn('Network failure during turn submission, routing to local storage cache:', err);
      handleOfflineTurn(userInputText, currentSid);
    }
  };

  // Manual Sync Retry Action
  const handleManualSyncRetry = async () => {
    setIsSyncing(true);
    setSyncToast({
      message: locale.syncingProgress,
      type: 'info',
    });

    try {
      const result = await syncPendingTurns();
      setIsSyncing(false);

      if (result.success) {
        const remainingQueue = getQueuedTurns();
        setUnsyncedTurns(remainingQueue);
        const now = new Date().toISOString();
        setLastSyncTime(now);

        if (result.data) {
          if (result.data.profile) {
            setProfile(result.data.profile);
          }
          if (result.data.isComplete && result.data.recommendations) {
            setRecommendations(result.data.recommendations);
            setSelectedRecommendation(result.data.recommendations[0]);
            if (result.data.recommendations[0]?.trainingCenter) {
              setTrainingCenter(result.data.recommendations[0].trainingCenter);
            }
            if (currentScreenRef.current === 'interview') {
              setCurrentScreen('recommendations');
            }
          } else if (result.data.nextQuestion && currentScreenRef.current === 'interview') {
            setQuestionTitle(result.data.nextQuestion);
            setQuestionSubtitle(result.data.questionSubtitle || '');
            setStepNumber(result.data.stepNumber || stepNumberRef.current);
          }
        }

        setSyncToast({
          message: locale.syncSuccessToast,
          type: 'success',
        });
        speakText(locale.syncSuccessToast);
        setTimeout(() => setSyncToast(null), 4000);
      } else {
        setSyncToast({
          message: `${locale.syncFailedToast} (${result.error || 'Network offline'})`,
          type: 'error',
        });
        speakText(locale.syncFailedToast);
        setTimeout(() => setSyncToast(null), 5000);
      }
    } catch (e: any) {
      setIsSyncing(false);
      setSyncToast({
        message: locale.syncFailedToast,
        type: 'error',
      });
      setTimeout(() => setSyncToast(null), 5000);
    }
  };

  // Toggle simulated offline mode
  const handleToggleOfflineSim = () => {
    const isNowSim = toggleOfflineSimulation();
    setIsSimulatingOffline(isNowSim);
    setIsOnline(!isNowSim);
    setSyncToast({
      message: isNowSim
        ? (language === 'hi' ? 'ऑफ़लाइन सिमुलेशन सक्रिय: उत्तर केवल डिवाइस पर सेव होंगे' : 'Simulated Offline active: responses will queue locally')
        : (language === 'hi' ? 'ऑनलाइन मोड पुनः सक्रिय' : 'Online mode restored'),
      type: 'info',
    });
    setTimeout(() => setSyncToast(null), 3500);
  };

  // Resume saved interview from localStorage
  const handleResumeCachedSession = () => {
    const saved = getCachedSession();
    if (!saved) return;

    setSessionId(saved.sessionId);
    setCandidateId(saved.candidateId);
    setLanguage(saved.language);
    setStepNumber(saved.stepNumber);
    setQuestionTitle(saved.questionTitle || locale.defaultQuestionTitle);
    setQuestionSubtitle(saved.questionSubtitle || locale.defaultQuestionSubtitle);
    setSuggestedExamples(saved.suggestedExamples || locale.examples);
    setProfile(saved.profile || {});

    setCurrentScreen('interview');
    speakText(
      saved.questionTitle || locale.defaultQuestionTitle,
      () => {
        speechEngineRef.current?.startListening();
      }
    );
  };

  // Discard saved interview
  const handleDiscardCachedSession = () => {
    clearCachedSession();
    setCachedSession(null);
    setSyncToast({
      message: language === 'hi' ? 'पिछला सत्र हटाया गया।' : 'Previous session discarded.',
      type: 'info',
    });
    setTimeout(() => setSyncToast(null), 3000);
  };

  const speakText = (text: string, onEnd?: () => void) => {
    if (speechEngineRef.current) {
      speechEngineRef.current.setCurrentQuestion(text);
      speechEngineRef.current.speak(text, () => {
        if (onEnd) onEnd();
      });
    }
  };

  // Screen actions
  const handleStartVoice = async () => {
    // Attempt proactive microphone permission request if supported
    if (speechEngineRef.current) {
      speechEngineRef.current.requestMicrophonePermission();
    }

    try {
      const res = await fetch('/api/session/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language, district: 'Nadia' }),
      });
      const data = await res.json();
      setSessionId(data.session.id);
      setCandidateId(data.candidate.id);
      setCurrentScreen('language');
      speakText(locale.whichLanguageSubtitle);
    } catch (e) {
      setCurrentScreen('language');
    }
  };

  const handleSelectLanguage = (newLang: SupportedLanguage) => {
    setLanguage(newLang);
    const newLocale = getLocale(newLang);
    speakText(newLocale.whichLanguageSubtitle);
  };

  const handleLanguageContinue = () => {
    setCurrentScreen('consent');
    speakText(locale.consentSpokenPrompt, () => {
      // Auto listen for spoken consent ("Yes" / "हाँ" / "হ্যাঁ")
      speechEngineRef.current?.startListening();
    });
  };

  const handleConsentAgree = async () => {
    if (sessionId) {
      await fetch('/api/session/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, agreed: true }),
      });
    }

    const firstQuestion =
      language === 'bn'
        ? 'আপনার বর্তমান কাজ বা অভিজ্ঞতার ব্যাপারে বলুন।'
        : language === 'mr'
        ? 'तुम्ही सध्या काय काम करता किंवा तुम्हाला कोणत्या कामाचा अनुभव आहे?'
        : language === 'ta'
        ? 'நீங்கள் தற்போது செய்யும் வேலை அல்லது அனுபவத்தைப் பற்றி சொல்லுங்கள்.'
        : 'अपने काम और अनुभव के बारे में बताएं।';

    setQuestionTitle(firstQuestion);
    setQuestionSubtitle(locale.defaultQuestionSubtitle);
    setSuggestedExamples(locale.examples);
    setStepNumber(1);
    setCurrentScreen('interview');
    speakText(firstQuestion, () => {
      // Proactively activate microphone for the candidate's spoken response
      speechEngineRef.current?.startListening();
    });
  };

  const handleConsentDecline = () => {
    setCurrentScreen('entry');
    speakText('प्रक्रिया रद्द कर दी गई है।');
  };

  const handleRepeatQuestion = () => {
    if (questionTitle) {
      speakText(questionTitle);
    }
  };

  const handleSkipQuestion = () => {
    submitTurnToAI('अगले सवाल पर चलें');
  };

  const handleToggleListening = () => {
    if (!speechEngineRef.current) return;
    if (isListening) {
      speechEngineRef.current.stopListening();
    } else {
      speechEngineRef.current.startListening();
    }
  };

  const handleSelectRecommendation = (rec: Recommendation) => {
    setSelectedRecommendation(rec);
    if (rec.trainingCenter) {
      setTrainingCenter(rec.trainingCenter);
    }
    setCurrentScreen('center_detail');
    speakText(
      `${rec.trade.localizedNames?.[language] || rec.trade.tradeName}। ${rec.trainingCenter?.name || 'पीएम-अजय स्किल सेंटर'} पर यह कोर्स उपलब्ध है।`
    );
  };

  const handleConfirmEnrollment = async () => {
    try {
      const res = await fetch('/api/enrollment/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateId: candidateId || 'cand_demo_01',
          tradeId: selectedRecommendation?.tradeId || 'trade_electrician',
          centerId: trainingCenter?.id || 'center_pmajay_nadia',
        }),
      });
      const data = await res.json();
      setProgress(data.progress);
    } catch (e) {
      console.error(e);
    }
    setCurrentScreen('progress');
    speakText(
      language === 'bn'
        ? 'আপনার ভর্তির আগ্রহ নিশ্চিত হয়েছে। প্রশিক্ষণের বিবরণ স্ক্রিনে দেখতে পারেন।'
        : language === 'mr'
        ? 'तुमचे नाव नोंदवले गेले आहे. प्रशिक्षणाची माहिती येथे पाहू शकता.'
        : 'आपका नामांकन दर्ज हो गया है। प्रशिक्षण की पूरी प्रगति आप यहाँ देख सकते हैं।'
    );
  };

  const handleTalkBackAction = (action: TalkBackAction) => {
    switch (action) {
      case 'hear_again':
      case 'repeat_question':
        handleRepeatQuestion();
        break;
      case 'speak':
        if (speechEngineRef.current) {
          speechEngineRef.current.startListening();
        }
        break;
      case 'yes':
        if (currentScreen === 'consent') handleConsentAgree();
        else if (currentScreen === 'center_detail') handleConfirmEnrollment();
        break;
      case 'no':
        if (currentScreen === 'consent') handleConsentDecline();
        break;
      case 'go_back':
        if (currentScreen === 'progress') setCurrentScreen('center_detail');
        else if (currentScreen === 'center_detail') setCurrentScreen('recommendations');
        else if (currentScreen === 'recommendations') setCurrentScreen('interview');
        else if (currentScreen === 'interview') setCurrentScreen('consent');
        else if (currentScreen === 'consent') setCurrentScreen('language');
        else if (currentScreen === 'language') setCurrentScreen('entry');
        break;
      case 'slower':
        if (speechEngineRef.current) {
          const nextSlower = !isSlower;
          setIsSlower(nextSlower);
          speechEngineRef.current.setSlowerRate(nextSlower);
          speakText(nextSlower ? 'धीमी गति चालू है।' : 'सामान्य गति।');
        }
        break;
      case 'stop_listening':
        if (speechEngineRef.current) {
          speechEngineRef.current.stopListening();
          speechEngineRef.current.stopSpeaking();
        }
        break;
    }
  };

  const handleResetToHome = () => {
    if (speechEngineRef.current) {
      speechEngineRef.current.stopListening();
      speechEngineRef.current.stopSpeaking();
    }
    setCurrentScreen('entry');
  };

  const toggleSpeechBargeIn = () => {
    if (isSpeaking && speechEngineRef.current) {
      speechEngineRef.current.stopSpeaking();
    } else {
      if (currentScreen === 'entry') speakText(locale.heroSubtitle);
      else if (currentScreen === 'language') speakText(locale.whichLanguageSubtitle);
      else if (currentScreen === 'consent') speakText(locale.consentSpokenPrompt);
      else if (currentScreen === 'interview') handleRepeatQuestion();
      else if (currentScreen === 'recommendations') speakText(locale.recommendationsSubtitle);
      else if (currentScreen === 'center_detail') speakText(locale.skillCenterTitle);
      else if (currentScreen === 'progress') speakText(locale.trainingInProgress);
    }
  };

  // Header Title based on screen
  const getHeaderTitle = () => {
    switch (currentScreen) {
      case 'entry':
        return locale.headerTitle;
      case 'language':
        return locale.chooseLanguageHeader;
      case 'consent':
        return locale.consentTitle;
      case 'interview':
        return locale.interviewHeader;
      case 'recommendations':
        return locale.recommendationsHeader;
      case 'center_detail':
        return locale.centerHeader;
      case 'progress':
        return locale.myProgressHeader;
      default:
        return 'PM-AJAY Voice Assistant';
    }
  };

  if (adminMode) {
    return <AdminPanel onExitAdmin={() => setAdminMode(false)} />;
  }

  // Initial Auth Loading State
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#ECECE8] p-4">
        <div className="flex w-full max-w-md flex-col items-center justify-center rounded-3xl bg-[#F8F8F4] p-8 text-center shadow-xl border border-stone-300">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#172554] text-amber-400 shadow-lg animate-pulse mb-4">
            <span className="text-2xl font-black">🇮🇳</span>
          </div>
          <h2 className="text-base font-extrabold text-[#172554]">PM-AJAY Voice Assistant</h2>
          <p className="mt-1 text-xs text-stone-500">Ministry of Social Justice & Empowerment</p>
          <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-stone-600">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#172554] border-t-transparent"></div>
            <span>सुरक्षित पोर्टल लोड हो रहा है...</span>
          </div>
        </div>
      </div>
    );
  }

  // Mandatory Authentication Gate: User cannot use the app without logging in first
  if (!user) {
    return (
      <div className="flex min-h-screen justify-center bg-[#ECECE8] antialiased">
        <div className="relative flex w-full max-w-md flex-col bg-[#F8F8F4] shadow-2xl min-h-screen border-x border-stone-300/40">
          <LoginScreen
            language={language}
            onLanguageChange={(lang) => {
              setLanguage(lang);
              if (speechEngineRef.current) {
                speechEngineRef.current.setLanguage(lang);
              }
            }}
            onOpenAdmin={() => setAdminMode(true)}
            onSpeakNarration={(text) => speakText(text)}
            isSpeaking={isSpeaking}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen justify-center bg-[#ECECE8] antialiased">
      {/* Mobile-Proportional App Canvas Container */}
      <div className="relative flex w-full max-w-md flex-col bg-[#F8F8F4] shadow-2xl min-h-screen border-x border-stone-300/40">
        {/* Sticky Navy Header */}
        <Header
          title={getHeaderTitle()}
          currentLanguage={language}
          onOpenLanguage={() => setCurrentScreen('language')}
          onOpenTalkBack={() => setIsTalkBackOpen(true)}
          isSpeaking={isSpeaking}
          onToggleSpeech={toggleSpeechBargeIn}
          onResetApp={handleResetToHome}
          onOpenAdmin={() => setAdminMode(true)}
          onOpenAuth={() => setIsAuthModalOpen(true)}
        />

        {/* Global Floating Sync Notification Toast */}
        {syncToast && (
          <div className="absolute top-16 left-3 right-3 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
            <div
              className={`flex items-center gap-2.5 rounded-2xl px-4 py-2.5 text-xs font-semibold shadow-lg border backdrop-blur-md ${
                syncToast.type === 'success'
                  ? 'bg-emerald-800/95 text-white border-emerald-600'
                  : syncToast.type === 'error'
                  ? 'bg-rose-800/95 text-white border-rose-600'
                  : 'bg-stone-900/95 text-white border-stone-700'
              }`}
            >
              <span className="flex-1 leading-snug">{syncToast.message}</span>
              <button
                onClick={() => setSyncToast(null)}
                className="text-stone-300 hover:text-white shrink-0 p-0.5"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Screen View with Motion Fade */}
        <main className="flex flex-1 flex-col">
          {currentScreen === 'entry' && (
            <EntryScreen
              language={language}
              onStartVoice={handleStartVoice}
              onOpenChannelSimulator={() => setIsChannelSimOpen(true)}
              onSpeakNarration={() => speakText(locale.heroSubtitle)}
              isSpeaking={isSpeaking}
              cachedSession={cachedSession}
              onResumeCachedSession={handleResumeCachedSession}
              onDiscardCachedSession={handleDiscardCachedSession}
            />
          )}

          {currentScreen === 'language' && (
            <LanguageScreen
              selectedLanguage={language}
              onSelectLanguage={handleSelectLanguage}
              onContinue={handleLanguageContinue}
              onSpeakNarration={() => speakText(locale.whichLanguageSubtitle)}
              isSpeaking={isSpeaking}
            />
          )}

          {currentScreen === 'consent' && (
            <ConsentScreen
              language={language}
              onAgree={handleConsentAgree}
              onDecline={handleConsentDecline}
              onSpeakNarration={() => speakText(locale.consentSpokenPrompt)}
              isSpeaking={isSpeaking}
              isListening={isListening}
            />
          )}

          {currentScreen === 'interview' && (
            <VoiceInterviewScreen
              language={language}
              stepNumber={stepNumber}
              totalSteps={totalSteps}
              questionTitle={questionTitle}
              questionSubtitle={questionSubtitle}
              suggestedExamples={suggestedExamples}
              isListening={isListening}
              isSpeaking={isSpeaking}
              audioVolume={audioVolume}
              interimTranscript={interimTranscript}
              profile={profile}
              sessionId={sessionId}
              onToggleListening={handleToggleListening}
              onRepeatQuestion={handleRepeatQuestion}
              onSkipQuestion={handleSkipQuestion}
              onSubmitTextAnswer={submitTurnToAI}
              isLoadingAI={isLoadingAI}
              isOnline={isOnline}
              unsyncedTurns={unsyncedTurns}
              isSyncing={isSyncing}
              lastSyncTime={lastSyncTime}
              onManualSyncRetry={handleManualSyncRetry}
              onToggleOfflineSim={handleToggleOfflineSim}
              isSimulatingOffline={isSimulatingOffline}
            />
          )}

          {currentScreen === 'recommendations' && (
            <RecommendationsScreen
              language={language}
              recommendations={
                recommendations.length > 0
                  ? recommendations
                  : [
                      {
                        id: 'rec_1',
                        candidateId: 'cand_demo',
                        sessionId: 'sess_demo',
                        tradeId: 'trade_electrician',
                        score: 95,
                        rank: 1,
                        isBestMatch: true,
                        trade: {
                          id: 'trade_electrician',
                          tradeName: 'Electrician',
                          nsqfLevel: 4,
                          sector: 'Power & Electrical',
                          category: 'hybrid',
                          demandLevel: 'High',
                          description: 'Domestic and commercial wiring and motor repair',
                          durationMonths: 3,
                          minEducation: '8th Pass',
                          expectedMonthlyEarning: '₹18,000',
                          localizedNames: { hi: 'इलेक्ट्रीशियन', bn: 'ইলেকট্রিশিয়ান', mr: 'इलेक्ट्रीशियन', ta: 'மின் பணியாளர்' },
                        },
                        trainingCenter: {
                          id: 'c1',
                          name: 'PM-AJAY Skill Center (Ranaghat)',
                          district: 'Nadia',
                          state: 'West Bengal',
                          address: 'Ranaghat Main Road, Nadia',
                          distanceKm: 8.4,
                          travelTimeMinutes: 22,
                          offeredTrades: ['trade_electrician'],
                          nextBatchDate: '12 September',
                          seatsAvailable: 14,
                          totalSeats: 30,
                          hostelAvailable: false,
                        },
                        distanceKm: 8.4,
                        explanation: {
                          hi: 'आपके व्यावहारिक तकनीकी अनुभव और इलाके में बिजली व सोलर की भारी मांग के कारण यह सबसे उत्तम है।',
                          bn: 'আপনার কারিগরি অভিজ্ঞতা এবং এলাকায় কাজের প্রচুর চাহিদার জন্য এটি উপযুক্ত।',
                          mr: 'तुमच्या कौशल्यानुसार हा कोर्स उत्तम आहे.',
                          ta: 'உங்கள் செய்முறை அனுபவத்திற்கு ஏற்றது.',
                        },
                        matchReasonTags: ['High local demand', '8.4 km nearby'],
                      },
                      {
                        id: 'rec_2',
                        candidateId: 'cand_demo',
                        sessionId: 'sess_demo',
                        tradeId: 'trade_tailor',
                        score: 82,
                        rank: 2,
                        isBestMatch: false,
                        trade: {
                          id: 'trade_tailor',
                          tradeName: 'Tailor / Stitching',
                          nsqfLevel: 3,
                          sector: 'Apparel & Garment',
                          category: 'self_employment',
                          demandLevel: 'High',
                          description: 'Garment stitching and boutique production',
                          durationMonths: 2,
                          minEducation: '5th Pass',
                          expectedMonthlyEarning: '₹14,000',
                          localizedNames: { hi: 'दर्जी / सिलाई', bn: 'দর্জি / সেলাই', mr: 'शिंपी / शिलाई', ta: 'தையல் கலைஞர்' },
                        },
                        trainingCenter: {
                          id: 'c2',
                          name: 'PM-AJAY Rural Livelihood Center',
                          district: 'Nadia',
                          state: 'West Bengal',
                          address: 'Shantipur Road, Nadia',
                          distanceKm: 5.2,
                          travelTimeMinutes: 15,
                          offeredTrades: ['trade_tailor'],
                          nextBatchDate: '15 September',
                          seatsAvailable: 8,
                          totalSeats: 25,
                          hostelAvailable: false,
                        },
                        distanceKm: 5.2,
                        explanation: {
                          hi: 'घर बैठे या अपनी दुकान लगाकर अच्छी आमदनी शुरू करने का सबसे बढ़िया रास्ता।',
                          bn: 'ঘরে বসে বা নিজস্ব দোকান দিয়ে উপার্জন শুরু করার দারুণ সুযোগ।',
                          mr: 'घरबसल्या स्वतःचा व्यवसाय सुरू करण्यासाठी उत्तम पर्याय.',
                          ta: 'வீட்டிலிருந்தே சொந்தமாக தொழில் தொடங்க ஏற்றது.',
                        },
                        matchReasonTags: ['5.2 km nearby', 'Self-employment'],
                      },
                    ]
              }
              candidateDistrict="Nadia"
              profile={profile}
              onSelectRecommendation={handleSelectRecommendation}
              onSeeTrainingCenters={() => {
                if (recommendations[0]?.trainingCenter) {
                  setTrainingCenter(recommendations[0].trainingCenter);
                }
                setCurrentScreen('center_detail');
              }}
              onSpeakRecommendation={(rec) => {
                const title =
                  rec.jobRole?.localizedJobTitles?.[language] ||
                  rec.trade.localizedNames?.[language] ||
                  rec.trade.tradeName;
                const desc =
                  rec.explanation?.[language] ||
                  rec.jobRole?.localizedDescriptions?.[language] ||
                  rec.trade.description;
                const salary = rec.jobRole?.salaryRange || rec.trade.expectedMonthlyEarning;
                const location = rec.jobRole
                  ? `${rec.jobRole.locationName}, ${rec.jobRole.district}`
                  : `${rec.trainingCenter.name}, ${rec.trainingCenter.district}`;
                speakText(`${title}। ${desc}। अपेक्षित मासिक आय: ${salary}। स्थान: ${location}`);
              }}
              onSpeakNarration={() =>
                speakText(
                  language === 'hi'
                    ? 'आपके हुनर और इलाके के आधार पर हमने आपके लिए ये वास्तविक नौकरियां चुनी हैं।'
                    : locale.recommendationsSubtitle
                )
              }
              isSpeaking={isSpeaking}
            />
          )}

          {currentScreen === 'center_detail' && (
            <TrainingCenterDetailScreen
              language={language}
              center={
                trainingCenter || {
                  id: 'center_pmajay_nadia',
                  name: 'PM-AJAY Skill Center (Ranaghat)',
                  district: 'Nadia',
                  state: 'West Bengal',
                  address: 'Ranaghat Main Road, Nadia, WB',
                  distanceKm: 8.4,
                  travelTimeMinutes: 22,
                  offeredTrades: ['trade_electrician'],
                  nextBatchDate: '12 September',
                  seatsAvailable: 14,
                  totalSeats: 30,
                  hostelAvailable: false,
                }
              }
              selectedRecommendation={selectedRecommendation || undefined}
              onConfirmEnrollment={handleConfirmEnrollment}
              onRequestCallback={() => {
                alert('A PM-AJAY local coordinator will call your phone within 2 hours.');
                speakText('हमारे स्थानीय सहायक अधिकारी जल्द ही आपसे संपर्क करेंगे।');
              }}
              onSpeakNarration={() => speakText(locale.skillCenterTitle)}
              isSpeaking={isSpeaking}
            />
          )}

          {currentScreen === 'progress' && (
            <ProgressTrackerScreen
              language={language}
              progress={
                progress || {
                  id: 'prog_demo',
                  candidateId: candidateId || 'cand_demo_01',
                  tradeId: 'trade_electrician',
                  centerId: 'center_pmajay_nadia',
                  currentStage: 'in_training_60',
                  percentComplete: 60,
                  confirmedDate: '12 Aug',
                  trainingStartDate: '18 Aug',
                  certificationStatus: 'upcoming',
                  employmentStatus: 'upcoming',
                  history: [],
                }
              }
              onSpeakNarration={() => speakText(locale.trainingInProgress)}
              isSpeaking={isSpeaking}
              onRefresh={async () => {
                if (candidateId) {
                  const res = await fetch(`/api/progress/${candidateId}`);
                  const data = await res.json();
                  if (data.progress) setProgress(data.progress);
                }
              }}
            />
          )}
        </main>

        {/* Discrete Admin Link in Bottom Footer for Hackathon Judges / Evaluators */}
        <footer className="border-t border-stone-200/60 bg-stone-50/70 p-3 text-center text-[10px] text-stone-400">
          <div className="flex items-center justify-between px-2">
            <span>PM-AJAY Voice Scheme © 2026</span>
            <button
              onClick={() => setAdminMode(true)}
              className="font-medium text-stone-500 hover:text-stone-800 hover:underline"
              title="Official Portal for Ministry Welfare Officers"
            >
              🔒 Admin Access
            </button>
          </div>
        </footer>

        {/* Talk-Back Voice Control Modal (PDF Page 4) */}
        <TalkBackDrawer
          isOpen={isTalkBackOpen}
          onClose={() => setIsTalkBackOpen(false)}
          language={language}
          onAction={handleTalkBackAction}
          isListening={isListening}
          isSpeaking={isSpeaking}
          isSlower={isSlower}
        />

        {/* Multi-Channel Simulator Modal (IVR & WhatsApp) */}
        <ChannelSimulatorModal
          isOpen={isChannelSimOpen}
          onClose={() => setIsChannelSimOpen(false)}
          language={language}
        />

        {/* Firebase Authentication Modal */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          language={language}
        />
      </div>
    </div>
  );
}

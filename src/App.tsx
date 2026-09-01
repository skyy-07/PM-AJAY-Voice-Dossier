import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.js';
import { TalkBackBar } from './components/common/TalkBackBar.js';
import { LandingPage } from './components/landing/LandingPage.js';
import { ConsentScreen } from './components/beneficiary/ConsentScreen.js';
import { LanguageSelectScreen } from './components/beneficiary/LanguageSelectScreen.js';
import { VoiceInterviewScreen } from './components/beneficiary/VoiceInterviewScreen.js';
import { ProfileConfirmScreen } from './components/beneficiary/ProfileConfirmScreen.js';
import { RecommendationsScreen } from './components/beneficiary/RecommendationsScreen.js';
import { MobileAppExperience } from './components/mobile/MobileAppExperience.js';
import { WhatsAppSimulator } from './components/whatsapp/WhatsAppSimulator.js';
import { OfflineKioskScreen } from './components/kiosk/OfflineKioskScreen.js';
import { AdminDashboard } from './components/admin/AdminDashboard.js';
import { MobileBottomNav } from './components/common/MobileBottomNav.js';
import { DemoConversationModal } from './components/common/DemoConversationModal.js';
import { HumanHelpModal } from './components/common/HumanHelpModal.js';
import { ThemeProvider, useTheme } from './context/ThemeContext.js';

import { SupportedLanguage, UserRole, CandidateProfile, ActiveInterviewSession } from './types.js';
import { api } from './lib/api.js';
import { userPreferences } from './lib/userPreferences.js';

function MainApp() {
  const [currentView, setCurrentView] = useState<string>('landing');
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>(() => userPreferences.getLanguage());
  const [hasGivenConsent, setHasGivenConsent] = useState<boolean>(() => userPreferences.getConsent());
  const [currentRole, setCurrentRole] = useState<UserRole>('beneficiary');
  
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Active session and candidate
  const [activeSession, setActiveSession] = useState<ActiveInterviewSession | null>(null);
  const [activeCandidate, setActiveCandidate] = useState<CandidateProfile | null>(null);

  // Modals
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isEscalationModalOpen, setIsEscalationModalOpen] = useState(false);

  // Sync state if preference events fire across components
  useEffect(() => {
    const handlePrefChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.type === 'language') {
        setSelectedLanguage(customEvent.detail.value);
      } else if (customEvent.detail?.type === 'consent') {
        setHasGivenConsent(customEvent.detail.value);
      } else if (customEvent.detail?.type === 'reset') {
        setSelectedLanguage('hi');
        setHasGivenConsent(false);
      }
    };

    window.addEventListener('pmajay_preference_change', handlePrefChange);
    return () => window.removeEventListener('pmajay_preference_change', handlePrefChange);
  }, []);

  // Update language and persist
  const handleSelectLanguage = (lang: SupportedLanguage) => {
    setSelectedLanguage(lang);
    userPreferences.setLanguage(lang);
    if (activeSession) {
      setActiveSession(prev => prev ? { ...prev, language: lang === 'auto' ? 'hi' : lang } : null);
    }
  };

  // Toggle/Set consent and persist
  const handleToggleConsent = (granted: boolean) => {
    setHasGivenConsent(granted);
    userPreferences.setConsent(granted);
  };

  // Initialize or resume interview session directly without redundant screens
  const startOrResumeInterview = async (langOverride?: SupportedLanguage) => {
    const lang = langOverride || selectedLanguage;
    const langCode = lang === 'auto' ? 'hi' : lang;

    try {
      const res = await api.startInterview({
        channel: 'voice_call',
        language: langCode,
        consentGiven: true
      });
      setActiveSession(res.session);
      setActiveCandidate(res.candidate);
      setCurrentView('beneficiary_interview');
    } catch (err) {
      console.error('Failed to start interview:', err);
    }
  };

  // 1. Start Voice Interview Flow
  const handleStartVoice = async () => {
    if (hasGivenConsent) {
      // User has already granted consent -> Go straight to interview using stored language
      await startOrResumeInterview();
    } else {
      // Prompt for consent once
      setCurrentView('beneficiary_consent');
    }
  };

  // 2. Consent given -> Store consent and proceed directly to interview using stored language
  const handleConsentGiven = async () => {
    handleToggleConsent(true);
    await startOrResumeInterview();
  };

  // 3. Language chosen explicitly -> Store language and enter interview session
  const handleLanguageProceed = async () => {
    handleToggleConsent(true);
    await startOrResumeInterview(selectedLanguage);
  };

  // Router dispatcher
  const handleSelectView = async (view: string) => {
    if (view === 'beneficiary_interview' || view === 'beneficiary') {
      if (hasGivenConsent) {
        if (!activeSession) {
          await startOrResumeInterview();
        } else {
          setCurrentView('beneficiary_interview');
        }
      } else {
        setCurrentView('beneficiary_consent');
      }
      return;
    }
    setCurrentView(view);
  };

  // 4. Interview complete -> Confirmation screen
  const handleCompleteInterview = (candidate: CandidateProfile) => {
    setActiveCandidate(candidate);
    setCurrentView('beneficiary_confirm');
  };

  // 5. Confirm profile -> NSQF recommendations
  const handleConfirmProfile = () => {
    setCurrentView('beneficiary_recommendations');
  };

  // 6. Evaluator 1-Click Persona Loader
  const handleSelectSample = async (sampleType: 'welder' | 'tailor' | 'tractor' | 'weaver') => {
    try {
      const res = await api.runDemoSample(sampleType);
      setActiveCandidate(res.candidate);
      setCurrentView('beneficiary_recommendations');
    } catch (err) {
      console.error('Failed to run demo sample:', err);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      isDark 
        ? 'bg-[#0a1120] text-[#E2E8F0] selection:bg-orange-500/30 selection:text-orange-200' 
        : 'bg-slate-50 text-slate-900 selection:bg-orange-500/30 selection:text-orange-800'
    }`}>
      {/* Universal Header */}
      <Header
        currentView={currentView}
        onSelectView={handleSelectView}
        selectedLanguage={selectedLanguage}
        onSelectLanguage={handleSelectLanguage}
        currentRole={currentRole}
        onChangeRole={(role) => setCurrentRole(role)}
        onOpenDemo={() => setIsDemoModalOpen(true)}
        onOpenEscalationModal={() => setIsEscalationModalOpen(true)}
      />

      {/* Accessible TalkBack Bar for Illiterate / Low-Literacy Users */}
      <TalkBackBar
        currentView={currentView}
        selectedLanguage={selectedLanguage}
      />

      {/* Main Content Area */}
      <main className="flex-1 relative pb-20 md:pb-6">
        {currentView === 'landing' && (
          <LandingPage
            onStartVoice={handleStartVoice}
            onOpenWhatsApp={() => setCurrentView('whatsapp')}
            onOpenKiosk={() => setCurrentView('kiosk')}
            onOpenAdmin={() => setCurrentView('admin')}
            onOpenMobile={() => setCurrentView('mobile')}
            onSelectSample={handleSelectSample}
            selectedLanguage={selectedLanguage}
            onSelectLanguage={handleSelectLanguage}
            hasGivenConsent={hasGivenConsent}
            onToggleConsent={handleToggleConsent}
          />
        )}

        {currentView === 'beneficiary_consent' && (
          <ConsentScreen
            selectedLanguage={selectedLanguage}
            onConsentGiven={handleConsentGiven}
            onBack={() => setCurrentView('landing')}
          />
        )}

        {currentView === 'beneficiary_language' && (
          <LanguageSelectScreen
            selectedLanguage={selectedLanguage}
            onSelectLanguage={handleSelectLanguage}
            onProceed={handleLanguageProceed}
            onBack={() => {
              if (activeSession) {
                setCurrentView('beneficiary_interview');
              } else {
                setCurrentView('landing');
              }
            }}
          />
        )}

        {currentView === 'beneficiary_interview' && activeSession && activeCandidate && (
          <VoiceInterviewScreen
            initialSession={activeSession}
            initialCandidate={activeCandidate}
            selectedLanguage={selectedLanguage}
            onChangeLanguage={() => setCurrentView('beneficiary_language')}
            onCompleteInterview={handleCompleteInterview}
            onRequestHumanHelp={() => setIsEscalationModalOpen(true)}
          />
        )}

        {currentView === 'beneficiary_confirm' && activeCandidate && (
          <ProfileConfirmScreen
            candidate={activeCandidate}
            selectedLanguage={selectedLanguage}
            onConfirm={handleConfirmProfile}
            onBack={() => setCurrentView('beneficiary_interview')}
          />
        )}

        {currentView === 'beneficiary_recommendations' && activeCandidate && (
          <RecommendationsScreen
            candidate={activeCandidate}
            selectedLanguage={selectedLanguage}
            onRestart={() => setCurrentView('landing')}
          />
        )}

        {currentView === 'mobile' && (
          <MobileAppExperience onExit={() => setCurrentView('landing')} />
        )}

        {currentView === 'whatsapp' && <WhatsAppSimulator />}

        {currentView === 'kiosk' && <OfflineKioskScreen />}

        {currentView === 'admin' && (
          <AdminDashboard
            onCancelLogin={() => setCurrentView('landing')}
          />
        )}
      </main>

      {/* Editorial Footer */}
      <footer className={`text-xs py-8 border-t transition-colors duration-200 ${
        isDark 
          ? 'bg-[#060a14] text-slate-400 border-white/10' 
          : 'bg-slate-100 text-slate-600 border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-amber-500">Vol. IV &bull; PM-AJAY</span>
              <span className="opacity-30">&bull;</span>
              <span className="font-editorial-serif italic text-sm font-semibold opacity-90">Ministry of Social Justice & Empowerment</span>
            </div>
            <p className="text-[11px] opacity-70 font-normal">
              Multilingual Speech Intelligence with Real-Time TalkBack &amp; NSQF Alignment Standard
            </p>
          </div>
          <div className="flex items-center space-x-6 text-[10px] tracking-[0.2em] uppercase font-semibold">
            <button 
              onClick={() => setIsDemoModalOpen(true)}
              className="hover:text-amber-500 transition cursor-pointer"
            >
              Evaluation Atelier
            </button>
            <span className="opacity-30">&bull;</span>
            <button 
              onClick={() => setCurrentView('admin')}
              className="hover:text-amber-500 transition cursor-pointer"
            >
              District Governance
            </button>
          </div>
        </div>
      </footer>

      {/* Mobile-First Bottom Navigation Bar */}
      <MobileBottomNav
        currentView={currentView}
        onSelectView={handleSelectView}
        selectedLanguage={selectedLanguage}
        onSelectLanguage={handleSelectLanguage}
        onOpenDemo={() => setIsDemoModalOpen(true)}
        onOpenEscalationModal={() => setIsEscalationModalOpen(true)}
      />

      {/* Modals */}
      <DemoConversationModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onSelectSample={handleSelectSample}
      />

      <HumanHelpModal
        isOpen={isEscalationModalOpen}
        onClose={() => setIsEscalationModalOpen(false)}
        candidateId={activeCandidate?.candidateId}
        defaultDistrict={activeCandidate?.location.district}
        defaultLanguage={selectedLanguage}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}

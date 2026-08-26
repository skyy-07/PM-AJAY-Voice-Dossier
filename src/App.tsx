import React, { useState } from 'react';
import { Header } from './components/Header.js';
import { TalkBackBar } from './components/common/TalkBackBar.js';
import { LandingPage } from './components/landing/LandingPage.js';
import { ConsentScreen } from './components/beneficiary/ConsentScreen.js';
import { LanguageSelectScreen } from './components/beneficiary/LanguageSelectScreen.js';
import { VoiceInterviewScreen } from './components/beneficiary/VoiceInterviewScreen.js';
import { ProfileConfirmScreen } from './components/beneficiary/ProfileConfirmScreen.js';
import { RecommendationsScreen } from './components/beneficiary/RecommendationsScreen.js';
import { WhatsAppSimulator } from './components/whatsapp/WhatsAppSimulator.js';
import { OfflineKioskScreen } from './components/kiosk/OfflineKioskScreen.js';
import { AdminDashboard } from './components/admin/AdminDashboard.js';
import { DemoConversationModal } from './components/common/DemoConversationModal.js';
import { HumanHelpModal } from './components/common/HumanHelpModal.js';
import { ThemeProvider, useTheme } from './context/ThemeContext.js';

import { SupportedLanguage, UserRole, CandidateProfile, ActiveInterviewSession } from './types.js';
import { api } from './lib/api.js';

function MainApp() {
  const [currentView, setCurrentView] = useState<string>('landing');
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('hi');
  const [currentRole, setCurrentRole] = useState<UserRole>('beneficiary');
  
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Active session and candidate
  const [activeSession, setActiveSession] = useState<ActiveInterviewSession | null>(null);
  const [activeCandidate, setActiveCandidate] = useState<CandidateProfile | null>(null);

  // Modals
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isEscalationModalOpen, setIsEscalationModalOpen] = useState(false);

  // 1. Start Voice Interview Flow
  const handleStartVoice = () => {
    setCurrentView('beneficiary_consent');
  };

  // 2. Consent given -> Go to language or directly to interview
  const handleConsentGiven = async () => {
    setCurrentView('beneficiary_language');
  };

  // 3. Language chosen -> Initialize interview session
  const handleLanguageProceed = async () => {
    try {
      const res = await api.startInterview({
        channel: 'voice_call',
        language: selectedLanguage === 'auto' ? 'hi' : selectedLanguage,
        consentGiven: true
      });
      setActiveSession(res.session);
      setActiveCandidate(res.candidate);
      setCurrentView('beneficiary_interview');
    } catch (err) {
      console.error('Failed to start interview:', err);
    }
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
        onSelectView={(view) => setCurrentView(view)}
        selectedLanguage={selectedLanguage}
        onSelectLanguage={(lang) => setSelectedLanguage(lang)}
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
      <main className="flex-1 relative">
        {currentView === 'landing' && (
          <LandingPage
            onStartVoice={handleStartVoice}
            onOpenWhatsApp={() => setCurrentView('whatsapp')}
            onOpenKiosk={() => setCurrentView('kiosk')}
            onOpenAdmin={() => setCurrentView('admin')}
            onSelectSample={handleSelectSample}
            selectedLanguage={selectedLanguage}
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
            onSelectLanguage={(l) => setSelectedLanguage(l)}
            onProceed={handleLanguageProceed}
            onBack={() => setCurrentView('beneficiary_consent')}
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

        {currentView === 'whatsapp' && <WhatsAppSimulator />}

        {currentView === 'kiosk' && <OfflineKioskScreen />}

        {currentView === 'admin' && <AdminDashboard />}
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

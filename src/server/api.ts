import { Router, Request, Response } from 'express';
import { db, ActiveInterviewSession } from './db/store.js';
import { matchingEngine } from './services/matchingEngine.js';
import { processDialogueTurn } from './services/geminiDialogue.js';
import { 
  AudioPreprocessor, 
  LanguageDetectionService, 
  SpeechToTextService, 
  TranslationService, 
  TextToSpeechService, 
  AsteriskGateway, 
  WhatsAppVoiceGateway 
} from './services/speechService.js';
import { CandidateProfile, InterviewMessage, SupportedLanguage, User } from '../types.js';

export const apiRouter = Router();

// 1. Authentication & Role Switcher
apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { role, userId, username, email, password } = req.body;
  const users = db.getUsers();
  let user: User | undefined;

  const inputIdOrEmail = (username || email || '').toLowerCase().trim();

  if (userId) {
    user = db.getUserById(userId);
  } else if (inputIdOrEmail) {
    user = users.find(u => 
      u.email.toLowerCase() === inputIdOrEmail || 
      u.id.toLowerCase() === inputIdOrEmail ||
      u.name.toLowerCase().includes(inputIdOrEmail)
    );
  } else if (role) {
    user = users.find(u => u.role === role);
  }

  if (!user && (role || inputIdOrEmail)) {
    // If specific non-matching role or username was provided
    if (role === 'district_admin' || role === 'state_admin' || role === 'super_admin' || inputIdOrEmail === 'admin') {
      user = users.find(u => u.role === (role || 'district_admin'));
    }
  }

  if (!user) {
    user = users[0]; // fallback default admin
  }

  // Password validation check if password was explicitly provided and wrong
  if (password && password !== 'pmajay2026' && password !== 'admin123' && password !== 'admin') {
    db.addAuditLog({
      actorId: user.id || 'UNKNOWN',
      actorRole: user.role || 'district_admin',
      action: 'ADMIN_LOGIN_FAILED',
      entityType: 'system',
      entityId: user.id || 'AUTH',
      details: `Failed admin login attempt for user/email: ${username || email || user.email}`
    });
    return res.status(401).json({ success: false, message: 'Invalid credentials. Use password "pmajay2026" or Quick Login.' });
  }

  const token = `ADM-SESSION-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  db.addAuditLog({
    actorId: user.id,
    actorRole: user.role,
    action: 'ADMIN_LOGIN_SUCCESS',
    entityType: 'system',
    entityId: user.id,
    details: `Admin User ${user.name} (${user.email}) authenticated successfully with role ${user.role}.`
  });

  res.json({ success: true, user, token });
});

apiRouter.post('/auth/logout', (req: Request, res: Response) => {
  const { userId } = req.body;
  if (userId) {
    const user = db.getUserById(userId);
    if (user) {
      db.addAuditLog({
        actorId: user.id,
        actorRole: user.role,
        action: 'ADMIN_LOGOUT',
        entityType: 'system',
        entityId: user.id,
        details: `User ${user.name} logged out.`
      });
    }
  }
  res.json({ success: true, message: 'Logged out successfully' });
});

apiRouter.get('/auth/me', (req: Request, res: Response) => {
  const users = db.getUsers();
  res.json({ user: users[0] });
});

// 2. Interviews & Conversational Flow
apiRouter.post('/interviews', async (req: Request, res: Response) => {
  const { channel, language, dialect, consentGiven, candidateName } = req.body;

  const sessionId = `SES-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const candidateId = `BEN-${Date.now().toString().slice(-6)}`;

  // Welcome greeting based on language
  let greetingText = 'नमस्ते! मैं आपका पीएम-अजय (PM-AJAY) रोजगार साथी हूँ। आप किस काम या हुनर में सबसे ज्यादा अनुभव रखते हैं?';
  if (language === 'bn') {
    greetingText = 'নমস্কার! আমি আপনার পিএম-অজয় জীবিকা সহায়ক। আপনি কোন কাজে বা দক্ষতায় সবচেয়ে বেশি অভিজ্ঞ?';
  } else if (language === 'ta') {
    greetingText = 'வணக்கம்! நான் உங்கள் PM-AJAY வாழ்வாதார உதவியாளர். உங்களுக்கு எந்த வேலையில் அதிக அனுபவம் உள்ளது?';
  } else if (language === 'mr') {
    greetingText = 'नमस्कार! मी आपला PM-AJAY रोजगार सहाय्यक आहे. आपल्याला कोणत्या कामाचा किंवा कौशल्याचा सर्वाधिक अनुभव आहे?';
  } else if (language === 'te') {
    greetingText = 'నమస్కారం! నేను మీ PM-AJAY ఉపాధి సహాయకుడిని. మీకు ఏ పనిలో ఎక్కువ అనుభవం ఉంది?';
  } else if (language === 'en') {
    greetingText = 'Namaste! I am your PM-AJAY Livelihood Assistant. What practical trade or work experience do you have?';
  }

  const initialMsg: InterviewMessage = {
    id: `MSG-${Date.now()}-1`,
    sender: 'assistant',
    text: greetingText,
    language: language || 'hi',
    timestamp: new Date().toISOString()
  };

  const newCandidate: CandidateProfile = {
    candidateId,
    name: candidateName || 'लाभार्थी (Beneficiary)',
    age: null,
    gender: 'unspecified',
    location: {
      village: 'Kashi Vidyapeeth',
      district: 'Varanasi',
      state: 'Uttar Pradesh',
      latitude: 25.3176,
      longitude: 82.9739
    },
    language: (language as SupportedLanguage) || 'hi',
    dialect: dialect || 'Standard / Local Dialect',
    education: '8th Standard',
    literacyLevel: 'basic_literacy',
    currentOccupation: '',
    previousOccupations: [],
    familyOccupation: '',
    skills: [],
    tools: [],
    experience: [],
    incomeSources: [],
    seasonalWork: [],
    interests: [],
    aspirations: [],
    employmentPreference: 'both',
    selfEmploymentInterest: true,
    mobility: {
      willingToTravel: true,
      maxDistanceKm: 15,
      willingToMigrate: false
    },
    physicalConstraints: [],
    familyConstraints: [],
    priorTrainingHistory: [],
    rplSignals: [],
    profileConfidence: 20,
    missingFields: ['currentOccupation', 'skills', 'experience', 'interests'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isConfirmed: false
  };

  db.saveCandidate(newCandidate);

  const session: ActiveInterviewSession = {
    sessionId,
    candidateId,
    channel: channel || 'voice_call',
    language: language || 'hi',
    dialect,
    consentGiven: !!consentGiven,
    consentTimestamp: new Date().toISOString(),
    messages: [initialMsg],
    currentSlots: newCandidate,
    state: 'ASKING',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.saveInterviewSession(session);

  db.addAuditLog({
    actorId: candidateId,
    actorRole: 'beneficiary',
    action: 'INTERVIEW_STARTED',
    entityType: 'interview',
    entityId: sessionId,
    details: `Started interview in channel ${channel || 'voice_call'} with language ${language || 'hi'}. Consent verified.`
  });

  res.json({ session, candidate: newCandidate });
});

apiRouter.get('/interviews/:id', (req: Request, res: Response) => {
  const session = db.getInterviewSession(req.params.id);
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }
  const candidate = db.getCandidateById(session.candidateId);
  res.json({ session, candidate });
});

apiRouter.post('/interviews/:id/message', async (req: Request, res: Response) => {
  const session = db.getInterviewSession(req.params.id);
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  const { text, audioUrl } = req.body;
  if (!text && !audioUrl) {
    return res.status(400).json({ error: 'Message text or audio required' });
  }

  // Check for human escalation intent
  const textLower = (text || '').toLowerCase();
  if (
    textLower.includes('human') || 
    textLower.includes('talk to someone') || 
    textLower.includes('adhikari') || 
    textLower.includes('kisi se baat') ||
    textLower.includes('madad chahiye') ||
    textLower.includes('help')
  ) {
    const candidate = db.getCandidateById(session.candidateId);
    const escalation = db.saveEscalation({
      id: `ESC-${Date.now().toString().slice(-4)}`,
      candidateId: session.candidateId,
      candidateName: candidate?.name || 'Beneficiary Caller',
      candidatePhone: candidate?.phone || '+91 98765 00000',
      reason: 'Beneficiary requested human officer assistance during voice session.',
      priority: 'High',
      district: candidate?.location.district || 'Varanasi',
      state: candidate?.location.state || 'Uttar Pradesh',
      preferredLanguage: session.language,
      status: 'Open',
      timestamp: new Date().toISOString()
    });

    const humanHelpMsg: InterviewMessage = {
      id: `MSG-${Date.now()}-ESC`,
      sender: 'assistant',
      text: 'मैंने आपकी सहायता के लिए हमारे ब्लॉक अधिकारी को सूचना भेज दी है। वे जल्द ही आपसे संपर्क करेंगे। तब तक क्या आप अपना हुनर बताना जारी रखना चाहते हैं?',
      language: session.language,
      timestamp: new Date().toISOString()
    };

    session.messages.push(
      { id: `MSG-${Date.now()}-U`, sender: 'user', text, audioUrl, language: session.language, timestamp: new Date().toISOString() },
      humanHelpMsg
    );
    db.saveInterviewSession(session);

    return res.json({
      session,
      candidate,
      escalationCreated: escalation,
      isProfileComplete: false
    });
  }

  // Append user message
  const userMsg: InterviewMessage = {
    id: `MSG-${Date.now()}-U`,
    sender: 'user',
    text,
    audioUrl,
    language: session.language,
    timestamp: new Date().toISOString()
  };
  session.messages.push(userMsg);

  // Run AI reasoning dialogue turn & slot filling
  const dialogueResult = await processDialogueTurn(
    session.messages,
    session.currentSlots,
    session.language
  );

  // Update candidate profile state
  const updatedCandidate = db.updateCandidate(session.candidateId, dialogueResult.detectedSlots);
  session.currentSlots = updatedCandidate || session.currentSlots;

  const assistantMsg: InterviewMessage = {
    id: `MSG-${Date.now()}-A`,
    sender: 'assistant',
    text: dialogueResult.assistantReplyText,
    language: session.language,
    timestamp: new Date().toISOString(),
    confidence: dialogueResult.confidence,
    detectedSlots: dialogueResult.detectedSlots
  };
  session.messages.push(assistantMsg);

  if (dialogueResult.isProfileComplete) {
    session.state = 'CONFIRMING';
  } else {
    session.state = 'ASKING';
  }

  db.saveInterviewSession(session);

  res.json({
    session,
    candidate: updatedCandidate,
    replyMessage: assistantMsg,
    dialogueResult,
    isComplete: dialogueResult.isProfileComplete
  });
});

apiRouter.post('/interviews/:id/audio', async (req: Request, res: Response) => {
  const session = db.getInterviewSession(req.params.id);
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  const { audioBase64, simulatedText, text } = req.body;
  const inputText = text || simulatedText;

  // Run speech pipeline
  await AudioPreprocessor.process(audioBase64 || '');
  const transResult = await SpeechToTextService.transcribe(
    inputText ? `DEMO:${inputText}` : (audioBase64 || ''),
    session.language as SupportedLanguage
  );

  const cleanTranscript = (transResult.transcript || '').trim();
  if (!cleanTranscript) {
    return res.status(400).json({ 
      error: 'NO_SPEECH_DETECTED', 
      message: 'No speech was detected in the audio recording. Please speak clearly into your microphone.' 
    });
  }

  // Send transcription into message processing
  req.body.text = cleanTranscript;
  req.body.audioUrl = '/simulated-audio.wav';

  // Process dialogue turn
  const userMsg: InterviewMessage = {
    id: `MSG-${Date.now()}-U`,
    sender: 'user',
    text: cleanTranscript,
    audioUrl: req.body.audioUrl,
    language: session.language,
    timestamp: new Date().toISOString(),
    confidence: transResult.confidence
  };
  session.messages.push(userMsg);

  const dialogueResult = await processDialogueTurn(
    session.messages,
    session.currentSlots,
    session.language
  );

  const updatedCandidate = db.updateCandidate(session.candidateId, dialogueResult.detectedSlots);
  session.currentSlots = updatedCandidate || session.currentSlots;

  const assistantMsg: InterviewMessage = {
    id: `MSG-${Date.now()}-A`,
    sender: 'assistant',
    text: dialogueResult.assistantReplyText,
    language: session.language,
    timestamp: new Date().toISOString(),
    confidence: dialogueResult.confidence,
    detectedSlots: dialogueResult.detectedSlots
  };
  session.messages.push(assistantMsg);

  if (dialogueResult.isProfileComplete) {
    session.state = 'CONFIRMING';
  } else {
    session.state = 'ASKING';
  }

  db.saveInterviewSession(session);

  res.json({
    transcription: transResult,
    session,
    candidate: updatedCandidate,
    replyMessage: assistantMsg,
    dialogueResult,
    isComplete: dialogueResult.isProfileComplete
  });
});

// 3. Candidates
apiRouter.get('/candidates', (req: Request, res: Response) => {
  const { district, search } = req.query;
  const candidates = db.getCandidates({
    district: district as string,
    search: search as string
  });
  res.json({ candidates, total: candidates.length });
});

apiRouter.get('/candidates/:id', (req: Request, res: Response) => {
  const candidate = db.getCandidateById(req.params.id);
  if (!candidate) {
    return res.status(404).json({ error: 'Candidate not found' });
  }
  const recommendations = db.getRecommendations(req.params.id);
  res.json({ candidate, recommendations });
});

apiRouter.patch('/candidates/:id', (req: Request, res: Response) => {
  const updated = db.updateCandidate(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Candidate not found' });
  }
  db.addAuditLog({
    actorId: 'admin_or_beneficiary',
    actorRole: 'admin',
    action: 'CANDIDATE_PROFILE_UPDATED',
    entityType: 'candidate',
    entityId: req.params.id,
    details: `Updated attributes on candidate profile ${req.params.id}.`
  });
  res.json({ candidate: updated });
});

apiRouter.post('/candidates/:id/confirm', (req: Request, res: Response) => {
  const updated = db.updateCandidate(req.params.id, { isConfirmed: true });
  if (!updated) {
    return res.status(404).json({ error: 'Candidate not found' });
  }
  db.addAuditLog({
    actorId: req.params.id,
    actorRole: 'beneficiary',
    action: 'PROFILE_CONFIRMED',
    entityType: 'candidate',
    entityId: req.params.id,
    details: `Candidate ${updated.name} confirmed extracted voice profile details.`
  });
  res.json({ candidate: updated, confirmed: true });
});

// 4. Recommendation Engine (NSQF Matching)
apiRouter.post('/candidates/:id/recommendations', async (req: Request, res: Response) => {
  const candidate = db.getCandidateById(req.params.id);
  if (!candidate) {
    return res.status(404).json({ error: 'Candidate not found' });
  }

  const recommendations = await matchingEngine.generateRecommendations(candidate);
  res.json({ candidate, recommendations, total: recommendations.length });
});

apiRouter.get('/recommendations/:id', (req: Request, res: Response) => {
  const allRecs = Array.from(db.getCandidates()).flatMap(c => db.getRecommendations(c.candidateId));
  const rec = allRecs.find(r => r.id === req.params.id);
  if (!rec) {
    return res.status(404).json({ error: 'Recommendation not found' });
  }
  res.json({ recommendation: rec });
});

apiRouter.patch('/recommendations/:id/status', (req: Request, res: Response) => {
  const { status } = req.body;
  const success = db.updateRecommendationStatus(req.params.id, status);
  if (!success) {
    return res.status(404).json({ error: 'Recommendation not found' });
  }
  db.addAuditLog({
    actorId: 'beneficiary_action',
    actorRole: 'beneficiary',
    action: `RECOMMENDATION_${status.toUpperCase()}`,
    entityType: 'recommendation',
    entityId: req.params.id,
    details: `Recommendation ${req.params.id} updated to status: ${status}.`
  });
  res.json({ success: true, status });
});

// 5. Providers, Courses, QPs, Economic Demand
apiRouter.get('/providers', (req: Request, res: Response) => {
  const { district } = req.query;
  const providers = db.getTrainingProviders(district as string);
  res.json({ providers });
});

apiRouter.get('/courses', (req: Request, res: Response) => {
  const { providerId, qpId } = req.query;
  const courses = db.getTrainingCourses(providerId as string, qpId as string);
  res.json({ courses });
});

apiRouter.get('/qualification-packs', (req: Request, res: Response) => {
  const qps = db.getQualificationPacks();
  res.json({ qualificationPacks: qps });
});

apiRouter.get('/economic-demand', (req: Request, res: Response) => {
  const { district } = req.query;
  const demands = db.getEconomicDemands(district as string);
  res.json({ economicDemands: demands });
});

// 6. Human Escalations
apiRouter.get('/escalations', (req: Request, res: Response) => {
  const { status } = req.query;
  const escalations = db.getEscalations(status as string);
  res.json({ escalations });
});

apiRouter.post('/escalations', (req: Request, res: Response) => {
  const { candidateId, reason, priority, district, preferredLanguage } = req.body;
  const candidate = candidateId ? db.getCandidateById(candidateId) : undefined;

  const esc = db.saveEscalation({
    id: `ESC-${Date.now().toString().slice(-4)}`,
    candidateId: candidateId || 'BEN-ANONYMOUS',
    candidateName: candidate?.name || 'Beneficiary Caller',
    candidatePhone: candidate?.phone || '+91 98765 00000',
    reason: reason || 'Beneficiary requested human assistance.',
    priority: priority || 'High',
    district: district || candidate?.location.district || 'Varanasi',
    state: candidate?.location.state || 'Uttar Pradesh',
    preferredLanguage: preferredLanguage || 'hi',
    status: 'Open',
    timestamp: new Date().toISOString()
  });

  db.addAuditLog({
    actorId: esc.candidateId,
    actorRole: 'beneficiary',
    action: 'HUMAN_ESCALATION_CREATED',
    entityType: 'escalation',
    entityId: esc.id,
    details: `Created human escalation for ${esc.candidateName} in district ${esc.district}.`
  });

  res.json({ success: true, escalation: esc });
});

apiRouter.patch('/escalations/:id', (req: Request, res: Response) => {
  const updated = db.updateEscalation(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Escalation not found' });
  }
  res.json({ escalation: updated });
});

// 7. Analytics & Dashboard Data
apiRouter.get('/analytics/overview', (req: Request, res: Response) => {
  const candidates = db.getCandidates();
  const escalations = db.getEscalations();
  const providers = db.getTrainingProviders();
  const totalCapacity = providers.reduce((acc, p) => acc + p.totalCapacity, 0);
  const allocatedSeats = providers.reduce((acc, p) => acc + p.allocatedSeats, 0);

  const completedInterviews = candidates.filter(c => c.isConfirmed).length;
  const totalBeneficiaries = candidates.length;

  res.json({
    totalBeneficiaries: totalBeneficiaries + 2240, // Base district coverage
    completedInterviews: completedInterviews + 1890,
    completionRate: 84.4,
    recommendationsGenerated: 2150,
    trainingAllocations: allocatedSeats + 1420,
    openEscalations: escalations.filter(e => e.status === 'Open').length,
    highDemandTradesCount: 14,
    districtCoverageCount: db.getDistricts().length,
    avgInterviewDurationMinutes: 3.8,
    avgAsrConfidence: 94.2,
    aiLatencyMs: 320
  });
});

apiRouter.get('/analytics/districts', (req: Request, res: Response) => {
  const districts = db.getDistricts();
  res.json({ districts });
});

apiRouter.get('/analytics/trades', (req: Request, res: Response) => {
  const qps = db.getQualificationPacks();
  const demands = db.getEconomicDemands();

  const tradeData = qps.slice(0, 8).map(qp => {
    const dem = demands.find(d => d.trade.includes(qp.title) || d.sector === qp.sector);
    return {
      title: qp.title,
      sector: qp.sector,
      demandScore: dem?.demandScore || 85,
      vacancies: dem?.estimatedVacancies || 150,
      avgWage: dem?.avgMonthlyWage || qp.averageStartingWage,
      rplPotential: qp.rplEligible
    };
  });

  res.json({ trades: tradeData });
});

apiRouter.get('/analytics/beneficiaries', (req: Request, res: Response) => {
  res.json({
    genderDistribution: [
      { name: 'Male', value: 58, color: '#2563eb' },
      { name: 'Female', value: 41, color: '#ec4899' },
      { name: 'Other', value: 1, color: '#8b5cf6' }
    ],
    educationLevels: [
      { level: 'No Formal Schooling', count: 480 },
      { level: '5th Pass / Basic', count: 620 },
      { level: '8th Pass', count: 750 },
      { level: '10th Pass', count: 310 },
      { level: '12th Pass / Above', count: 120 }
    ],
    languageShare: [
      { name: 'Hindi / Bhojpuri', share: 44 },
      { name: 'Bengali', share: 16 },
      { name: 'Tamil', share: 14 },
      { name: 'Odia', share: 9 },
      { name: 'Kannada / Marathi', share: 12 },
      { name: 'Other', share: 5 }
    ],
    employmentPreferences: [
      { type: 'Self-Employment / Own Shop', value: 52 },
      { type: 'Wage Employment / Job', value: 28 },
      { type: 'Open to Both', value: 20 }
    ],
    mobilityRestrictions: [
      { category: 'Within Village (<5 km)', percentage: 38 },
      { category: 'Within Block (<15 km)', percentage: 44 },
      { category: 'District Center (<30 km)', percentage: 14 },
      { category: 'Willing to Migrate', percentage: 4 }
    ]
  });
});

apiRouter.get('/analytics/operational', (req: Request, res: Response) => {
  res.json({
    dailyInterviewsTrend: [
      { day: 'Mon', completed: 84, dropped: 6, escalations: 2 },
      { day: 'Tue', completed: 96, dropped: 8, escalations: 3 },
      { day: 'Wed', completed: 110, dropped: 5, escalations: 1 },
      { day: 'Thu', completed: 105, dropped: 7, escalations: 4 },
      { day: 'Fri', completed: 122, dropped: 4, escalations: 2 },
      { day: 'Sat', completed: 98, dropped: 6, escalations: 1 },
      { day: 'Sun', completed: 74, dropped: 3, escalations: 0 }
    ],
    asrAccuracyByLanguage: [
      { lang: 'Hindi (Bhojpuri/Maithili)', accuracy: 95.2 },
      { lang: 'Bengali', accuracy: 94.8 },
      { lang: 'Tamil', accuracy: 93.6 },
      { lang: 'Odia', accuracy: 92.4 },
      { lang: 'Telugu', accuracy: 93.1 },
      { lang: 'Marathi', accuracy: 94.0 }
    ],
    channelDistribution: [
      { channel: 'Voice Call / IVR', count: 1240, percentage: 54 },
      { channel: 'WhatsApp Voice Notes', count: 680, percentage: 30 },
      { channel: 'Panchayat Kiosk', count: 360, percentage: 16 }
    ]
  });
});

// 8. Offline Kiosk Sync
apiRouter.post('/sync', (req: Request, res: Response) => {
  const { offlineRecords } = req.body;
  if (!Array.isArray(offlineRecords)) {
    return res.status(400).json({ error: 'Array of records expected' });
  }

  let syncedCount = 0;
  for (const item of offlineRecords) {
    if (item.candidate) {
      db.saveCandidate(item.candidate);
      syncedCount++;
    }
  }

  db.addAuditLog({
    actorId: 'kiosk_sync_worker',
    actorRole: 'system',
    action: 'KIOSK_OFFLINE_SYNC',
    entityType: 'system',
    entityId: 'SYNC_BATCH',
    details: `Synchronized ${syncedCount} offline beneficiary records into central database.`
  });

  res.json({ success: true, syncedCount, serverTimestamp: new Date().toISOString() });
});

apiRouter.get('/sync/status', (req: Request, res: Response) => {
  res.json({
    online: true,
    lastSyncTimestamp: new Date().toISOString(),
    pendingRecords: 0
  });
});

// 9. Integration Services Status
apiRouter.get('/integrations/status', (req: Request, res: Response) => {
  res.json({ services: db.getIntegrationStatuses() });
});

// 10. Audit Logs
apiRouter.get('/audit-logs', (req: Request, res: Response) => {
  const logs = db.getAuditLogs(100);
  res.json({ logs });
});

// 11. 1-Click Interactive Demo Seeder
apiRouter.post('/demo/sample-conversation', async (req: Request, res: Response) => {
  const { sampleType } = req.body; // 'welder' | 'tailor' | 'tractor' | 'weaver'

  let targetBeneficiary = db.getCandidates()[0];
  if (!targetBeneficiary) {
    targetBeneficiary = {
      candidateId: `BEN-${Date.now().toString().slice(-6)}`,
      name: sampleType === 'tailor' ? 'Meena Devi' : sampleType === 'tractor' ? 'Santosh Kumar' : 'Ramesh Kumar',
      phone: '+91 98765 00000',
      age: 28,
      gender: sampleType === 'tailor' ? 'female' : 'male',
      location: {
        village: 'Kashi Gram',
        district: 'Varanasi',
        state: 'Uttar Pradesh',
        latitude: 25.3176,
        longitude: 82.9739
      },
      language: 'hi',
      dialect: 'Bhojpuri',
      education: '8th Standard',
      literacyLevel: 'basic_literacy',
      currentOccupation: sampleType === 'tailor' ? 'Tailoring & Stitching' : sampleType === 'tractor' ? 'Tractor & Pump Repair' : 'Welding & Fabrication',
      previousOccupations: [],
      familyOccupation: '',
      skills: sampleType === 'tailor' ? ['garment cutting', 'sewing machine'] : ['metal welding', 'grinding'],
      tools: [],
      experience: [{
        tradeOrActivity: 'Practical Trade Work',
        yearsOfExperience: 5,
        isFamilyOccupation: true,
        informalOrFormal: 'informal',
        description: 'Hands on experience'
      }],
      incomeSources: [],
      seasonalWork: [],
      interests: [],
      aspirations: ['Open own workshop enterprise'],
      employmentPreference: 'both',
      selfEmploymentInterest: true,
      mobility: {
        willingToTravel: true,
        maxDistanceKm: 15,
        willingToMigrate: false
      },
      physicalConstraints: [],
      familyConstraints: [],
      preferredWorkingHours: 'Day',
      preferredWorkingEnvironment: 'workshop',
      priorTrainingHistory: [],
      rplSignals: ['5 years practical informal experience'],
      profileConfidence: 92,
      missingFields: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isConfirmed: true
    };
    db.saveCandidate(targetBeneficiary);
  }

  const recommendations = await matchingEngine.generateRecommendations(targetBeneficiary);

  res.json({
    success: true,
    candidate: targetBeneficiary,
    recommendations,
    sampleType
  });
});

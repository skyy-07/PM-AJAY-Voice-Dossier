import { CandidateProfile, SupportedLanguage } from '../types';

export interface CachedInterviewSession {
  sessionId: string;
  candidateId: string;
  language: SupportedLanguage;
  stepNumber: number;
  totalSteps: number;
  questionTitle: string;
  questionSubtitle?: string;
  suggestedExamples?: string[];
  profile: Partial<CandidateProfile>;
  transcript: Array<{
    speaker: 'assistant' | 'user';
    text: string;
    timestamp: string;
  }>;
  lastSavedAt: string;
  isComplete: boolean;
}

export interface OfflineQueuedTurn {
  id: string;
  sessionId: string;
  stepNumber: number;
  userInputText: string;
  timestamp: string;
  language: SupportedLanguage;
  status: 'pending' | 'syncing' | 'synced' | 'failed';
  retryCount: number;
  error?: string;
}

const STORAGE_KEYS = {
  CACHED_SESSION: 'pmajay_cached_interview_session',
  OFFLINE_QUEUE: 'pmajay_offline_turns_queue',
  LAST_SYNC_TIME: 'pmajay_last_sync_timestamp',
  FORCE_OFFLINE_SIM: 'pmajay_simulate_offline',
};

// 1. Session Cache Utilities
export function saveCachedSession(session: CachedInterviewSession): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CACHED_SESSION, JSON.stringify(session));
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC_TIME, new Date().toISOString());
  } catch (e) {
    console.warn('Failed to save interview session to localStorage:', e);
  }
}

export function getCachedSession(): CachedInterviewSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CACHED_SESSION);
    if (!raw) return null;
    return JSON.parse(raw) as CachedInterviewSession;
  } catch (e) {
    console.warn('Failed to read cached interview session:', e);
    return null;
  }
}

export function clearCachedSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.CACHED_SESSION);
  } catch (e) {
    console.warn('Failed to clear cached session:', e);
  }
}

// 2. Offline Queue Utilities
export function enqueueOfflineTurn(turn: {
  sessionId: string;
  stepNumber: number;
  userInputText: string;
  language: SupportedLanguage;
}): OfflineQueuedTurn {
  const queue = getQueuedTurns();
  const newTurn: OfflineQueuedTurn = {
    id: `turn_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    sessionId: turn.sessionId,
    stepNumber: turn.stepNumber,
    userInputText: turn.userInputText,
    timestamp: new Date().toISOString(),
    language: turn.language,
    status: 'pending',
    retryCount: 0,
  };

  queue.push(newTurn);
  try {
    localStorage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify(queue));
  } catch (e) {
    console.warn('Failed to save turn to offline queue:', e);
  }
  return newTurn;
}

export function getQueuedTurns(): OfflineQueuedTurn[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.OFFLINE_QUEUE);
    if (!raw) return [];
    return JSON.parse(raw) as OfflineQueuedTurn[];
  } catch (e) {
    console.warn('Failed to read offline turns queue:', e);
    return [];
  }
}

export function removeQueuedTurn(id: string): void {
  try {
    const queue = getQueuedTurns().filter((t) => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify(queue));
  } catch (e) {
    console.warn('Failed to remove queued turn:', e);
  }
}

export function clearQueuedTurns(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.OFFLINE_QUEUE);
  } catch (e) {
    console.warn('Failed to clear queued turns:', e);
  }
}

export function getLastSyncTime(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.LAST_SYNC_TIME);
  } catch {
    return null;
  }
}

export function isOfflineSimulationActive(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEYS.FORCE_OFFLINE_SIM) === 'true';
  } catch {
    return false;
  }
}

export function setOfflineSimulationActive(active: boolean): void {
  try {
    if (active) {
      localStorage.setItem(STORAGE_KEYS.FORCE_OFFLINE_SIM, 'true');
    } else {
      localStorage.removeItem(STORAGE_KEYS.FORCE_OFFLINE_SIM);
    }
  } catch (e) {
    console.warn('Failed to toggle offline simulation:', e);
  }
}

export function toggleOfflineSimulation(): boolean {
  const current = isOfflineSimulationActive();
  setOfflineSimulationActive(!current);
  return !current;
}

export function checkIsOnline(): boolean {
  if (isOfflineSimulationActive()) {
    return false;
  }
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}

// 3. Fallback Heuristic Profile Extractor when network is offline
export function extractOfflineProfileDeltas(
  text: string,
  _lang: SupportedLanguage,
  stepNumber: number,
  existingProfile?: Partial<CandidateProfile>
): {
  updatedProfile: Partial<CandidateProfile>;
  nextQuestion: string;
  questionSubtitle?: string;
  isComplete: boolean;
} {
  const lower = text.toLowerCase();
  const prof: Partial<CandidateProfile> = { ...(existingProfile || {}) };

  const informalSkills = new Set(prof.informalSkills || []);
  const tradeInterests = new Set(prof.tradeInterests || []);
  const familyTraditionalSkills = new Set(prof.familyTraditionalSkills || []);

  // Check electrical / wiring
  if (
    lower.includes('बिजली') ||
    lower.includes('वायरिंग') ||
    lower.includes('electric') ||
    lower.includes('wire') ||
    lower.includes('মোটর') ||
    lower.includes('বিদ্যুৎ') ||
    lower.includes('वायर')
  ) {
    informalSkills.add('Basic electrical wiring');
    informalSkills.add('Water pump motor repairs');
    tradeInterests.add('Electrician (Domestic/Industrial)');
  }

  // Check tailoring / sewing / garments
  if (
    lower.includes('सिलाई') ||
    lower.includes('कपड़ा') ||
    lower.includes('tailor') ||
    lower.includes('stitch') ||
    lower.includes('সেলাই') ||
    lower.includes('পোশাক') ||
    lower.includes('शिलाई') ||
    lower.includes('தையல்')
  ) {
    informalSkills.add('Garment stitching');
    familyTraditionalSkills.add('Traditional tailoring');
    tradeInterests.add('Self-Employed Tailor');
  }

  // Check automotive / two-wheeler
  if (
    lower.includes('बाइक') ||
    lower.includes('ऑटो') ||
    lower.includes('garage') ||
    lower.includes('bike') ||
    lower.includes('গ্যারেজ') ||
    lower.includes('दुरुस्ती') ||
    lower.includes('வண்டி')
  ) {
    informalSkills.add('Two-wheeler basic mechanics');
    tradeInterests.add('Automotive Service Technician');
  }

  // Check farming / agriculture / dairy
  if (
    lower.includes('खेती') ||
    lower.includes('पशु') ||
    lower.includes('दूध') ||
    lower.includes('farm') ||
    lower.includes('dairy') ||
    lower.includes('চাষ') ||
    lower.includes('গরু') ||
    lower.includes('शेती') ||
    lower.includes('விவசாயம்')
  ) {
    familyTraditionalSkills.add('Dairy cattle & organic farming');
  }

  // Check solar / clean energy
  if (
    lower.includes('सोलर') ||
    lower.includes('सौर') ||
    lower.includes('solar') ||
    lower.includes('প্যানেল') ||
    lower.includes('சூரிய')
  ) {
    tradeInterests.add('Solar PV Installer (Suryamitra)');
  }

  // Check education
  if (lower.includes('8') || lower.includes('आठवीं') || lower.includes('অষ্টম') || lower.includes('8th')) {
    prof.educationLevel = '8th Pass';
  } else if (lower.includes('10') || lower.includes('दसवीं') || lower.includes('মাধ্যমিক') || lower.includes('10th')) {
    prof.educationLevel = '10th Pass';
  } else if (lower.includes('5') || lower.includes('पांचवीं') || lower.includes('প্রাথমিক') || lower.includes('5th')) {
    prof.educationLevel = '5th Pass (Primary)';
  } else if (!prof.educationLevel) {
    prof.educationLevel = 'Informal / Basic Schooling';
  }

  // Check travel distance
  if (lower.includes('10') || lower.includes('15') || lower.includes('किलोमीटर') || lower.includes('কিমি') || lower.includes('km')) {
    prof.travelLimitKm = 15;
  } else if (lower.includes('25') || lower.includes('30')) {
    prof.travelLimitKm = 25;
  } else if (lower.includes('हॉस्टल') || lower.includes('hostel') || lower.includes('হোস্টেল')) {
    prof.travelLimitKm = 50;
  }

  // Check self employment vs wage
  if (
    lower.includes('दुकान') ||
    lower.includes('खुद का') ||
    lower.includes('own shop') ||
    lower.includes('নিজের দোকান') ||
    lower.includes('स्वयंरोजगार') ||
    lower.includes('சொந்த தொழில்')
  ) {
    prof.employmentPreference = 'self_employment';
  } else if (
    lower.includes('नौकरी') ||
    lower.includes('company') ||
    lower.includes('job') ||
    lower.includes('পक्की চাকরি') ||
    lower.includes('नोकरी') ||
    lower.includes('வேலை')
  ) {
    prof.employmentPreference = 'wage_employment';
  }

  prof.informalSkills = Array.from(informalSkills);
  prof.tradeInterests = Array.from(tradeInterests);
  prof.familyTraditionalSkills = Array.from(familyTraditionalSkills);
  prof.completedStepCount = Math.min(5, stepNumber);
  prof.isComplete = stepNumber >= 5;

  // Offline questions lookup
  const offlineQuestions: Record<number, { title: string; subtitle: string }> = {
    1: {
      title: 'क्या आपके परिवार में कोई पारंपरिक काम या पुश्तैनी हुनर है?',
      subtitle: 'जैसे सिलाई, बढ़ईगीरी, मिट्टी का काम, हस्तशिल्प या पशुपालन।',
    },
    2: {
      title: 'प्रशिक्षण के लिए आप प्रतिदिन कितनी दूरी तक यात्रा कर सकते हैं?',
      subtitle: 'साइकिल या बस से 5 से 15 किमी, या क्या आप हॉस्टल में रह सकते हैं?',
    },
    3: {
      title: 'ट्रेनिंग के बाद आप खुद की दुकान खोलना चाहेंगे या किसी कंपनी में नौकरी?',
      subtitle: 'स्व-रोजगार या मासिक वेतन वाली नौकरी।',
    },
    4: {
      title: 'आपकी औपचारिक शिक्षा कहाँ तक हुई है?',
      subtitle: 'जैसे 5वीं, 8वीं, 10वीं या काम करते हुए सीखा।',
    },
    5: {
      title: 'धन्यवाद! आपकी प्रोफाइल तैयार हो रही है।',
      subtitle: 'हम आपकी जानकारी का विश्लेषण कर सर्वोत्तम कोर्स खोज रहे हैं।',
    },
  };

  const nextQ = offlineQuestions[stepNumber] || {
    title: 'क्या आपके परिवार में कोई पारंपरिक काम होता है?',
    subtitle: 'पारंपरिक हुनर या अनुभव के बारे में बताएं।',
  };

  return {
    updatedProfile: prof,
    nextQuestion: nextQ.title,
    questionSubtitle: nextQ.subtitle,
    isComplete: stepNumber >= 5,
  };
}

// 4. Batch Synchronization with Server
export async function syncPendingTurns(
  onProgress?: (synced: number, total: number) => void
): Promise<{
  success: boolean;
  syncedCount: number;
  data?: any;
  error?: string;
}> {
  const queue = getQueuedTurns();
  if (queue.length === 0) {
    return { success: true, syncedCount: 0 };
  }

  try {
    const cachedSession = getCachedSession();
    const sessionId = queue[0]?.sessionId || cachedSession?.sessionId;

    if (!sessionId) {
      return { success: false, syncedCount: 0, error: 'No active session ID found' };
    }

    const payload = {
      sessionId,
      turns: queue.map((t) => ({
        userInputText: t.userInputText,
        stepNumber: t.stepNumber,
        timestamp: t.timestamp,
        language: t.language,
      })),
      cachedProfile: cachedSession?.profile,
      language: cachedSession?.language || 'hi',
    };

    const res = await fetch('/api/session/sync-batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Sync server responded with status ${res.status}`);
    }

    const responseData = await res.json();

    // Clear synchronized turns
    clearQueuedTurns();
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC_TIME, new Date().toISOString());

    if (onProgress) {
      onProgress(queue.length, queue.length);
    }

    return {
      success: true,
      syncedCount: queue.length,
      data: responseData,
    };
  } catch (err: any) {
    console.error('Batch sync failed:', err);
    return {
      success: false,
      syncedCount: 0,
      error: err.message || 'Network error during sync',
    };
  }
}

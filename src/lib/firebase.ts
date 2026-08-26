import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { CandidateProfile, Recommendation, HumanEscalation, AuditLog, DistrictInfo, TrainingProvider, EconomicDemand } from '../types.js';

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);
export const auth = getAuth(app);

// Sign-in anonymously for Firestore security rules if needed
export async function ensureAuth() {
  try {
    if (!auth.currentUser) {
      await signInAnonymously(auth);
    }
  } catch (err) {
    console.warn('Firebase anonymous auth warning:', err);
  }
}

// Collections
export const COLLECTIONS = {
  CANDIDATES: 'candidates',
  RECOMMENDATIONS: 'recommendations',
  ESCALATIONS: 'escalations',
  AUDIT_LOGS: 'audit_logs',
  SESSIONS: 'interview_sessions',
  DISTRICTS: 'districts',
  PROVIDERS: 'providers',
  ECONOMIC_DEMANDS: 'economic_demands',
  SYSTEM_STATUS: 'system_status'
};

export const cloudService = {
  // 1. Candidate Real-Time Ops
  async saveCandidate(candidate: CandidateProfile): Promise<void> {
    await ensureAuth();
    const candidateRef = doc(db, COLLECTIONS.CANDIDATES, candidate.candidateId);
    await setDoc(candidateRef, {
      ...candidate,
      updatedAt: new Date().toISOString(),
      _syncedAt: serverTimestamp()
    }, { merge: true });
  },

  async getCandidate(candidateId: string): Promise<CandidateProfile | null> {
    await ensureAuth();
    const candidateRef = doc(db, COLLECTIONS.CANDIDATES, candidateId);
    const snap = await getDoc(candidateRef);
    if (snap.exists()) {
      return snap.data() as CandidateProfile;
    }
    return null;
  },

  listenToCandidates(onUpdate: (candidates: CandidateProfile[]) => void, district?: string) {
    ensureAuth();
    let q = query(collection(db, COLLECTIONS.CANDIDATES));
    if (district && district !== 'All') {
      q = query(collection(db, COLLECTIONS.CANDIDATES), where('location.district', '==', district));
    }
    return onSnapshot(q, (snapshot) => {
      const list: CandidateProfile[] = [];
      snapshot.forEach(docSnap => {
        list.push(docSnap.data() as CandidateProfile);
      });
      // Sort in-memory by updatedAt desc
      list.sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime());
      onUpdate(list);
    }, (error) => {
      console.warn('Firestore listenToCandidates error:', error);
    });
  },

  // 2. Real-Time Human Escalations
  async saveEscalation(escalation: HumanEscalation): Promise<void> {
    await ensureAuth();
    const escRef = doc(db, COLLECTIONS.ESCALATIONS, escalation.id);
    await setDoc(escRef, {
      ...escalation,
      _syncedAt: serverTimestamp()
    }, { merge: true });
  },

  async updateEscalationStatus(id: string, status: 'Open' | 'In Progress' | 'Resolved', assignedOfficer?: string): Promise<void> {
    await ensureAuth();
    const escRef = doc(db, COLLECTIONS.ESCALATIONS, id);
    await updateDoc(escRef, {
      status,
      assignedOfficer: assignedOfficer || null,
      updatedAt: new Date().toISOString()
    });
  },

  listenToEscalations(onUpdate: (escalations: HumanEscalation[]) => void) {
    ensureAuth();
    const q = query(collection(db, COLLECTIONS.ESCALATIONS));
    return onSnapshot(q, (snapshot) => {
      const list: HumanEscalation[] = [];
      snapshot.forEach(docSnap => {
        list.push(docSnap.data() as HumanEscalation);
      });
      list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      onUpdate(list);
    }, (err) => {
      console.warn('Firestore listenToEscalations error:', err);
    });
  },

  // 3. Audit Logs
  async logAuditEvent(log: Omit<AuditLog, 'id' | 'timestamp'>): Promise<void> {
    try {
      await ensureAuth();
      const id = `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const logRef = doc(db, COLLECTIONS.AUDIT_LOGS, id);
      await setDoc(logRef, {
        ...log,
        id,
        timestamp: new Date().toISOString(),
        _syncedAt: serverTimestamp()
      });
    } catch (e) {
      console.warn('Could not record audit log to cloud:', e);
    }
  },

  listenToAuditLogs(onUpdate: (logs: AuditLog[]) => void, maxCount = 50) {
    ensureAuth();
    const q = query(collection(db, COLLECTIONS.AUDIT_LOGS), limit(maxCount));
    return onSnapshot(q, (snapshot) => {
      const list: AuditLog[] = [];
      snapshot.forEach(docSnap => {
        list.push(docSnap.data() as AuditLog);
      });
      list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      onUpdate(list);
    }, (err) => {
      console.warn('Firestore listenToAuditLogs error:', err);
    });
  },

  // 4. Recommendations
  async saveRecommendations(candidateId: string, recs: Recommendation[]): Promise<void> {
    await ensureAuth();
    for (const rec of recs) {
      const recRef = doc(db, COLLECTIONS.RECOMMENDATIONS, rec.id);
      await setDoc(recRef, {
        ...rec,
        candidateId,
        _syncedAt: serverTimestamp()
      }, { merge: true });
    }
  }
};

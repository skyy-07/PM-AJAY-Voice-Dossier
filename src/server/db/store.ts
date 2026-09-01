import { 
  CandidateProfile, 
  QualificationPack, 
  TrainingProvider, 
  TrainingCourse, 
  EconomicDemand, 
  Recommendation, 
  HumanEscalation, 
  AuditLog, 
  SyncQueueRecord, 
  DistrictInfo, 
  IntegrationServiceStatus,
  InterviewMessage,
  User
} from '../../types.js';

import { 
  DISTRICTS, 
  QUALIFICATION_PACKS, 
  TRAINING_PROVIDERS, 
  TRAINING_COURSES, 
  ECONOMIC_DEMANDS, 
  INITIAL_BENEFICIARIES, 
  INITIAL_ESCALATIONS, 
  INTEGRATION_SERVICES, 
  INITIAL_AUDIT_LOGS 
} from './seedData.js';

export interface ActiveInterviewSession {
  sessionId: string;
  candidateId: string;
  channel: 'voice_call' | 'whatsapp' | 'kiosk' | 'web';
  language: string;
  dialect?: string;
  consentGiven: boolean;
  consentTimestamp: string;
  messages: InterviewMessage[];
  currentSlots: Partial<CandidateProfile>;
  state: string;
  createdAt: string;
  updatedAt: string;
}

export class InMemoryStore {
  private districts: DistrictInfo[] = [];
  private qualificationPacks: QualificationPack[] = [];
  private trainingProviders: TrainingProvider[] = [];
  private trainingCourses: TrainingCourse[] = [];
  private economicDemands: EconomicDemand[] = [];
  private candidates: Map<string, CandidateProfile> = new Map();
  private recommendations: Map<string, Recommendation[]> = new Map();
  private interviewSessions: Map<string, ActiveInterviewSession> = new Map();
  private escalations: Map<string, HumanEscalation> = new Map();
  private auditLogs: AuditLog[] = [];
  private syncQueue: Map<string, SyncQueueRecord> = new Map();
  private integrationServices: IntegrationServiceStatus[] = [];
  private users: User[] = [
    { id: 'USR-ADMIN', name: 'Dr. Alok Verma (IAS)', email: 'admin@pmajay.gov.in', role: 'state_admin', state: 'Uttar Pradesh' },
    { id: 'USR-DIST', name: 'R. K. Mishra', email: 'varanasi.admin@pmajay.gov.in', role: 'district_admin', district: 'Varanasi', state: 'Uttar Pradesh' },
    { id: 'USR-FIELD', name: 'Arvind Sharma', email: 'field.kashi@pmajay.gov.in', role: 'field_worker', district: 'Varanasi', state: 'Uttar Pradesh' },
    { id: 'USR-SUPER', name: 'National PM-AJAY Cell', email: 'superadmin@pmajay.nic.in', role: 'super_admin' },
    { id: 'USR-BEN', name: 'Beneficiary User', email: 'beneficiary@pmajay.nic.in', role: 'beneficiary' }
  ];

  constructor() {
    this.seed();
  }

  public seed() {
    this.districts = [...DISTRICTS];
    this.qualificationPacks = [...QUALIFICATION_PACKS];
    this.trainingProviders = [...TRAINING_PROVIDERS];
    this.trainingCourses = [...TRAINING_COURSES];
    this.economicDemands = [...ECONOMIC_DEMANDS];
    this.integrationServices = [...INTEGRATION_SERVICES];
    this.auditLogs = [...INITIAL_AUDIT_LOGS];

    this.candidates.clear();
    for (const b of INITIAL_BENEFICIARIES) {
      this.candidates.set(b.candidateId, { ...b });
    }

    this.escalations.clear();
    for (const e of INITIAL_ESCALATIONS) {
      this.escalations.set(e.id, { ...e });
    }
  }

  // Users
  public getUsers(): User[] {
    return this.users;
  }

  public getUserById(id: string): User | undefined {
    return this.users.find(u => u.id === id);
  }

  // Districts
  public getDistricts(): DistrictInfo[] {
    return this.districts;
  }

  public getDistrictByName(name: string): DistrictInfo | undefined {
    return this.districts.find(d => d.name.toLowerCase() === name.toLowerCase());
  }

  // Qualification Packs
  public getQualificationPacks(): QualificationPack[] {
    return this.qualificationPacks;
  }

  public getQualificationPackById(id: string): QualificationPack | undefined {
    return this.qualificationPacks.find(qp => qp.id === id || qp.qpCode === id);
  }

  // Training Providers & Courses
  public getTrainingProviders(district?: string): TrainingProvider[] {
    if (!district) return this.trainingProviders;
    return this.trainingProviders.filter(tp => tp.district.toLowerCase() === district.toLowerCase());
  }

  public getTrainingProviderById(id: string): TrainingProvider | undefined {
    return this.trainingProviders.find(tp => tp.id === id);
  }

  public getTrainingCourses(providerId?: string, qpId?: string): TrainingCourse[] {
    let result = this.trainingCourses;
    if (providerId) {
      result = result.filter(tc => tc.providerId === providerId);
    }
    if (qpId) {
      result = result.filter(tc => tc.qualificationPackId === qpId);
    }
    return result;
  }

  // Economic Demand
  public getEconomicDemands(district?: string): EconomicDemand[] {
    if (!district) return this.economicDemands;
    return this.economicDemands.filter(ed => ed.district.toLowerCase() === district.toLowerCase());
  }

  // Candidates
  public getCandidates(filter?: { district?: string; search?: string }): CandidateProfile[] {
    let list = Array.from(this.candidates.values());
    if (filter?.district) {
      list = list.filter(c => c.location.district.toLowerCase() === filter.district?.toLowerCase());
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(c => 
        c.name.toLowerCase().includes(q) || 
        c.currentOccupation.toLowerCase().includes(q) ||
        c.skills.some(s => s.toLowerCase().includes(q)) ||
        c.candidateId.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getCandidateById(id: string): CandidateProfile | undefined {
    return this.candidates.get(id);
  }

  public saveCandidate(candidate: CandidateProfile): CandidateProfile {
    candidate.updatedAt = new Date().toISOString();
    this.candidates.set(candidate.candidateId, candidate);
    return candidate;
  }

  public updateCandidate(id: string, updates: Partial<CandidateProfile>): CandidateProfile | undefined {
    const existing = this.candidates.get(id);
    if (!existing) return undefined;
    const updated: CandidateProfile = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.candidates.set(id, updated);
    return updated;
  }

  public deleteCandidate(id: string): boolean {
    const res = this.candidates.delete(id);
    this.recommendations.delete(id);
    return res;
  }

  // Recommendations
  public getRecommendations(candidateId: string): Recommendation[] {
    return this.recommendations.get(candidateId) || [];
  }

  public saveRecommendations(candidateId: string, recs: Recommendation[]): void {
    this.recommendations.set(candidateId, recs);
  }

  public updateRecommendationStatus(recId: string, status: 'recommended' | 'applied' | 'enrolled' | 'declined'): boolean {
    for (const [candId, recList] of this.recommendations.entries()) {
      const target = recList.find(r => r.id === recId);
      if (target) {
        target.status = status;
        return true;
      }
    }
    return false;
  }

  // Interview Sessions
  public getInterviewSession(sessionId: string): ActiveInterviewSession | undefined {
    return this.interviewSessions.get(sessionId);
  }

  public saveInterviewSession(session: ActiveInterviewSession): ActiveInterviewSession {
    session.updatedAt = new Date().toISOString();
    this.interviewSessions.set(session.sessionId, session);
    return session;
  }

  // Human Escalations
  public getEscalations(status?: string): HumanEscalation[] {
    let list = Array.from(this.escalations.values());
    if (status && status !== 'All') {
      list = list.filter(e => e.status.toLowerCase() === status.toLowerCase());
    }
    return list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  public getEscalationById(id: string): HumanEscalation | undefined {
    return this.escalations.get(id);
  }

  public saveEscalation(esc: HumanEscalation): HumanEscalation {
    this.escalations.set(esc.id, esc);
    return esc;
  }

  public updateEscalation(id: string, updates: Partial<HumanEscalation>): HumanEscalation | undefined {
    const existing = this.escalations.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates };
    this.escalations.set(id, updated);
    return updated;
  }

  // Audit Logs
  public getAuditLogs(limit: number = 50): AuditLog[] {
    return [...this.auditLogs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, limit);
  }

  public addAuditLog(entry: Omit<AuditLog, 'id' | 'timestamp'>): AuditLog {
    const log: AuditLog = {
      ...entry,
      id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString()
    };
    this.auditLogs.unshift(log);
    if (this.auditLogs.length > 500) {
      this.auditLogs.pop();
    }
    return log;
  }

  // Sync Queue
  public getSyncQueue(): SyncQueueRecord[] {
    return Array.from(this.syncQueue.values());
  }

  public addSyncRecord(record: Omit<SyncQueueRecord, 'id' | 'syncStatus' | 'attempts'>): SyncQueueRecord {
    const item: SyncQueueRecord = {
      ...record,
      id: `SYNC-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      syncStatus: 'pending',
      attempts: 0
    };
    this.syncQueue.set(item.id, item);
    return item;
  }

  public updateSyncRecord(id: string, updates: Partial<SyncQueueRecord>): void {
    const existing = this.syncQueue.get(id);
    if (existing) {
      this.syncQueue.set(id, { ...existing, ...updates });
    }
  }

  // Integrations
  public getIntegrationStatuses(): IntegrationServiceStatus[] {
    return this.integrationServices;
  }

  public updateIntegrationStatus(serviceKey: string, status: 'MOCK' | 'CONNECTED' | 'ERROR', notes?: string): void {
    const target = this.integrationServices.find(s => s.serviceKey === serviceKey);
    if (target) {
      target.status = status;
      if (notes) target.notes = notes;
    }
  }
}

export const db = new InMemoryStore();

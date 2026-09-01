import { 
  CandidateProfile, 
  Recommendation, 
  ActiveInterviewSession, 
  HumanEscalation, 
  DistrictInfo, 
  QualificationPack, 
  TrainingProvider, 
  EconomicDemand, 
  AuditLog, 
  IntegrationServiceStatus,
  User 
} from '../types.js';
import { cloudService } from './firebase.js';

export const api = {
  // Auth
  async login(role?: string, userId?: string): Promise<{ user: User }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, userId })
    });
    const data = await res.json();
    cloudService.logAuditEvent({
      actorId: data.user?.id || 'USR',
      actorRole: data.user?.role || 'beneficiary',
      action: 'USER_LOGIN',
      entityType: 'system',
      entityId: data.user?.id || 'LOGIN',
      details: `User logged in to cloud with role ${data.user?.role}`
    });
    return data;
  },

  async adminLogin(params: { username?: string; password?: string; role?: string; userId?: string }): Promise<{ success: boolean; user: User; token: string; message?: string }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Authentication failed');
    }
    cloudService.logAuditEvent({
      actorId: data.user?.id || 'ADM',
      actorRole: data.user?.role || 'district_admin',
      action: 'ADMIN_LOGIN_SUCCESS',
      entityType: 'system',
      entityId: data.user?.id || 'LOGIN',
      details: `Admin ${data.user?.name} logged in with role ${data.user?.role}`
    });
    return data;
  },

  async adminLogout(userId?: string): Promise<void> {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
    } catch {
      // ignore network error on logout
    }
  },

  async getMe(): Promise<{ user: User }> {
    const res = await fetch('/api/auth/me');
    return res.json();
  },

  // Interviews
  async startInterview(params: {
    channel: 'voice_call' | 'whatsapp' | 'kiosk' | 'web';
    language: string;
    dialect?: string;
    consentGiven: boolean;
    candidateName?: string;
  }): Promise<{ session: ActiveInterviewSession; candidate: CandidateProfile }> {
    const res = await fetch('/api/interviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    const data = await res.json();
    if (data.candidate) {
      // Sync candidate profile to Firestore in real-time
      cloudService.saveCandidate(data.candidate).catch(console.warn);
      cloudService.logAuditEvent({
        actorId: data.candidate.candidateId,
        actorRole: 'beneficiary',
        action: 'INTERVIEW_STARTED',
        entityType: 'interview',
        entityId: data.session?.sessionId || 'SES',
        details: `Beneficiary started live voice session on channel ${params.channel} in ${params.language}`
      });
    }
    return data;
  },

  async getInterview(id: string): Promise<{ session: ActiveInterviewSession; candidate: CandidateProfile }> {
    const res = await fetch(`/api/interviews/${id}`);
    return res.json();
  },

  async sendMessage(
    sessionId: string, 
    text: string, 
    audioUrl?: string
  ): Promise<{ session: ActiveInterviewSession; candidate: CandidateProfile; dialogueResult?: any; escalationCreated?: any }> {
    const res = await fetch(`/api/interviews/${sessionId}/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, audioUrl })
    });
    const data = await res.json();
    if (data.candidate) {
      cloudService.saveCandidate(data.candidate).catch(console.warn);
    }
    if (data.escalationCreated) {
      cloudService.saveEscalation(data.escalationCreated).catch(console.warn);
    }
    return data;
  },

  async sendAudio(
    sessionId: string, 
    audioBase64?: string, 
    simulatedText?: string
  ): Promise<{ transcription: any; session: ActiveInterviewSession; candidate: CandidateProfile; dialogueResult: any }> {
    const res = await fetch(`/api/interviews/${sessionId}/audio`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ audioBase64, simulatedText })
    });
    const data = await res.json();
    if (data.candidate) {
      cloudService.saveCandidate(data.candidate).catch(console.warn);
    }
    return data;
  },

  // Candidates
  async getCandidates(filter?: { district?: string; search?: string }): Promise<{ candidates: CandidateProfile[]; total: number }> {
    const query = new URLSearchParams();
    if (filter?.district) query.set('district', filter.district);
    if (filter?.search) query.set('search', filter.search);
    const res = await fetch(`/api/candidates?${query.toString()}`);
    return res.json();
  },

  async getCandidate(id: string): Promise<{ candidate: CandidateProfile; recommendations: Recommendation[] }> {
    const res = await fetch(`/api/candidates/${id}`);
    return res.json();
  },

  async updateCandidate(id: string, updates: Partial<CandidateProfile>): Promise<{ candidate: CandidateProfile }> {
    const res = await fetch(`/api/candidates/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    if (data.candidate) {
      cloudService.saveCandidate(data.candidate).catch(console.warn);
      cloudService.logAuditEvent({
        actorId: 'admin_officer',
        actorRole: 'admin',
        action: 'CANDIDATE_PROFILE_UPDATED',
        entityType: 'candidate',
        entityId: id,
        details: `Candidate record updated: ${data.candidate.name}`
      });
    }
    return data;
  },

  async confirmProfile(id: string): Promise<{ candidate: CandidateProfile; confirmed: boolean }> {
    const res = await fetch(`/api/candidates/${id}/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (data.candidate) {
      cloudService.saveCandidate(data.candidate).catch(console.warn);
      cloudService.logAuditEvent({
        actorId: id,
        actorRole: 'beneficiary',
        action: 'PROFILE_CONFIRMED',
        entityType: 'candidate',
        entityId: id,
        details: `Beneficiary confirmed spoken dossier slots in cloud`
      });
    }
    return data;
  },

  // Recommendations
  async generateRecommendations(candidateId: string): Promise<{ candidate: CandidateProfile; recommendations: Recommendation[]; total: number }> {
    const res = await fetch(`/api/candidates/${candidateId}/recommendations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (data.recommendations && data.recommendations.length > 0) {
      cloudService.saveRecommendations(candidateId, data.recommendations).catch(console.warn);
    }
    return data;
  },

  async updateRecommendationStatus(recId: string, status: 'recommended' | 'applied' | 'enrolled' | 'declined'): Promise<{ success: boolean; status: string }> {
    const res = await fetch(`/api/recommendations/${recId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    cloudService.logAuditEvent({
      actorId: 'beneficiary',
      actorRole: 'beneficiary',
      action: `RECOMMENDATION_${status.toUpperCase()}`,
      entityType: 'recommendation',
      entityId: recId,
      details: `NSQF Opportunity status transitioned to ${status}`
    });
    return res.json();
  },

  // Master Data
  async getProviders(district?: string): Promise<{ providers: TrainingProvider[] }> {
    const q = district ? `?district=${encodeURIComponent(district)}` : '';
    const res = await fetch(`/api/providers${q}`);
    return res.json();
  },

  async getQualificationPacks(): Promise<{ qualificationPacks: QualificationPack[] }> {
    const res = await fetch('/api/qualification-packs');
    return res.json();
  },

  async getEconomicDemands(district?: string): Promise<{ economicDemands: EconomicDemand[] }> {
    const q = district ? `?district=${encodeURIComponent(district)}` : '';
    const res = await fetch(`/api/economic-demand${q}`);
    return res.json();
  },

  async getDistricts(): Promise<{ districts: DistrictInfo[] }> {
    const res = await fetch('/api/analytics/districts');
    return res.json();
  },

  // Escalations
  async getEscalations(status?: string): Promise<{ escalations: HumanEscalation[] }> {
    const q = status ? `?status=${encodeURIComponent(status)}` : '';
    const res = await fetch(`/api/escalations${q}`);
    return res.json();
  },

  async createEscalation(data: Partial<HumanEscalation>): Promise<{ success: boolean; escalation: HumanEscalation }> {
    const res = await fetch('/api/escalations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const out = await res.json();
    if (out.escalation) {
      cloudService.saveEscalation(out.escalation).catch(console.warn);
      cloudService.logAuditEvent({
        actorId: out.escalation.candidateId,
        actorRole: 'beneficiary',
        action: 'HUMAN_ESCALATION_CREATED',
        entityType: 'escalation',
        entityId: out.escalation.id,
        details: `Officer escalation filed for ${out.escalation.candidateName} (${out.escalation.district})`
      });
    }
    return out;
  },

  async updateEscalation(id: string, updates: Partial<HumanEscalation>): Promise<{ escalation: HumanEscalation }> {
    const res = await fetch(`/api/escalations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    const out = await res.json();
    if (out.escalation) {
      cloudService.saveEscalation(out.escalation).catch(console.warn);
      cloudService.logAuditEvent({
        actorId: 'bdo_officer',
        actorRole: 'admin',
        action: `ESCALATION_${out.escalation.status.toUpperCase()}`,
        entityType: 'escalation',
        entityId: id,
        details: `Escalation status set to ${out.escalation.status}`
      });
    }
    return out;
  },

  // Analytics
  async getAnalyticsOverview(): Promise<any> {
    const res = await fetch('/api/analytics/overview');
    return res.json();
  },

  async getBeneficiaryAnalytics(): Promise<any> {
    const res = await fetch('/api/analytics/beneficiaries');
    return res.json();
  },

  async getTradeAnalytics(): Promise<any> {
    const res = await fetch('/api/analytics/trades');
    return res.json();
  },

  async getOperationalAnalytics(): Promise<any> {
    const res = await fetch('/api/analytics/operational');
    return res.json();
  },

  // Integrations & Audits
  async getIntegrationStatuses(): Promise<{ services: IntegrationServiceStatus[] }> {
    const res = await fetch('/api/integrations/status');
    return res.json();
  },

  async getAuditLogs(): Promise<{ logs: AuditLog[] }> {
    const res = await fetch('/api/audit-logs');
    return res.json();
  },

  // Kiosk Sync
  async syncOfflineRecords(offlineRecords: any[]): Promise<{ success: boolean; syncedCount: number }> {
    const res = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ offlineRecords })
    });
    const data = await res.json();
    for (const rec of offlineRecords) {
      if (rec.candidate) {
        cloudService.saveCandidate(rec.candidate).catch(console.warn);
      }
    }
    cloudService.logAuditEvent({
      actorId: 'kiosk_node',
      actorRole: 'field_worker',
      action: 'KIOSK_OFFLINE_SYNC',
      entityType: 'system',
      entityId: 'SYNC_CLOUD',
      details: `Batch synced ${offlineRecords.length} records to Cloud Firestore`
    });
    return data;
  },

  // Demo Seeder
  async runDemoSample(sampleType: 'welder' | 'tailor' | 'tractor' | 'weaver'): Promise<any> {
    const res = await fetch('/api/demo/sample-conversation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sampleType })
    });
    const data = await res.json();
    if (data.candidate) {
      cloudService.saveCandidate(data.candidate).catch(console.warn);
    }
    return data;
  }
};

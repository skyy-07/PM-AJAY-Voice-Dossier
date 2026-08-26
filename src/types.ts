export type UserRole = 
  | 'beneficiary' 
  | 'field_worker' 
  | 'district_admin' 
  | 'state_admin' 
  | 'super_admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  district?: string;
  state?: string;
}

export type SupportedLanguage = 
  | 'hi' // Hindi
  | 'bn' // Bengali
  | 'mr' // Marathi
  | 'ta' // Tamil
  | 'te' // Telugu
  | 'kn' // Kannada
  | 'ml' // Malayalam
  | 'gu' // Gujarati
  | 'pa' // Punjabi
  | 'or' // Odia
  | 'as' // Assamese
  | 'en' // English
  | 'auto';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  locale: string;
  script: string;
}

export interface ConsentRecord {
  consentGiven: boolean;
  consentTimestamp: string;
  consentLanguage: string;
  consentType: 'spoken' | 'digital_touch';
  channel: 'voice_call' | 'whatsapp' | 'kiosk' | 'web';
  ipAddress?: string;
}

export interface CandidateLocation {
  village: string;
  gramPanchayat?: string;
  block?: string;
  district: string;
  state: string;
  pincode?: string;
  latitude: number;
  longitude: number;
}

export interface MobilityConstraints {
  willingToTravel: boolean;
  maxDistanceKm: number;
  willingToMigrate: boolean;
  preferredTransport?: string;
}

export interface ExperienceEntry {
  tradeOrActivity: string;
  yearsOfExperience: number;
  isFamilyOccupation: boolean;
  informalOrFormal: 'informal' | 'formal' | 'traditional_family';
  description: string;
}

export interface CandidateProfile {
  candidateId: string;
  name: string;
  phone?: string;
  age: number | null;
  gender: 'male' | 'female' | 'other' | 'unspecified';
  location: CandidateLocation;
  language: SupportedLanguage;
  dialect?: string;
  education: string;
  literacyLevel: 'basic_literacy' | 'functional_literacy' | 'illiterate' | 'fluent';
  currentOccupation: string;
  previousOccupations: string[];
  familyOccupation: string;
  skills: string[];
  tools: string[];
  experience: ExperienceEntry[];
  incomeSources: string[];
  seasonalWork: string[];
  interests: string[];
  aspirations: string[];
  employmentPreference: 'wage_employment' | 'self_employment' | 'both' | 'unspecified';
  selfEmploymentInterest: boolean;
  mobility: MobilityConstraints;
  physicalConstraints: string[];
  familyConstraints: string[];
  preferredWorkingHours?: string;
  preferredWorkingEnvironment?: 'indoor' | 'outdoor' | 'workshop' | 'farm' | 'any';
  priorTrainingHistory: string[];
  rplSignals: string[];
  profileConfidence: number;
  missingFields: string[];
  createdAt: string;
  updatedAt: string;
  isConfirmed: boolean;
}

export interface QualificationPack {
  id: string;
  qpCode: string;
  title: string;
  sector: string;
  nsqfLevel: number;
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  toolsRequired: string[];
  minEducation: string;
  workType: 'wage' | 'self_employment' | 'hybrid';
  entrepreneurshipPotential: 'High' | 'Medium' | 'Low';
  mobilityRequirement: 'Low' | 'Medium' | 'High';
  relatedTrades: string[];
  keywords: string[];
  approxDurationHours: number;
  averageStartingWage: number;
  rplEligible: boolean;
}

export interface TrainingProvider {
  id: string;
  name: string;
  type: 'PMKK' | 'ITITrainingCenter' | 'RuralSelfEmploymentTrainingInstitute' | 'VocationalCenter';
  district: string;
  state: string;
  address: string;
  latitude: number;
  longitude: number;
  contactPerson: string;
  contactPhone: string;
  active: boolean;
  totalCapacity: number;
  allocatedSeats: number;
  availableSeats: number;
  rating: number;
  facilities: string[];
  affiliatedSSC?: string;
  nextBatchStartDate?: string;
  phone?: string;
}

export interface TrainingCourse {
  id: string;
  providerId: string;
  providerName: string;
  qualificationPackId: string;
  qpTitle: string;
  nsqfLevel: number;
  sector: string;
  durationMonths: number;
  fee: number;
  mode: 'Full-time' | 'Part-time' | 'Weekend' | 'Residential';
  startDate: string;
  availableSeats: number;
  totalSeats: number;
  stipendAvailable: boolean;
  hostelAvailable: boolean;
}

export interface EconomicDemand {
  id: string;
  district: string;
  state: string;
  trade: string;
  sector: string;
  demandScore: number;
  seasonality: 'All-Year' | 'Seasonal-Harvest' | 'Seasonal-Festive' | 'Seasonal-Construction';
  avgMonthlyWage: number;
  enterprisePotential: 'High' | 'Medium' | 'Low';
  estimatedVacancies: number;
  growthForecastPercent: number;
  governmentIncentives: string[];
  topEmployers?: string[];
}

export interface Recommendation {
  id: string;
  candidateId: string;
  rank: number;
  qualificationPackId: string;
  qualificationPackCode: string;
  qualificationPackTitle: string;
  trade?: string;
  qualification?: string;
  sector: string;
  nsqfLevel: number;
  matchScore: number;
  scoreBreakdown?: {
    skillScore: number;
    experienceScore: number;
    interestScore: number;
    mobilityScore: number;
    demandScore: number;
    compositeScore: number;
  };
  whyRecommended: string[];
  skillsMatched: string[];
  skillsToDevelop: string[];
  matchedSkills?: string[];
  skillGaps?: string[];
  trainingProvider: TrainingProvider;
  nearestCenterDistanceKm: number;
  nearestTrainingProvider?: {
    id: string;
    name: string;
    distanceKm: number;
    district: string;
    availableSeats: number;
    courseStartDate: string;
    contactPhone: string;
  };
  economicDemand: EconomicDemand;
  localDemand?: {
    district: string;
    demandScore: number;
    growthTrend: string;
    estimatedMonthlyWage: number;
    seasonality: string;
  };
  rplFastTrackEligible: boolean;
  rplPotential?: {
    eligible: boolean;
    recommendedLevel: number;
    priorSkillRecognized: string[];
    assessmentMode: string;
  };
  careerPathway: string;
  nextSteps?: string[];
  status: 'recommended' | 'applied' | 'enrolled' | 'declined';
  createdAt: string;
  generatedAt?: string;
}

export interface InterviewMessage {
  id: string;
  sender: 'assistant' | 'user' | 'system';
  text: string;
  audioUrl?: string;
  language: string;
  timestamp: string;
  detectedSlots?: Partial<CandidateProfile>;
  confidence?: number;
  isProcessing?: boolean;
}

export type ConversationState = 
  | 'IDLE'
  | 'LISTENING'
  | 'PROCESSING'
  | 'UNDERSTANDING'
  | 'ASKING'
  | 'SPEAKING'
  | 'CONFIRMING'
  | 'RECOMMENDING'
  | 'COMPLETED'
  | 'ERROR';

export interface ActiveInterviewSession {
  sessionId: string;
  candidateId: string;
  channel: 'voice_call' | 'whatsapp' | 'kiosk' | 'web';
  language: string;
  dialect?: string;
  consentGiven: boolean;
  consentTimestamp: string;
  messages: InterviewMessage[];
  currentSlots: CandidateProfile;
  state: ConversationState;
  createdAt: string;
  updatedAt: string;
}

export interface HumanEscalation {
  id: string;
  candidateId: string;
  candidateName: string;
  candidatePhone?: string;
  reason: string;
  priority: 'High' | 'Medium' | 'Low';
  district: string;
  state: string;
  preferredLanguage: string;
  status: 'Open' | 'Assigned' | 'In Progress' | 'Resolved' | 'Closed';
  assignedStaff?: string;
  notes?: string;
  timestamp: string;
  resolvedAt?: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorRole: string;
  action: string;
  entityType: 'candidate' | 'interview' | 'recommendation' | 'provider' | 'escalation' | 'system';
  entityId: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
}

export interface SyncQueueRecord {
  id: string;
  candidateId?: string;
  clientSessionId?: string;
  payloadType?: string;
  action?: string;
  payload?: any;
  data?: any;
  createdOfflineAt?: string;
  syncStatus?: string;
  status?: 'pending' | 'syncing' | 'synced' | 'failed';
  attempts?: number;
  retryCount?: number;
  errorMessage?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DistrictInfo {
  name: string;
  state: string;
  districtCode?: string;
  primaryLanguage?: string;
  primaryDialect?: string;
  topTrades?: string[];
  demandScore?: number;
  totalBeneficiariesRecorded?: number;
  rplCandidatesIdentified?: number;
  latitude?: number;
  longitude?: number;
  beneficiaryCount?: number;
  trainingCenterCount?: number;
  topSectors?: string[];
  demandIndex?: number;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface IntegrationServiceStatus {
  serviceName?: string;
  serviceKey?: string;
  name?: string;
  category: 'telephony' | 'messaging' | 'ai_speech' | 'vector_db' | 'government_api';
  status: 'CONNECTED' | 'SIMULATED' | 'OFFLINE' | 'MOCK' | 'ERROR';
  description?: string;
  endpoint?: string;
  latencyMs?: number;
  uptimePercent?: number;
  notes?: string;
  lastHealthCheck?: string;
}

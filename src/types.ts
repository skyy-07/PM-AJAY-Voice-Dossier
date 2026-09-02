export type SupportedLanguage = 'hi' | 'bn' | 'mr' | 'ta' | 'en';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string; // e.g. "Hindi"
  nativeName: string; // e.g. "हिन्दी"
  script: string;
  speechCode: string; // e.g. "hi-IN"
}

export interface LanguageDetectionResult {
  detectedLanguage: SupportedLanguage;
  confidence: number;
  languageName: string;
  nativeName: string;
  isAutoDetected: boolean;
  sampleText?: string;
}

export type ChannelType = 'web_voice' | 'ivr' | 'whatsapp';

export interface Candidate {
  id: string;
  name: string;
  phone: string;
  district: string;
  state: string;
  gender?: string;
  age?: number;
  createdAt: string;
}

export interface CandidateProfile {
  id: string;
  candidateId: string;
  educationLevel: string; // e.g., 'Primary (Class 5)', '8th Pass', '10th Pass', 'No formal schooling'
  currentOccupation: string; // e.g., 'Daily wage farm worker', 'Informal helper', 'Unemployed'
  familyTraditionalSkills: string[]; // e.g., ['Stitching', 'Pottery', 'Carpentry', 'Cattle rearing']
  informalSkills: string[]; // e.g., ['Basic electrical wiring', 'Tractor driving', 'Masonry']
  travelLimitKm: number; // e.g., 10, 25, 50
  employmentPreference: 'self_employment' | 'wage_employment' | 'both';
  tradeInterests: string[]; // e.g., ['Electrician', 'Tailoring', 'Plumbing', 'Solar technician']
  localContextNotes?: string;
  confidenceScore: number; // 0 to 1
  completedStepCount: number; // e.g. 1 to 5
  isComplete: boolean;
}

export interface InterviewTimelineTurn {
  stepNumber: number;
  category: 'education' | 'experience' | 'traditional_skills' | 'mobility' | 'livelihood_preference' | 'general';
  categoryLabel: Record<SupportedLanguage, string>;
  question: string;
  questionSubtitle?: string;
  userAnswer: string;
  timestamp: string;
  extractedInsights?: string[];
  audioDurationSeconds?: number;
}

export interface InterviewSession {
  id: string;
  candidateId: string;
  channel: ChannelType;
  language: SupportedLanguage;
  consentGiven: boolean;
  consentTimestamp?: string;
  currentStepIndex: number;
  totalSteps: number;
  status: 'initialized' | 'consent_pending' | 'in_progress' | 'completed' | 'abandoned';
  transcript: Array<{
    speaker: 'assistant' | 'user';
    text: string;
    timestamp: string;
    audioRef?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface RealJobRole {
  id: string;
  tradeId?: string;
  jobTitle: string;
  nsqfLevel: number;
  nsqfQpCode: string; // e.g. "ELE/Q1401", "SGJ/Q0101", "AMH/Q1947"
  sector: string;
  category: 'self_employment' | 'wage_employment' | 'hybrid';
  demandLevel: 'High' | 'Medium' | 'Emerging';
  jobDescription: string;
  keyDuties: string[];
  toolsEquipment: string[];
  hiringEmployers: string[];
  salaryRange: string;
  dailyWage?: string;
  employmentType: string;
  activeVacanciesCount: number;
  minEducation: string;
  experienceRequired: string;
  durationMonths: number;
  expectedMonthlyEarning: string;

  // Location & Proximity Factor
  district: string;
  block: string;
  locationName: string;
  distanceKm: number;
  travelTimeMinutes: number;
  commuteMode: string;
  hostelAvailable: boolean;
  trainingCenterId: string;

  // Localization across 5 languages
  localizedJobTitles: Record<SupportedLanguage, string>;
  localizedDescriptions: Record<SupportedLanguage, string>;
  localizedDuties: Record<SupportedLanguage, string[]>;
  localizedLocation: Record<SupportedLanguage, string>;
}

export interface NSQFTrade {
  id: string;
  tradeName: string;
  nsqfLevel: number; // 1 to 5
  nsqfQpCode?: string;
  sector: string; // e.g., "Electronics", "Apparel", "Automotive", "Construction"
  category: 'self_employment' | 'wage_employment' | 'hybrid';
  demandLevel: 'High' | 'Medium' | 'Emerging';
  description: string;
  durationMonths: number;
  minEducation: string;
  expectedMonthlyEarning: string;
  hiringEmployers?: string[];
  activeVacanciesCount?: number;
  keyDuties?: string[];
  toolsEquipment?: string[];
  localizedNames: Record<SupportedLanguage, string>;
  localizedDescriptions: Record<SupportedLanguage, string>;
  localizedDuties?: Record<SupportedLanguage, string[]>;
}

export interface TrainingCenter {
  id: string;
  name: string;
  district: string;
  state: string;
  address: string;
  latitude: number;
  longitude: number;
  distanceKm: number; // calculated relative to candidate or district center
  travelTimeMinutes: number;
  offeredTrades: string[]; // trade IDs
  nextBatchDate: string;
  seatsAvailable: number;
  totalSeats: number;
  hostelAvailable: boolean;
  stipendSupport: boolean;
  contactNumber: string;
}

export interface Recommendation {
  id: string;
  candidateId: string;
  sessionId: string;
  tradeId: string;
  trade: NSQFTrade;
  jobRole?: RealJobRole;
  score: number;
  rank: number;
  isBestMatch: boolean;
  trainingCenter: TrainingCenter;
  distanceKm: number;
  explanation: Record<SupportedLanguage, string>;
  matchReasonTags: string[];
  vacanciesCount?: number;
  hiringCompanies?: string[];
  startingSalary?: string;
  duties?: string[];
}

export interface NSQFPathwayMilestone {
  stageKey: 'baseline' | 'certified_course' | 'experienced_lead' | 'master_contractor';
  stageLabel: string;
  stageName: string;
  nsqfLevel: number;
  timeframe: string;
  monthlyEarning: number; // in INR numeric for charting (e.g. 18000)
  earningDisplay: string; // e.g. "₹18,000"
  jobRoleTitle: string;
  qpCode?: string;
  sector: string;
  duties: string[];
  keyCompetencies: string[];
  isCurrentRecommendation?: boolean;
  isCurrentBaseline?: boolean;
  localizedTitles: Record<SupportedLanguage, string>;
  localizedTimeframes: Record<SupportedLanguage, string>;
  localizedDuties: Record<SupportedLanguage, string[]>;
}

export interface NSQFCareerPathwayData {
  tradeId: string;
  tradeName: string;
  sector: string;
  pathwaySummary: string;
  currentRecommendationNsqfLevel: number;
  milestones: NSQFPathwayMilestone[];
  growthMultiplier: string; // e.g. "4.5x Earning Leap"
  personalizedAdvice?: Record<SupportedLanguage, string>;
}

export type EnrollmentStage = 
  | 'interest_confirmed' 
  | 'counseling_done'
  | 'enrollment_confirmed' 
  | 'training_started' 
  | 'in_training_60' 
  | 'certification' 
  | 'employment_placed';

export interface EnrollmentProgress {
  id: string;
  candidateId: string;
  tradeId: string;
  centerId: string;
  currentStage: EnrollmentStage;
  percentComplete: number;
  confirmedDate: string;
  trainingStartDate: string;
  certificationStatus: 'upcoming' | 'in_progress' | 'passed';
  employmentStatus: 'upcoming' | 'counseling' | 'placed' | 'self_employed';
  history: Array<{
    stage: EnrollmentStage;
    title: string;
    date: string;
    completed: boolean;
    note?: string;
  }>;
}

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  role: 'district_officer' | 'state_admin' | 'super_admin';
  district: string;
}

export interface AuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  targetEntity: string;
  targetId: string;
  details: string;
  timestamp: string;
}

export type TalkBackAction =
  | 'hear_again'
  | 'repeat_question'
  | 'speak'
  | 'yes'
  | 'no'
  | 'go_back'
  | 'slower'
  | 'stop_listening';

export type ScreenName =
  | 'entry'
  | 'language'
  | 'consent'
  | 'interview'
  | 'recommendations'
  | 'center_detail'
  | 'progress';

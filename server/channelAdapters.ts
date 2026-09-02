import { ChannelType, SupportedLanguage } from '../src/types';
import { db } from './db';
import { analyzeTurnAndGetNextQuestion } from './gemini';
import { matchProfileToTrades } from './matcher';

export interface InboundVoiceMessage {
  sessionId?: string;
  callerPhone: string;
  channel: ChannelType;
  language: SupportedLanguage;
  spokenText: string;
  audioDurationSeconds?: number;
}

export interface OutboundVoiceResponse {
  sessionId: string;
  channel: ChannelType;
  replySpokenText: string;
  replyAudioUrl?: string;
  stepIndex: number;
  isComplete: boolean;
  recommendedTrades?: any[];
  status: string;
}

export class ChannelAdapterManager {
  public static async handleInboundMessage(
    payload: InboundVoiceMessage
  ): Promise<OutboundVoiceResponse> {
    let session = payload.sessionId ? db.sessions.get(payload.sessionId) : null;

    if (!session) {
      // Create Candidate & Session
      const candidateId = `cand_chan_${Date.now()}`;
      db.candidates.set(candidateId, {
        id: candidateId,
        name: 'Beneficiary Caller',
        phone: payload.callerPhone,
        district: 'Nadia',
        state: 'West Bengal',
        createdAt: new Date().toISOString(),
      });

      const newSession = {
        id: `sess_chan_${Date.now()}`,
        candidateId,
        channel: payload.channel,
        language: payload.language,
        consentGiven: true,
        consentTimestamp: new Date().toISOString(),
        currentStepIndex: 1,
        totalSteps: 5,
        status: 'in_progress' as const,
        transcript: [
          {
            speaker: 'assistant' as const,
            text: 'नमस्ते! पीएम-अजय सेवा में आपका स्वागत है। अपने काम और अनुभव के बारे में बताएं।',
            timestamp: new Date().toISOString(),
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db.sessions.set(newSession.id, newSession);
      session = newSession;
    }

    // Append user's spoken turn to transcript
    session.transcript.push({
      speaker: 'user',
      text: payload.spokenText,
      timestamp: new Date().toISOString(),
    });

    const currentProfile = db.profiles.get(session.candidateId) || {
      id: `prof_${session.candidateId}`,
      candidateId: session.candidateId,
      educationLevel: '',
      currentOccupation: '',
      familyTraditionalSkills: [],
      informalSkills: [],
      travelLimitKm: 15,
      employmentPreference: 'both',
      tradeInterests: [],
      completedStepCount: session.currentStepIndex,
      confidenceScore: 0.3,
      isComplete: false,
    };

    // Analyze via Gemini / Profile Engine
    const analysis = await analyzeTurnAndGetNextQuestion(
      session.transcript,
      payload.language,
      currentProfile,
      session.currentStepIndex
    );

    // Update profile
    const updated = { ...currentProfile, ...analysis.updatedProfile };
    db.profiles.set(session.candidateId, updated);

    // Update session step
    session.currentStepIndex = analysis.stepNumber;
    if (analysis.isComplete) {
      session.status = 'completed';
    }

    session.transcript.push({
      speaker: 'assistant',
      text: analysis.nextQuestion,
      timestamp: new Date().toISOString(),
    });

    let recs: any[] = [];
    if (analysis.isComplete) {
      recs = matchProfileToTrades(updated, 'Nadia', payload.language);
      db.recommendations.set(session.candidateId, recs);
    }

    return {
      sessionId: session.id,
      channel: payload.channel,
      replySpokenText: analysis.nextQuestion,
      stepIndex: session.currentStepIndex,
      isComplete: analysis.isComplete,
      recommendedTrades: recs,
      status: session.status,
    };
  }
}

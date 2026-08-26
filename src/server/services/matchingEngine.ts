import { CandidateProfile, Recommendation, QualificationPack, TrainingProvider, TrainingCourse, EconomicDemand } from '../../types.js';
import { db } from '../db/store.js';
import { vectorSearch } from './vectorSearch.js';

export function calculateHaversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export interface MatchScoreBreakdown {
  qp: QualificationPack;
  totalScore: number; // 0 to 100
  skillScore: number;
  interestScore: number;
  experienceScore: number;
  educationScore: number;
  mobilityScore: number;
  demandScore: number;
  providerScore: number;
  enterpriseScore: number;
  rplScore: number;
  nearestProvider?: TrainingProvider;
  distanceKm: number;
  matchingCourse?: TrainingCourse;
  economicDemand?: EconomicDemand;
  matchedSkills: string[];
  skillGaps: string[];
  whyRecommended: string[];
  rplEligible: boolean;
  rplDetails: {
    eligible: boolean;
    recommendedLevel: number;
    priorSkillRecognized: string[];
    assessmentMode: string;
  };
}

export class NSQFMatchingEngine {
  constructor() {
    // initialize vector search index
    const packs = db.getQualificationPacks();
    vectorSearch.indexPacks(packs);
  }

  public async generateRecommendations(candidate: CandidateProfile): Promise<Recommendation[]> {
    const allQPs = db.getQualificationPacks();
    const providers = db.getTrainingProviders();
    const courses = db.getTrainingCourses();
    const demands = db.getEconomicDemands();

    // Prepare candidate profile query text
    const candidateQuery = [
      candidate.currentOccupation || '',
      candidate.familyOccupation || '',
      ...(candidate.skills || []),
      ...(candidate.tools || []),
      ...(candidate.experience || []).map(e => (e.tradeOrActivity || '') + ' ' + (e.description || '')),
      ...(candidate.interests || []),
      ...(candidate.aspirations || [])
    ].join(' ');

    const vectorResults = await vectorSearch.search(candidateQuery, 10);
    const vectorScoreMap = new Map<string, number>();
    for (const vr of vectorResults) {
      vectorScoreMap.set(vr.qualificationPackId, vr.score);
    }

    const breakdowns: MatchScoreBreakdown[] = [];

    for (const qp of allQPs) {
      const breakdown = this.scoreQualificationPack(candidate, qp, providers, courses, demands, vectorScoreMap.get(qp.id) || 0);
      breakdowns.push(breakdown);
    }

    // Sort by total score descending
    breakdowns.sort((a, b) => b.totalScore - a.totalScore);

    // Pick top 3 distinct recommendations
    const top3 = breakdowns.slice(0, 3);

    const recommendations: Recommendation[] = top3.map((b, idx) => {
      const nearest = b.nearestProvider;
      const demand = b.economicDemand;

      const fallbackProvider: TrainingProvider = nearest || {
        id: 'TP-DEFAULT',
        name: 'District PMKK Skill Center',
        type: 'PMKK',
        district: candidate.location.district,
        state: candidate.location.state,
        address: 'District Skill Development Center',
        latitude: candidate.location.latitude,
        longitude: candidate.location.longitude,
        contactPerson: 'Center Incharge',
        contactPhone: '+91 94150 12345',
        active: true,
        totalCapacity: 120,
        allocatedSeats: 90,
        availableSeats: 30,
        rating: 4.6,
        facilities: ['Practical Lab', 'Hostel', 'Tool Library'],
        affiliatedSSC: b.qp.sector,
        nextBatchStartDate: b.matchingCourse?.startDate || '2026-09-15',
        phone: '+91 94150 12345'
      };

      const fallbackDemand: EconomicDemand = demand || {
        id: `DEM-${b.qp.id}`,
        district: candidate.location.district,
        state: candidate.location.state,
        trade: b.qp.title,
        sector: b.qp.sector,
        demandScore: 85,
        seasonality: 'All-Year',
        avgMonthlyWage: b.qp.averageStartingWage,
        enterprisePotential: b.qp.entrepreneurshipPotential,
        estimatedVacancies: 120,
        growthForecastPercent: 14,
        governmentIncentives: ['PM-AJAY Grant', 'Tool Kit Incentive'],
        topEmployers: ['District Fabricators Association', 'Rural Infrastructure Board']
      };

      return {
        id: `REC-${candidate.candidateId}-${idx + 1}-${Date.now().toString().slice(-4)}`,
        candidateId: candidate.candidateId,
        rank: idx + 1,
        qualificationPackId: b.qp.id,
        qualificationPackCode: b.qp.qpCode,
        qualificationPackTitle: b.qp.title,
        trade: b.qp.title,
        qualification: `${b.qp.title} (NSQF Level ${b.qp.nsqfLevel} - ${b.qp.qpCode})`,
        sector: b.qp.sector,
        nsqfLevel: b.qp.nsqfLevel,
        matchScore: Math.min(99, Math.max(60, Math.round(b.totalScore))),
        scoreBreakdown: {
          skillScore: Math.round(b.skillScore),
          experienceScore: Math.round(b.experienceScore),
          interestScore: Math.round(b.interestScore),
          mobilityScore: Math.round(b.mobilityScore),
          demandScore: Math.round(b.demandScore),
          compositeScore: Math.round(b.totalScore)
        },
        whyRecommended: b.whyRecommended,
        skillsMatched: b.matchedSkills,
        skillsToDevelop: b.skillGaps,
        matchedSkills: b.matchedSkills,
        skillGaps: b.skillGaps,
        trainingProvider: fallbackProvider,
        nearestCenterDistanceKm: b.distanceKm,
        nearestTrainingProvider: {
          id: fallbackProvider.id,
          name: fallbackProvider.name,
          distanceKm: b.distanceKm,
          district: fallbackProvider.district,
          availableSeats: fallbackProvider.availableSeats,
          courseStartDate: b.matchingCourse?.startDate || '2026-09-15',
          contactPhone: fallbackProvider.contactPhone
        },
        economicDemand: fallbackDemand,
        localDemand: {
          district: fallbackDemand.district,
          demandScore: fallbackDemand.demandScore,
          growthTrend: `+${fallbackDemand.growthForecastPercent}% expected sector growth`,
          estimatedMonthlyWage: fallbackDemand.avgMonthlyWage,
          seasonality: fallbackDemand.seasonality
        },
        rplFastTrackEligible: b.rplDetails.eligible,
        careerPathway: `${b.qp.title} (NSQF ${b.qp.nsqfLevel}) → Lead Craftsman / Supervisor (NSQF 5) → Independent Workshop Owner`,
        enterprisePotential: b.qp.entrepreneurshipPotential,
        rplPotential: b.rplDetails,
        nextSteps: [
          `Free enrollment under PM-AJAY component 2 grant at ${fallbackProvider.name}`,
          b.rplDetails.eligible 
            ? `Apply for Direct RPL Certification (Assessment only, 12-hour orientation)`
            : `3-month classroom & hands-on practical batch starting ${b.matchingCourse?.startDate || 'next month'}`,
          `Receive government NSQF certification and toolkit support upon completion`,
          `Linkage with Mudra / PMEGP for enterprise startup grant`
        ],
        status: 'recommended',
        createdAt: new Date().toISOString(),
        generatedAt: new Date().toISOString()
      };
    });

    db.saveRecommendations(candidate.candidateId, recommendations);
    db.addAuditLog({
      actorId: candidate.candidateId,
      actorRole: 'beneficiary',
      action: 'RECOMMENDATIONS_GENERATED',
      entityType: 'recommendation',
      entityId: candidate.candidateId,
      details: `Generated ${recommendations.length} NSQF livelihood recommendations for ${candidate.name} (${candidate.location.district}). Top match: ${recommendations[0]?.trade} (${recommendations[0]?.matchScore}%)`
    });

    return recommendations;
  }

  private scoreQualificationPack(
    candidate: CandidateProfile,
    qp: QualificationPack,
    providers: TrainingProvider[],
    courses: TrainingCourse[],
    demands: EconomicDemand[],
    vectorSimilarity: number
  ): MatchScoreBreakdown {
    const whyRecommended: string[] = [];
    const matchedSkills: string[] = [];
    const skillGaps: string[] = [];

    // 1. Skill & Tool overlap
    const candidateSkillsLower = (candidate.skills || []).map(s => s.toLowerCase());
    const candidateToolsLower = (candidate.tools || []).map(t => t.toLowerCase());
    const allCandPractical = [...candidateSkillsLower, ...candidateToolsLower];

    let skillMatchWeight = 0;
    for (const reqSkill of qp.requiredSkills) {
      const isMatched = allCandPractical.some(cs => cs.includes(reqSkill) || reqSkill.includes(cs) || this.areRelated(cs, reqSkill));
      if (isMatched) {
        matchedSkills.push(reqSkill);
        skillMatchWeight += 1;
      } else {
        skillGaps.push(reqSkill);
      }
    }

    for (const tool of qp.toolsRequired) {
      const toolMatched = candidateToolsLower.some(ct => ct.includes(tool.toLowerCase()) || tool.toLowerCase().includes(ct));
      if (toolMatched) {
        matchedSkills.push(`Tool: ${tool}`);
        skillMatchWeight += 0.8;
      }
    }

    const skillScore = Math.min(30, (skillMatchWeight / Math.max(1, qp.requiredSkills.length)) * 30 + vectorSimilarity * 15);

    if (matchedSkills.length > 0) {
      whyRecommended.push(`Direct alignment with your informal skills in ${matchedSkills.slice(0, 2).join(', ')}`);
    }

    // 2. Experience & Family Occupation
    let experienceScore = 0;
    const totalExpYears = (candidate.experience || []).reduce((acc, e) => acc + (e.yearsOfExperience || 0), 0);
    const familyOcc = candidate.familyOccupation || '';
    const isFamilyTrade = familyOcc.toLowerCase().includes(qp.sector.toLowerCase()) ||
      qp.keywords.some(k => familyOcc.toLowerCase().includes(k));

    if (isFamilyTrade && familyOcc) {
      experienceScore += 12;
      whyRecommended.push(`Builds directly on your family's traditional livelihood background (${familyOcc})`);
    }

    if (totalExpYears >= 5) {
      experienceScore += 10;
      whyRecommended.push(`Recognizes your ${totalExpYears} years of hands-on practical work experience`);
    } else if (totalExpYears >= 2) {
      experienceScore += 6;
    }

    // 3. Interest & Aspiration alignment
    let interestScore = 0;
    const candInterestsLower = (candidate.interests || []).map(i => i.toLowerCase()).concat((candidate.aspirations || []).map(a => a.toLowerCase()));
    const interestMatched = qp.keywords.some(k => candInterestsLower.some(ci => ci.includes(k)));
    if (interestMatched) {
      interestScore = 15;
      whyRecommended.push(`Matches your stated interest in learning and growing in ${qp.sector}`);
    } else {
      interestScore = 5;
    }

    // 4. Education Compatibility
    let educationScore = 10;
    // NSQF level 3/4 generally accessible with 5th/8th pass or informal RPL
    if (candidate.education.includes('No formal') || candidate.education.includes('Below 5th')) {
      educationScore = qp.rplEligible ? 8 : 4;
    }

    // 5. Nearest Provider & Proximity
    let minDistance = 999;
    let nearestProvider: TrainingProvider | undefined;
    let matchingCourse: TrainingCourse | undefined;

    // Filter providers in same district or nearby
    const candLat = candidate.location.latitude || 25.3176;
    const candLon = candidate.location.longitude || 82.9739;

    for (const prov of providers) {
      const dist = calculateHaversineDistanceKm(candLat, candLon, prov.latitude, prov.longitude);
      const provCourses = courses.filter(c => c.providerId === prov.id && c.qualificationPackId === qp.id);
      
      if (provCourses.length > 0 || prov.district.toLowerCase() === candidate.location.district.toLowerCase()) {
        if (dist < minDistance) {
          minDistance = dist;
          nearestProvider = prov;
          matchingCourse = provCourses[0];
        }
      }
    }

    if (!nearestProvider && providers.length > 0) {
      nearestProvider = providers[0];
      minDistance = 8.5;
    }

    const maxAllowedDist = candidate.mobility.maxDistanceKm || 15;
    let mobilityScore = 0;
    if (minDistance <= maxAllowedDist) {
      mobilityScore = 15;
      whyRecommended.push(`Nearby training center available (${nearestProvider?.name || 'Local PMKK'}) only ${minDistance} km from your village`);
    } else if (minDistance <= maxAllowedDist * 1.5) {
      mobilityScore = 8;
    } else {
      mobilityScore = 4;
    }

    // 6. District Economic Demand & Wages
    const distDemand = demands.find(d => 
      d.district.toLowerCase() === candidate.location.district.toLowerCase() &&
      (d.trade.toLowerCase().includes(qp.title.toLowerCase()) || d.sector.toLowerCase() === qp.sector.toLowerCase())
    ) || demands.find(d => d.sector.toLowerCase() === qp.sector.toLowerCase());

    let demandScore = 10;
    if (distDemand) {
      demandScore = Math.round((distDemand.demandScore / 100) * 15);
      whyRecommended.push(`High local employment and enterprise demand in ${candidate.location.district} (${distDemand.demandScore}/100 demand index)`);
    }

    // 7. Enterprise potential
    let enterpriseScore = 0;
    if (candidate.selfEmploymentInterest && qp.entrepreneurshipPotential === 'High') {
      enterpriseScore = 10;
      whyRecommended.push(`High village enterprise potential with PM-AJAY capital subsidy & Mudra support`);
    } else {
      enterpriseScore = 5;
    }

    // 8. RPL (Recognition of Prior Learning) determination
    const isRplEligible = (totalExpYears >= 3 || isFamilyTrade) && qp.rplEligible;
    let rplScore = isRplEligible ? 8 : 0;
    if (isRplEligible) {
      whyRecommended.push(`Eligible for Recognition of Prior Learning (RPL) to convert uncertified skills into a formal NSQF government credential`);
    }

    const totalScore = Math.min(
      98,
      skillScore + experienceScore + interestScore + educationScore + mobilityScore + demandScore + enterpriseScore + rplScore
    );

    return {
      qp,
      totalScore,
      skillScore,
      interestScore,
      experienceScore,
      educationScore,
      mobilityScore,
      demandScore,
      providerScore: nearestProvider ? 10 : 5,
      enterpriseScore,
      rplScore,
      nearestProvider,
      distanceKm: minDistance,
      matchingCourse,
      economicDemand: distDemand,
      matchedSkills: Array.from(new Set(matchedSkills)),
      skillGaps: Array.from(new Set(skillGaps)).slice(0, 3),
      whyRecommended: whyRecommended.slice(0, 5),
      rplEligible: isRplEligible,
      rplDetails: {
        eligible: isRplEligible,
        recommendedLevel: qp.nsqfLevel,
        priorSkillRecognized: matchedSkills.slice(0, 3),
        assessmentMode: isRplEligible ? 'Practical Demonstration & Spoken Viva' : 'Standard 3-Month Course & Practical Assessment'
      }
    };
  }

  private areRelated(candTerm: string, reqSkill: string): boolean {
    const pairs: [string, string][] = [
      ['loha', 'welding'],
      ['welder', 'welding'],
      ['arc', 'welding'],
      ['grinder', 'cutting'],
      ['silai', 'stitching'],
      ['darzi', 'tailor'],
      ['kapda', 'garment'],
      ['bijli', 'electrical'],
      ['wire', 'wiring'],
      ['tractor', 'diesel engine'],
      ['pump', 'solar pump'],
      ['bunkar', 'weaving'],
      ['tanti', 'handloom'],
      ['saree', 'jacquard']
    ];

    for (const [a, b] of pairs) {
      if ((candTerm.includes(a) && reqSkill.includes(b)) || (candTerm.includes(b) && reqSkill.includes(a))) {
        return true;
      }
    }
    return false;
  }
}

export const matchingEngine = new NSQFMatchingEngine();

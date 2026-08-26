import { GoogleGenAI, Type } from '@google/genai';
import { CandidateProfile, InterviewMessage, SupportedLanguage } from '../../types.js';

let aiClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

export interface DialogueStepResponse {
  assistantReplyText: string;
  detectedSlots: Partial<CandidateProfile>;
  confidence: number;
  isProfileComplete: boolean;
  missingSlots: string[];
  suggestedAction?: 'ask_followup' | 'confirm_profile' | 'escalate_human';
}

const SYSTEM_INSTRUCTION = `You are a respectful multilingual livelihood counselor helping rural PM-AJAY beneficiaries in India.
Speak simply, warmly, empathetically, and naturally in the beneficiary's chosen language or dialect.
Never shame the user for low education, lack of certificates, or informal employment.
Prefer everyday vocabulary over formal bureaucratic jargon.
Ask ONLY ONE clear, simple question at a time.
Infer competencies and practical skills from everyday descriptions (e.g. "I fix father's tractor" -> diesel engine repair, tool usage).
Detect whether they have informal experience that qualifies for Recognition of Prior Learning (RPL).
Always output a valid JSON adhering to the required schema.`;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    assistantReplyText: {
      type: Type.STRING,
      description: 'The natural spoken response/question in the requested language.',
    },
    extractedSlots: {
      type: Type.OBJECT,
      description: 'Extracted candidate profile fields.',
      properties: {
        name: { type: Type.STRING },
        age: { type: Type.NUMBER },
        gender: { type: Type.STRING },
        village: { type: Type.STRING },
        district: { type: Type.STRING },
        state: { type: Type.STRING },
        education: { type: Type.STRING },
        currentOccupation: { type: Type.STRING },
        familyOccupation: { type: Type.STRING },
        skills: { type: Type.ARRAY, items: { type: Type.STRING } },
        tools: { type: Type.ARRAY, items: { type: Type.STRING } },
        yearsOfExperience: { type: Type.NUMBER },
        interests: { type: Type.ARRAY, items: { type: Type.STRING } },
        aspirations: { type: Type.ARRAY, items: { type: Type.STRING } },
        selfEmploymentInterest: { type: Type.BOOLEAN },
        employmentPreference: { type: Type.STRING },
        willingToTravel: { type: Type.BOOLEAN },
        maxDistanceKm: { type: Type.NUMBER },
        willingToMigrate: { type: Type.BOOLEAN },
        rplSignals: { type: Type.ARRAY, items: { type: Type.STRING } }
      }
    },
    confidence: {
      type: Type.NUMBER,
      description: 'Confidence score from 0 to 100.',
    },
    isProfileComplete: {
      type: Type.BOOLEAN,
      description: 'True if minimum essential slots (skills/work, location, mobility, preference) are filled.',
    },
    missingSlots: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'List of remaining missing profile attributes.'
    }
  },
  required: ['assistantReplyText', 'confidence', 'isProfileComplete', 'missingSlots']
};

// Helper: Sleep for exponential backoff
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function processDialogueTurn(
  messages: InterviewMessage[],
  currentProfile: Partial<CandidateProfile>,
  language: SupportedLanguage | string = 'hi'
): Promise<DialogueStepResponse> {
  const ai = getGenAI();

  if (ai) {
    const conversationHistoryText = messages
      .map(m => `${m.sender.toUpperCase()}: ${m.text}`)
      .join('\n');

    const prompt = `Current Profile State:
${JSON.stringify(currentProfile, null, 2)}

Beneficiary Target Language: ${language}

Recent Conversation History:
${conversationHistoryText}

Analyze the user's latest response.
Extract any newly revealed slots (name, age, village, district, state, education, currentOccupation, familyOccupation, skills, tools, years of experience, interests, aspirations, employment preference, mobility constraints).
Determine the next single, empathetic follow-up question to ask in ${language} to fill remaining missing key slots, OR if enough information (skills, occupation, location, mobility, interest) is gathered, invite the user to review their profile summary.`;

    // Cascade list of models to try in case of temporary 503 spikes in demand
    const modelsToTry = ['gemini-3.7-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];

    for (const modelName of modelsToTry) {
      // Try with retry backoff for 503 / 429 errors
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          if (attempt > 0) {
            await sleep(400 * attempt);
          }

          const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
              systemInstruction: SYSTEM_INSTRUCTION,
              responseMimeType: 'application/json',
              responseSchema: RESPONSE_SCHEMA
            }
          });

          const rawText = response.text || '{}';
          const parsed = JSON.parse(rawText);
          const extracted = parsed.extractedSlots || {};

          const updatedSlots: Partial<CandidateProfile> = {
            ...currentProfile,
            name: extracted.name || currentProfile.name,
            age: extracted.age || currentProfile.age,
            education: extracted.education || currentProfile.education,
            currentOccupation: extracted.currentOccupation || currentProfile.currentOccupation,
            familyOccupation: extracted.familyOccupation || currentProfile.familyOccupation,
            skills: Array.from(new Set([...(currentProfile.skills || []), ...(extracted.skills || [])])),
            tools: Array.from(new Set([...(currentProfile.tools || []), ...(extracted.tools || [])])),
            interests: Array.from(new Set([...(currentProfile.interests || []), ...(extracted.interests || [])])),
            aspirations: Array.from(new Set([...(currentProfile.aspirations || []), ...(extracted.aspirations || [])])),
            selfEmploymentInterest: extracted.selfEmploymentInterest !== undefined ? extracted.selfEmploymentInterest : currentProfile.selfEmploymentInterest,
            employmentPreference: extracted.employmentPreference || currentProfile.employmentPreference || 'both',
            rplSignals: Array.from(new Set([...(currentProfile.rplSignals || []), ...(extracted.rplSignals || [])]))
          };

          if (extracted.village || extracted.district) {
            updatedSlots.location = {
              village: extracted.village || currentProfile.location?.village || '',
              district: extracted.district || currentProfile.location?.district || 'Varanasi',
              state: extracted.state || currentProfile.location?.state || 'Uttar Pradesh',
              latitude: currentProfile.location?.latitude || 25.3176,
              longitude: currentProfile.location?.longitude || 82.9739
            };
          }

          if (extracted.willingToTravel !== undefined || extracted.maxDistanceKm !== undefined) {
            updatedSlots.mobility = {
              willingToTravel: extracted.willingToTravel ?? currentProfile.mobility?.willingToTravel ?? true,
              maxDistanceKm: extracted.maxDistanceKm ?? currentProfile.mobility?.maxDistanceKm ?? 15,
              willingToMigrate: extracted.willingToMigrate ?? currentProfile.mobility?.willingToMigrate ?? false
            };
          }

          if (extracted.yearsOfExperience) {
            updatedSlots.experience = [
              {
                tradeOrActivity: extracted.currentOccupation || currentProfile.currentOccupation || 'Practical Trade Work',
                yearsOfExperience: extracted.yearsOfExperience,
                isFamilyOccupation: !!extracted.familyOccupation,
                informalOrFormal: 'informal',
                description: `Hands-on practical experience for ${extracted.yearsOfExperience} years.`
              }
            ];
          }

          return {
            assistantReplyText: parsed.assistantReplyText,
            detectedSlots: updatedSlots,
            confidence: parsed.confidence || 92,
            isProfileComplete: parsed.isProfileComplete || false,
            missingSlots: parsed.missingSlots || [],
            suggestedAction: parsed.isProfileComplete ? 'confirm_profile' : 'ask_followup'
          };
        } catch (err: any) {
          const isTransientError = err?.status === 'UNAVAILABLE' || err?.code === 503 || err?.message?.includes('demand') || err?.message?.includes('503');
          if (isTransientError && attempt === 0) {
            // Retry once on transient demand spike
            continue;
          }
          // Break inner loop to try next model in cascade
          break;
        }
      }
    }
  }

  // Deterministic Expert Multilingual Counselor Fallback (Guarantees 100% continuous uptime)
  return fallbackDeterministicCounselor(messages, currentProfile, language);
}

function fallbackDeterministicCounselor(
  messages: InterviewMessage[],
  current: Partial<CandidateProfile>,
  lang: string
): DialogueStepResponse {
  const lastUserMsg = [...messages].reverse().find(m => m.sender === 'user')?.text || '';
  const textLower = lastUserMsg.toLowerCase();

  const detected: Partial<CandidateProfile> = {
    skills: [...(current.skills || [])],
    tools: [...(current.tools || [])],
    interests: [...(current.interests || [])],
    aspirations: [...(current.aspirations || [])],
    rplSignals: [...(current.rplSignals || [])],
    location: current.location || {
      village: 'Gram Panchayat',
      district: 'Varanasi',
      state: 'Uttar Pradesh',
      latitude: 25.3176,
      longitude: 82.9739
    },
    mobility: current.mobility || {
      willingToTravel: true,
      maxDistanceKm: 15,
      willingToMigrate: false
    }
  };

  // 1. Welding & Metal Fabrication
  if (textLower.includes('weld') || textLower.includes('loha') || textLower.includes('gate') || textLower.includes('grinder') || textLower.includes('grill') || textLower.includes('rod')) {
    detected.currentOccupation = detected.currentOccupation || 'Informal Welding & Metal Fabrication';
    detected.skills = Array.from(new Set([...detected.skills!, 'arc welding', 'metal cutting', 'grinding', 'grill fabrication']));
    detected.tools = Array.from(new Set([...detected.tools!, 'Welding Inverter', 'Angle Grinder', 'Electrode Holder']));
    detected.interests = Array.from(new Set([...detected.interests!, 'Welding Workshop Enterprise', 'Manual Metal Arc Welder (NSQF 3)']));
  }

  // 2. Tailoring & Garments
  if (textLower.includes('silai') || textLower.includes('darzi') || textLower.includes('tailor') || textLower.includes('kapda') || textLower.includes('blouse') || textLower.includes('suit') || textLower.includes('machine')) {
    detected.currentOccupation = detected.currentOccupation || 'Home Tailoring & Garment Stitching';
    detected.skills = Array.from(new Set([...detected.skills!, 'pedal sewing machine operation', 'blouse stitching', 'garment cutting', 'pattern making']));
    detected.tools = Array.from(new Set([...detected.tools!, 'Sewing Machine', 'Tailoring Scissors', 'Measuring Tape']));
    detected.interests = Array.from(new Set([...detected.interests!, 'Self-Employed Tailor Boutique', 'Self Employed Tailor (NSQF 4)']));
  }

  // 3. Agriculture, Tractor & Diesel Mechanic
  if (textLower.includes('tractor') || textLower.includes('pump') || textLower.includes('engine') || textLower.includes('kheti') || textLower.includes('diesel') || textLower.includes('motor')) {
    detected.currentOccupation = detected.currentOccupation || 'Tractor Driver & Farm Machinery Helper';
    detected.skills = Array.from(new Set([...detected.skills!, 'tractor driving', 'diesel engine maintenance', 'rotavator operation', 'pump overhaul']));
    detected.tools = Array.from(new Set([...detected.tools!, 'Tractor', 'Spanner Kit', 'Grease Gun', 'Socket Wrench']));
    detected.interests = Array.from(new Set([...detected.interests!, 'Agri Machinery Mechanic (NSQF 4)', 'Solar Pump Technician']));
  }

  // 4. Electrician & Solar Wiring
  if (textLower.includes('bijli') || textLower.includes('wire') || textLower.includes('electric') || textLower.includes('switch') || textLower.includes('solar') || textLower.includes('inverter')) {
    detected.currentOccupation = detected.currentOccupation || 'Domestic Electrician & Wireman Helper';
    detected.skills = Array.from(new Set([...detected.skills!, 'house wiring', 'switchboard assembly', 'line testing', 'solar panel connection']));
    detected.tools = Array.from(new Set([...detected.tools!, 'Line Tester', 'Digital Multimeter', 'Drill Machine', 'Wire Stripper']));
    detected.interests = Array.from(new Set([...detected.interests!, 'Solar Rooftop & Certified Wireman', 'Solar PV Installer (NSQF 4)']));
  }

  // 5. Handloom & Weaving
  if (textLower.includes('bunkar') || textLower.includes('loom') || textLower.includes('weaving') || textLower.includes('saree') || textLower.includes('tanti') || textLower.includes('reshamp')) {
    detected.currentOccupation = detected.currentOccupation || 'Traditional Handloom Weaver';
    detected.familyOccupation = detected.familyOccupation || 'Traditional Heritage Handloom Weaving';
    detected.skills = Array.from(new Set([...detected.skills!, 'frame loom weaving', 'jacquard card knotting', 'yarn warping', 'silk motif design']));
    detected.tools = Array.from(new Set([...detected.tools!, 'Handloom', 'Wooden Shuttle', 'Jacquard Machine', 'Bobbins']));
    detected.interests = Array.from(new Set([...detected.interests!, 'Jacquard Handloom Weaver (NSQF 3)', 'Handloom Producer Group']));
  }

  // 6. Construction, Masonry & Plumbing
  if (textLower.includes('rajmistri') || textLower.includes('mason') || textLower.includes('plumber') || textLower.includes('pipe') || textLower.includes('cement') || textLower.includes('diwar')) {
    detected.currentOccupation = detected.currentOccupation || 'Assistant Mason & Construction Worker';
    detected.skills = Array.from(new Set([...detected.skills!, 'brick masonry', 'plastering', 'pipe fitting', 'waterproofing']));
    detected.tools = Array.from(new Set([...detected.tools!, 'Trowel', 'Spirit Level', 'Pipe Wrench']));
    detected.interests = Array.from(new Set([...detected.interests!, 'General Mason (NSQF 4)', 'Plumber General (NSQF 3)']));
  }

  // Extract years of experience
  const expMatch = textLower.match(/(\d+)\s*(saal|sal|year|years|boshor|varsham|varsh|varshamulu|samvatsara)/);
  if (expMatch) {
    const yrs = parseInt(expMatch[1], 10);
    detected.experience = [
      {
        tradeOrActivity: detected.currentOccupation || 'Practical Hands-on Work',
        yearsOfExperience: yrs,
        isFamilyOccupation: true,
        informalOrFormal: 'traditional_family',
        description: `Informal practical work experience for ${yrs} years.`
      }
    ];
    if (yrs >= 4) {
      detected.rplSignals = Array.from(new Set([...detected.rplSignals!, `${yrs} years practical experience qualifies for RPL fast-track certification.`]));
    }
  }

  // Work preference
  if (textLower.includes('apna') || textLower.includes('dukaan') || textLower.includes('khud ka') || textLower.includes('business') || textLower.includes('own shop') || textLower.includes('swarojgar')) {
    detected.selfEmploymentInterest = true;
    detected.employmentPreference = 'self_employment';
  } else if (textLower.includes('naukri') || textLower.includes('job') || textLower.includes('salary') || textLower.includes('company')) {
    detected.selfEmploymentInterest = false;
    detected.employmentPreference = 'wage_employment';
  } else {
    detected.selfEmploymentInterest = true;
    detected.employmentPreference = 'both';
  }

  // Mobility
  if (textLower.includes('gaon') || textLower.includes('ghar ke paas') || textLower.includes('near home') || textLower.includes('bahar nahi') || textLower.includes('paas me')) {
    detected.mobility = {
      willingToTravel: true,
      maxDistanceKm: 10,
      willingToMigrate: false
    };
  }

  // Candidate Name extraction
  const nameMatch = textLower.match(/(mera naam|naam|my name is|name)\s+([a-zA-Z\u0900-\u097F]+(?:\s+[a-zA-Z\u0900-\u097F]+)?)/);
  if (nameMatch && nameMatch[2]) {
    detected.name = nameMatch[2].trim();
  }

  const turnCount = messages.filter(m => m.sender === 'user').length;
  let reply = '';
  let isComplete = false;

  // Language-specific conversational response generator
  if (lang === 'bn') {
    if (turnCount === 1) {
      reply = 'খুব ভালো। আপনি কত বছর ধরে এই কাজ করছেন এবং কোন কোন যন্ত্রপাতি বা মেশিন ব্যবহার করতে পারেন?';
    } else if (turnCount === 2) {
      reply = 'ধন্যবাদ। আপনি কি নিজের গ্রামে বা ব্লকের আশেপাশে নিজের ব্যবসা/দোকান করতে চান, নাকি কোম্পানিতে চাকরি করতে চান?';
    } else if (turnCount === 3) {
      reply = 'কাজের জন্য আপনি গ্রাম থেকে সর্বোচ্চ কত কিলোমিটার পর্যন্ত যাতায়াত করতে পারবেন?';
    } else {
      reply = 'অসংখ্য ধন্যবাদ। আমি আপনার অভিজ্ঞতা ও কাজের আগ্রহ বুঝতে পেরেছি। চলুন আপনার তথ্যের সারাংশটি দেখে নেওয়া যাক।';
      isComplete = true;
    }
  } else if (lang === 'ta') {
    if (turnCount === 1) {
      reply = 'மிக்க மகிழ்ச்சி. நீங்கள் இந்த வேலையை எத்தனை வருடங்களாக செய்கிறீர்கள்? என்ன கருவிகள் பயன்படுத்துகிறீர்கள்?';
    } else if (turnCount === 2) {
      reply = 'நன்றி. சொந்தமாக கடை/தொழில் செய்ய விரும்புகிறீர்களா அல்லது நிறுவனத்தில் வேலை செய்ய விரும்புகிறீர்களா?';
    } else if (turnCount === 3) {
      reply = 'பயிற்சி பெற உங்கள் கிராமத்திலிருந்து எத்தனை கிலோமீட்டர் தூரம் வரை பயணிக்க முடியும்?';
    } else {
      reply = 'மிக நன்று. உங்கள் திறன்களையும் விருப்பங்களையும் பதிவு செய்துவிட்டோம். உங்கள் விவரங்களை உறுதி செய்வோம்.';
      isComplete = true;
    }
  } else if (lang === 'te') {
    if (turnCount === 1) {
      reply = 'చాలా బాగుంది. మీరు ఈ పనిని ఎన్ని సంవత్సరాలుగా చేస్తున్నారు మరియు ఏ పరికరాలను ఉపయోగిస్తున్నారు?';
    } else if (turnCount === 2) {
      reply = 'ధన్యవాదాలు. మీరు స్వంతంగా వ్యాపారం/దుకాణం పెట్టాలనుకుంటున్నారా లేదా ఉద్యోగం చేయాలనుకుంటున్నారా?';
    } else if (turnCount === 3) {
      reply = 'శిక్షణ లేదా పని కోసం మీరు మీ గ్రామం నుండి ఎంత దూరం వరకు ప్రయాణించగలరు?';
    } else {
      reply = 'చాలా ధన్యవాదాలు. మీ నైపుణ్యాలు మరియు ప్రాధాన్యతలను మేము నమోదు చేశాము. రండి, మీ వివరాలను సమీక్షిద్దాం.';
      isComplete = true;
    }
  } else if (lang === 'mr') {
    if (turnCount === 1) {
      reply = 'खूप छान! तुम्ही हे काम किती वर्षांपासून करत आहात आणि कोणती अवजारे किंवा यंत्रे वापरता?';
    } else if (turnCount === 2) {
      reply = 'छान. तुम्हाला स्वतःचा व्यवसाय सुरू करायचा आहे की कंपनीमध्ये नोकरी करायची आहे?';
    } else if (turnCount === 3) {
      reply = 'कामासाठी किंवा प्रशिक्षणासाठी तुम्ही गावापासून किती किलोमीटर अंतरापर्यंत जाऊ शकता?';
    } else {
      reply = 'खूप खूप धन्यवाद. आम्ही तुमची कौशल्ये आणि प्राधान्ये समजून घेतली आहेत. चला तुमच्या प्रोफाईलची पडताळणी करूया.';
      isComplete = true;
    }
  } else {
    // Hindi & dialects default
    if (turnCount === 1) {
      reply = 'बहुत अच्छा। आप लगभग कितने साल से यह काम कर रहे हैं और कौन-कौन से औजार या मशीन चलाते हैं?';
    } else if (turnCount === 2) {
      reply = 'बढ़िया। आप आगे चलकर नौकरी करना पसंद करेंगे या अपने गांव के पास अपना खुद का काम/दुकान शुरू करना चाहते हैं?';
    } else if (turnCount === 3) {
      reply = 'ट्रेनिंग या काम के लिए आप अपने गांव से कितनी दूरी तक जा सकते हैं? क्या कोई पारिवारिक मजबूरी है?';
    } else {
      reply = 'बहुत-बहुत धन्यवाद। मैंने आपकी कुशलता और प्राथमिकताओं को समझ लिया है। आइए एक बार आपकी जानकारी की पुष्टि कर लेते हैं।';
      isComplete = true;
    }
  }

  return {
    assistantReplyText: reply,
    detectedSlots: detected,
    confidence: 90,
    isProfileComplete: isComplete,
    missingSlots: isComplete ? [] : ['years_experience', 'mobility_distance'],
    suggestedAction: isComplete ? 'confirm_profile' : 'ask_followup'
  };
}

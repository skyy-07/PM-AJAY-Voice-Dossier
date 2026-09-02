import { CandidateProfile, RealJobRole, Recommendation, SupportedLanguage } from '../src/types';
import { db } from './db';
import {
  CandidateTradeEvaluationInput,
  filterAndRankRecommendationsWithGemini,
} from './gemini';
import { REAL_JOBS_CATALOGUE } from './realJobsDataset';

export function matchProfileToTrades(
  profile: CandidateProfile,
  candidateDistrict: string = 'Nadia',
  targetLanguage: SupportedLanguage = 'hi',
  fullTranscript: Array<{ speaker: 'assistant' | 'user'; text: string }> = []
): Recommendation[] {
  const allTrades = Array.from(db.trades.values());
  const allCenters = Array.from(db.centers.values());
  const allRealJobs = Array.from(db.realJobs.values());

  // Aggregate user dialogue text to extract explicit negative/positive constraints
  const combinedUserText = fullTranscript
    .filter((t) => t.speaker === 'user')
    .map((t) => t.text)
    .join(' ')
    .toLowerCase();

  // Find nearest centers in this district or neighboring districts
  const districtCenters = allCenters.filter(
    (c) => c.district.toLowerCase() === candidateDistrict.toLowerCase()
  );
  const fallbackCenters = districtCenters.length > 0 ? districtCenters : allCenters;

  const scoredList: Array<{
    tradeId: string;
    score: number;
    nearestCenter: (typeof allCenters)[0];
    matchedRealJob?: RealJobRole;
    tags: string[];
    customExplanation?: Record<SupportedLanguage, string>;
  }> = [];

  for (const trade of allTrades) {
    let score = 50; // base score
    const tags: string[] = [];

    // Find nearest center offering this trade
    const centersWithTrade = fallbackCenters.filter((c) =>
      c.offeredTrades.includes(trade.id)
    );
    const chosenCenter = centersWithTrade[0] || fallbackCenters[0];

    // Find matching real job in catalogue
    const matchedRealJob = allRealJobs.find(
      (job) =>
        job.tradeId === trade.id ||
        job.jobTitle.toLowerCase().includes(trade.tradeName.toLowerCase()) ||
        trade.tradeName.toLowerCase().includes(job.jobTitle.toLowerCase())
    );

    // 1. Proximity / Mobility Filter (Distance Factor & 100% Online Mode)
    const isOnlineTrade =
      trade.id.includes('data_entry') ||
      trade.id.includes('digital_marketing') ||
      trade.id.includes('copa') ||
      trade.id.includes('graphic_web') ||
      trade.id.includes('remote_bpo') ||
      (matchedRealJob && (matchedRealJob.commuteMode.includes('Online') || matchedRealJob.distanceKm === 0));

    const candidateMaxKm = profile.travelLimitKm ?? 20;
    const effectiveDistance = isOnlineTrade
      ? 0
      : matchedRealJob
      ? matchedRealJob.distanceKm
      : chosenCenter.distanceKm;

    // Check for explicit online / WFH demand
    const isOnlineCourseIntent =
      /(online|course|कोर्स|ऑनलाइन|डिजिटल|digital|computer|कंप्यूटर|কম্পিউটার|संगणक|கணினி|typing|टाइपिंग|data entry|डेटा एंट्री|marketing|मार्केटिंग|social media|reels|canva|photoshop|coding|programming|python|web design|website|graphic|ग्राफिक|telecaller|telecalling|work from home|remote|wfh|ঘরে বসে|घर बैठे|घरी बसून|வீட்டிலிருந்தே)/i.test(
        combinedUserText
      ) ||
      (profile.informalSkills || []).some((s) =>
        /(online|course|digital|computer|typing|data entry|marketing|coding|programming|python|canva|photoshop|remote|wfh|telecaller|bpo|ঘরে বসে|घर बैठे|घरी बसून|कोडिंग|অনলাইন|कोर्स|ऑनलाइन|डिजिटल|कंप्यूटर|संगणक|கணினி)/i.test(
          s
        )
      ) ||
      (profile.tradeInterests || []).some((i) =>
        /(online|course|digital|computer|typing|data entry|marketing|coding|programming|python|canva|photoshop|remote|wfh|telecaller|bpo|ঘরে বসে|घर बैठे|घरी बसून|कोडिंग|অনলাইন|कोर्स|ऑनलाइन|डिजिटल|कंप्यूटर|संगणक|கணினி)/i.test(
          i
        )
      ) ||
      /(online|course|digital|computer|data entry|marketing|coding|programming|telecaller|कोडिंग|অনলাইন|कोर्स|ऑनलाइन|डिजिटल|कंप्यूटर)/i.test(
        profile.currentOccupation || ''
      );

    if (isOnlineTrade) {
      if (isOnlineCourseIntent) {
        score += 65;
        tags.push('100% fits requested Online / Remote Learning Mode');
      } else {
        score += 30;
        tags.push('100% Online Mode (Learn from Home / Anywhere)');
      }
    } else if (effectiveDistance <= candidateMaxKm) {
      score += 30;
      tags.push(`${effectiveDistance} km local proximity (within ${candidateMaxKm} km limit)`);
    } else if (effectiveDistance <= candidateMaxKm * 1.5) {
      score += 10;
      tags.push(`${effectiveDistance} km direct commute`);
    } else {
      score -= 30; // Strictly penalize if exceeds mobility constraint
      if (chosenCenter.hostelAvailable) {
        score += 15;
        tags.push('Hostel accommodation available');
      } else {
        tags.push(`Exceeds ${candidateMaxKm} km travel limit`);
      }
    }

    // 2. Strict Education Constraint Check
    const userEdu = (profile.educationLevel || '').toLowerCase();
    const tradeMinEdu = (trade.minEducation || '').toLowerCase();
    if (userEdu.includes('5th') || userEdu.includes('primary') || userEdu.includes('no formal')) {
      if (tradeMinEdu.includes('10th') || tradeMinEdu.includes('12th')) {
        score -= 25; // Ineligible or discouraged without secondary schooling
      }
    }

    // 3. Skill & Informal Background Alignment (No Broad Associations)
    const interests = (profile.tradeInterests || []).map((t) => t.toLowerCase());
    const skills = [
      ...(profile.informalSkills || []),
      ...(profile.familyTraditionalSkills || []),
    ].map((s) => s.toLowerCase());

    const isDirectInterest = interests.some(
      (i) =>
        trade.tradeName.toLowerCase().includes(i) ||
        trade.sector.toLowerCase().includes(i) ||
        (matchedRealJob && matchedRealJob.jobTitle.toLowerCase().includes(i))
    );
    if (isDirectInterest) {
      score += 35;
      tags.push('Direct interest alignment');
    }

    // Check specific real-world hands-on skills
    const hasRelatedSkill = skills.some((s) => {
      if (trade.id.includes('data_entry')) {
        return (
          s.includes('data') ||
          s.includes('entry') ||
          s.includes('typing') ||
          s.includes('excel') ||
          s.includes('office') ||
          s.includes('computer') ||
          s.includes('टाइपिंग') ||
          s.includes('डेटा') ||
          s.includes('এক্সেল')
        );
      }
      if (trade.id.includes('digital_marketing')) {
        return (
          s.includes('market') ||
          s.includes('social') ||
          s.includes('reels') ||
          s.includes('insta') ||
          s.includes('fb') ||
          s.includes('facebook') ||
          s.includes('ad') ||
          s.includes('मार्केटिंग') ||
          s.includes('বিজ্ঞাপন')
        );
      }
      if (trade.id.includes('copa')) {
        return (
          s.includes('code') ||
          s.includes('coding') ||
          s.includes('program') ||
          s.includes('python') ||
          s.includes('web') ||
          s.includes('software') ||
          s.includes('कोडिंग') ||
          s.includes('সফটওয়্যার')
        );
      }
      if (trade.id.includes('graphic_web')) {
        return (
          s.includes('graphic') ||
          s.includes('design') ||
          s.includes('canva') ||
          s.includes('photo') ||
          s.includes('thumbnail') ||
          s.includes('poster') ||
          s.includes('लोगो') ||
          s.includes('ग्राफिक') ||
          s.includes('ডিজাইন')
        );
      }
      if (trade.id.includes('remote_bpo')) {
        return (
          s.includes('call') ||
          s.includes('telecaller') ||
          s.includes('bpo') ||
          s.includes('customer') ||
          s.includes('care') ||
          s.includes('support') ||
          s.includes('chat') ||
          s.includes('voice') ||
          s.includes('वर्क फ्रॉम होम') ||
          s.includes('কাস্টমার')
        );
      }
      if (trade.id.includes('electrician') || trade.id.includes('solar')) {
        return (
          s.includes('wire') ||
          s.includes('motor') ||
          s.includes('repair') ||
          s.includes('current') ||
          s.includes('meter') ||
          s.includes('बिजली') ||
          s.includes('বিদ্যুৎ') ||
          s.includes('solar') ||
          s.includes('सौर')
        );
      }
      if (trade.id.includes('tailor')) {
        return (
          s.includes('stitch') ||
          s.includes('cloth') ||
          s.includes('sew') ||
          s.includes('machine') ||
          s.includes('सिलाई') ||
          s.includes('সেলাই') ||
          s.includes('tailor') ||
          s.includes('boutique')
        );
      }
      if (trade.id.includes('auto')) {
        return (
          s.includes('drive') ||
          s.includes('bike') ||
          s.includes('motor') ||
          s.includes('puncture') ||
          s.includes('vehicle') ||
          s.includes('गाड़ी') ||
          s.includes('গাড়ি') ||
          s.includes('rickshaw') ||
          s.includes('টোটো')
        );
      }
      if (trade.id.includes('dairy')) {
        return (
          s.includes('farm') ||
          s.includes('cow') ||
          s.includes('cattle') ||
          s.includes('milk') ||
          s.includes('पशु') ||
          s.includes('দুধ') ||
          s.includes('डेयरी')
        );
      }
      if (trade.id.includes('plumbing')) {
        return (
          s.includes('pipe') ||
          s.includes('water') ||
          s.includes('tap') ||
          s.includes('leak') ||
          s.includes('नल') ||
          s.includes('প্লাম্বার') ||
          s.includes('পাম্প')
        );
      }
      if (trade.id.includes('masonry')) {
        return (
          s.includes('brick') ||
          s.includes('cement') ||
          s.includes('mason') ||
          s.includes('mistri') ||
          s.includes('ईंट') ||
          s.includes('राजमिस्त्री') ||
          s.includes('গাঁথনি')
        );
      }
      if (trade.id.includes('warehouse')) {
        return (
          s.includes('pack') ||
          s.includes('store') ||
          s.includes('delivery') ||
          s.includes('box') ||
          s.includes('गोदाम') ||
          s.includes('প্যাকিং') ||
          s.includes('লোড')
        );
      }
      if (trade.id.includes('gda')) {
        return (
          s.includes('health') ||
          s.includes('nurse') ||
          s.includes('hospital') ||
          s.includes('patient') ||
          s.includes('दवा') ||
          s.includes('হাসপাতাল') ||
          s.includes('সেবা')
        );
      }
      if (trade.id.includes('drone')) {
        return (
          s.includes('drone') ||
          s.includes('spray') ||
          s.includes('tech') ||
          s.includes('mobile') ||
          s.includes('ड्रोन') ||
          s.includes('স্প্রে')
        );
      }
      if (trade.id.includes('welder')) {
        return (
          s.includes('weld') ||
          s.includes('metal') ||
          s.includes('iron') ||
          s.includes('grill') ||
          s.includes('वेल्डिंग') ||
          s.includes('লোহা')
        );
      }
      if (trade.id.includes('csc')) {
        return (
          s.includes('computer') ||
          s.includes('phone') ||
          s.includes('online') ||
          s.includes('form') ||
          s.includes('आधार') ||
          s.includes('কম্পিউটার') ||
          s.includes('মোবাইল')
        );
      }
      return false;
    });

    if (hasRelatedSkill) {
      score += 30;
      tags.push('Proven hands-on skill experience');
    }

    // 4. Strict Employment Preference Constraint (Self vs Wage)
    if (
      profile.employmentPreference === 'self_employment' &&
      trade.category === 'self_employment'
    ) {
      score += 30;
      tags.push('100% fits self-employment goal');
    } else if (
      profile.employmentPreference === 'self_employment' &&
      trade.category === 'wage_employment'
    ) {
      score -= 15; // demote wage employment when candidate explicitly asked for self-employment
    } else if (
      profile.employmentPreference === 'wage_employment' &&
      (trade.category === 'wage_employment' || trade.category === 'hybrid')
    ) {
      score += 30;
      tags.push('Verified wage employers hiring');
    }

    // 5. Local Demand & Active Vacancies Weight
    if (trade.demandLevel === 'High') {
      score += 15;
      tags.push('High district hiring demand');
    }

    if (trade.activeVacanciesCount && trade.activeVacanciesCount > 10) {
      score += 10;
      tags.push(`${trade.activeVacanciesCount} active verified vacancies`);
    }

    scoredList.push({
      tradeId: trade.id,
      score,
      nearestCenter: chosenCenter,
      matchedRealJob,
      tags,
    });
  }

  // Sort descending by score
  scoredList.sort((a, b) => b.score - a.score);

  // Take top 3 best matching real jobs/trades
  const topMatches = scoredList.slice(0, 3);

  const localizedExplanations: Record<string, Record<SupportedLanguage, string>> = {
    trade_electrician: {
      hi: 'आपके तकनीकी हुनर, वायरिंग अनुभव और स्थानीय क्षेत्र में बिजली व डिस्कॉम के काम की भारी मांग के कारण यह आपके लिए सबसे उत्तम वास्तविक नौकरी है।',
      bn: 'আপনার কারিগরি অভিজ্ঞতা এবং এলাকায় গৃহস্থালি ও কৃষি পাম্প ওয়্যারিংয়ের ব্যাপক চাহিদার জন্য এটি সবচেয়ে বাস্তবসম্মত ও নির্ভরযোগ্য কাজ।',
      mr: 'तुमच्या तांत्रिक कौशल्यामुळे आणि स्थानिक भागात वीज व शेती पंप वायरिंगची प्रचंड मागणी असल्याने हा सर्वात योग्य रोजगार पर्याय आहे.',
      ta: 'உங்கள் செய்முறை அனுபவம் மற்றும் இப்பகுதியில் மின் பணியாளர்களுக்கான அதிக தேவை காரணமாக இது சிறந்த தேர்வு.',
      en: 'Top recommendation matching your hands-on electrical wiring background with 18+ active local discom vacancies.',
    },
    trade_tailor: {
      hi: 'सिलाई के हुनर से घर बैठे बुटीक खोलने या परिधान इकाइयों में काम करके ₹12,000-₹24,000 कमाने का सबसे ठोस अवसर।',
      bn: 'ঘরে বসে নিজস্ব বুটিক বা দর্জি দোকান খুলে মাসে ₹১২,০০০-₹২৪,০০০ উপার্জনের জন্য আপনার সেলাই দক্ষতার সেরা মেলবন্ধন।',
      mr: 'घरबसल्या स्वतःचा बुटीक किंवा शिलाई व्यवसाय सुरू करून दरमहा ₹१२,०००-₹२४,००० कमावण्यासाठी उत्तम मार्ग.',
      ta: 'வீட்டிலிருந்தே சொந்தமாக தையல் தொழில் தொடங்கி நிலையான வருமானம் ஈட்ட உங்கள் திறமைக்கு மிகவும் பொருத்தமானது.',
      en: 'Ideal for home-based boutique enterprise or garment clusters with immediate PM-AJAY toolkit grant support.',
    },
    trade_solar: {
      hi: 'पीएम सूर्य घर योजना के तहत आपके ब्लॉक में सोलर रूफटॉप व इन्वर्टर लगाने वाले तकनीशियनों की सीधी भर्ती हो रही है।',
      bn: 'পিএম সূর্য ঘর প্রকল্পের অধীনে আপনার ব্লকেই সোলার প্যানেল ও ইনভার্টার সংযোগকারী প্রযুক্তিবিদদের সরাসরি নিয়োগ চলছে।',
      mr: 'पंतप्रधान सूर्य घर योजनेअंतर्गत तुमच्या तालुक्यात सोलर तंत्रज्ञांना थेट सरकारी कामे आणि मागणी उपलब्ध आहे.',
      ta: 'சூரிய சக்தி கூரை திட்டங்களின் கீழ் உங்கள் பகுதியிலேயே உடனடி வேலைவாய்ப்பும் அரசு உதவியும் உள்ளது.',
      en: 'Direct hiring in PM Surya Ghar rooftop solar installations with approved EPC contractor partnerships.',
    },
    trade_auto: {
      hi: 'बाइक और ई-रिक्शा (टोटो) की रिपेयरिंग, बीएलडीसी मोटर और बैटरी कंट्रोलर सुधारकर तुरंत अच्छी कमाई का रास्ता।',
      bn: 'মোটরসাইকেল ও টোটো/ই-রিকশার ইঞ্জিন, ব্রেক ও ব্যাটারি মেরামত করে দ্রুত স্বাধীন কর্মসংস্থানের সুযোগ।',
      mr: 'दुचाकी आणि ई-रिक्षा दुरुस्ती, इंजिन व बॅटरी रिपेअरिंगमधून हमखास रोजगाराची संधी.',
      ta: 'இருசக்கர வாகனம் மற்றும் இ-ரிக்ஷா பழுதுநீக்கி விரைவாக தொழில் தொடங்கும் வேலைவாய்ப்பு.',
      en: 'High-income local trade servicing two-wheelers, EV scooters, and e-rickshaws with active dealership demand.',
    },
    trade_dairy: {
      hi: 'दुग्ध समिति और उन्नत पशुपालन से जुड़कर नियमित मासिक आय और सरकारी डेयरी अनुदान का सीधा लाभ।',
      bn: 'দুগ্ধ সমবায় ও উন্নত গবাদি পশু পালনের মাধ্যমে নিয়মিত মাসিক নিশ্চিত আয়ের সুবর্ণ সুযোগ।',
      mr: 'दुग्ध सहकारी संस्थांशी जोडून नियमित मासिक उत्पन्न आणि पशुसंवर्धन योजनेचा लाभ मिळवण्याचा मार्ग.',
      ta: 'பால் பண்ணை மற்றும் கூட்டுறவு சங்கம் மூலம் நிலையான வருமானம் ஈட்ட இது மிகச் சிறந்த வாய்ப்பு.',
      en: 'Direct linkage to village dairy cooperatives ensuring steady monthly income and subsidized livestock assistance.',
    },
    trade_plumbing: {
      hi: 'जल जीवन मिशन और नए मकानों में पाइपलाइन, मोटर व सैनिटरी फिटिंग के 15+ खुले काम आपके पास उपलब्ध हैं।',
      bn: 'জল জীবন মিশন ও গৃহ নির্মাণ প্রকল্পে জলের পাইপলাইন এবং স্যানিটারি ফিটিংসের প্রচুর কাজের সুযোগ।',
      mr: 'जल जीवन मिशन आणि नवीन बांधकामांमध्ये पाईपलाईन व सॅनिटरी फिटिंगची हमखास मागणी.',
      ta: 'குடிநீர் திட்டம் மற்றும் கட்டுமானங்களில் குழாய் பொருத்துநருக்கான அதிக உடனடி வாய்ப்புகள்.',
      en: 'High-demand plumbing and pipeline maintenance under Har Ghar Jal and local construction projects.',
    },
    trade_masonry: {
      hi: 'पीएम आवास योजना व पक्के मकान निर्माण में कुशल राजमिस्त्री, प्लास्टर व टाइल्स कारीगरों की प्रतिदिन ₹700-₹900 की मांग।',
      bn: 'প্রধানমন্ত্রী গ্রামীণ আবাসন ও আধুনিক নির্মাণে দক্ষ রাজমিস্ত্রি ও টাইলস মিস্ত্রির নিশ্চিত দৈনিক রোজগার।',
      mr: 'पंतप्रधान आवास योजना व बांधकामात कुशल गवंडी आणि टाईल्स कामगारांना दररोज ₹७००-₹९०० ची मागणी.',
      ta: 'வீட்டு வசதி திட்டம் மற்றும் கட்டுமானங்களில் கொத்தனார் மற்றும் டைல்ஸ் வேலைக்கு அதிக ஊதியம்.',
      en: 'Steady livelihood in brickwork, plastering, and tiling across PMAY-G rural housing and private construction.',
    },
    trade_warehouse: {
      hi: 'फ्लिपकार्ट, अमेज़न व डेल्हीवरी वेयरहाउस में बारकोड स्कैनर से सामान छांटने व पैकिंग की मासिक पक्की नौकरी (पीएफ/ईएसआई सहित)।',
      bn: 'ফ্লিপকার্ট, অ্যামাজন ও লজিস্টিকস হাব-এ বারকোড স্ক্যানিং ও প্যাকিং অ্যাসোসিয়েটের স্থায়ী মাসিক চাকরি।',
      mr: 'ई-कॉमर्स वेअरहाऊसमध्ये बारकोड स्कॅनरने मालाची तपासणी व पॅकिंगची पगारदार नोकरी.',
      ta: 'கிடங்கில் பார்சல் ஸ்கேனிங் மற்றும் பேக்கிங் பணிக்கான தொடர் நிறுவன வேலைவாய்ப்பு.',
      en: 'Structured logistics fulfillment employment with PF/ESI, overtime benefits, and rapid career promotion.',
    },
    trade_gda: {
      hi: 'सरकारी व निजी अस्पतालों में जीडीए नर्सिंग सहायक बनकर मरीजों की देखभाल और प्रतिष्ठित स्वास्थ्य सेवा नौकरी।',
      bn: 'হাসপাতাল ও নার্সিংহোমে জেনারেল ডিউটি অ্যাসিস্ট্যান্ট হিসেবে স্বাস্থ্যসেবায় সম্মানজনক কর্মসংস্থান।',
      mr: 'रुग्णालय व क्लिनिकमध्ये रुग्ण सेवा सहाय्यक म्हणून प्रतिष्ठित नोकरीची संधी.',
      ta: 'மருத்துவமனையில் நோயாளி பராமரிப்பு மற்றும் மருத்துவ உதவி பணியாளர் வேலை.',
      en: 'Healthcare hospital ward assistant with guaranteed placement in sub-divisional hospitals and nursing homes.',
    },
    trade_drone: {
      hi: 'ड्रोन पायलट बनकर खेतों में नैनो-यूरिया छिड़कने की आधुनिक तकनीक सीखें और ₹18,000-₹30,000 कमाएं।',
      bn: 'কৃষি ড্রোন পাইলট হয়ে আধুনিক পদ্ধতিতে সার স্প্রে করে প্রতি মাসে ₹১৮,০০০-₹৩০,০০০ উপার্জনের সেরা সুযোগ।',
      mr: 'कृषी ड्रोन पायलट बनून शेतात फवारणी करण्याचे आधुनिक तंत्रज्ञान आणि उच्च उत्पन्नाची संधी.',
      ta: 'விவசாய ட்ரோன் இயக்கி நவீன முறையில் உரம் தெளிக்கும் உயர் வருமான தொழில்.',
      en: 'Cutting-edge DGCA-certified agri-drone piloting for nano-fertilizer spraying with FPOs and hiring centers.',
    },
    trade_welder: {
      hi: 'लोहे के गेट, ग्रिल, शेड और गाड़ियों की वेल्डिंग व फैब्रिकेशन से ₹15,000-₹25,000 कमाने का हुनर।',
      bn: 'লোহার গ্রিল, গেট ও মেটাল ফেব্রিকেশনের দক্ষ কারিগর হয়ে স্বাধীন ওয়ার্কশপ গড়ার সুযোগ।',
      mr: 'लोखंडी गेट, ग्रिल व शेड वेल्डिंग कामातून स्वतःचा व्यवसाय किंवा कारखान्यात काम.',
      ta: 'உலோக வெல்டிங் மற்றும் கேட் தயாரிப்பில் சொந்த பட்டறை அல்லது தொழிற்சாலை பணி.',
      en: 'High-earning arc welding and structural metal fabrication for industrial workshops and independent grills.',
    },
    trade_csc: {
      hi: 'गांव में अपना ग्राहक सेवा केंद्र खोलकर आधार से पैसे निकालना, सरकारी फॉर्म भरना और डिजिटल सेवाएं देकर कमाई करें।',
      bn: 'গ্রামে নিজের ডিজিটাল সেবা কেন্দ্র খুলে আধার ব্যাংকিং ও অনলাইন ফর্ম ফিলাপের স্বনির্ভর ব্যবসা।',
      mr: 'गावात स्वतःचे डिजिटल केंद्र सुरू करून आधार बँकिंग व सरकारी योजनांचे फॉर्म भरून कमाई.',
      ta: 'கிராமத்தில் பொது சேவை மையம் மூலம் அரசு சேவைகள் வழங்கி வருமானம் ஈட்டும் வாய்ப்பு.',
      en: 'Village digital entrepreneurship managing micro-ATM cash transactions and government scheme applications.',
    },
    trade_data_entry: {
      hi: '100% ऑनलाइन प्रमाणित कोर्स - घर बैठे या दफ्तर में टाइपिंग, एमएस एक्सेल और डेटा एंट्री से ₹15,000-₹26,000 कमाने का सबसे उत्तम अवसर।',
      bn: '১০০% অনলাইন সার্টিফাইড কোর্স - ঘরে বসে বা অফিসে টাইপিং, এক্সেল ও ব্যাক-অফিস কাজে ₹১৫,০০০-₹২৬,০০০ নিশ্চিত উপার্জনের পথ।',
      mr: '१००% ऑनलाईन प्रमाणित कोर्स - घरबसल्या संगणकावर टायपिंग व डेटा एंट्रीतून ₹१५,०००-₹२६,००० कमावण्याची उत्तम संधी.',
      ta: '100% ஆன்லைன் சான்றிதழ் படிப்பு - வீட்டிலிருந்தே கணினியில் தட்டச்சு மற்றும் தரவு பதிவு செய்து நிலையான வருமானம் ஈட்டும் வாய்ப்பு.',
      en: '100% Online Certified Course: Fast-track to work-from-home data entry, spreadsheet operations, and corporate back-office placements.',
    },
    trade_digital_marketing: {
      hi: '100% ऑनलाइन कोर्स - इंस्टाग्राम रील्स, फेसबुक विज्ञापन, कैनवा और ऑनलाइन प्रोडक्ट बेचकर ₹18,000-₹35,000 कमाने का आधुनिक अवसर।',
      bn: '১০০% অনলাইন কোর্স - সোশ্যাল মিডিয়া, গুগল অ্যাডस ও ই-কমার্সে প্রোডাক্ট প্রমোশন করে ঘরে বসে ফ্রিল্যান্সিং ও চাকরির সুযোগ।',
      mr: '१००% ऑनलाईन कोर्स - सोशल मीडिया, फेसबुक जाहिराती आणि डिजिटल मार्केटिंगमधून दरमहा ₹१८,०००-₹३५,००० ची पक्की संधी.',
      ta: '100% ஆன்லைன் படிப்பு - சமூக ஊடக விளம்பரங்கள் மற்றும் டிஜிட்டல் மார்க்கெட்டிங் மூலம் வீட்டில் இருந்தே தொழில் செய்யும் சிறந்த வாய்ப்பு.',
      en: '100% Online Certified Course: Master social media ads, Canva creative design, and e-commerce selling with remote/agency job links.',
    },
    trade_copa: {
      hi: '100% ऑनलाइन कोर्स - शुरुआत से कोडिंग, वेबसाइट बनाना (HTML/CSS) और पायथन सीखकर आईटी कंपनियों में ₹20,000-₹38,000 की नौकरी।',
      bn: '১০০% অনলাইন কোর্স - বেসিক কোডিং, ওয়েব ডেভেলপমেন্ট ও পাইথন শিখে আইটি ও টেক ইন্ডাস্ট্রিতে ক্যারিয়ার গড়ার দারুণ সুযোগ।',
      mr: '१००% ऑनलाईन कोर्स - सुरुवातीपासून कोडिंग, वेब डिझाईन आणि पायथन शिकून आयटी क्षेत्रात ₹२०,०००-₹३८,००० ची नोकरी.',
      ta: '100% ஆன்லைன் படிப்பு - அடிப்படை கணினி குறியீடு, வலைத்தள உருவாக்கம் மற்றும் பைதான் மூலம் ஐடி துறையில் வேலைவாய்ப்பு.',
      en: '100% Online Technical Track: Practical web layouts (HTML/CSS), Python programming foundations, and junior software assistant openings.',
    },
    trade_graphic_web: {
      hi: '100% ऑनलाइन कोर्स - मोबाइल व लैपटॉप पर कैनवा व फोटोशॉप से यूट्यूब थंबनेल, पोस्टर व लोगो बनाकर ₹16,000-₹32,000 की कमाई।',
      bn: '১০০% অনলাইন কোর্স - ক্যানভা ও ফটোশপে পোস্টার, লোগো ও ইউটিউব থাম্বনেইল ডিজাইন করে ঘরে বসে আয়ের সেরা মাধ্যম।',
      mr: '१००% ऑनलाईन कोर्स - कॅनव्हा व फोटोशॉपने पोस्टर्स, लोगो आणि थंबनेल्स डिझाईन करून घरबसल्या उत्पन्नाचा मार्ग.',
      ta: '100% ஆன்லைன் படிப்பு - கேன்வா மற்றும் போட்டோஷாப் மூலம் போஸ்டர்கள் மற்றும் யூடியூப் தம்ப்நெயில் வடிவமைத்து வருமானம் ஈட்டும் வழி.',
      en: '100% Online Creative Course: Canva Pro design, thumbnail creation, and freelance visual content production.',
    },
    trade_remote_bpo: {
      hi: '100% ऑनलाइन कोर्स - घर बैठे मोबाइल व हेडसेट से बैंकों व ई-कॉमर्स कंपनियों के कस्टमर केयर कॉल संभालें और ₹15,000-₹28,000 कमाएं।',
      bn: '১০০% অনলাইন কোর্স - ঘরে বসে মোবাইল ও হেডসেটের সাহায্যে ব্যাংকিং ও ই-কমার্স কাস্টমার কেয়ার অ্যাসোসিয়েট হিসেবে মাসিক নিশ্চিত আয়।',
      mr: '१০০% ऑनलाईन कोर्स - घरबसल्या मोबाईलवर कस्टमर सपोर्ट व टेलिकॉलिंग करून दरमहा ₹१५,०००-₹२८,००० ची वर्क-फ्रॉम-होम नोकरी.',
      ta: '100% ஆன்லைன் படிப்பு - வீட்டிலிருந்தே வாடிக்கையாளர் சேவை மற்றும் டெலிகாலிங் மூலம் மாதாந்திர ஊதியம் பெறும் வேலை.',
      en: '100% Online Work-From-Home Track: Inbound/outbound customer support, cloud CRM handling, and certified remote BPO employment.',
    },
  };

  const results: Recommendation[] = topMatches.map((item, index) => {
    const trade = db.trades.get(item.tradeId)!;
    const matchedJob = item.matchedRealJob || allRealJobs.find((j) => j.tradeId === trade.id);

    const explanations: Record<SupportedLanguage, string> = localizedExplanations[trade.id] || {
      hi: 'यह वास्तविक रोजगार आपके हुनर, नजदीकी केंद्र और क्षेत्र में मांग के आधार पर सबसे उत्तम है।',
      bn: 'আপনার বাস্তব অভিজ্ঞতা ও নিকটবর্তী কেন্দ্রের সুবিধার্থে এই কাজটি সবচেয়ে উপযোগী।',
      mr: 'तुमच्या कौशल्यानुसार आणि स्थानिक मागणीनुसार हा प्रत्यक्ष रोजगार पर्याय उत्तम आहे.',
      ta: 'உங்கள் திறனுக்கு ஏற்ப மற்றும் அருகிலுள்ள வேலைவாய்ப்புகளுக்கு இந்த பணி பரிந்துரைக்கப்படுகிறது.',
      en: 'Recommended based on your informal skill profile, location proximity, and verified local hiring demand.',
    };

    return {
      id: `rec_${profile.candidateId}_${trade.id}`,
      candidateId: profile.candidateId,
      sessionId: `sess_${profile.candidateId}`,
      tradeId: trade.id,
      trade,
      jobRole: matchedJob,
      realJob: matchedJob,
      score: item.score,
      rank: index + 1,
      isBestMatch: index === 0,
      trainingCenter: item.nearestCenter,
      distanceKm: matchedJob ? matchedJob.distanceKm : item.nearestCenter.distanceKm,
      explanation: explanations,
      matchReasonTags: item.tags,
      vacanciesCount: matchedJob?.activeVacanciesCount || trade.activeVacanciesCount || 12,
      hiringCompanies: matchedJob?.hiringEmployers || trade.hiringEmployers || [],
      startingSalary: matchedJob?.salaryRange || trade.expectedMonthlyEarning,
      duties: matchedJob?.keyDuties || trade.keyDuties || [],
    };
  });

  return results;
}

/**
 * AI-Assisted Recommendation Matcher with Full Multi-Turn Interview Context
 * Uses Gemini AI to evaluate hard constraints and rank trades with personalized reasoning,
 * falling back seamlessly to deterministic constraint engine if API is unavailable.
 */
export async function matchProfileToTradesWithGemini(
  profile: CandidateProfile,
  fullTranscript: Array<{ speaker: 'assistant' | 'user'; text: string }>,
  candidateDistrict: string = 'Nadia',
  targetLanguage: SupportedLanguage = 'hi'
): Promise<Recommendation[]> {
  const allTrades = Array.from(db.trades.values());
  const allCenters = Array.from(db.centers.values());
  const allRealJobs = Array.from(db.realJobs.values());

  const districtCenters = allCenters.filter(
    (c) => c.district.toLowerCase() === candidateDistrict.toLowerCase()
  );
  const fallbackCenters = districtCenters.length > 0 ? districtCenters : allCenters;

  // Prepare structured evaluation input for Gemini
  const candidateTradeInputs: CandidateTradeEvaluationInput[] = allTrades.map((trade) => {
    const centersWithTrade = fallbackCenters.filter((c) =>
      c.offeredTrades.includes(trade.id)
    );
    const chosenCenter = centersWithTrade[0] || fallbackCenters[0];
    const matchedJob = allRealJobs.find(
      (job) =>
        job.tradeId === trade.id ||
        job.jobTitle.toLowerCase().includes(trade.tradeName.toLowerCase()) ||
        trade.tradeName.toLowerCase().includes(job.jobTitle.toLowerCase())
    );

    const isOnlineTrade =
      trade.id.includes('data_entry') ||
      trade.id.includes('digital_marketing') ||
      trade.id.includes('copa') ||
      trade.id.includes('graphic_web') ||
      trade.id.includes('remote_bpo') ||
      (matchedJob && (matchedJob.commuteMode.includes('Online') || matchedJob.distanceKm === 0));

    const distanceKm = isOnlineTrade
      ? 0
      : matchedJob
      ? matchedJob.distanceKm
      : chosenCenter.distanceKm;

    return {
      tradeId: trade.id,
      tradeName: trade.tradeName,
      nsqfLevel: trade.nsqfLevel,
      sector: trade.sector,
      category: trade.category,
      minEducation: trade.minEducation,
      expectedMonthlyEarning: trade.expectedMonthlyEarning,
      distanceKm,
      isOnline: Boolean(isOnlineTrade),
      hostelAvailable: Boolean(chosenCenter.hostelAvailable),
      trainingCenterName: chosenCenter.name,
      matchedRealJobTitle: matchedJob?.jobTitle,
      keyDuties: matchedJob?.keyDuties || trade.keyDuties || [],
      toolsEquipment: matchedJob?.toolsEquipment || trade.toolsEquipment || [],
      hiringEmployers: matchedJob?.hiringEmployers || trade.hiringEmployers || [],
    };
  });

  try {
    const aiRankings = await filterAndRankRecommendationsWithGemini(
      fullTranscript,
      profile,
      candidateDistrict,
      targetLanguage,
      candidateTradeInputs
    );

    if (aiRankings && aiRankings.length > 0) {
      // Filter strictly by eligibility and sort by Gemini score descending
      const eligibleRankings = aiRankings
        .filter((r) => r.isEligible !== false)
        .sort((a, b) => b.score - a.score);

      const topAiMatches = (eligibleRankings.length >= 3 ? eligibleRankings : aiRankings).slice(0, 3);

      const recommendations: Recommendation[] = topAiMatches.map((aiItem, index) => {
        const trade = db.trades.get(aiItem.tradeId) || allTrades[0];
        const matchedJob = allRealJobs.find((j) => j.tradeId === trade.id);
        const centersWithTrade = fallbackCenters.filter((c) => c.offeredTrades.includes(trade.id));
        const chosenCenter = centersWithTrade[0] || fallbackCenters[0];

        const explanationObj: Record<SupportedLanguage, string> = {
          hi: aiItem.personalizedExplanation || 'आपके हुनर व पसंद के अनुसार उपयुक्त सिफारिश।',
          bn: aiItem.personalizedExplanation || 'আপনার অভিজ্ঞতা ও পছন্দের ভিত্তিতে নির্ধারিত।',
          mr: aiItem.personalizedExplanation || 'तुमच्या कौशल्यानुसार निवडलेला उत्तम पर्याय.',
          ta: aiItem.personalizedExplanation || 'உங்கள் அனுபவத்திற்கு ஏற்ற பரிந்துரை.',
          en: aiItem.personalizedExplanation || 'Personalized recommendation based on your verified interview constraints.',
        };
        explanationObj[targetLanguage] = aiItem.personalizedExplanation;

        return {
          id: `rec_${profile.candidateId}_${trade.id}`,
          candidateId: profile.candidateId,
          sessionId: `sess_${profile.candidateId}`,
          tradeId: trade.id,
          trade,
          jobRole: matchedJob,
          realJob: matchedJob,
          score: Math.round(aiItem.score),
          rank: index + 1,
          isBestMatch: index === 0,
          trainingCenter: chosenCenter,
          distanceKm: matchedJob ? matchedJob.distanceKm : chosenCenter.distanceKm,
          explanation: explanationObj,
          matchReasonTags: aiItem.matchReasonTags || ['Constraint-verified match'],
          vacanciesCount: matchedJob?.activeVacanciesCount || trade.activeVacanciesCount || 12,
          hiringCompanies: matchedJob?.hiringEmployers || trade.hiringEmployers || [],
          startingSalary: matchedJob?.salaryRange || trade.expectedMonthlyEarning,
          duties: matchedJob?.keyDuties || trade.keyDuties || [],
        };
      });

      return recommendations;
    }
  } catch (err) {
    console.warn('AI ranking exception, falling back to deterministic constraint engine:', err);
  }

  // Deterministic fallback
  return matchProfileToTrades(profile, candidateDistrict, targetLanguage, fullTranscript);
}

// Function to directly search and filter the exhaustive real jobs catalogue
export function searchRealJobs(
  query: string = '',
  district: string = '',
  category: string = '',
  maxDistanceKm?: number
): RealJobRole[] {
  let list = Array.from(db.realJobs.values());

  if (district && district.toLowerCase() !== 'all') {
    list = list.filter((j) => j.district.toLowerCase() === district.toLowerCase());
  }

  if (category && category !== 'all') {
    list = list.filter((j) => j.category === category);
  }

  if (maxDistanceKm) {
    list = list.filter((j) => j.distanceKm <= maxDistanceKm);
  }

  if (query.trim()) {
    const q = query.toLowerCase();
    list = list.filter(
      (j) =>
        j.jobTitle.toLowerCase().includes(q) ||
        j.sector.toLowerCase().includes(q) ||
        j.jobDescription.toLowerCase().includes(q) ||
        j.locationName.toLowerCase().includes(q) ||
        j.block.toLowerCase().includes(q) ||
        j.keyDuties.some((d) => d.toLowerCase().includes(q)) ||
        j.toolsEquipment.some((t) => t.toLowerCase().includes(q)) ||
        j.hiringEmployers.some((e) => e.toLowerCase().includes(q))
    );
  }

  // Sort by distance then vacancy count
  return list.sort(
    (a, b) => a.distanceKm - b.distanceKm || b.activeVacanciesCount - a.activeVacanciesCount
  );
}

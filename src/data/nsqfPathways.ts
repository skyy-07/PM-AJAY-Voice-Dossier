import { CandidateProfile, NSQFCareerPathwayData, NSQFPathwayMilestone, Recommendation, SupportedLanguage } from '../types';

/**
 * NSQF National Skills Qualifications Framework Pathway Database
 * Authentic government QP Codes (SSC / NCVET standard) across sectors.
 */
interface SectorPathwayConfig {
  sector: string;
  defaultQpCode: string;
  courseTitle: string;
  courseNsqfLevel: number;
  courseDuration: string;
  courseEarning: number;
  courseEarningStr: string;
  
  experiencedTitle: string;
  experiencedNsqfLevel: number;
  experiencedTimeframe: string;
  experiencedEarning: number;
  experiencedEarningStr: string;
  experiencedQpCode: string;
  
  masterTitle: string;
  masterNsqfLevel: number;
  masterTimeframe: string;
  masterEarning: number;
  masterEarningStr: string;
  masterQpCode: string;

  localizedCourseTitles: Record<SupportedLanguage, string>;
  localizedExperiencedTitles: Record<SupportedLanguage, string>;
  localizedMasterTitles: Record<SupportedLanguage, string>;

  courseDuties: Record<SupportedLanguage, string[]>;
  experiencedDuties: Record<SupportedLanguage, string[]>;
  masterDuties: Record<SupportedLanguage, string[]>;
}

const SECTOR_PATHWAYS: Record<string, SectorPathwayConfig> = {
  // 1. Electrical & Power
  electrical: {
    sector: 'Power & Construction',
    defaultQpCode: 'ELE/Q1401',
    courseTitle: 'Certified Domestic Electrician',
    courseNsqfLevel: 4,
    courseDuration: '3 Months (350 hrs)',
    courseEarning: 18000,
    courseEarningStr: '₹18,000 / mo',
    
    experiencedTitle: 'Industrial Electrician & Motor Specialist',
    experiencedNsqfLevel: 5,
    experiencedTimeframe: '1-2 Years',
    experiencedEarning: 32000,
    experiencedEarningStr: '₹32,000 / mo',
    experiencedQpCode: 'ELE/Q6303',
    
    masterTitle: 'Licensed Electrical Contractor & Enterprise Owner',
    masterNsqfLevel: 7,
    masterTimeframe: '3-5 Years',
    masterEarning: 60000,
    masterEarningStr: '₹60,000+ / mo',
    masterQpCode: 'ELE/Q7102',

    localizedCourseTitles: {
      hi: 'प्रमाणित घरेलू इलेक्ट्रीशियन (NSQF Level 4)',
      bn: 'প্রত্যয়িত গৃহস্থালি ইলেকট্রিশিয়ান (NSQF লেভেল ৪)',
      mr: 'प्रमाणित घरगुती इलेक्ट्रिशियन (NSQF स्तर ४)',
      ta: 'சான்றளிக்கப்பட்ட வீட்டு மின் பணியாளர் (NSQF நிலை 4)',
      en: 'Certified Domestic Electrician (NSQF Level 4)',
    },
    localizedExperiencedTitles: {
      hi: 'औद्योगिक इलेक्ट्रीशियन व मोटर विशेषज्ञ (NSQF Level 5)',
      bn: 'শিল্প ইলেকট্রিশিয়ান ও মোটর বিশেষজ্ঞ (NSQF লেভেল ৫)',
      mr: 'औद्योगिक इलेक्ट्रिशियन व मोटर विशेषज्ञ (NSQF स्तर ५)',
      ta: 'தொழில்துறை எலக்ட்ரீஷியன் & மோட்டார் நிபுணர் (NSQF நிலை 5)',
      en: 'Industrial Electrician & Motor Specialist (NSQF Level 5)',
    },
    localizedMasterTitles: {
      hi: 'लाइसेंस्ड इलेक्ट्रिकल ठेकेदार व फर्म मालिक (NSQF Level 7)',
      bn: 'লাইসেন্সপ্রাপ্ত বৈদ্যুতিক ঠিকাদার ও ব্যবসার মালিক (NSQF লেভেল ৭)',
      mr: 'परवानाधारक इलेक्ट्रिकल कंत्राटदार व उद्योजक (NSQF स्तर ७)',
      ta: 'உரிமம் பெற்ற மின் ஒப்பந்ததாரர் & தொழில்முனைவோர் (NSQF நிலை 7)',
      en: 'Licensed Electrical Contractor & Business Owner (NSQF Level 7)',
    },
    courseDuties: {
      hi: ['घरेलू वायरिंग, एमसीबी बॉक्स फिटिंग', 'सिंगल/थ्री फेज मोटर रिपेयर', 'सुरक्षा मानकों का पालन'],
      bn: ['গৃহস্থালি ওয়্যারিং, এমসিবি বক্স ফিটিং', 'মোটর মেরামত ও রক্ষণাবেক্ষণ', 'নিরাপত্তা মান অনুসরণ'],
      mr: ['घरगुती वायरिंग, एमसीबी बॉक्स बसवणे', 'मोटर दुरुस्ती व देखभाल', 'सुरक्षा नियमांचे पालन'],
      ta: ['வீட்டு வயரிங் மற்றும் எம்சிபி பொருத்துதல்', 'மோட்டார் பழுதுபார்த்தல்', 'பாதுகாப்பு விதிகள்'],
      en: ['Domestic conduit wiring & MCB installation', 'Motor servicing & testing', 'Safety compliance & diagnostics'],
    },
    experiencedDuties: {
      hi: ['फैक्ट्री पैनल वायरिंग व थ्री-फेज ग्रिड कनेक्शन', 'कमर्शियल मेंटेनेंस सुपरविजन', 'जूनियर तकनीशियनों को मार्गदर्शन'],
      bn: ['কারখানা প্যানেল ওয়্যারিং ও গ্রিড সংযোগ', 'বাণিজ্যিক রক্ষণাবেক্ষণ পরিচালনা', 'জুনিয়রদের প্রশিক্ষণ'],
      mr: ['फॅक्टरी पॅनेल वायरिंग व ग्रीड जोडणी', 'व्यावसायिक देखभाल पर्यवेक्षण', 'ज्युनिअर टेक्निशियनचे मार्गदर्शन'],
      ta: ['தொழிற்சாலை பேனல் வயரிங்', 'வணிக பராமரிப்பு மேற்பார்வை', 'ஜூனியர் வழிகாட்டுதல்'],
      en: ['Industrial control panel wiring & PLC interface', 'Commercial maintenance oversight', 'Field team supervision'],
    },
    masterDuties: {
      hi: ['सरकारी व निजी बिजली टेंडर लेना', '5-10 लोगों की टीम चलाना व मुफ़्त सरकारी ऋण से दुकान/फर्म विस्तार', 'कक्षा ‘ए’ इलेक्ट्रिकल सुपरवाइजर लाइसेंस'],
      bn: ['সরকারি ও বাণিজ্যিক টেন্ডার পরিচালনা', '৫-১০ জনের দল পরিচালনা ও নিজস্ব ফার্ম বিস্তার', 'লাইসেন্সপ্রাপ্ত ঠিকাদার প্রতিষ্ঠান'],
      mr: ['सरकारी व खाजगी वीज कंत्राटे घेणे', '५-१० लोकांची टीम चालवणे व व्यवसाय वाढ', 'वर्ग ‘ए’ सुपरवायझर परवाना'],
      ta: ['அரசு மற்றும் தனியார் ஒப்பந்தங்கள் எடுத்தல்', 'சொந்த நிறுவனம் & குழு மேலாண்மை', 'வகுப்பு ‘ஏ’ மேற்பார்வையாளர் உரிமம்'],
      en: ['Government tender execution & private contracting', 'Managing 10+ electricians & expanding enterprise', 'Class-A Electrical Contractor Licensing'],
    },
  },

  // 2. Apparel & Tailoring
  apparel: {
    sector: 'Apparel, Made-Ups & Home Furnishing',
    defaultQpCode: 'AMH/Q1947',
    courseTitle: 'Self-Employed Tailor & Boutique Craftsman',
    courseNsqfLevel: 4,
    courseDuration: '2.5 Months (300 hrs)',
    courseEarning: 16000,
    courseEarningStr: '₹16,000 / mo',
    
    experiencedTitle: 'Senior Pattern Master & Designer Tailor',
    experiencedNsqfLevel: 5,
    experiencedTimeframe: '1-2 Years',
    experiencedEarning: 28000,
    experiencedEarningStr: '₹28,000 / mo',
    experiencedQpCode: 'AMH/Q1201',
    
    masterTitle: 'Apparel Boutique Owner & Garment Export Entrepreneur',
    masterNsqfLevel: 6,
    masterTimeframe: '3-4 Years',
    masterEarning: 50000,
    masterEarningStr: '₹50,000+ / mo',
    masterQpCode: 'AMH/Q1802',

    localizedCourseTitles: {
      hi: 'प्रमाणित स्वरोजगार दर्जी व सिलाई कारीगर (NSQF Level 4)',
      bn: 'প্রত্যয়িত স্বনির্ভর দর্জি ও বুটিক কারিগর (NSQF লেভেল ৪)',
      mr: 'प्रमाणित स्वयंरोजगार शिंपी व बुटीक कारागीर (NSQF स्तर ४)',
      ta: 'சான்றளிக்கப்பட்ட சுயதொழில் தையல் கலைஞர் (NSQF நிலை 4)',
      en: 'Certified Self-Employed Tailor & Craftsman (NSQF Level 4)',
    },
    localizedExperiencedTitles: {
      hi: 'सीनियर पैटर्न मास्टर व डिजाइनर दर्जी (NSQF Level 5)',
      bn: 'সিনিয়র প্যাটার্ন মাস্টার ও ডিজাইনার দর্জি (NSQF লেভেল ৫)',
      mr: 'वरिष्ठ पॅटर्न मास्टर व डिझायनर शिंपी (NSQF स्तर ५)',
      ta: 'சீனியர் பேட்டர்ன் மாஸ்டர் & ஆடை வடிவமைப்பாளர் (NSQF நிலை 5)',
      en: 'Senior Pattern Master & Designer Tailor (NSQF Level 5)',
    },
    localizedMasterTitles: {
      hi: 'बुटीक मालिक व रेडीमेड गारमेंट उद्यमी (NSQF Level 6)',
      bn: 'বুটিক মালিক ও পোশাক কারখানা উদ্যোক্তা (NSQF লেভেল ৬)',
      mr: 'बुटीक मालक व गारमेंट युनिट उद्योजक (NSQF स्तर ६)',
      ta: 'ஆடை பூட்டிக் உரிமையாளர் & தொழில்முனைவோர் (NSQF நிலை 6)',
      en: 'Apparel Boutique Owner & Manufacturing Entrepreneur (NSQF Level 6)',
    },
    courseDuties: {
      hi: ['सटीक नाप, ड्राफ्टिंग व कटिंग', 'ब्लाउज, सूट, शर्ट सिलाई व फिनिशिंग', 'सिलाई मशीन रखरखाव'],
      bn: ['সঠিক মাপ, ড্রাফটিং ও কাটিং', 'ব্লাউজ, পোশাক ও শার্ট সেলাই', 'সেলাই মেশিন রক্ষণাবেক্ষণ'],
      mr: ['अचूक माप, कटिंग व ड्राफ्टिंग', 'ब्लाऊज, ड्रेस व शर्ट शिलाई', 'मशीन देखभाल'],
      ta: ['சரியான அளவு எடுத்தல் & வெட்டுதல்', 'ஆடைகள் தைத்தல் மற்றும் முடித்தல்', 'தையல் இயந்திர பராமரிப்பு'],
      en: ['Garment measuring, drafting & pattern cutting', 'Quality stitching of shirts, suits & blouses', 'Machine calibration & maintenance'],
    },
    experiencedDuties: {
      hi: ['कस्टम डिजाइनर ड्रेसेस व ब्राइडल वियर', 'पैटर्न मेकिंग व फैब्रिक ग्रेडिंग', 'दुकान में असिस्टेंट्स को काम सिखाना'],
      bn: ['ডিজাইনার পোশাক ও ব্রাইডাল ওয়্যার তৈরি', 'প্যাটার্ন তৈরি ও ফেব্রিক গ্রেডিং', 'সহকারীদের দিকনির্দেশনা'],
      mr: ['डिझायनर कपडे व ब्रायडल वेअर', 'पॅटर्न मेकिंग व फॅब्रिक ग्रेडिंग', 'दुकानातील सहकाऱ्यांना प्रशिक्षण'],
      ta: ['வடிவமைப்பாளர் உடைகள் தயாரித்தல்', 'பேட்டர்ன் மாடலிங்', 'உதவியாளர்களுக்கு பயிற்சி'],
      en: ['Designer bridal & custom wear pattern grading', 'Advanced fitting adjustments', 'Mentoring tailoring apprentices'],
    },
    masterDuties: {
      hi: ['मुद्रा ऋण से 5-10 मशीनों की बुटीक यूनिट खोलना', 'थोक स्कूल यूनिफॉर्म व शादी आर्डर लेना', 'ई-कॉमर्स व स्थानीय ब्रांडिंग'],
      bn: ['মুদ্রা ঋণে নিজস্ব ৫-১০ মেশিনের বুটিক স্থাপন', 'পাইকারি স্কুল ও বিয়ের পোশাক সরবরাহ', 'অনলাইন ও লোকাল ব্র্যান্ডিং'],
      mr: ['मुद्रा कर्जातून ५-१० मशीनचा स्वतःचा बुटीक युनिट', 'शालेय गणवेश व लग्न ऑर्डर्स घेणे', 'स्थानिक ब्रँड निर्मिती'],
      ta: ['முத்ரா கடன் மூலம் சொந்த தையல் தொழிற்சாலை', 'பள்ளி சீருடைகள் & மொத்த ஆடை ஆர்டர்கள்', 'சொந்த பிராண்ட் உருவாக்கம்'],
      en: ['Own multi-machine boutique & apparel workshop', 'Bulk school uniform & festive contracts', 'Direct retail branding & wholesale supply'],
    },
  },

  // 3. Solar & Green Energy
  solar: {
    sector: 'Green Jobs & Renewable Energy',
    defaultQpCode: 'SGJ/Q0101',
    courseTitle: 'Solar PV Installer (Suryamitra)',
    courseNsqfLevel: 4,
    courseDuration: '3 Months (300 hrs)',
    courseEarning: 19000,
    courseEarningStr: '₹19,000 / mo',
    
    experiencedTitle: 'Solar Grid & O&M Maintenance Specialist',
    experiencedNsqfLevel: 5,
    experiencedTimeframe: '1-2 Years',
    experiencedEarning: 34000,
    experiencedEarningStr: '₹34,000 / mo',
    experiencedQpCode: 'SGJ/Q0102',
    
    masterTitle: 'Solar EPC Project Supervisor & Green Entrepreneur',
    masterNsqfLevel: 7,
    masterTimeframe: '3-5 Years',
    masterEarning: 65000,
    masterEarningStr: '₹65,000+ / mo',
    masterQpCode: 'SGJ/Q0106',

    localizedCourseTitles: {
      hi: 'सोलर पीवी इंस्टॉलर - सूर्यमित्र (NSQF Level 4)',
      bn: 'সৌর প্যানেল ইনস্টলার - সূর্যমিত্র (NSQF লেভেল ৪)',
      mr: 'सौर पॅनेल इन्स्टॉलर - सूर्यमित्र (NSQF स्तर ४)',
      ta: 'சூரிய ஒளி மின் நிறுவுனர் - சூர்யமித்ரா (NSQF நிலை 4)',
      en: 'Solar PV System Installer - Suryamitra (NSQF Level 4)',
    },
    localizedExperiencedTitles: {
      hi: 'सोलर ग्रिड व ओएंडएम रखरखाव विशेषज्ञ (NSQF Level 5)',
      bn: 'সৌর গ্রিড ও রক্ষণাবেক্ষণ বিশেষজ্ঞ (NSQF লেভেল ৫)',
      mr: 'सौर ग्रीड व देखभाल विशेषज्ञ (NSQF स्तर ५)',
      ta: 'சோலார் கட்டமைப்பு பராமரிப்பு நிபுணர் (NSQF நிலை 5)',
      en: 'Solar Grid & O&M Maintenance Specialist (NSQF Level 5)',
    },
    localizedMasterTitles: {
      hi: 'सोलर प्रोजेक्ट सुपरवाइजर व ग्रीन उद्यमी (NSQF Level 7)',
      bn: 'সৌর প্রকল্প সুপারভাইজার ও পরিবেশবান্ধব উদ্যোক্তা (NSQF লেভেল ৭)',
      mr: 'सौर प्रकल्प पर्यवेक्षक व हरित उद्योजक (NSQF स्तर ७)',
      ta: 'சோலார் திட்ட மேற்பார்வையாளர் & பசுமை தொழில்முனைவோர் (NSQF நிலை 7)',
      en: 'Solar EPC Project Engineer & Renewable Entrepreneur (NSQF Level 7)',
    },
    courseDuties: {
      hi: ['रूफटॉप सोलर पैनल माउंटिंग व स्ट्रक्चरल फिक्सिंग', 'इन्वर्टर व बैटरी चार्ज कंट्रोलर कनेक्शन', 'नेट मीटरिंग टेस्टिंग'],
      bn: ['ছাদের সোলার প্যানেল স্থাপন ও ফ্রেম তৈরি', 'ইনভার্টার ও ব্যাটারি চার্জার সংযোগ', 'নেট মিটারিং পরীক্ষা'],
      mr: ['छतावरील सौर पॅनेल बसवणे', 'इन्व्हर्टर व बॅटरी जोडणी', 'मीटरिंग तपासणी'],
      ta: ['சூரிய பேனல்கள் பொருத்துதல்', 'இன்வெர்ட்டர் & பேட்டரி இணைப்புகள்', 'மின் பரிசோதனை'],
      en: ['Rooftop solar panel array mounting & anchoring', 'Inverter wiring, battery & charge controllers', 'Grid sync & safety testing'],
    },
    experiencedDuties: {
      hi: ['सोलर पंप (पीएम-कुसुम) इंस्टॉलेशन व फॉल्ट डायग्नोस्टिक्स', 'कमर्शियल रूफटॉप ओएंडएम', 'वार्षिक मेंटेनेंस कॉन्ट्रैक्ट (एएमसी)'],
      bn: ['সৌর পাম্প স্থাপন ও সমস্যা সমাধান', 'বাণিজ্যিক সোলার সিস্টেম রক্ষণাবেক্ষণ', 'বার্ষিক এএমসি চুক্তি'],
      mr: ['सौर कृषी पंप बसवणे व दुरुस्ती', 'व्यावसायिक सौर युनिट देखभाल', 'वार्षिक देखभाल करार'],
      ta: ['விவசாய சோலார் பம்புகள் பொருத்துதல்', 'வணிக சோலார் பராமரிப்பு', 'ஆண்டு பராமரிப்பு ஒப்பந்தங்கள்'],
      en: ['PM-KUSUM solar agricultural pump commissioning', 'Thermal imaging & IV curve efficiency testing', 'Commercial annual maintenance contracts'],
    },
    masterDuties: {
      hi: ['पीएम सूर्य घर योजना के तहत गांव/कस्बे में अधिकृत वेंडर बनना', 'सरकारी सोलर टेंडर व फार्मर प्रोजेक्ट्स लेना', 'स्वयं की सोलर कंसल्टेंसी व इंस्टॉलेशन टीम'],
      bn: ['প্রধানমন্ত্রী সূর্য ঘর যোজনার অনুমোদিত ফ্র্যাঞ্চাইজি', 'সরকারি সোলার টেন্ডার ও প্রকল্প পরিচালনা', 'নিজস্ব সোলার কোম্পানি ও ১০ জনের দল'],
      mr: ['पीएम सूर्य घर योजनेचे अधिकृत कंत्राटदार', 'सरकारी व खाजगी सोलर प्रकल्प हाताळणे', 'स्वतःची सोलर कंपनी व टीम'],
      ta: ['பிரதம மந்திரி சூர்ய கர் அங்கீகரிக்கப்பட்ட விற்பனையாளர்', 'அரசு சோலார் திட்டங்கள் எடுத்தல்', 'சொந்த சோலார் நிறுவனம்'],
      en: ['Authorized PM Surya Ghar rooftop solar franchise owner', 'EPC government contract bidding & turnkey execution', 'Managing 15+ installation & engineering staff'],
    },
  },

  // 4. Plumbing & Water Sanitation
  plumbing: {
    sector: 'Plumbing & Water Management',
    defaultQpCode: 'PSC/Q0104',
    courseTitle: 'Certified General Plumber (Jal Jeevan Mission)',
    courseNsqfLevel: 4,
    courseDuration: '2 Months (250 hrs)',
    courseEarning: 17000,
    courseEarningStr: '₹17,000 / mo',
    
    experiencedTitle: 'Master Plumber & Pipeline Systems Specialist',
    experiencedNsqfLevel: 5,
    experiencedTimeframe: '1-2 Years',
    experiencedEarning: 30000,
    experiencedEarningStr: '₹30,000 / mo',
    experiencedQpCode: 'PSC/Q0108',
    
    masterTitle: 'Sanitation Infrastructure Contractor & Agency Owner',
    masterNsqfLevel: 6,
    masterTimeframe: '3-4 Years',
    masterEarning: 55000,
    masterEarningStr: '₹55,000+ / mo',
    masterQpCode: 'PSC/Q0112',

    localizedCourseTitles: {
      hi: 'प्रमाणित प्लम्बर - जल जीवन मिशन (NSQF Level 4)',
      bn: 'প্রত্যয়িত প্লাম্বার - জল জীবন মিশন (NSQF লেভেল ৪)',
      mr: 'प्रमाणित प्लंबर - जल जीवन मिशन (NSQF स्तर ४)',
      ta: 'சான்றளிக்கப்பட்ட பிளம்பர் - ஜல் ஜீவன் மிஷன் (NSQF நிலை 4)',
      en: 'Certified General Plumber - Jal Jeevan Mission (NSQF Level 4)',
    },
    localizedExperiencedTitles: {
      hi: 'मास्टर प्लम्बर व पाइपलाइन विशेषज्ञ (NSQF Level 5)',
      bn: 'মাস্টার প্লাম্বার ও পাইপলাইন বিশেষজ্ঞ (NSQF লেভেল ৫)',
      mr: 'मास्टर प्लंबर व पाइपलाइन तज्ज्ञ (NSQF स्तर ५)',
      ta: 'முதன்மை பிளம்பர் & பைப்லைன் நிபுணர் (NSQF நிலை 5)',
      en: 'Master Plumber & Water Network Specialist (NSQF Level 5)',
    },
    localizedMasterTitles: {
      hi: 'जल व स्वच्छता ठेकेदार व फर्म मालिक (NSQF Level 6)',
      bn: 'জল ও পয়ঃনিষ্কাশন ঠিকাদার ও ফার্মের মালিক (NSQF লেভেল ৬)',
      mr: 'पाणीपुरवठा व स्वच्छता कंत्राटदार (NSQF स्तर ६)',
      ta: 'சுகாதார உள்கட்டமைப்பு ஒப்பந்ததாரர் (NSQF நிலை 6)',
      en: 'Sanitation Infrastructure Contractor & Agency Owner (NSQF Level 6)',
    },
    courseDuties: {
      hi: ['पाइप फिटिंग, पीवीसी/सीपीवीसी जॉइनिंग', 'बाथरूम फिटिंग्स व वाटर पंप इंस्टॉलेशन', 'लीकेज टेस्टिंग'],
      bn: ['পাইপ ফিটিং ও জয়েন্টিং', 'বাথরুম ফিটিংস ও ওয়াটার পাম্প স্থাপন', 'লিকেজ পরীক্ষা'],
      mr: ['पाईप फिटिंग, पीव्हीसी जोडणी', 'बाथरूम फिटिंग व पाण्याचा पंप बसवणे', 'गळती तपासणी'],
      ta: ['பைப் பொருத்துதல் & இணைத்தல்', 'குளியலறை பொருத்துதல்கள் & மோட்டார் நிறுவுதல்', 'கசிவு சரிபார்த்தல்'],
      en: ['CPVC/UPVC pipe laying, threading & solvent welding', 'Sanitary fixtures, valves & submersible pumps', 'Pressure testing & drainage'],
    },
    experiencedDuties: {
      hi: ['मल्टी-स्टोरी बिल्डिंग प्लंबिंग सिस्टम', 'स्मार्ट वाटर मीटरिंग व सोलर वाटर हीटर', 'पाइपलाइन मेंटेनेंस सुपरविजन'],
      bn: ['বহুতল ভবনের প্লাম্বিং সিস্টেম', 'স্মার্ট ওয়াটার মিটারিং ও সোলার ওয়াটার হিটার', 'পাইপলাইন তদারকি'],
      mr: ['इमारतींची प्लंबिंग प्रणाली', 'सोलर वॉटर हीटर व वॉटर मीटर', 'देखभाल पर्यवेक्षण'],
      ta: ['பன்னடுக்கு கட்டட பிளம்பிங்', 'சூரிய நீர் சூடாக்கி பொருத்துதல்', 'பராமரிப்பு மேற்பார்வை'],
      en: ['Commercial multi-story plumbing grid design', 'Solar water heater integration & booster pumps', 'Site pipeline supervisor'],
    },
    masterDuties: {
      hi: ['हर घर जल योजना व म्युनिसिपल पाइपलाइन कॉन्ट्रैक्ट', '5-8 प्लम्बरों की अपनी कांट्रैक्टिंग एजेंसी', 'हार्डवेयर व सैनिटरी वेयर डिस्ट्रीब्यूशन'],
      bn: ['জল জীবন মিশন ও পৌর পাইপলাইন সরকারি টেন্ডার', '৫-৮ জন প্লাম্বারের দল পরিচালনা', 'স্যানিটারি সামগ্রীর পাইকারি ব্যবসা'],
      mr: ['जल जीवन मिशन व सरकारी पाइपलाइन कंत्राटे', '५-८ कामगारांची कंत्राटदार एजन्सी', 'हार्डवेअर व सॅनिटरी दुकान'],
      ta: ['ஜல் ஜீவன் திட்ட அரசு ஒப்பந்தங்கள்', 'சொந்த பிளம்பிங் சேவை நிறுவனம்', 'சானிட்டரி உதிரிபாக விற்பனை'],
      en: ['Jal Jeevan Mission village network government contracting', 'Managing private plumbing service contracting agency', 'Sanitary ware dealership & commercial execution'],
    },
  },

  // 5. Automotive Two-Wheeler / EV
  automotive: {
    sector: 'Automotive & EV Mobility',
    defaultQpCode: 'ASC/Q1411',
    courseTitle: 'Two-Wheeler & EV Service Technician',
    courseNsqfLevel: 4,
    courseDuration: '3 Months (350 hrs)',
    courseEarning: 18500,
    courseEarningStr: '₹18,500 / mo',
    
    experiencedTitle: 'Senior Diagnostic & EV Battery Specialist',
    experiencedNsqfLevel: 5,
    experiencedTimeframe: '1-2 Years',
    experiencedEarning: 32000,
    experiencedEarningStr: '₹32,000 / mo',
    experiencedQpCode: 'ASC/Q1414',
    
    masterTitle: 'Multi-Brand Garage & EV Service Franchise Owner',
    masterNsqfLevel: 6,
    masterTimeframe: '3-4 Years',
    masterEarning: 58000,
    masterEarningStr: '₹58,000+ / mo',
    masterQpCode: 'ASC/Q1602',

    localizedCourseTitles: {
      hi: 'प्रमाणित दोपहिया व ईवी सर्विस तकनीशियन (NSQF Level 4)',
      bn: 'প্রত্যয়িত দু-চাকা ও ইভি মেকানিক (NSQF লেভেল ৪)',
      mr: 'प्रमाणित दुचाकी व ईव्ही तंत्रज्ञ (NSQF स्तर ४)',
      ta: 'சான்றளிக்கப்பட்ட இருசக்கர & இவி மெக்கானிக் (NSQF நிலை 4)',
      en: 'Certified Two-Wheeler & EV Service Technician (NSQF Level 4)',
    },
    localizedExperiencedTitles: {
      hi: 'सीनियर डायग्नोस्टिक व ईवी बैटरी विशेषज्ञ (NSQF Level 5)',
      bn: 'সিনিয়র ডায়াগনস্টিক ও ব্যাটারি বিশেষজ্ঞ (NSQF লেভেল ৫)',
      mr: 'वरिष्ठ डायग्नोस्टिक व ईव्ही बॅटरी तज्ज्ञ (NSQF स्तर ५)',
      ta: 'சீனியர் எலக்ட்ரிக் வாகன பேட்டரி நிபுணர் (NSQF நிலை 5)',
      en: 'Senior Diagnostic & EV Battery Specialist (NSQF Level 5)',
    },
    localizedMasterTitles: {
      hi: 'मल्टी-ब्रांड सर्विस गैराज व ईवी वर्कशॉप मालिक (NSQF Level 6)',
      bn: 'মাল্টি-ব্র্যান্ড গ্যারেজ ও ইভি ওয়ার্কশপ মালিক (NSQF লেভেল ৬)',
      mr: 'मल्टी-ब्रँड गॅरेज व ईव्ही सर्व्हिस सेंटर मालक (NSQF स्तर ६)',
      ta: 'மல்டி-பிராண்ட் கேரேஜ் & இவி ஒர்க்ஷாப் உரிமையாளர் (NSQF நிலை 6)',
      en: 'Multi-Brand Auto Garage & EV Franchise Owner (NSQF Level 6)',
    },
    courseDuties: {
      hi: ['इंजन सर्विसिंग, कार्बोरेटर/एफआई ट्यूनिंग', 'इलेक्ट्रिक स्कूटर मोटर व ब्रेक मरम्मत', 'ऑयल चेंज व सस्पेंशन'],
      bn: ['ইঞ্জিন সার্ভিসিং ও টিউনিং', 'বৈদ্যুতিক স্কুটার মোটর ও ব্রেক মেরামত', 'সাসপেনশন ও চেইন ড্রাইভ ঠিক করা'],
      mr: ['इंजिन सर्व्हिसिंग, ट्यूनिंग', 'इलेक्ट्रिक स्कूटर मोटर व ब्रेक दुरुस्ती', 'सस्पेन्शन देखभाल'],
      ta: ['இன்ஜின் சர்வீஸ் & டியூனிங்', 'மின்சார ஸ்கூட்டர் மோட்டார் பழுது', 'பிரேக் மற்றும் சஸ்பென்ஷன்'],
      en: ['4-Stroke engine periodic servicing & FI system tuning', 'BLDC hub motor, controller & disc brakes', 'Periodic maintenance & electrical harness testing'],
    },
    experiencedDuties: {
      hi: ['ईवी लिथियम-आयन बैटरी पैक टेस्टिंग व बीएमएस फॉल्ट', 'डिजिटल ओबीडी स्कैनर डायग्नोसिस', 'शोरूम वर्कशॉप सुपरविजन'],
      bn: ['ইভি লিথিয়াম ব্যাটারি প্যাক ও বিএমএস পরীক্ষা', 'ডিজিটাল ওবিডি স্ক্যানার ব্যবহার', 'ওয়ার্কশপ পরিচালনা'],
      mr: ['ईव्ही बॅटरी व बीएमएस फॉल्ट दुरुस्ती', 'डिजिटल स्कॅनर डायग्नोसिस', 'वर्कशॉप पर्यवेक्षण'],
      ta: ['இவி பேட்டரி மற்றும் பிஎம்எஸ் சரிபார்த்தல்', 'டிஜிட்டல் ஸ்கேனர் பரிசோதனை', 'பணிமனை மேற்பார்வை'],
      en: ['Lithium-ion battery pack inspection & BMS fault clearing', 'Digital OBD diagnostic tool scanner operation', 'Authorized dealership workshop floor control'],
    },
    masterDuties: {
      hi: ['मुद्रा ऋण से अपना मल्टी-ब्रांड 2-व्हीलर व ईवी गैराज खोलना', 'स्पेयर पार्ट्स व मोबाइल सर्विस वैन शुरू करना', '4-6 मैकेनिकों की टीम'],
      bn: ['মুদ্রা ঋণে নিজস্ব আধুনিক মাল্টি-ব্র্যান্ড গ্যারেজ', 'খুচরা যন্ত্রাংশ ও ভ্রাম্যমাণ সার্ভিস ভ্যান', '৪-৬ জন মেকানিকের দল'],
      mr: ['स्वतःचे आधुनिक मल्टि-ब्रँड गॅरेज व स्पेअर पार्ट्स दुकान', 'मोबाईल सर्व्हिस व्हॅन सुरू करणे', '४-६ मेकॅनिकची टीम'],
      ta: ['சொந்த நவீன இருசக்கர வாகன பழுதுபார்க்கும் பட்டறை', 'உதிரிபாகங்கள் விற்பனை & நடமாடும் சேவை', '4-6 மெக்கானிக் குழு'],
      en: ['Own multi-bay vehicle & EV workshop center with MUDRA loan', 'Genuine spare parts retailing & mobile breakdown van', 'Managing team of 5+ mechanics and technicians'],
    },
  },

  // 6. Food Processing, Dairy & Agriculture
  food: {
    sector: 'Food Processing & Agribusiness',
    defaultQpCode: 'FIC/Q9001',
    courseTitle: 'Food & Dairy Processing Operator',
    courseNsqfLevel: 4,
    courseDuration: '2.5 Months (300 hrs)',
    courseEarning: 15500,
    courseEarningStr: '₹15,500 / mo',
    
    experiencedTitle: 'Quality Assurance & Food Production Supervisor',
    experiencedNsqfLevel: 5,
    experiencedTimeframe: '1-2 Years',
    experiencedEarning: 27000,
    experiencedEarningStr: '₹27,000 / mo',
    experiencedQpCode: 'FIC/Q0103',
    
    masterTitle: 'Food Processing Plant & Organic Agro Enterprise Owner',
    masterNsqfLevel: 6,
    masterTimeframe: '3-4 Years',
    masterEarning: 52000,
    masterEarningStr: '₹52,000+ / mo',
    masterQpCode: 'FIC/Q0504',

    localizedCourseTitles: {
      hi: 'प्रमाणित खाद्य व डेयरी प्रसंस्करण ऑपरेटर (NSQF Level 4)',
      bn: 'প্রত্যয়িত খাদ্য ও দুগ্ধ প্রক্রিয়াকরণ অপারেটর (NSQF লেভেল ৪)',
      mr: 'प्रमाणित अन्न व दुग्ध प्रक्रिया ऑपरेटर (NSQF स्तर ४)',
      ta: 'சான்றளிக்கப்பட்ட உணவு & பால் பதப்படுத்துபவர் (NSQF நிலை 4)',
      en: 'Certified Food & Dairy Processing Operator (NSQF Level 4)',
    },
    localizedExperiencedTitles: {
      hi: 'गुणवत्ता नियंत्रण व फूड प्रोडक्शन सुपरवाइजर (NSQF Level 5)',
      bn: 'মান নিয়ন্ত্রণ ও খাদ্য উৎপাদন তদারককারী (NSQF লেভেল ৫)',
      mr: 'गुणवत्ता नियंत्रण व उत्पादन पर्यवेक्षक (NSQF स्तर ५)',
      ta: 'தரக் கட்டுப்பாடு & உணவு உற்பத்தி மேற்பார்வையாளர் (NSQF நிலை 5)',
      en: 'Quality Assurance & Food Production Supervisor (NSQF Level 5)',
    },
    localizedMasterTitles: {
      hi: 'खाद्य प्रसंस्करण यूनिट व ऑर्गेनिक एग्रो उद्यमी (NSQF Level 6)',
      bn: 'খাদ্য প্রক্রিয়াকরণ ইউনিট ও কৃষি উদ্যোক্তা (NSQF লেভেল ৬)',
      mr: 'अन्न प्रक्रिया युनिट व कृषी उद्योजक (NSQF स्तर ६)',
      ta: 'உணவு பதப்படுத்தும் ஆலை & விவசாய தொழில்முனைவோர் (NSQF நிலை 6)',
      en: 'Food Processing Unit & Organic Agro Enterprise Owner (NSQF Level 6)',
    },
    courseDuties: {
      hi: ['अनाज, फल, दूध पाश्चुरीकरण व पैकेजिंग', 'एफएसएसएआई (FSSAI) स्वच्छता नियम', 'मशीन संचालन व स्टरलाइजेशन'],
      bn: ['ফল, দুগ্ধ প্রক্রিয়াকরণ ও প্যাকেজিং', 'FSSAI স্বাস্থ্যবিধি ও নিরাপত্তা মান', 'মেশিন পরিচালনা ও জীবাণুমুক্তকরণ'],
      mr: ['फळ, दूध प्रक्रिया व पॅकेजिंग', 'FSSAI स्वच्छता नियमांचे पालन', 'मशीन चालवणे व निर्जंतुकीकरण'],
      ta: ['பழங்கள், பால் பதப்படுத்துதல் & பேக்கிங்', 'உணவு பாதுகாப்பு மற்றும் சுகாதாரம்', 'இயந்திர இயக்கம்'],
      en: ['Fruit/milk pasteurization, drying & automated packaging', 'FSSAI hygiene standards & cold chain preservation', 'Sanitization and equipment sterilization'],
    },
    experiencedDuties: {
      hi: ['बैच क्वालिटी टेस्टिंग व शेल्फ लाइफ एनहांसमेंट', 'डेयरी/बेकरी प्लांट लाइन लीडर', 'वेंडर प्रोक्योरमेंट'],
      bn: ['পণ্যের গুণমান পরীক্ষা ও শেল্ফ লাইফ বৃদ্ধি', 'বেকারি বা ডেইরি প্ল্যান্ট সুপারভিশন', 'কাঁচামাল সংগ্রহ'],
      mr: ['उत्पादन गुणवत्ता तपासणी', 'डेअरी/बेकरी युनिट सुपरवायझर', 'कच्चा माल खरेदी'],
      ta: ['உணவு தர பரிசோதனை', 'பால்/பேக்கரி பிரிவு மேற்பார்வை', 'மூலப்பொருள் கொள்முதல்'],
      en: ['Batch sensory & microbiological test logging', 'Dairy & commercial bakery assembly line oversight', 'Raw material vendor procurement control'],
    },
    masterDuties: {
      hi: ['पीएम एफएमई योजना (PM-FME) 35% सब्सिडी से अपनी पिकल/जूस/डेयरी यूनिट', 'स्थानीय सुपरमार्केट व ऑनलाइन ब्रांड सप्लाई', '10+ ग्रामीण महिलाओं/युवाओं को रोजगार'],
      bn: ['PM-FME যোজনার ৩৫% ভর্তুকিতে নিজস্ব প্রক্রিয়াকরণ ইউনিট', 'সুপারমার্কেট ও অনলাইন ব্র্যান্ড সাপ্লাই', '১০+ মানুষের কর্মসংস্থান সৃষ্টি'],
      mr: ['PM-FME योजनेतून स्वतःचा प्रक्रिया उद्योग', 'सुपरमार्केट व स्थानिक ब्रँडिंग', '१०+ कामगारांना रोजगार'],
      ta: ['PM-FME திட்ட மானியத்துடன் சொந்த உணவு பதப்படுத்தும் ஆலை', 'சூப்பர் மார்க்கெட் சப்ளை', '10+ நபர்களுக்கு வேலைவாய்ப்பு'],
      en: ['Own branded food processing unit with PM-FME 35% capital subsidy', 'Supermarket & retail distribution tie-ups', 'Employing 10+ local rural workers & farmers'],
    },
  },

  // 7. IT & Digital / Data Operations
  digital: {
    sector: 'IT-ITeS & Digital Services',
    defaultQpCode: 'SSC/Q2212',
    courseTitle: 'Domestic Data Entry & Digital Marketing Associate',
    courseNsqfLevel: 4,
    courseDuration: '3 Months (300 hrs)',
    courseEarning: 17500,
    courseEarningStr: '₹17,500 / mo',
    
    experiencedTitle: 'Digital Operations & MIS Analytics Lead',
    experiencedNsqfLevel: 5,
    experiencedTimeframe: '1-2 Years',
    experiencedEarning: 30000,
    experiencedEarningStr: '₹30,000 / mo',
    experiencedQpCode: 'SSC/Q0508',
    
    masterTitle: 'Digital Agency & Common Service Center (CSC) Owner',
    masterNsqfLevel: 6,
    masterTimeframe: '3-4 Years',
    masterEarning: 55000,
    masterEarningStr: '₹55,000+ / mo',
    masterQpCode: 'SSC/Q0702',

    localizedCourseTitles: {
      hi: 'डिजिटल डेटा एंट्री व ऑनलाइन मार्केटिंग एसोसिएट (NSQF Level 4)',
      bn: 'ডিজিটাল ডাটা এন্ট্রি ও অনলাইন মার্কেটিং সহযোগী (NSQF লেভেল ৪)',
      mr: 'डिजिटल डेटा एन्ट्री व ऑनलाइन मार्केटिंग सहाय्यक (NSQF स्तर ४)',
      ta: 'டிஜிட்டல் தரவு உள்ளீடு & சந்தைப்படுத்தல் நிபுணர் (NSQF நிலை 4)',
      en: 'Domestic Data Entry & Digital Marketing Associate (NSQF Level 4)',
    },
    localizedExperiencedTitles: {
      hi: 'डिजिटल ऑपरेशंस व एमआईएस एनालिटिक्स लीड (NSQF Level 5)',
      bn: 'ডিজিটাল অপারেশনস ও এমআইএস লিড (NSQF লেভেল ৫)',
      mr: 'डिजिटल ऑपरेशन्स व एमआयएस विश्लेषक (NSQF स्तर ५)',
      ta: 'டிஜிட்டல் செயல்பாடுகள் & தரவு ஆய்வாளர் (NSQF நிலை 5)',
      en: 'Digital Operations & MIS Analytics Lead (NSQF Level 5)',
    },
    localizedMasterTitles: {
      hi: 'डिजिटल एजेंसी व सीएससी (CSC) ई-सेवा केंद्र संचालक (NSQF Level 6)',
      bn: 'ডিজিটাল সার্ভিস এজেন্সি ও সিএসসি কেন্দ্র পরিচালক (NSQF লেভেল ৬)',
      mr: 'डिजिटल एजन्सी व सीएससी (CSC) केंद्र संचालक (NSQF स्तर ६)',
      ta: 'டிஜிட்டல் சேவை நிறுவனம் & பொது சேவை மைய உரிமையாளர் (NSQF நிலை 6)',
      en: 'Digital Agency & Common Service Center (CSC) Owner (NSQF Level 6)',
    },
    courseDuties: {
      hi: ['35+ wpm टाइपिंग, एमएस एक्सेल व डेटाबेस एंट्री', 'सोशल मीडिया पोस्टिंग, कैनवा ग्राफिक्स', 'ई-कॉमर्स कैटलॉगिंग'],
      bn: ['৩৫+ wpm টাইপিং, এক্সেল ও ডাটাবেস এন্ট্রি', 'সোশ্যাল মিডিয়া ও ক্যানভা ডিজাইন', 'ই-কমার্স ক্যাটালগ তৈরি'],
      mr: ['३५+ शब्द/मिनिट टायपिंग व एक्सेल डेटा एन्ट्री', 'सोशल मीडिया पोस्टिंग, ग्राफिक्स', 'ऑनलाइन ई-कॉमर्स सपोर्ट'],
      ta: ['தட்டச்சு, எக்செல் & தரவுத்தள உள்ளீடு', 'சமூக ஊடக மேலாண்மை & கிராபிக்ஸ்', 'இ-காமர்ஸ் ஆதரவு'],
      en: ['High-speed data transcription & spreadsheet formulas', 'Social media creatives & Canva promotion', 'Online portal form submission & CRM logging'],
    },
    experiencedDuties: {
      hi: ['एडवांस्ड एमआईएस डैशबोर्ड, वीलुकअप/पिवट टेबल्स', 'रिमोट क्लाइंट प्रोजेक्ट मैनेजमेंट', 'टीम क्वालिटी ऑडिट'],
      bn: ['উন্নত এক্সেল ও এমআইএস ড্যাশবোর্ড পরিচালনা', 'অনলাইন ক্লায়েন্ট প্রজেক্ট ম্যানেজমেন্ট', 'কোয়ালিটি অডিট'],
      mr: ['प्रगत एमआयएस डॅशबोर्ड व रिपोर्टिंग', 'ऑनलाइन क्लायंट मॅनेजमेंट', 'डेटा ऑडिट'],
      ta: ['மேம்பட்ட எக்செல் & தரவு மேலாண்மை', 'வாடிக்கையாளர் திட்ட மேலாண்மை', 'தர தணிக்கை'],
      en: ['Executive MIS dashboard generation & query reporting', 'Remote client campaign management & analytics', 'Sub-team workflow and quality SLA auditing'],
    },
    masterDuties: {
      hi: ['अपना सीएससी ई-सेवा केंद्र व डिजिटल स्टूडियो खोलना', 'स्थानीय व्यवसायों के लिए डिजिटल मार्केटिंग एजेंसी', 'सरकारी व निजी ऑनलाइन टेंडर्स'],
      bn: ['নিজস্ব ডিজিটাল সিএসসি সেন্টার ও ফটো-প্রিন্টিং স্টুডিও', 'অনলাইন ডিজিটাল মার্কেটিং এজেন্সি', 'সরকারি সেবা ও অনলাইন পোর্টাল প্রদান'],
      mr: ['स्वतःचे सीएससी केंद्र व डिजिटल एजन्सी सुरू करणे', 'स्थानिक दुकानांसाठी ऑनलाइन मार्केटिंग', 'ऑनलाइन सेवा पुरवणे'],
      ta: ['சொந்த பொது சேவை மையம் (CSC) & டிஜிட்டல் நிறுவனம்', 'வணிக டிஜிட்டல் விளம்பர சேவை', 'அரசு சேவைகள் வழங்கல்'],
      en: ['Own multi-terminal Common Service Center (CSC) & Digital Hub', 'Digital marketing agency for local retail businesses', 'Government service facilitation & private BPO contracts'],
    },
  },
};

/**
 * Determine which sector pathway best maps to the recommended trade/job
 */
function resolveSectorKey(rec: Recommendation): string {
  const text = `${rec.tradeId} ${rec.trade.tradeName} ${rec.trade.sector} ${rec.jobRole?.jobTitle || ''} ${rec.jobRole?.sector || ''}`.toLowerCase();
  
  if (text.includes('solar') || text.includes('green') || text.includes('suryamitra') || text.includes('renewable') || text.includes('photovoltaic')) {
    return 'solar';
  }
  if (text.includes('tailor') || text.includes('sewing') || text.includes('apparel') || text.includes('garment') || text.includes('stitching') || text.includes('boutique')) {
    return 'apparel';
  }
  if (text.includes('plumb') || text.includes('pipe') || text.includes('sanitation') || text.includes('jal')) {
    return 'plumbing';
  }
  if (text.includes('auto') || text.includes('mechanic') || text.includes('two wheeler') || text.includes('bike') || text.includes('motorcycle') || text.includes('vehicle') || text.includes('ev ')) {
    return 'automotive';
  }
  if (text.includes('food') || text.includes('dairy') || text.includes('agro') || text.includes('bakery') || text.includes('processing') || text.includes('farming')) {
    return 'food';
  }
  if (text.includes('data') || text.includes('copa') || text.includes('digital') || text.includes('computer') || text.includes('it') || text.includes('bpo') || text.includes('typing')) {
    return 'digital';
  }
  // Default to electrical for technical crafts or general vocational
  return 'electrical';
}

/**
 * Generates an adaptive, personalized NSQF 4-Stage Career Progression Pathway
 * combining candidate profile (baseline education, current role, informal skills)
 * with the suggested course and future industry milestones.
 */
export function generateNSQFPathway(
  recommendation: Recommendation,
  profile?: CandidateProfile,
  language: SupportedLanguage = 'hi'
): NSQFCareerPathwayData {
  const sectorKey = resolveSectorKey(recommendation);
  const config = SECTOR_PATHWAYS[sectorKey] || SECTOR_PATHWAYS.electrical;

  // Extract candidate baseline info
  const baselineOccupation = profile?.currentOccupation || 'Informal Helper / Agricultural Worker';
  const informalSkillsStr = profile?.informalSkills?.length ? profile.informalSkills.join(', ') : 'Hands-on informal learning';
  const eduLevel = profile?.educationLevel || '8th / 10th Standard';
  const isSelfEmployedPref = profile?.employmentPreference === 'self_employment';

  // Baseline Stage (Stage 0)
  const baselineMilestone: NSQFPathwayMilestone = {
    stageKey: 'baseline',
    stageLabel: 'Current Baseline',
    stageName: 'Stage 0: Uncertified Entry',
    nsqfLevel: 1.5,
    timeframe: 'Today',
    monthlyEarning: 7500,
    earningDisplay: '₹6,000 - ₹9,000 / mo',
    jobRoleTitle: `Current: ${baselineOccupation}`,
    sector: config.sector,
    isCurrentBaseline: true,
    duties: [
      `Educational base: ${eduLevel}`,
      `Prior informal experience: ${informalSkillsStr}`,
      'Uncertified daily-wage or informal family assistance without formal NSQF card',
    ],
    keyCompetencies: ['Informal aptitude', 'Practical eagerness', 'Local awareness'],
    localizedTitles: {
      hi: `वर्तमान स्थिति: ${baselineOccupation} (असंगठित / प्रारंभिक)`,
      bn: `বর্তমান অবস্থা: ${baselineOccupation} (অপ্রাতিষ্ঠানিক)`,
      mr: `सध्याची स्थिती: ${baselineOccupation} (असंघटित)`,
      ta: `தற்போதைய நிலை: ${baselineOccupation} (அமைப்புசாரா)`,
      en: `Current Starting Point: ${baselineOccupation}`,
    },
    localizedTimeframes: {
      hi: 'आज (वर्तमान)',
      bn: 'আজ (বর্তমান)',
      mr: 'आज (सध्या)',
      ta: 'இன்று',
      en: 'Current Status',
    },
    localizedDuties: {
      hi: [
        `शैक्षणिक स्तर: ${eduLevel}`,
        `मौजूदा हुनर: ${informalSkillsStr}`,
        'अनौपचारिक मजदूरी / बिना प्रमाण पत्र का कार्य',
      ],
      bn: [
        `শিক্ষাগত স্তর: ${eduLevel}`,
        `পূর্ব অভিজ্ঞতা: ${informalSkillsStr}`,
        'অপ্রাতিষ্ঠানিক দৈনিক মজুরি ভিত্তিক সহায়তা',
      ],
      mr: [
        `शैक्षणिक पात्रता: ${eduLevel}`,
        `मागील अनुभव: ${informalSkillsStr}`,
        'प्रमाणपत्राशिवाय असंघटित काम',
      ],
      ta: [
        `கல்வி தகுதி: ${eduLevel}`,
        `அனுபவம்: ${informalSkillsStr}`,
        'சான்றிதழற்ற ஆரம்ப நிலை பணி',
      ],
      en: [
        `Education background: ${eduLevel}`,
        `Prior informal skill: ${informalSkillsStr}`,
        'Informal or daily-wage support without NSQF certification',
      ],
    },
  };

  // Immediate Suggested Course (Stage 1)
  const courseMilestone: NSQFPathwayMilestone = {
    stageKey: 'certified_course',
    stageLabel: 'PM-AJAY Course (3 Mo)',
    stageName: 'Stage 1: Certified Course',
    nsqfLevel: config.courseNsqfLevel,
    qpCode: config.defaultQpCode,
    timeframe: 'In 2-3 Months',
    monthlyEarning: config.courseEarning,
    earningDisplay: config.courseEarningStr,
    jobRoleTitle: config.courseTitle,
    sector: config.sector,
    isCurrentRecommendation: true,
    duties: config.courseDuties.en,
    keyCompetencies: ['NSQF Certified', 'Technical QP Qualification', 'Government Skill Card'],
    localizedTitles: config.localizedCourseTitles,
    localizedTimeframes: {
      hi: '2-3 माह में (प्रशिक्षण पश्चात)',
      bn: '২-৩ মাসে (প্রশিক্ষণ শেষে)',
      mr: '२-३ महिन्यांत (प्रशिक्षणानंतर)',
      ta: '2-3 மாதங்களில் (பயிற்சிக்கு பின்)',
      en: 'In 2-3 Months (Post-Certification)',
    },
    localizedDuties: config.courseDuties,
  };

  // 1-2 Year Advanced Role (Stage 2)
  const experiencedMilestone: NSQFPathwayMilestone = {
    stageKey: 'experienced_lead',
    stageLabel: 'Lead Specialist (1-2 Yrs)',
    stageName: 'Stage 2: Experienced Lead',
    nsqfLevel: config.experiencedNsqfLevel,
    qpCode: config.experiencedQpCode,
    timeframe: config.experiencedTimeframe,
    monthlyEarning: config.experiencedEarning,
    earningDisplay: config.experiencedEarningStr,
    jobRoleTitle: config.experiencedTitle,
    sector: config.sector,
    duties: config.experiencedDuties.en,
    keyCompetencies: ['Advanced Diagnostics', 'Team Supervision', 'RPL Level 5 Upgrade'],
    localizedTitles: config.localizedExperiencedTitles,
    localizedTimeframes: {
      hi: '1-2 वर्ष के अनुभव पर',
      bn: '১-২ বছরের অভিজ্ঞতায়',
      mr: '१-२ वर्षांच्या अनुभवानंतर',
      ta: '1-2 ஆண்டுகள் அனுபவத்தில்',
      en: 'After 1-2 Years On-Job',
    },
    localizedDuties: config.experiencedDuties,
  };

  // 3-5 Year Mastery / Enterprise Contractor (Stage 3)
  const masterMilestone: NSQFPathwayMilestone = {
    stageKey: 'master_contractor',
    stageLabel: isSelfEmployedPref ? 'Business Owner (3-5 Yrs)' : 'Master Specialist (3-5 Yrs)',
    stageName: 'Stage 3: Master & Entrepreneur',
    nsqfLevel: config.masterNsqfLevel,
    qpCode: config.masterQpCode,
    timeframe: config.masterTimeframe,
    monthlyEarning: config.masterEarning,
    earningDisplay: config.masterEarningStr,
    jobRoleTitle: config.masterTitle,
    sector: config.sector,
    duties: config.masterDuties.en,
    keyCompetencies: ['Business Ownership', 'Government Contracting', 'MUDRA Financing', 'Team Leadership'],
    localizedTitles: config.localizedMasterTitles,
    localizedTimeframes: {
      hi: '3-5 वर्ष में (मास्टर / उद्यमी)',
      bn: '৩-৫ বছরে (মাস্টার / উদ্যোক্তা)',
      mr: '३-५ वर्षांत (उद्योजक / कंत्राटदार)',
      ta: '3-5 ஆண்டுகளில் (தொழில்முனைவோர்)',
      en: 'In 3-5 Years (Master / Owner)',
    },
    localizedDuties: config.masterDuties,
  };

  const milestones = [baselineMilestone, courseMilestone, experiencedMilestone, masterMilestone];

  const adviceMap: Record<SupportedLanguage, string> = {
    hi: `आपके पास ${informalSkillsStr} का प्रारंभिक आधार है। यह 3-महीने का निःशुल्क कोर्स आपको सीधे लेवल 4 प्रमाण पत्र और ₹${config.courseEarning.toLocaleString('en-IN')}/माह की शुरुआती आमदनी दिलाएगा। 3-5 वर्षों में आप ₹${config.masterEarning.toLocaleString('en-IN')}+ की स्वतंत्र फर्म के मालिक बन सकते हैं।`,
    bn: `আপনার পূর্ব অভিজ্ঞতা ও মেধার ভিত্তিতে এই ৩ মাসের বিনামূল্যে কোর্সটি আপনাকে সরাসরি লেভেল ৪ সার্টিফিকেট এবং প্রতি মাসে ₹${config.courseEarning.toLocaleString('en-IN')} উপার্জনের পথে নিয়ে যাবে। ৩-৫ বছরে আপনি ₹${config.masterEarning.toLocaleString('en-IN')}+ আয়ের স্বাধীন ব্যবসা গড়তে পারবেন।`,
    mr: `तुमच्या पूर्वीच्या अनुभवावर आधारित हा ३ महिन्यांचा मोफत कोर्स तुम्हाला थेट स्तर ४ प्रमाणपत्र आणि ₹${config.courseEarning.toLocaleString('en-IN')}/महिना मिळवून देईल. पुढील ३-५ वर्षांत तुम्ही स्वतःचा मोठा व्यवसाय उभा करू शकता.`,
    ta: `உங்கள் அடிப்படை திறமைக்கு இந்த 3 மாத இலவச பயிற்சி மூலம் உடனடியாக NSQF நிலை 4 சான்றிதழ் மற்றும் ₹${config.courseEarning.toLocaleString('en-IN')}/மாத வருமானம் கிடைக்கும். 3-5 ஆண்டுகளில் நீங்கள் ₹${config.masterEarning.toLocaleString('en-IN')}+ வருமானம் ஈட்டும் தொழில்முனைவோராக வளரலாம்.`,
    en: `Starting with your background in ${informalSkillsStr}, this 3-month PM-AJAY course grants you NSQF Level ${config.courseNsqfLevel} certification, accelerating your monthly earnings from baseline to ₹${config.courseEarning.toLocaleString('en-IN')} and opening a verified path to ₹${config.masterEarning.toLocaleString('en-IN')}+ enterprise ownership.`,
  };

  return {
    tradeId: recommendation.tradeId,
    tradeName: recommendation.trade.tradeName,
    sector: config.sector,
    pathwaySummary: `NSQF Career Pathway from Level 1 Helper to Level ${config.masterNsqfLevel} Certified Master`,
    currentRecommendationNsqfLevel: config.courseNsqfLevel,
    milestones,
    growthMultiplier: `${(config.masterEarning / 7500).toFixed(1)}x Earning Leap`,
    personalizedAdvice: adviceMap,
  };
}

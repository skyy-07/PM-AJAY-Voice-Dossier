import { SupportedLanguage } from '../types.js';

export type TranslationKey = string;

// Master Dictionary covering all 12 Indic languages + English
export const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    // Header & Global
    'header.title': 'PM-AJAY Voice Dossier',
    'header.subtitle': 'Speech-Driven Livelihood & Certification Dispatcher',
    'header.banner': 'PM-AJAY Skilling & Livelihood Dissemination System • Vol. IV',
    'header.dossier': 'Interactive Dossier',
    'header.spoken_intake': 'Spoken Intake',
    'header.whatsapp': 'WhatsApp Notes',
    'header.kiosk': 'Offline Kiosk',
    'header.governance': 'Governance',
    'header.human_help': 'Human Help',
    'header.role': 'Role',
    'talkback.listen_screen': 'Read Screen Aloud (TalkBack)',
    'talkback.speaking': 'Reading Screen Aloud...',
    'talkback.stop': 'Stop Audio',
    'talkback.active': 'TalkBack Active: Tap any card to hear it spoken',
    'talkback.enabled': 'Voice Guide ON',
    'talkback.disabled': 'Voice Guide OFF',

    // Landing Page
    'landing.eyebrow': 'National Dissemination • 12 Indian Languages • PM-AJAY',
    'landing.hero_title_1': 'Tell us what work you know.',
    'landing.hero_title_2': 'We’ll help you find the right skill pathway.',
    'landing.hero_desc': 'No complicated forms or digital barriers. Speak naturally in your native tongue about your daily trade, tools, and family heritage. Our voice engine translates lived experience into government NSQF certifications, free PM-AJAY stipends, and local job matching.',
    'landing.benchmarks': 'Interactive Benchmarks:',
    'landing.welder': '6-Yr Welding',
    'landing.tailor': 'Village Tailor',
    'landing.tractor': 'Tractor & Pump',
    'landing.weaver': 'Handloom Weaver',
    'landing.card_ivr_badge': 'Primary IVR',
    'landing.card_ivr_title': 'Spoken Interview',
    'landing.card_ivr_desc': 'Interactive voice intake in regional dialects. Seamlessly understands informal tools, vernacular vocabulary, and ancestral trades.',
    'landing.card_ivr_b1': 'Real-time voice activity & waveform feedback',
    'landing.card_ivr_b2': 'Adaptive follow-up slot clarification',
    'landing.card_ivr_b3': 'Telecom & Asterisk SIP bridge ready',
    'landing.card_ivr_cta': 'Initiate Voice Call',
    'landing.card_wa_badge': 'Asynchronous',
    'landing.card_wa_title': 'WhatsApp Notes',
    'landing.card_wa_desc': 'Send short audio messages over WhatsApp. Processes regional accents and returns skilling pathways directly as WhatsApp cards.',
    'landing.card_wa_b1': 'Audio upload & recording simulation',
    'landing.card_wa_b2': 'Instant pipeline: Ingest → Classify → Card',
    'landing.card_wa_b3': 'Zero app download required for citizen',
    'landing.card_wa_cta': 'Open Simulator',
    'landing.card_kiosk_badge': 'Village Terminal',
    'landing.card_kiosk_title': 'Offline Kiosk',
    'landing.card_kiosk_desc': 'Large-screen touch-optimized mode for Gram Panchayat kiosks with low connectivity. Queues audio locally and syncs in background.',
    'landing.card_kiosk_b1': 'High-contrast oversized touch controls',
    'landing.card_kiosk_b2': 'Local IndexedDB queue & background sync',
    'landing.card_kiosk_b3': 'Designed for low digital literacy citizens',
    'landing.card_kiosk_cta': 'Launch Terminal',
    'landing.gov_badge': 'District & State PM-AJAY Directorate',
    'landing.gov_title': 'Administrative & Skilling Governance Portal',
    'landing.gov_desc': 'Real-time geospatial analytics across pilot districts, NSQF supply vs market demand balance, training center capacity tracking, and human escalation triage.',
    'landing.gov_cta': 'Open Governance Panel',
    'landing.badge1_title': 'NSQF Levels 1–5',
    'landing.badge1_desc': 'National Qualification Pack standard',
    'landing.badge2_title': 'RPL Fast-Track',
    'landing.badge2_desc': 'Prior Learning certification',
    'landing.badge3_title': 'District Demand',
    'landing.badge3_desc': 'Wage & vacancy matching',
    'landing.badge4_title': '15 km Proximity',
    'landing.badge4_desc': 'Local PMKK & RSETI routing',

    // Consent Screen
    'consent.back': 'Return to Home',
    'consent.badge': 'Protocols • PM-AJAY Section 4',
    'consent.title': 'Beneficiary Consent & Data Protection',
    'consent.subtitle': 'Consent rules and security for livelihood skill profiling',
    'consent.audio_banner': 'Listen to Spoken Privacy Statement',
    'consent.audio_sub': 'Click to hear the consent in your spoken language',
    'consent.audio_broadcasting': 'Broadcasting in dialect...',
    'consent.statement': 'To recommend the most suitable NSQF training and livelihood pathway under PM-AJAY, we request your consent to record and process your spoken work experience and skill details. Your data is strictly encrypted and protected.',
    'consent.sec1': 'Encrypted voice transport & role-based privacy access',
    'consent.sec2': 'Used exclusively for NSQF training & PM-AJAY stipend matching',
    'consent.sec3': 'You can withdraw or delete your record anytime via district administration',
    'consent.agree_label': 'I agree to participate in the voice skilling interview and understand my information will be matched strictly to official government training opportunities.',
    'consent.continue_btn': 'Continue to Language Selection',

    // Language Select Screen
    'lang.back': 'Back to Consent',
    'lang.eyebrow': 'Dialect • Spoken Intake Mode',
    'lang.title': 'Choose Your Spoken Language',
    'lang.desc': 'Select the native tongue or regional dialect you speak most naturally at work.',
    'lang.autodetect_title': '⚡ Real-Time Auto Detect (IndicLID)',
    'lang.autodetect_desc': 'Speak freely in your native dialect; neural engine detects language automatically.',
    'lang.start_spoken': 'Start Spoken',
    'lang.confirm_btn': 'Confirm Dialect & Enter Audio Studio',

    // Voice Interview Screen
    'interview.back_lang': 'Change Language',
    'interview.help_officer': 'Call Human Officer',
    'interview.status_speaking': 'Assistant is speaking in your language...',
    'interview.status_ready': 'Ready for your response. Tap microphone and speak.',
    'interview.status_listening': 'Listening... Speak about your daily work and trade.',
    'interview.status_processing': 'Processing speech through IndicWhisper AI...',
    'interview.mic_tap_speak': 'Tap to Speak in Dialect',
    'interview.mic_recording': 'Listening... Tap when Finished',
    'interview.repeat_prompt': 'Listen to Question Again',
    'interview.typing_placeholder': 'Or type answer in regional script...',
    'interview.send_text': 'Send Answer',
    'interview.understood_slots': 'Skills Understood So Far',
    'interview.complete_btn': 'Profile Complete • View Recommendations',

    // Profile Confirm Screen
    'confirm.back': 'Return to Voice Interview',
    'confirm.title': 'Review Your Understood Profile',
    'confirm.subtitle': 'Please confirm your work details before matching government training schemes.',
    'confirm.listen_summary': 'Listen to Spoken Profile Summary',
    'confirm.occupation_title': 'Main Occupation & Experience:',
    'confirm.tools_title': 'Tools & Equipment Mastered:',
    'confirm.mobility_title': 'Preferred Working Radius:',
    'confirm.training_title': 'Training Preference:',
    'confirm.correct_btn': 'Correct Detail',
    'confirm.generate_btn': 'Confirm Profile & Generate NSQF Schemes',

    // Recommendations Screen
    'rec.banner_badge': 'NSQF Skill Alignment',
    'rec.banner_title': 'Recommended Livelihood Pathways for You',
    'rec.banner_desc': 'Matched according to your spoken work experience, verified skills, and local district job demand.',
    'rec.listen_overview': 'Listen in Spoken Audio',
    'rec.why_title': 'Why We Recommended This',
    'rec.skills_title': 'Skills & Bridge Training',
    'rec.demand_title': 'Economic Demand & Wages',
    'rec.recognized_skills': 'Recognized Informal Skills:',
    'rec.bridge_skills': 'Skills to be Learned (Bridge):',
    'rec.district_score': 'District Demand Score:',
    'rec.vacancies': 'Estimated Local Vacancies:',
    'rec.starting_wage': 'Average Starting Wage:',
    'rec.top_employers': 'Top Local Employers:',
    'rec.nearest_center': 'Nearest Accredited Center:',
    'rec.seats_available': 'Seats Available',
    'rec.next_batch': 'Next Batch:',
    'rec.helpline': 'Helpline:',
    'rec.new_assessment': 'Conduct New Spoken Assessment',
    'rec.enroll_btn': 'Enroll in Free PM-AJAY Cohort (1-Click)',
    'rec.enrolled_success': 'Dossier Submitted to District Officer (SMS Confirmation Dispatched)',
    'rec.d3_title': 'Local District Job Demand (D3.js Market Viability)',
    'rec.d3_sub': 'Comparative hiring intensity, wage absorption potential, and local MSME vacancy depth'
  },

  hi: {
    // Header & Global
    'header.title': 'पीएम-अजय वॉइस डॉसियर',
    'header.subtitle': 'वाणी-आधारित आजीविका एवं प्रमाणन प्रेषक',
    'header.banner': 'पीएम-अजय कौशल एवं आजीविका प्रसार प्रणाली • खंड IV',
    'header.dossier': 'इंटरैक्टिव डॉसियर',
    'header.spoken_intake': 'मौखिक साक्षात्कार',
    'header.whatsapp': 'व्हाट्सएप नोट्स',
    'header.kiosk': 'ऑफ़लाइन कियोस्क',
    'header.governance': 'प्रशासनिक पैनल',
    'header.human_help': 'सहायता अधिकारी',
    'header.role': 'भूमिका',
    'talkback.listen_screen': 'पूरी स्क्रीन बोलकर सुनें (टॉकबैक)',
    'talkback.speaking': 'स्क्रीन पढ़ी जा रही है...',
    'talkback.stop': 'आवाज़ बंद करें',
    'talkback.active': 'टॉकबैक चालू है: किसी भी बॉक्स को छूकर आवाज़ में सुनें',
    'talkback.enabled': 'वाणी मार्गदर्शक चालू',
    'talkback.disabled': 'वाणी मार्गदर्शक बंद',

    // Landing Page
    'landing.eyebrow': 'राष्ट्रीय प्रसार • 12 भारतीय भाषाएं • पीएम-अजय',
    'landing.hero_title_1': 'बताइए आप क्या काम जानते हैं।',
    'landing.hero_title_2': 'हम आपके लिए सही हुनर का रास्ता खोजेंगे।',
    'landing.hero_desc': 'बिना किसी फॉर्म या डिजिटल रुकावट के। अपनी मातृभाषा में अपने रोज़मर्रा के काम, औज़ारों और हुनर के बारे में बोलकर बताएं। हमारा वॉइस इंजन आपके अनुभव को सरकारी NSQF प्रमाण पत्र, मुफ्त पीएम-अजय वजीफे और स्थानीय नौकरी से जोड़ता है।',
    'landing.benchmarks': 'परीक्षण नमूने (नमूना देखें):',
    'landing.welder': '6-वर्ष वेल्डर',
    'landing.tailor': 'गांव की दर्जी',
    'landing.tractor': 'ट्रैक्टर मिस्त्री',
    'landing.weaver': 'हथकरघा बुनकर',
    'landing.card_ivr_badge': 'मुख्य फोन कॉल',
    'landing.card_ivr_title': 'बोलकर साक्षात्कार (IVR)',
    'landing.card_ivr_desc': 'क्षेत्रीय बोली में बातचीत। आपके पुराने काम, देसी औज़ारों और पुश्तैनी हुनर को सरलता से समझता है।',
    'landing.card_ivr_b1': 'बोलने के साथ तरंगों द्वारा आवाज़ की पुष्टि',
    'landing.card_ivr_b2': 'ज़रूरत पड़ने पर सरल सवाल पूछने की सुविधा',
    'landing.card_ivr_b3': 'साधारण फोन और टोल-फ्री कॉल पर उपलब्ध',
    'landing.card_ivr_cta': 'वॉइस कॉल शुरू करें',
    'landing.card_wa_badge': 'व्हाट्सएप चैट',
    'landing.card_wa_title': 'व्हाट्सएप वॉइस संदेश',
    'landing.card_wa_desc': 'व्हाट्सएप पर छोटा वॉइस मैसेज भेजें। आपकी भाषा समझकर सीधे व्हाट्सएप पर सरकारी योजना कार्ड भेजेगा।',
    'landing.card_wa_b1': 'ऑडियो रिकॉर्ड और अपलोड करने की सुविधा',
    'landing.card_wa_b2': 'तुरंत विश्लेषण: आवाज़ → पहचान → योजना कार्ड',
    'landing.card_wa_b3': 'लाभार्थी को कोई नया ऐप डाउनलोड नहीं करना',
    'landing.card_wa_cta': 'व्हाट्सएप शुरू करें',
    'landing.card_kiosk_badge': 'ग्राम पंचायत टर्मिनल',
    'landing.card_kiosk_title': 'ऑफ़लाइन कियोस्क',
    'landing.card_kiosk_desc': 'बिना इंटरनेट या कम नेटवर्क वाले गांवों के लिए बड़ी स्क्रीन वाला आसान टच स्क्रीन सिस्टम।',
    'landing.card_kiosk_b1': 'अनपढ़ नागरिकों के लिए बड़े रंगीन बटन',
    'landing.card_kiosk_b2': 'ऑफ़लाइन जानकारी सहेजने और बाद में भेजने की सुविधा',
    'landing.card_kiosk_b3': 'कम पढ़े-लिखे लोगों के लिए विशेष डिज़ाइन',
    'landing.card_kiosk_cta': 'कियोस्क खोलें',
    'landing.gov_badge': 'जिला एवं राज्य पीएम-अजय निदेशालय',
    'landing.gov_title': 'प्रशासनिक एवं कौशल निगरानी पोर्टल',
    'landing.gov_desc': 'जिलों में हुनर की मांग, प्रशिक्षण केंद्रों की सीटें और सहायता अधिकारी प्रबंधन का लाइव डैशबोर्ड।',
    'landing.gov_cta': 'प्रशासनिक पोर्टल खोलें',
    'landing.badge1_title': 'NSQF स्तर 1–5',
    'landing.badge1_desc': 'राष्ट्रीय योग्यता मानक प्रमाणन',
    'landing.badge2_title': 'RPL त्वरित प्रमाणन',
    'landing.badge2_desc': 'पुराने अनुभव की सीधी सरकारी मान्यता',
    'landing.badge3_title': 'जिले में मांग',
    'landing.badge3_desc': 'वेतन एवं खाली पदों से मिलान',
    'landing.badge4_title': '15 किमी के दायरे में',
    'landing.badge4_desc': 'नज़दीकी सरकारी प्रशिक्षण केंद्र',

    // Consent Screen
    'consent.back': 'मुख्य पृष्ठ पर लौटें',
    'consent.badge': 'नियम • पीएम-अजय धारा 4',
    'consent.title': 'लाभार्थी सहमति एवं डेटा सुरक्षा',
    'consent.subtitle': 'हुनर पहचान एवं प्रशिक्षण के लिए सहमति नियम',
    'consent.audio_banner': 'सहमति नियम बोलकर सुनें',
    'consent.audio_sub': 'अपनी भाषा में सहमति का विवरण सुनने के लिए दबाएं',
    'consent.audio_broadcasting': 'आपकी भाषा में बोला जा रहा है...',
    'consent.statement': 'पीएम-अजय (PM-AJAY) योजना के तहत आपके लिए सबसे उपयुक्त सरकारी हुनर प्रशिक्षण और रोज़गार की सिफारिश करने के लिए, हम आपके काम के अनुभव की जानकारी लेने हेतु आपकी सहमति मांगते हैं। आपकी जानकारी पूरी तरह सुरक्षित और गोपनीय रहेगी।',
    'consent.sec1': 'सुरक्षित वॉइस रिकॉर्डिंग एवं सरकारी नियमों के तहत डेटा सुरक्षा',
    'consent.sec2': 'केवल सरकारी प्रशिक्षण, प्रमाण पत्र और वजीफे के लिए उपयोग',
    'consent.sec3': 'आप जब चाहें जिला प्रशासन से अपनी जानकारी हटा सकते हैं',
    'consent.agree_label': 'मैं वॉइस इंटरव्यू में भाग लेने के लिए सहमत हूँ और समझता हूँ कि मेरी जानकारी का उपयोग केवल सरकारी प्रशिक्षण अवसरों के लिए होगा।',
    'consent.continue_btn': 'भाषा चुनने के लिए आगे बढ़ें',

    // Language Select Screen
    'lang.back': 'सहमति पर वापस जाएं',
    'lang.eyebrow': 'बोली एवं भाषा चयन',
    'lang.title': 'अपनी बोलने की भाषा चुनें',
    'lang.desc': 'वह भाषा या बोली चुनें जिसमें आप काम के बारे में सबसे आसानी से बोल सकते हैं।',
    'lang.autodetect_title': '⚡ अपने आप भाषा पहचानें (ऑटो डिटेक्ट)',
    'lang.autodetect_desc': 'अपनी बोली में बेझिझक बोलें; सिस्टम अपने आप आपकी भाषा पहचान लेगा।',
    'lang.start_spoken': 'बोलना शुरू करें',
    'lang.confirm_btn': 'भाषा की पुष्टि करें और स्टूडियो में प्रवेश करें',

    // Voice Interview Screen
    'interview.back_lang': 'भाषा बदलें',
    'interview.help_officer': 'अधिकारी से मदद लें',
    'interview.status_speaking': 'सहायक आपकी भाषा में बोल रहा है...',
    'interview.status_ready': 'जवाब देने के लिए तैयार। माइक दबाकर बोलें।',
    'interview.status_listening': 'सुन रहे हैं... अपने काम और औज़ारों के बारे में बोलें।',
    'interview.status_processing': 'आवाज़ को समझा जा रहा है...',
    'interview.mic_tap_speak': 'बोलने के लिए माइक दबाएं',
    'interview.mic_recording': 'सुन रहे हैं... बोलने के बाद दबाएं',
    'interview.repeat_prompt': 'सवाल दोबारा सुनें',
    'interview.typing_placeholder': 'या यहाँ लिखकर जवाब दें...',
    'interview.send_text': 'जवाब भेजें',
    'interview.understood_slots': 'अब तक समझा गया हुनर',
    'interview.complete_btn': 'साक्षात्कार पूरा हुआ • सिफारिशें देखें',

    // Profile Confirm Screen
    'confirm.back': 'साक्षात्कार पर वापस जाएं',
    'confirm.title': 'अपनी जानकारी की पुष्टि करें',
    'confirm.subtitle': 'सरकारी प्रशिक्षण योजना से जोड़ने से पहले अपने काम की जानकारी जांच लें।',
    'confirm.listen_summary': 'पूरी जानकारी आवाज़ में सुनें',
    'confirm.occupation_title': 'मुख्य काम और अनुभव:',
    'confirm.tools_title': 'औज़ार और मशीनें जो आप जानते हैं:',
    'confirm.mobility_title': 'काम करने का पसंदीदा दायरा:',
    'confirm.training_title': 'प्रशिक्षण की इच्छा:',
    'confirm.correct_btn': 'बदलाव करें',
    'confirm.generate_btn': 'जानकारी सही है • सरकारी योजनाएं देखें',

    // Recommendations Screen
    'rec.banner_badge': 'NSQF कौशल मिलान',
    'rec.banner_title': 'आपके लिए उपयुक्त आजीविका एवं हुनर रास्ते',
    'rec.banner_desc': 'आपके बोले गए अनुभव, हुनर और जिले में रोज़गार की मांग के अनुसार चुने गए।',
    'rec.listen_overview': 'सिफारिशें बोलकर सुनें',
    'rec.why_title': 'हमने इसे क्यों चुना',
    'rec.skills_title': 'हुनर और नया प्रशिक्षण',
    'rec.demand_title': 'जिले में मांग और अनुमानित कमाई',
    'rec.recognized_skills': 'आपका पुराना हुनर (मान्यता प्राप्त):',
    'rec.bridge_skills': 'नया हुनर जो सिखाया जाएगा:',
    'rec.district_score': 'जिले में मांग स्कोर:',
    'rec.vacancies': 'उपलब्ध नौकरियां:',
    'rec.starting_wage': 'शुरुआती मासिक वेतन:',
    'rec.top_employers': 'प्रमुख स्थानीय नियोक्ता:',
    'rec.nearest_center': 'निकटतम सरकारी प्रशिक्षण केंद्र:',
    'rec.seats_available': 'सीटें उपलब्ध',
    'rec.next_batch': 'अगला बैच शुरू:',
    'rec.helpline': 'हेल्पलाइन नंबर:',
    'rec.new_assessment': 'नया साक्षात्कार शुरू करें',
    'rec.enroll_btn': 'मुफ्त पीएम-अजय बैच में प्रवेश लें (1-क्लिक)',
    'rec.enrolled_success': 'जिला अधिकारी को आवेदन भेजा गया (SMS भेजा जा चुका है)',
    'rec.d3_title': 'जिले में रोज़गार की मांग (D3.js ग्राफ)',
    'rec.d3_sub': 'स्थानीय बाज़ार में मांग, वेतन स्तर और खाली पदों की तुलना'
  },

  bn: {
    // Header & Global
    'header.title': 'পিএম-অজয় ভয়েস ডসিয়ার',
    'header.subtitle': 'কণ্ঠস্বর-ভিত্তিক জীবিকা ও দক্ষতা সনদ পোর্টাল',
    'header.banner': 'পিএম-অজয় দক্ষতা ও জীবিকা বিস্তার ব্যবস্থা • খণ্ড IV',
    'header.dossier': 'ইন্টারেক্টিভ ডসিয়ার',
    'header.spoken_intake': 'কণ্ঠ সাক্ষাৎকার',
    'header.whatsapp': 'হোয়াটসঅ্যাপ ভয়েস নোট',
    'header.kiosk': 'অফলাইন কিয়স্ক',
    'header.governance': 'প্রশাসনিক প্যানেল',
    'header.human_help': 'সহায়তা কর্মকর্তা',
    'header.role': 'ভূমিকা',
    'talkback.listen_screen': 'পর্দার লেখা শুনুন (টকব্যাক)',
    'talkback.speaking': 'পর্দা পড়ে শোনানো হচ্ছে...',
    'talkback.stop': 'শব্দ বন্ধ করুন',
    'talkback.active': 'টকব্যাক চালু: যেকোনো বক্সে চাপ দিলে পড়ে শোনাবে',
    'talkback.enabled': 'ভয়েস গাইড চালু',
    'talkback.disabled': 'ভয়েস গাইড বন্ধ',

    // Landing Page
    'landing.eyebrow': 'জাতীয় কর্মসূচি • ১২টি ভারতীয় ভাষা • পিএম-অজয়',
    'landing.hero_title_1': 'আপনি কী কাজ জানেন বলুন।',
    'landing.hero_title_2': 'আমরা আপনার জন্য সঠিক সরকারি প্রশিক্ষণের পথ খুঁজে দেব।',
    'landing.hero_desc': 'কোনো ফর্ম বা ডিজিটাল জটিলতা ছাড়া। নিজের মাতৃভাষায় নিজের প্রাত্যহিক কাজ, যন্ত্রপাতি ও অভিজ্ঞতার কথা বলুন। আমাদের ভয়েস সিস্টেম আপনার অভিজ্ঞতাকে সরকারি NSQF সার্টিফিকেট, নিখরচায় বৃত্তি ও চাকরির সুযোগের সাথে মিলিয়ে দেবে।',
    'landing.benchmarks': 'নমুনা ডেমো:',
    'landing.welder': '৬-বছরের ওয়েল্ডার',
    'landing.tailor': 'গ্রামের দর্জি',
    'landing.tractor': 'ট্র্যাক্টর মেকানিক',
    'landing.weaver': 'তাঁতি কারিগর',
    'landing.card_ivr_badge': 'প্রধান ফোন কল',
    'landing.card_ivr_title': 'কণ্ঠস্বর সাক্ষাৎকার',
    'landing.card_ivr_desc': 'নিজের আঞ্চলিক ভাষায় কথা বলুন। আপনার পুরনো কাজ, দেশি সরঞ্জাম এবং পারিবারিক দক্ষতার মূল্যায়ন করে।',
    'landing.card_ivr_b1': 'কথা বলার সাথে সাথে রিয়েল-টাইম অডিও ফিডব্যাক',
    'landing.card_ivr_b2': 'প্রয়োজনে সহজ প্রশ্নের মাধ্যমে স্পষ্টীকরণ',
    'landing.card_ivr_b3': 'সাধারণ ফোন ও টোল-ফ্রি লাইনে উপলব্ধ',
    'landing.card_ivr_cta': 'ভয়েস কল শুরু করুন',
    'landing.card_wa_badge': 'হোয়াটসঅ্যাপ বার্তা',
    'landing.card_wa_title': 'হোয়াটসঅ্যাপ ভয়েস নোট',
    'landing.card_wa_desc': 'হোয়াটসঅ্যাপে ছোট ভয়েস মেসেজ পাঠান। সঙ্গে সঙ্গে যাচাই করে উপযুক্ত সরকারি কোর্সের কার্ড পাঠিয়ে দেবে।',
    'landing.card_wa_b1': 'অডিও রেকর্ড ও পাঠানোর সহজ ব্যবস্থা',
    'landing.card_wa_b2': 'তাত্ক্ষণিক বিশ্লেষণ: অডিও → যাচাইকরণ → স্কিম কার্ড',
    'landing.card_wa_b3': 'কোনো নতুন অ্যাপ ডাউনলোড করার প্রয়োজন নেই',
    'landing.card_wa_cta': 'হোয়াটসঅ্যাপ খুলুন',
    'landing.card_kiosk_badge': 'গ্রাম পঞ্চায়েত টার্মিনাল',
    'landing.card_kiosk_title': 'অফলাইন কিয়স্ক',
    'landing.card_kiosk_desc': 'কম ইন্টারনেটযুক্ত গ্রামের পঞ্চায়েতের জন্য বড় পর্দার টাচ স্ক্রিন কিয়স্ক। অফলাইনে কাজ রেকর্ড করে রাখে।',
    'landing.card_kiosk_b1': 'নিরক্ষর মানুষের জন্য বড় বোতাম ও সহজ নির্দেশিকা',
    'landing.card_kiosk_b2': 'স্থানীয় মেমরিতে সংরক্ষণ ও পরে স্বয়ংক্রিয় সিঙ্ক',
    'landing.card_kiosk_b3': 'স্বল্প শিক্ষিত গ্রামীণ নাগরিকদের উপযোগী',
    'landing.card_kiosk_cta': 'কিয়স্ক চালু করুন',
    'landing.gov_badge': 'জেলা ও রাজ্য পিএম-অজয় অধিদপ্তর',
    'landing.gov_title': 'প্রশাসনিক ও দক্ষতা তদারকি পোর্টাল',
    'landing.gov_desc': 'জেলায় চাকরির চাহিদা, প্রশিক্ষণ কেন্দ্রের আসন এবং জরুরি সহায়তা তদারকির সরাসরি তথ্য।',
    'landing.gov_cta': 'প্রশাসনিক প্যানেল দেখুন',
    'landing.badge1_title': 'NSQF লেভেল ১–৫',
    'landing.badge1_desc': 'জাতীয় দক্ষতা মান সনদ',
    'landing.badge2_title': 'RPL দ্রুত অনুমোদন',
    'landing.badge2_desc': 'পূর্ব অভিজ্ঞতার সরকারি স্বীকৃতি',
    'landing.badge3_title': 'জেলায় কাজের চাহিদা',
    'landing.badge3_desc': 'বেতন ও খালি পদের সাথে সমন্বয়',
    'landing.badge4_title': '১৫ কিমির মধ্যে',
    'landing.badge4_desc': 'নিকটস্থ সরকারি প্রশিক্ষণ কেন্দ্র',

    // Consent Screen
    'consent.back': 'হোমে ফিরে যান',
    'consent.badge': 'নিয়মাবলী • পিএম-অজয় ধারা ৪',
    'consent.title': 'সুবিধাভোগীর সম্মতি ও তথ্য সুরক্ষা',
    'consent.subtitle': 'জীবিকা মূল্যায়ন ও তথ্য সুরক্ষার নিয়ম',
    'consent.audio_banner': 'সম্মতি বিবরণটি বাংলায় শুনুন',
    'consent.audio_sub': 'অডিওতে শুনতে এখানে চাপুন',
    'consent.audio_broadcasting': 'বাংলায় বলা হচ্ছে...',
    'consent.statement': 'পিএম-অজয় প্রকল্পের আওতায় আপনার জন্য উপযুক্ত প্রশিক্ষণ ও কর্মসংস্থান সুপারিশ করতে আমরা আপনার কাজের অভিজ্ঞতা ও দক্ষতার তথ্য সংগ্রহ করতে আপনার সম্মতি নিচ্ছি। এই তথ্য সম্পূর্ণ সুরক্ষিত ও গোপন থাকবে।',
    'consent.sec1': 'এনক্রিপ্ট করা ভয়েস ও সরকারি সুরক্ষার নিয়ম মেনে সংরক্ষণ',
    'consent.sec2': 'শুধুমাত্র সরকারি প্রশিক্ষণ ও ভাতা দেওয়ার কাজে ব্যবহৃত হবে',
    'consent.sec3': 'আপনি যেকোনো সময় জেলা প্রশাসনে যোগাযোগ করে তথ্য মুছতে পারবেন',
    'consent.agree_label': 'আমি ভয়েস সাক্ষাৎকারে অংশ নিতে রাজি এবং সম্মতি দিচ্ছি যে আমার তথ্য সরকারি প্রশিক্ষণের কাজেই ব্যবহৃত হবে।',
    'consent.continue_btn': 'ভাষা নির্বাচন করতে এগিয়ে যান',

    // Language Select Screen
    'lang.back': 'সম্মতিতে ফিরে যান',
    'lang.eyebrow': 'উপভাষা ও ভাষা নির্বাচন',
    'lang.title': 'আপনার মুখের ভাষা বেছে নিন',
    'lang.desc': 'কাজের কথা বলতে যে ভাষায় আপনি সবচেয়ে স্বাচ্ছন্দ্যবোধ করেন তা বেছে নিন।',
    'lang.autodetect_title': '⚡ স্বয়ংক্রিয় ভাষা শনাক্তকরণ',
    'lang.autodetect_desc': 'নিজের স্বাভাবিক ভাষায় কথা বলুন; সিস্টেম নিজে থেকেই ভাষা বুঝে নেবে।',
    'lang.start_spoken': 'কথা বলা শুরু করুন',
    'lang.confirm_btn': 'ভাষা নিশ্চিত করুন ও স্টুডিওতে প্রবেশ করুন',

    // Voice Interview Screen
    'interview.back_lang': 'ভাষা পরিবর্তন',
    'interview.help_officer': 'কর্মকর্তার সাহায্য নিন',
    'interview.status_speaking': 'সহকারী বাংলায় কথা বলছে...',
    'interview.status_ready': 'উত্তর দেওয়ার জন্য প্রস্তুত। মাইক চেপে কথা বলুন।',
    'interview.status_listening': 'শুনছি... আপনার কাজ ও যন্ত্রপাতি নিয়ে বলুন।',
    'interview.status_processing': 'কণ্ঠস্বর বিশ্লেষণ করা হচ্ছে...',
    'interview.mic_tap_speak': 'কথা বলতে মাইক চাপুন',
    'interview.mic_recording': 'শুনছি... বলা শেষ হলে চাপুন',
    'interview.repeat_prompt': 'প্রশ্নটি আবার শুনুন',
    'interview.typing_placeholder': 'অথবা বাংলায় টাইপ করুন...',
    'interview.send_text': 'উত্তর পাঠান',
    'interview.understood_slots': 'চিহ্নিত দক্ষতা সমূহ',
    'interview.complete_btn': 'সাক্ষাৎকার সমাপ্ত • সুপারিশ দেখুন',

    // Profile Confirm Screen
    'confirm.back': 'সাক্ষাৎকারে ফিরে যান',
    'confirm.title': 'আপনার তথ্যের সত্যতা যাচাই করুন',
    'confirm.subtitle': 'সরকারি প্রশিক্ষণ কোর্সে যুক্ত করার আগে আপনার দেওয়া তথ্য মিলিয়ে নিন।',
    'confirm.listen_summary': 'পুরো বিবরণটি বাংলায় শুনুন',
    'confirm.occupation_title': 'প্রধান পেশা ও কাজের অভিজ্ঞতা:',
    'confirm.tools_title': 'যেসব যন্ত্রপাতি আপনি চালাতে পারেন:',
    'confirm.mobility_title': 'কাজের পছন্দের দূরত্ব:',
    'confirm.training_title': 'প্রশিক্ষণের আগ্রহ:',
    'confirm.correct_btn': 'সংশোধন করুন',
    'confirm.generate_btn': 'তথ্য সঠিক আছে • সরকারি কোর্স দেখুন',

    // Recommendations Screen
    'rec.banner_badge': 'NSQF দক্ষতা মূল্যায়ন',
    'rec.banner_title': 'আপনার জন্য উপযুক্ত সরকারি প্রশিক্ষণ ও কাজের পথ',
    'rec.banner_desc': 'আপনার অভিজ্ঞতা, দক্ষতা এবং জেলায় কাজের চাহিদার ভিত্তিতে বাছাই করা হয়েছে।',
    'rec.listen_overview': 'সুপারিশগুলি বাংলায় শুনুন',
    'rec.why_title': 'আমরা কেন এটি সুপারিশ করেছি',
    'rec.skills_title': 'দক্ষতা ও সেতু প্রশিক্ষণ',
    'rec.demand_title': 'জেলায় চাহিদা ও আনুমানিক বেতন',
    'rec.recognized_skills': 'স্বীকৃত পুরনো দক্ষতা:',
    'rec.bridge_skills': 'নতুন যে দক্ষতা শেখানো হবে:',
    'rec.district_score': 'জেলায় চাকরির চাহিদা স্কোর:',
    'rec.vacancies': 'উপলব্ধ পদসংখ্যা:',
    'rec.starting_wage': 'গড় শুরুর বেতন:',
    'rec.top_employers': 'স্থানীয় শীর্ষ নিয়োগকর্তা:',
    'rec.nearest_center': 'নিকটস্থ অনুমোদিত কেন্দ্র:',
    'rec.seats_available': 'আসন খালি আছে',
    'rec.next_batch': 'পরবর্তী ব্যাচ শুরু:',
    'rec.helpline': 'হেল্পলাইন:',
    'rec.new_assessment': 'নতুন মূল্যায়ন শুরু করুন',
    'rec.enroll_btn': 'বিনামূল্যে পিএম-অজয় কোর্সে যোগ দিন (১-ক্লিক)',
    'rec.enrolled_success': 'জেলা কর্মকর্তার কাছে আবেদন জমা দেওয়া হয়েছে (SMS পাঠানো হয়েছে)',
    'rec.d3_title': 'জেলায় চাকরির চাহিদা (D3.js গ্রাফ)',
    'rec.d3_sub': 'স্থানীয় বাজারে চাহিদা, মজুরি এবং শূন্যপদের তুলনামূলক তথ্য'
  },

  mr: {
    // Marathi
    'header.title': 'PM-AJAY व्हॉईस डॉसियर',
    'header.subtitle': 'आवाज-आधारित उपजीविका व कौशल्य प्रमाणपत्र प्रणाली',
    'header.banner': 'PM-AJAY कौशल्य व उपजीविका प्रसार प्रणाली • खंड IV',
    'header.dossier': 'इंटरॅक्टिव्ह डॉसियर',
    'header.spoken_intake': 'तोंडी मुलाखत',
    'header.whatsapp': 'व्हॉट्सॲप नोट्स',
    'header.kiosk': 'ऑफलाईन किऑस्क',
    'header.governance': 'प्रशासकीय पॅनेल',
    'header.human_help': 'मदत अधिकारी',
    'header.role': 'भूमिका',
    'talkback.listen_screen': 'पूर्ण स्क्रीन ऐका (टॉकबॅक)',
    'talkback.speaking': 'स्क्रीन वाचली जात आहे...',
    'talkback.stop': 'आवाज थांबवा',
    'talkback.active': 'टॉकबॅक चालू: कोणत्याही बॉक्सवर टॅप करून आवाज ऐका',
    'talkback.enabled': 'व्हॉईस गाईड चालू',
    'talkback.disabled': 'व्हॉईस गाईड बंद',

    'landing.eyebrow': 'राष्ट्रीय उपक्रम • १२ भारतीय भाषा • PM-AJAY',
    'landing.hero_title_1': 'तुम्हाला कोणते काम येते ते सांगा.',
    'landing.hero_title_2': 'आम्ही तुमच्यासाठी योग्य कौशल्याचा मार्ग शोधू.',
    'landing.hero_desc': 'कोणत्याही कठीण फॉर्म किंवा डिजिटल अडथळ्यांशिवाय. आपल्या मातृभाषेत आपल्या रोजच्या कामाबद्दल आणि अनुभवाबद्दल बोला. आमची प्रणाली तुमच्या अनुभवाला सरकारी NSQF प्रमाणपत्र, मोफत PM-AJAY विद्यावेतन आणि स्थानिक नोकरीशी जोडते.',
    'landing.benchmarks': 'चाचणी नमुने:',
    'landing.welder': '६-वर्षे वेल्डर',
    'landing.tailor': 'गावची शिंपी',
    'landing.tractor': 'ट्रॅक्टर मेकॅनिक',
    'landing.weaver': 'हातमाग विणकर',
    'landing.card_ivr_badge': 'थेट फोन कॉल',
    'landing.card_ivr_title': 'तोंडी मुलाखत (IVR)',
    'landing.card_ivr_desc': 'स्थानिक बोलीभाषेत संवाद. तुमचे जुने काम आणि कौशल्यांचे अचूक मूल्यांकन.',
    'landing.card_ivr_b1': 'बोलताना थेट ऑडिओ तरंग अभिप्राय',
    'landing.card_ivr_b2': 'सोप्या प्रश्नांद्वारे माहितीची पडताळणी',
    'landing.card_ivr_b3': 'साध्या फोनवर टोल-फ्री उपलब्ध',
    'landing.card_ivr_cta': 'कॉल सुरू करा',
    'landing.card_wa_badge': 'व्हॉट्सॲप मेसेज',
    'landing.card_wa_title': 'व्हॉट्सॲप व्हॉईस नोट्स',
    'landing.card_wa_desc': 'व्हॉट्सॲपवर व्हॉईस मेसेज पाठवून सरकारी कौशल्य योजनांची माहिती मिळवा.',
    'landing.card_wa_b1': 'व्हॉईस रेकॉर्डिंग आणि पाठवण्याची सोय',
    'landing.card_wa_b2': 'त्वरित विश्लेषण: आवाज → पडताळणी → योजना कार्ड',
    'landing.card_wa_b3': 'कोणतेही ॲप डाऊनलोड करण्याची गरज नाही',
    'landing.card_wa_cta': 'व्हॉट्सॲप उघडा',
    'landing.card_kiosk_badge': 'ग्रामपंचायत टर्मिनल',
    'landing.card_kiosk_title': 'ऑफलाईन किऑस्क',
    'landing.card_kiosk_desc': 'कमी इंटरनेट असलेल्या गावांच्या ग्रामपंचायतीसाठी मोठी स्क्रीन असलेले टच किऑस्क.',
    'landing.card_kiosk_b1': 'अशिक्षित नागरिकांसाठी मोठी बटणे व सुलभ रचना',
    'landing.card_kiosk_b2': 'ऑफलाईन डेटा साठवणे व नंतर सिंक करणे',
    'landing.card_kiosk_b3': 'ग्रामीण नागरिकांसाठी सुलभ',
    'landing.card_kiosk_cta': 'किऑस्क सुरू करा',
    'landing.gov_badge': 'जिल्हा व राज्य PM-AJAY संचालनालय',
    'landing.gov_title': 'प्रशासकीय व कौशल्य नियंत्रण पोर्टल',
    'landing.gov_desc': 'जिल्ह्यातील नोकऱ्यांची मागणी, प्रशिक्षण केंद्रांमधील जागा आणि मदत व्यवस्थापन.',
    'landing.gov_cta': 'प्रशासकीय पोर्टल उघडा',
    'landing.badge1_title': 'NSQF स्तर १–५',
    'landing.badge1_desc': 'राष्ट्रीय कौशल्य मानके',
    'landing.badge2_title': 'RPL थेट मान्यता',
    'landing.badge2_desc': 'अनुभवाची सरकारी मान्यता',
    'landing.badge3_title': 'जिल्ह्यात मागणी',
    'landing.badge3_desc': 'वेतन व नोकऱ्यांशी सांगड',
    'landing.badge4_title': '१५ किमी अंतरात',
    'landing.badge4_desc': 'जवळचे सरकारी केंद्र',

    'consent.back': 'मागे जा',
    'consent.badge': 'नियम • PM-AJAY कलम ४',
    'consent.title': 'लाभार्थी संमती व डेटा सुरक्षा',
    'consent.subtitle': 'कौशल्य मूल्यांकन व माहिती सुरक्षेचे नियम',
    'consent.audio_banner': 'संमती नियम आवाजात ऐका',
    'consent.audio_sub': 'मराठीत ऐकण्यासाठी दाबा',
    'consent.audio_broadcasting': 'मराठीत वाचले जात आहे...',
    'consent.statement': 'PM-AJAY योजनेअंतर्गत आपल्यासाठी योग्य कौशल्य प्रशिक्षण व उपजीविका पर्याय शोधण्यासाठी आम्ही आपल्या कामाचा अनुभव व कौशल्याची माहिती विचारत आहोत. ही माहिती पूर्णपणे सुरक्षित व गोपनीय राहील.',
    'consent.sec1': 'सुरक्षित व्हॉईस रेकॉर्डिंग व सरकारी नियमांनुसार डेटा संरक्षण',
    'consent.sec2': 'फक्त सरकारी प्रशिक्षण व विद्यावेतनासाठी वापर',
    'consent.sec3': 'तुम्ही केव्हाही जिल्हा प्रशासनाकडून माहिती काढू शकता',
    'consent.agree_label': 'मी व्हॉईस मुलाखतीसाठी संमती देत आहे आणि माझी माहिती फक्त सरकारी प्रशिक्षणासाठी वापरली जाईल हे मला मान्य आहे.',
    'consent.continue_btn': 'भाषा निवडीसाठी पुढे जा',

    'lang.back': 'संमतीवर परत जा',
    'lang.eyebrow': 'भाषा व बोली निवड',
    'lang.title': 'आपली बोलण्याची भाषा निवडा',
    'lang.desc': 'तुम्ही रोजच्या कामात ज्या भाषेत सहज बोलता ती भाषा निवडा.',
    'lang.autodetect_title': '⚡ आपोआप भाषा ओळखा (ऑटो डिटेक्ट)',
    'lang.autodetect_desc': 'आपल्या बोलीभाषेत बोला; सिस्टीम आपोआप भाषा समजून घेईल.',
    'lang.start_spoken': 'बोलणे सुरू करा',
    'lang.confirm_btn': 'भाषा निश्चित करा व पुढे जा',

    'interview.back_lang': 'भाषा बदला',
    'interview.help_officer': 'अधिकारी मदत',
    'interview.status_speaking': 'मदतनीस मराठीत बोलत आहे...',
    'interview.status_ready': 'उत्तर देण्यासाठी तयार. माईक दाबून बोला.',
    'interview.status_listening': 'ऐकत आहे... आपल्या कामाबद्दल बोला.',
    'interview.status_processing': 'आवाज समजून घेतला जात आहे...',
    'interview.mic_tap_speak': 'बोलण्यासाठी माईक दाबा',
    'interview.mic_recording': 'ऐकत आहे... बोलून झाल्यावर दाबा',
    'interview.repeat_prompt': 'प्रश्न पुन्हा ऐका',
    'interview.typing_placeholder': 'किंवा येथे लिहून उत्तर द्या...',
    'interview.send_text': 'उत्तर पाठवा',
    'interview.understood_slots': 'समजलेली कौशल्ये',
    'interview.complete_btn': 'मुलाखत पूर्ण • शिफारसी पहा',

    'confirm.back': 'मुलाखतीवर परत जा',
    'confirm.title': 'आपल्या माहितीची खात्री करा',
    'confirm.subtitle': 'सरकारी प्रशिक्षण योजनेशी जोडण्यापूर्वी माहिती तपासा.',
    'confirm.listen_summary': 'माहिती आवाजात ऐका',
    'confirm.occupation_title': 'मुख्य व्यवसाय आणि अनुभव:',
    'confirm.tools_title': 'माहिती असलेली अवजारे व यंत्रे:',
    'confirm.mobility_title': 'कामाचे पसंतीचे अंतर:',
    'confirm.training_title': 'प्रशिक्षणाची आवड:',
    'confirm.correct_btn': 'बदल करा',
    'confirm.generate_btn': 'माहिती बरोबर आहे • योजना पहा',

    'rec.banner_badge': 'NSQF कौशल्य जुळणी',
    'rec.banner_title': 'तुमच्यासाठी योग्य उपजीविका व प्रशिक्षण मार्ग',
    'rec.banner_desc': 'तुमचा अनुभव, कौशल्य आणि जिल्ह्यातील मागणीनुसार निवडलेले पर्याय.',
    'rec.listen_overview': 'शिफारसी आवाजात ऐका',
    'rec.why_title': 'आम्ही हे का निवडले',
    'rec.skills_title': 'कौशल्य आणि नवीन प्रशिक्षण',
    'rec.demand_title': 'जिल्ह्यातील मागणी आणि उत्पन्न',
    'rec.recognized_skills': 'मान्यताप्राप्त जुने कौशल्य:',
    'rec.bridge_skills': 'शिकवले जाणारे नवीन कौशल्य:',
    'rec.district_score': 'जिल्ह्यातील मागणी गुण:',
    'rec.vacancies': 'उपलब्ध नोकऱ्या:',
    'rec.starting_wage': 'अपेक्षित मासिक वेतन:',
    'rec.top_employers': 'प्रमुख स्थानिक कंपन्या:',
    'rec.nearest_center': 'जवळचे अधिकृत केंद्र:',
    'rec.seats_available': 'जागा उपलब्ध',
    'rec.next_batch': 'पुढील बॅच सुरुवात:',
    'rec.helpline': 'हेल्पलाईन नंबर:',
    'rec.new_assessment': 'नवीन मुलाखत सुरू करा',
    'rec.enroll_btn': 'मोफत PM-AJAY बॅचमध्ये प्रवेश घ्या (१-क्लिक)',
    'rec.enrolled_success': 'जिल्हा अधिकाऱ्यांना अर्ज पाठवला (SMS पाठवला आहे)',
    'rec.d3_title': 'जिल्ह्यातील नोकऱ्यांची मागणी (D3.js आलेख)',
    'rec.d3_sub': 'स्थानिक बाजारातील मागणी आणि वेतन पातळीची तुलना'
  },

  ta: {
    // Tamil
    'header.title': 'PM-AJAY குரல் வழி திட்டம்',
    'header.subtitle': 'குரல் வழி வாழ்வாதார மற்றும் திறன் சான்றிதழ் தளம்',
    'header.banner': 'PM-AJAY திறன் மற்றும் வாழ்வாதார அமைப்பு • தொகுதி IV',
    'header.dossier': 'செயல்திட்ட ஆவணம்',
    'header.spoken_intake': 'குரல் நேர்காணல்',
    'header.whatsapp': 'வாட்ஸ்அப் குரல் செய்தி',
    'header.kiosk': 'ஆஃப்லைன் கியோஸ்க்',
    'header.governance': 'நிர்வாக தளம்',
    'header.human_help': 'உதவி அதிகாரி',
    'header.role': 'பணிநிலை',
    'talkback.listen_screen': 'திரையை குரலில் கேளுங்கள் (TalkBack)',
    'talkback.speaking': 'திரை வாசிக்கப்படுகிறது...',
    'talkback.stop': 'ஒலியை நிறுத்து',
    'talkback.active': 'டாக்-பேக் செயலில் உள்ளது: எந்த பெட்டியையும் தட்டி குரலில் கேட்கலாம்',
    'talkback.enabled': 'குரல் வழிகாட்டி ஆன்',
    'talkback.disabled': 'குரல் வழிகாட்டி ஆஃப்',

    'landing.eyebrow': 'தேசிய திட்டம் • 12 இந்திய மொழிகள் • PM-AJAY',
    'landing.hero_title_1': 'உங்களுக்கு தெரிந்த வேலைகளை எங்களிடம் கூறுங்கள்.',
    'landing.hero_title_2': 'உங்களுக்கான சரியான திறன் வழியை நாங்கள் கண்டுபிடிப்போம்.',
    'landing.hero_desc': 'படிவங்கள் அல்லது டிஜிட்டல் தடைகள் இன்றி, உங்கள் தாய்மொழியில் அன்றாட வேலை அனுபவத்தை பேசுங்கள். எங்கள் குரல் தளம் உங்கள் அனுபவத்தை அரசு NSQF சான்றிதழ்கள், இலவச உதவித்தொகை மற்றும் வேலைவாய்ப்புகளுடன் இணைக்கிறது.',
    'landing.benchmarks': 'மாதிரி நேர்காணல்கள்:',
    'landing.welder': '6-வருட வெல்டர்',
    'landing.tailor': 'கிராமத்து தையல்காரர்',
    'landing.tractor': 'டிராக்டர் மெக்கானிக்',
    'landing.weaver': 'கைத்தறி நெசவாளர்',
    'landing.card_ivr_badge': 'தொலைபேசி அழைப்பு',
    'landing.card_ivr_title': 'குரல் வழி நேர்காணல்',
    'landing.card_ivr_desc': 'பிராந்திய மொழியில் எளிய உரையாடல். உங்கள் பழைய அனுபவங்கள் மற்றும் கருவிகளை துல்லியமாக புரிந்துகொள்ளும்.',
    'landing.card_ivr_b1': 'பேசும்போதே உடனடி ஒலி அலை பின்னூட்டம்',
    'landing.card_ivr_b2': 'எளிதான பின்தொடர் கேள்விகள் மூலம் தெளிவு',
    'landing.card_ivr_b3': 'சாதாரண போன் மற்றும் கட்டணமில்லா அழைப்பில் கிடைக்கும்',
    'landing.card_ivr_cta': 'குரல் அழைப்பைத் தொடங்குக',
    'landing.card_wa_badge': 'வாட்ஸ்அப்',
    'landing.card_wa_title': 'வாட்ஸ்அப் ஆடியோ நோட்ஸ்',
    'landing.card_wa_desc': 'வாட்ஸ்அப்பில் குரல் செய்தி அனுப்பி அரசு திறன் திட்ட பரிந்துரைகளை பெறுங்கள்.',
    'landing.card_wa_b1': 'ஆடியோ பதிவு செய்து அனுப்பும் வசதி',
    'landing.card_wa_b2': 'உடனடி பகுப்பாய்வு: ஆடியோ → சான்றிதழ் → திட்ட அட்டை',
    'landing.card_wa_b3': 'புதிய செயலியை பதிவிறக்க தேவையில்லை',
    'landing.card_wa_cta': 'வாட்ஸ்அப்பை திறக்கவும்',
    'landing.card_kiosk_badge': 'கிராம பஞ்சாயத்து மையம்',
    'landing.card_kiosk_title': 'ஆஃப்லைன் கியோஸ்க்',
    'landing.card_kiosk_desc': 'இணைய வசதி குறைந்த கிராமங்களுக்கான தொடுதிரை கியோஸ்க்.',
    'landing.card_kiosk_b1': 'எழுத்தறிவு குறைந்தோருக்கான பெரிய பொத்தான்கள்',
    'landing.card_kiosk_b2': 'ஆஃப்லைனில் சேமித்து பின் தானாக பதிவேற்றும் வசதி',
    'landing.card_kiosk_b3': 'கிராமப்புற பயனர்களுக்கு ஏற்றது',
    'landing.card_kiosk_cta': 'கியோஸ்கை தொடங்குக',
    'landing.gov_badge': 'மாவட்ட & மாநில PM-AJAY இயக்குநரகம்',
    'landing.gov_title': 'நிர்வாக மற்றும் திறன் கண்காணிப்பு தளம்',
    'landing.gov_desc': 'மாவட்ட அளவிலான வேலை தேவைகள், பயிற்சி மைய இடங்கள் மற்றும் உதவி கோரிக்கைகள்.',
    'landing.gov_cta': 'நிர்வாக தளத்தை திறக்கவும்',
    'landing.badge1_title': 'NSQF நிலைகள் 1–5',
    'landing.badge1_desc': 'தேசிய திறன் தர சான்றிதழ்',
    'landing.badge2_title': 'RPL நேரடி அங்கீகாரம்',
    'landing.badge2_desc': 'முந்தைய அனுபவத்திற்கு அரசு சான்றிதழ்',
    'landing.badge3_title': 'மாவட்ட தேவை',
    'landing.badge3_desc': 'சம்பளம் மற்றும் காலிப்பணியிட இணைப்பு',
    'landing.badge4_title': '15 கி.மீ எல்லைக்குள்',
    'landing.badge4_desc': 'அருகிலுள்ள அரசு பயிற்சி மையம்',

    'consent.back': 'முகப்புக்கு திரும்புக',
    'consent.badge': 'விதிகள் • PM-AJAY பிரிவு 4',
    'consent.title': 'பயனாளர் சம்மதம் மற்றும் தரவு பாதுகாப்பு',
    'consent.subtitle': 'திறன் மதிப்பீடு மற்றும் பாதுகாப்பு விதிகள்',
    'consent.audio_banner': 'சம்மத விவரத்தை தமிழில் கேளுங்கள்',
    'consent.audio_sub': 'குரலில் கேட்க கிளிக் செய்யவும்',
    'consent.audio_broadcasting': 'தமிழில் பேசப்படுகிறது...',
    'consent.statement': 'PM-AJAY திட்டத்தின் கீழ் உங்களுக்கு ஏற்ற திறன் பயிற்சி மற்றும் வாழ்வாதார வாய்ப்புகளை பரிந்துரைக்க, உங்கள் பணி அனுபவம் மற்றும் திறன் விவரங்களை பயன்படுத்த உங்களின் அனுமதியை பெறுகிறோம். இது முற்றிலும் பாதுகாப்பானது.',
    'consent.sec1': 'குரல் பதிவு மறைகுறியாக்கப்பட்டு அரசு விதிகளின்படி பாதுகாக்கப்படும்',
    'consent.sec2': 'அரசு பயிற்சி மற்றும் உதவித்தொகைக்கு மட்டுமே பயன்படுத்தப்படும்',
    'consent.sec3': 'நீங்கள் எப்போது வேண்டுமானாலும் மாவட்ட நிர்வாகம் மூலம் தகவலை நீக்கலாம்',
    'consent.agree_label': 'நான் குரல் நேர்காணலில் பங்கேற்க ஒப்புக்கொள்கிறேன், என் தகவல்கள் அரசு பயிற்சிகளுக்கு மட்டுமே பயன்படுத்தப்படும் என்பதை அறிவேன்.',
    'consent.continue_btn': 'மொழி தேர்வு செய்ய தொடரவும்',

    'lang.back': 'சம்மதத்திற்கு திரும்புக',
    'lang.eyebrow': 'மொழி தேர்வு',
    'lang.title': 'உங்கள் பேசும் மொழியை தேர்வு செய்யவும்',
    'lang.desc': 'உங்கள் வேலை அனுபவத்தை எளிதாக பேசக்கூடிய மொழியை தேர்ந்தெடுக்கவும்.',
    'lang.autodetect_title': '⚡ தானியங்கி மொழி கண்டறிதல்',
    'lang.autodetect_desc': 'உங்கள் மொழியில் பேசுங்கள்; சிஸ்டம் தானாகவே மொழியை கண்டறியும்.',
    'lang.start_spoken': 'பேசத் தொடங்குங்கள்',
    'lang.confirm_btn': 'மொழியை உறுதி செய்து தொடரவும்',

    'interview.back_lang': 'மொழியை மாற்றுக',
    'interview.help_officer': 'அதிகாரி உதவி',
    'interview.status_speaking': 'உதவியாளர் தமிழில் பேசுகிறார்...',
    'interview.status_ready': 'பதிலளிக்க தயார். மைக்கை தட்டி பேசுங்கள்.',
    'interview.status_listening': 'கேட்கிறது... உங்கள் வேலையைப் பற்றி பேசுங்கள்.',
    'interview.status_processing': 'குரல் பகுப்பாய்வு செய்யப்படுகிறது...',
    'interview.mic_tap_speak': 'பேச மைக்கை தட்டவும்',
    'interview.mic_recording': 'கேட்கிறது... பேசி முடித்ததும் தட்டவும்',
    'interview.repeat_prompt': 'கேள்வியை மீண்டும் கேளுங்கள்',
    'interview.typing_placeholder': 'அல்லது தமிழில் தட்டச்சு செய்யவும்...',
    'interview.send_text': 'பதிலை அனுப்புக',
    'interview.understood_slots': 'புரிந்துகொள்ளப்பட்ட திறன்கள்',
    'interview.complete_btn': 'நேர்காணல் முடிந்தது • பரிந்துரைகளை காண்க',

    'confirm.back': 'நேர்காணலுக்கு திரும்புக',
    'confirm.title': 'உங்கள் தகவல்களை சரிபார்க்கவும்',
    'confirm.subtitle': 'அரசு திட்டங்களுடன் இணைக்கும் முன் உங்கள் தகவல்களை உறுதிப்படுத்தவும்.',
    'confirm.listen_summary': 'முழு விவரத்தையும் குரலில் கேளுங்கள்',
    'confirm.occupation_title': 'முக்கிய தொழில் மற்றும் அனுபவம்:',
    'confirm.tools_title': 'தெரிந்த கருவிகள் மற்றும் இயந்திரங்கள்:',
    'confirm.mobility_title': 'வேலை செய்ய விரும்பும் தூரம்:',
    'confirm.training_title': 'பயிற்சி விருப்பம்:',
    'confirm.correct_btn': 'திருத்தம் செய்க',
    'confirm.generate_btn': 'தகவல்கள் சரி • அரசு திட்டங்களை காண்க',

    'rec.banner_badge': 'NSQF திறன் பொருத்தம்',
    'rec.banner_title': 'உங்களுக்கான சிறந்த திறன் மற்றும் வாழ்வாதார வழிகள்',
    'rec.banner_desc': 'உங்கள் அனுபவம், திறன் மற்றும் மாவட்ட வேலைவாய்ப்பு தேவையின் அடிப்படையில் தேர்ந்தெடுக்கப்பட்டது.',
    'rec.listen_overview': 'பரிந்துரைகளை குரலில் கேளுங்கள்',
    'rec.why_title': 'நாங்கள் இதை ஏன் பரிந்துரைத்தோம்',
    'rec.skills_title': 'திறன்கள் மற்றும் புதிய பயிற்சி',
    'rec.demand_title': 'மாவட்ட தேவை மற்றும் வருமானம்',
    'rec.recognized_skills': 'அங்கீகரிக்கப்பட்ட பழைய திறன்:',
    'rec.bridge_skills': 'புதிதாக கற்றுத்தரப்படும் திறன்:',
    'rec.district_score': 'மாவட்ட தேவை மதிப்பெண்:',
    'rec.vacancies': 'காலியிடங்கள்:',
    'rec.starting_wage': 'சராசரி தொடக்க சம்பளம்:',
    'rec.top_employers': 'முக்கிய உள்ளூர் நிறுவனங்கள்:',
    'rec.nearest_center': 'அருகிலுள்ள அங்கீகரிக்கப்பட்ட மையம்:',
    'rec.seats_available': 'இடங்கள் உள்ளன',
    'rec.next_batch': 'அடுத்த பேட்ச் ஆரம்பம்:',
    'rec.helpline': 'உதவி எண்:',
    'rec.new_assessment': 'புதிய நேர்காணலை தொடங்குக',
    'rec.enroll_btn': 'இலவச PM-AJAY வகுப்பில் சேரவும் (1-கிளிக்)',
    'rec.enrolled_success': 'மாவட்ட அதிகாரிக்கு விண்ணப்பம் அனுப்பப்பட்டது (SMS அனுப்பப்பட்டது)',
    'rec.d3_title': 'மாவட்ட வேலைவாய்ப்பு தேவை (D3.js வரைபடம்)',
    'rec.d3_sub': 'உள்ளூர் சந்தை தேவை மற்றும் சம்பள ஒப்பீடு'
  },

  te: {
    // Telugu
    'header.title': 'PM-AJAY వాయిస్ డాసియర్',
    'header.subtitle': 'వాయిస్-ఆధారిత జీవనోపాధి మరియు నైపుణ్య ధృవీకరణ వ్యవస్థ',
    'header.banner': 'PM-AJAY నైపుణ్య మరియు జీవనోపాధి విస్తరణ వ్యవస్థ • వాల్యూమ్ IV',
    'header.dossier': 'ఇంటరాక్టివ్ డాసియర్',
    'header.spoken_intake': 'వాయిస్ ఇంటర్వ్యూ',
    'header.whatsapp': 'వాట్సాప్ వాయిస్ నోట్స్',
    'header.kiosk': 'ఆఫ్‌లైన్ కియోస్క్',
    'header.governance': 'పాలనా విభాగం',
    'header.human_help': 'సహాయ అధికారి',
    'header.role': 'పాత్ర',
    'talkback.listen_screen': 'పూర్తి స్క్రీన్‌ను వినండి (TalkBack)',
    'talkback.speaking': 'స్క్రీన్ చదవబడుతోంది...',
    'talkback.stop': 'ఆపండి',
    'talkback.active': 'టాక్‌బ్యాక్ ఆన్‌లో ఉంది: ఏదైనా బాక్స్‌పై తాకి వాయిస్‌లో వినండి',
    'talkback.enabled': 'వాయిస్ గైడ్ ఆన్',
    'talkback.disabled': 'వాయిస్ గైడ్ ఆఫ్',

    'landing.eyebrow': 'జాతీయ కార్యక్రమం • 12 భారతీయ భాషలు • PM-AJAY',
    'landing.hero_title_1': 'మీకు తెలిసిన పని గురించి మాకు చెప్పండి.',
    'landing.hero_title_2': 'మేము మీకు సరైన ప్రభుత్వ నైపుణ్య శిక్షణను చూపిస్తాము.',
    'landing.hero_desc': 'ఎటువంటి ఫారమ్‌లు లేకుండా మీ మాతృభాషలో మాట్లాడండి. మీ అనుభవాన్ని ప్రభుత్వ NSQF సర్టిఫికెట్లు, ఉచిత స్టైపెండ్ మరియు స్థానిక ఉద్యోగ అవకాశాలతో అనుసంధానిస్తాము.',
    'landing.benchmarks': 'నమూనా డెమోలు:',
    'landing.welder': '6-సంవత్సరాల వెల్డర్',
    'landing.tailor': 'గ్రామ దర్జీ',
    'landing.tractor': 'ట్రాక్టర్ మెకానిక్',
    'landing.weaver': 'చేనేత కార్మికుడు',
    'landing.card_ivr_badge': 'ఫోన్ కాల్',
    'landing.card_ivr_title': 'వాయిస్ ఇంటర్వ్యూ (IVR)',
    'landing.card_ivr_desc': 'మీ ప్రాంతీయ భాషలో మాట్లాడండి. మీ పాత పని అనుభవం మరియు పనిముట్లను సులభంగా అర్థం చేసుకుంటుంది.',
    'landing.card_ivr_b1': 'మాట్లాడుతున్నప్పుడు ప్రత్యక్ష ఆడియో తరంగాలు',
    'landing.card_ivr_b2': 'సులభమైన ప్రశ్నల ద్వారా వివరాల గుర్తింపు',
    'landing.card_ivr_b3': 'సాధారణ ఫోన్‌లలో టోల్-ఫ్రీగా లభ్యం',
    'landing.card_ivr_cta': 'వాయిస్ కాల్ ప్రారంభించండి',
    'landing.card_wa_badge': 'వాట్సాప్',
    'landing.card_wa_title': 'వాట్సాప్ వాయిస్ సందేశాలు',
    'landing.card_wa_desc': 'వాట్సాప్‌లో వాయిస్ మెసేజ్ పంపి ప్రభుత్వ పథకాల కార్డులను పొందండి.',
    'landing.card_wa_b1': 'ఆడియో రికార్డ్ చేసి పంపే సౌలభ్యం',
    'landing.card_wa_b2': 'తక్షణ విశ్లేషణ: ఆడియో → గుర్తింపు → పథకం కార్డు',
    'landing.card_wa_b3': 'కొత్త యాప్ డౌన్‌లోడ్ చేయనవసరం లేదు',
    'landing.card_wa_cta': 'వాట్సాప్ తెరవండి',
    'landing.card_kiosk_badge': 'గ్రామ పంచాయతీ టెర్మినల్',
    'landing.card_kiosk_title': 'ఆఫ్‌లైన్ కియోస్క్',
    'landing.card_kiosk_desc': 'ఇంటర్నెట్ తక్కువగా ఉన్న గ్రామాల కోసం పెద్ద టచ్ స్క్రీన్ కియోస్క్.',
    'landing.card_kiosk_b1': 'నిరక్షరాస్యుల కోసం పెద్ద రంగుల బటన్లు',
    'landing.card_kiosk_b2': 'ఆఫ్‌లైన్‌లో భద్రపరిచి తర్వాత అప్‌లోడ్ చేసే సౌలభ్యం',
    'landing.card_kiosk_b3': 'గ్రామీణ పౌరులకు అనుకూలం',
    'landing.card_kiosk_cta': 'కియోస్క్ ప్రారంభించండి',
    'landing.gov_badge': 'జిల్లా మరియు రాష్ట్ర PM-AJAY డైరెక్టరేట్',
    'landing.gov_title': 'పరిపాలన మరియు నైపుణ్య పర్యవేక్షణ పోర్టల్',
    'landing.gov_desc': 'జిల్లాల వారీగా ఉద్యోగాల డిమాండ్ మరియు శిక్షణ కేంద్రాల వివరాలు.',
    'landing.gov_cta': 'పోర్టల్ తెరవండి',
    'landing.badge1_title': 'NSQF స్థాయిలు 1–5',
    'landing.badge1_desc': 'జాతీయ నైపుణ్య ప్రమాణ ధృవీకరణ',
    'landing.badge2_title': 'RPL వేగవంతమైన గుర్తింపు',
    'landing.badge2_desc': 'పాత అనుభవానికి ప్రభుత్వ గుర్తింపు',
    'landing.badge3_title': 'జిల్లాలో డిమాండ్',
    'landing.badge3_desc': 'జీతం మరియు ఖాళీల అనుసంధానం',
    'landing.badge4_title': '15 కి.మీ పరిధిలో',
    'landing.badge4_desc': 'సమీప ప్రభుత్వ శిక్షణ కేంద్రం',

    'consent.back': 'హోమ్‌కు తిరిగి వెళ్ళండి',
    'consent.badge': 'నిబంధనలు • PM-AJAY సెక్షన్ 4',
    'consent.title': 'లబ్ధిదారుల సమ్మతి మరియు డేటా భద్రత',
    'consent.subtitle': 'నైపుణ్య అంచనా మరియు భద్రతా నియమాలు',
    'consent.audio_banner': 'సమ్మతి వివరాలను తెలుగులో వినండి',
    'consent.audio_sub': 'వాయిస్‌లో వినడానికి ఇక్కడ తాకండి',
    'consent.audio_broadcasting': 'తెలుగులో చదవబడుతోంది...',
    'consent.statement': 'PM-AJAY పథకం కింద మీకు తగిన నైపుణ్య శిక్షణ మరియు ఉపాధి అవకాశాలను సిఫార్సు చేయడానికి, మీ పని అనుభవాన్ని సేకరించడానికి మీ సమ్మతిని కోరుతున్నాము. మీ సమాచారం పూర్తిగా సురక్షితంగా ఉంటుంది.',
    'consent.sec1': 'వాయిస్ రికార్డింగ్ ప్రభుత్వ నిబంధనల ప్రకారం సురక్షితం',
    'consent.sec2': 'ప్రభుత్వ శిక్షణ మరియు స్టైపెండ్ కోసం మాత్రమే ఉపయోగించబడుతుంది',
    'consent.sec3': 'మీరు ఎప్పుడైనా జిల్లా యంత్రాంగం ద్వారా సమాచారాన్ని తొలగించవచ్చు',
    'consent.agree_label': 'నేను వాయిస్ ఇంటర్వ్యూలో పాల్గొనడానికి అంగీకరిస్తున్నాను మరియు నా సమాచారం ప్రభుత్వ శిక్షణలకే ఉపయోగపడుతుందని అర్థం చేసుకున్నాను.',
    'consent.continue_btn': 'భాష ఎంచుకోవడానికి కొనసాగండి',

    'lang.back': 'సమ్మతికి తిరిగి వెళ్ళండి',
    'lang.eyebrow': 'భాష ఎంపిక',
    'lang.title': 'మీ మాట్లాడే భాషను ఎంచుకోండి',
    'lang.desc': 'మీరు పని గురించి సులభంగా మాట్లాడగలిగే మాతృభాషను ఎంచుకోండి.',
    'lang.autodetect_title': '⚡ ఆటో లాంగ్వేజ్ డిటెక్షన్',
    'lang.autodetect_desc': 'మీ భాషలో మాట్లాడండి; సిస్టమ్ స్వయంచాలకంగా గుర్తిస్తుంది.',
    'lang.start_spoken': 'మాట్లాడటం ప్రారంభించండి',
    'lang.confirm_btn': 'భాషను ధృవీకరించి కొనసాగండి',

    'interview.back_lang': 'భాషను మార్చండి',
    'interview.help_officer': 'అధికారి సహాయం',
    'interview.status_speaking': 'సహాయకుడు తెలుగులో మాట్లాడుతున్నారు...',
    'interview.status_ready': 'సమాధానం ఇవ్వడానికి సిద్ధంగా ఉంది. మైక్ తాకి మాట్లాడండి.',
    'interview.status_listening': 'వింటున్నాము... మీ పని గురించి మాట్లాడండి.',
    'interview.status_processing': 'వాయిస్‌ను విశ్లేషిస్తున్నాము...',
    'interview.mic_tap_speak': 'మాట్లాడటానికి మైక్ నొక్కండి',
    'interview.mic_recording': 'వింటున్నాము... పూర్తయిన తర్వాత నొక్కండి',
    'interview.repeat_prompt': 'ప్రశ్నను మళ్ళీ వినండి',
    'interview.typing_placeholder': 'లేదా ఇక్కడ టైప్ చేయండి...',
    'interview.send_text': 'సమాధానం పంపండి',
    'interview.understood_slots': 'గుర్తించబడిన నైపుణ్యాలు',
    'interview.complete_btn': 'ఇంటర్వ్యూ పూర్తయింది • సిఫార్సులు చూడండి',

    'confirm.back': 'ఇంటర్వ్యూకు తిరిగి వెళ్ళండి',
    'confirm.title': 'మీ సమాచారాన్ని ధృవీకరించండి',
    'confirm.subtitle': 'ప్రభుత్వ శిక్షణ పథకాలతో అనుసంధానించే ముందు వివరాలను తనిఖీ చేయండి.',
    'confirm.listen_summary': 'వివరాలను వాయిస్‌లో వినండి',
    'confirm.occupation_title': 'ప్రధాన వృత్తి మరియు అనుభవం:',
    'confirm.tools_title': 'తెలిసిన పనిముట్లు మరియు యంత్రాలు:',
    'confirm.mobility_title': 'పని చేయదలచిన దూరం:',
    'confirm.training_title': 'శిక్షణ ఆసక్తి:',
    'confirm.correct_btn': 'సవరించండి',
    'confirm.generate_btn': 'సమాచారం సరైనది • పథకాలు చూడండి',

    'rec.banner_badge': 'NSQF నైపుణ్య సరిపోలిక',
    'rec.banner_title': 'మీకు సరిపోయే జీవనోపాధి మరియు శిక్షణ మార్గాలు',
    'rec.banner_desc': 'మీ అనుభవం మరియు జిల్లాలో ఉద్యోగ డిమాండ్ ఆధారంగా ఎంపిక చేయబడ్డాయి.',
    'rec.listen_overview': 'సిఫార్సులను వాయిస్‌లో వినండి',
    'rec.why_title': 'మేము దీన్ని ఎందుకు ఎంచుకున్నాము',
    'rec.skills_title': 'నైపుణ్యాలు మరియు కొత్త శిక్షణ',
    'rec.demand_title': 'జిల్లాలో డిమాండ్ మరియు జీతం',
    'rec.recognized_skills': 'గుర్తించబడిన పాత నైపుణ్యం:',
    'rec.bridge_skills': 'కొత్తగా నేర్పించే నైపుణ్యం:',
    'rec.district_score': 'జిల్లా డిమాండ్ స్కోరు:',
    'rec.vacancies': 'ఉద్యోగ ఖాళీలు:',
    'rec.starting_wage': 'ప్రారంభ వేతనం:',
    'rec.top_employers': 'ప్రధాన స్థానిక సంస్థలు:',
    'rec.nearest_center': 'సమీప అధికారిక కేంద్రం:',
    'rec.seats_available': 'సీట్లు అందుబాటులో ఉన్నాయి',
    'rec.next_batch': 'తదుపరి బ్యాచ్ ప్రారంభం:',
    'rec.helpline': 'హెల్ప్‌లైన్ నంబర్:',
    'rec.new_assessment': 'కొత్త అంచనాను ప్రారంభించండి',
    'rec.enroll_btn': 'ఉచిత PM-AJAY బ్యాచ్‌లో చేరండి (1-క్లిక్)',
    'rec.enrolled_success': 'జిల్లా అధికారికి దరఖాస్తు పంపబడింది (SMS పంపబడింది)',
    'rec.d3_title': 'జిల్లాలో ఉద్యోగ డిమాండ్ (D3.js గ్రాఫ్)',
    'rec.d3_sub': 'స్థానిక మార్కెట్ డిమాండ్ మరియు జీతాల విశ్లేషణ'
  }
};

// Fallback resolver
export function t(key: string, language: SupportedLanguage = 'hi'): string {
  const langKey = language === 'auto' ? 'hi' : language;
  
  if (TRANSLATIONS[langKey] && TRANSLATIONS[langKey][key]) {
    return TRANSLATIONS[langKey][key];
  }
  
  // Hindi fallback
  if (TRANSLATIONS['hi'] && TRANSLATIONS['hi'][key]) {
    return TRANSLATIONS['hi'][key];
  }

  // English fallback
  if (TRANSLATIONS['en'] && TRANSLATIONS['en'][key]) {
    return TRANSLATIONS['en'][key];
  }

  return key;
}

// Generate complete screen spoken narration for TalkBack (for low-literacy users)
export function getScreenNarration(
  screenName: string, 
  language: SupportedLanguage = 'hi',
  context?: any
): string {
  const lang = language === 'auto' ? 'hi' : language;

  if (lang === 'bn') {
    switch (screenName) {
      case 'landing':
        return 'নমস্কার। এটি পিএম-অজয় ভয়েস ডসিয়ার। আপনি কোনো ফর্ম পূরণ না করেই নিজের মাতৃভাষায় কথা বলে সরকারি দক্ষতা প্রশিক্ষণ ও বৃত্তির সুযোগ পেতে পারেন। ভয়েস কল শুরু করতে নিচের সোনালী বোতামে চাপুন।';
      case 'beneficiary_consent':
        return 'এটি সম্মতি ও তথ্য সুরক্ষা পাতা। আপনার কাজের অভিজ্ঞতা সরকারি প্রশিক্ষণের জন্য সংরক্ষিত থাকবে। এগিয়ে যেতে নিচে সম্মতি দিয়ে এগিয়ে যাওয়ার বোতামটি চাপুন।';
      case 'beneficiary_language':
        return 'এখানে আপনার মুখের ভাষা বেছে নিন। বাংলা, হিন্দি বা অন্যান্য যেকোনো ভাষা বেছে নিয়ে নিচের নিশ্চিতকরণ বোতামটি চাপুন।';
      case 'beneficiary_interview':
        return 'এটি মৌখিক সাক্ষাৎকার পাতা। সহকারী আপনাকে বাংলায় প্রশ্ন করবে। উত্তর দিতে মাঝের বড় মাইক বোতামটি চেপে আপনার কাজ ও অভিজ্ঞতার কথা বলুন।';
      case 'beneficiary_confirm':
        return 'আপনার কাজের তথ্যের সারাংশ এখানে দেওয়া হয়েছে। তথ্য ঠিক থাকলে নিচের নিশ্চিত বোতামটি চাপুন।';
      case 'beneficiary_recommendations':
        return 'আপনার অভিজ্ঞতার ভিত্তিতে সরকারি প্রশিক্ষণের তালিকা প্রস্তুত। আপনার নিকটস্থ প্রশিক্ষণ কেন্দ্রে ভর্তি হতে বিনামূল্যে কোর্সে যোগ দিন বোতামে চাপুন।';
      default:
        return 'পিএম-অজয় দক্ষতা পোর্টাল। সহায়তার জন্য যে কোনো বিকল্পে চাপুন।';
    }
  }

  if (lang === 'ta') {
    switch (screenName) {
      case 'landing':
        return 'வணக்கம். இது PM-AJAY குரல் வழி திறன் போர்டல். நீங்கள் எந்த படிவமும் இன்றி உங்கள் தாய்மொழியில் பேசி அரசு பயிற்சி வாய்ப்புகளை பெறலாம். தொடங்க கீழே உள்ள பொத்தானை தட்டவும்.';
      case 'beneficiary_consent':
        return 'இது பயனாளி சம்மதப் பக்கம். உங்கள் தகவல்கள் அரசு பயிற்சிக்காக மட்டுமே பயன்படுத்தப்படும். தொடர சம்மதித்து முன்னேறவும்.';
      case 'beneficiary_language':
        return 'உங்கள் பேசும் மொழியை தேர்வு செய்யவும். தமிழ் அல்லது பிற மொழிகளை தேர்ந்தெடுத்து உறுதி செய்யவும்.';
      case 'beneficiary_interview':
        return 'இது குரல் நேர்காணல் பக்கம். மைக்கை தட்டி உங்கள் தொழில் மற்றும் அனுபவத்தை தமிழில் பேசுங்கள்.';
      case 'beneficiary_confirm':
        return 'உங்கள் வேலை விவரங்களின் சுருக்கம். விவரங்கள் சரியானவை என்றால் உறுதி செய்யவும்.';
      case 'beneficiary_recommendations':
        return 'உங்களுக்கான அரசு திறன் பயிற்சி பட்டியல் தயார். இலவச பயிற்சியில் சேர கீழே உள்ள பொத்தானை தட்டவும்.';
      default:
        return 'PM-AJAY குரல் தளம்.';
    }
  }

  if (lang === 'mr') {
    switch (screenName) {
      case 'landing':
        return 'नमस्ते. हे PM-AJAY व्हॉईस डॉसियर आहे. कोणत्याही फॉर्मशिवाय आपल्या मातृभाषेत बोलून सरकारी कौशल्य प्रशिक्षण मिळवा. सुरू करण्यासाठी खालील बटण दाबा.';
      case 'beneficiary_consent':
        return 'हे संमती व डेटा सुरक्षा पान आहे. आपली माहिती सुरक्षित राहील. पुढे जाण्यासाठी संमती द्या.';
      case 'beneficiary_language':
        return 'आपली भाषा निवडा आणि पुढे जाण्यासाठी बटण दाबा.';
      case 'beneficiary_interview':
        return 'हे तोंडी मुलाखतीचे पान आहे. माईक दाबून आपल्या कामाबद्दल बोला.';
      case 'beneficiary_confirm':
        return 'आपल्या कामाच्या माहितीची खात्री करा आणि सरकारी योजना पहा.';
      case 'beneficiary_recommendations':
        return 'आपल्यासाठी योग्य सरकारी प्रशिक्षण कोर्सेस तयार आहेत. मोफत प्रवेश घेण्यासाठी खालील बटण दाबा.';
      default:
        return 'PM-AJAY व्हॉईस डॉसियर पोर्टल.';
    }
  }

  if (lang === 'en') {
    switch (screenName) {
      case 'landing':
        return 'Welcome to PM-AJAY Voice Dossier. Speak naturally in your native language about your work to discover government NSQF skill courses and stipends. Tap the primary button to begin.';
      case 'beneficiary_consent':
        return 'Beneficiary consent screen. Your data is encrypted and used only for training matching. Check the agreement box to proceed.';
      case 'beneficiary_language':
        return 'Choose your spoken language or select auto-detect to enter the voice interview.';
      case 'beneficiary_interview':
        return 'Voice interview session. Listen to the assistant and tap the microphone to speak about your trade.';
      case 'beneficiary_confirm':
        return 'Review your understood profile. Confirm your details to generate tailored NSQF recommendations.';
      case 'beneficiary_recommendations':
        return 'Here are your matched NSQF livelihood pathways and nearest training centers. Tap enroll to submit your dossier.';
      default:
        return 'PM-AJAY Voice Skilling Portal.';
    }
  }

  // Default Hindi Narration
  switch (screenName) {
    case 'landing':
      return 'नमस्ते। यह पीएम-अजय वॉइस डॉसियर है। बिना किसी फॉर्म के अपनी भाषा में बोलकर सरकारी हुनर प्रशिक्षण और वजीफा पाएं। शुरू करने के लिए नीचे दिए गए बटन को दबाएं।';
    case 'beneficiary_consent':
      return 'यह लाभार्थी सहमति और डेटा सुरक्षा पृष्ठ है। आपकी जानकारी सरकारी प्रशिक्षण के लिए सुरक्षित रहेगी। आगे बढ़ने के लिए सहमति देकर बटन दबाएं।';
    case 'beneficiary_language':
      return 'अपनी बोलने की भाषा चुनें और आगे बढ़ने के लिए बटन दबाएं।';
    case 'beneficiary_interview':
      return 'यह बोलकर साक्षात्कार देने का पृष्ठ है। सवाल सुनकर बीच का बड़ा माइक बटन दबाएं और अपने काम के बारे में बोलें।';
    case 'beneficiary_confirm':
      return 'आपके काम की जानकारी का विवरण। यदि सब सही है तो पुष्टि करके सरकारी योजनाएं देखें।';
    case 'beneficiary_recommendations':
      return 'आपके हुनर के अनुसार सरकारी प्रशिक्षण और नौकरियों की सूची तैयार है। मुफ्त प्रवेश लेने के लिए नीचे दिए गए बटन पर दबाएं।';
    default:
      return 'पीएम-अजय कौशल एवं आजीविका प्रसार प्रणाली।';
  }
}

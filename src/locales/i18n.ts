import { LanguageOption, SupportedLanguage } from '../types';

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    script: 'Devanagari',
    speechCode: 'hi-IN',
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    script: 'Bengali',
    speechCode: 'bn-IN',
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    script: 'Latin',
    speechCode: 'en-IN',
  },
  {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    script: 'Devanagari',
    speechCode: 'mr-IN',
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    script: 'Tamil',
    speechCode: 'ta-IN',
  },
];

export interface LocaleStrings {
  appTitle: string;
  headerTitle: string;
  // Entry Screen
  heroTitle: string;
  heroSubtitle: string;
  tapToSpeak: string;
  startWithVoice: string;
  callIvrOption: string;
  worksWithoutInternet: string;
  designedForLowLiteracy: string;

  // Language Screen
  chooseLanguageHeader: string;
  whichLanguageTitle: string;
  whichLanguageSubtitle: string;
  autoDetectTitle: string;
  autoDetectSubtitle: string;
  speakToDetectBtn: string;
  detectingLanguage: string;
  languageDetected: (name: string) => string;
  autoDetectActiveBadge: string;
  continueBtn: string;
  changeLanguageLater: string;
  speakNormallyTip: string;

  // Consent Screen
  consentHeader: string;
  consentTitle: string;
  consentBody: string;
  consentSpokenPrompt: string;
  consentAgreeBtn: string;
  consentDeclineBtn: string;

  // Interview Screen
  interviewHeader: string;
  stepIndicator: (current: number, total: number) => string;
  defaultQuestionTitle: string;
  defaultQuestionSubtitle: string;
  listeningState: string;
  speakPrompt: string;
  answerInOwnWords: string;
  examplesTitle: string;
  examples: string[];
  skipRepeatBtn: string;
  interviewCompleteTitle: string;
  analyzingProfileMsg: string;

  // Offline Caching & Manual Sync
  offlineModeNotice: string;
  offlineStatusBadge: string;
  onlineSyncedBadge: string;
  unsyncedTurnsCount: (count: number) => string;
  syncRetryBtn: string;
  syncingProgress: string;
  syncSuccessToast: string;
  syncFailedToast: string;
  cachedProgressSavedLocally: string;
  resumeSavedInterviewBtn: string;
  resumeSavedInterviewNotice: string;
  discardSavedInterviewBtn: string;

  // Voice Upload & Audio Input
  uploadVoiceTitle: string;
  uploadVoiceSubtitle: string;
  uploadVoiceBtn: string;
  dragAndDropAudio: string;
  chooseAudioFile: string;
  transcribingAudio: string;
  transcribeAndSubmit: string;
  audioPreview: string;
  recordVoiceClip: string;
  stopRecording: string;
  audioUploadedSuccess: string;
  supportedAudioFormats: string;

  // Talkback controls
  talkBackHeader: string;
  talkBackSubtitle: string;
  actions: {
    hearAgain: { title: string; desc: string };
    repeatQuestion: { title: string; desc: string };
    speak: { title: string; desc: string };
    yes: { title: string; desc: string };
    no: { title: string; desc: string };
    goBack: { title: string; desc: string };
    slower: { title: string; desc: string };
    stopListening: { title: string; desc: string };
  };
  recommendedControlsNote: string;

  // Recommendations Screen
  recommendationsHeader: string;
  basedOnWhatYouToldMe: string;
  recommendationsSubtitle: string;
  bestMatchBadge: string;
  kmAway: (km: number) => string;
  seeTrainingCentersBtn: string;
  listenToOptionsTip: string;
  speakThisCard: string;
  estimatedDemand: (level: string) => string;

  // Center Detail Screen
  centerHeader: string;
  skillCenterTitle: string;
  travelEstimate: (km: number, mins: number) => string;
  nextBatchLabel: string;
  seatsAvailableLabel: (seats: number) => string;
  trainingSupportAvailable: string;
  whatHappensNextTitle: string;
  step1: string;
  step2: string;
  step3: string;
  confirmEnrollmentBtn: string;
  callMeBackBtn: string;
  enrollmentSuccessMsg: string;

  // Progress Screen
  myProgressHeader: string;
  currentStatusLabel: string;
  trainingInProgress: string;
  percentComplete: (pct: number) => string;
  enrollmentConfirmed: string;
  trainingStarted: string;
  trainingCompletedStep: (pct: number) => string;
  certificationStep: string;
  employmentFollowUpStep: string;
  upcomingStatus: string;
  todayStatus: string;
  postTrainingCallNote: string;
  updatesByVoiceNote: string;

  // Audio Screen Narrations (Auto-spoken when landing on screens)
  narrations: {
    entry: string;
    language: string;
    consent: string;
    interviewIntro: string;
    recommendations: string;
    center: string;
    progress: string;
    ivrWelcome: string;
  };
}

export const LOCALES: Record<SupportedLanguage, LocaleStrings> = {
  hi: {
    appTitle: 'पीएम-अजय वॉइस सहायक',
    headerTitle: 'पीएम-अजय वॉइस सहायक',
    heroTitle: 'अपने भविष्य के लिए सही हुनर खोजें।',
    heroSubtitle: 'कोई फॉर्म नहीं। कोई कठिन ऐप नहीं। बस अपनी भाषा में बोलकर बताएं।',
    tapToSpeak: 'बोलने के लिए दबाएं',
    startWithVoice: 'आवाज़ से शुरू करें',
    callIvrOption: 'आईवीआर कॉल / वॉइस नोट भेजें',
    worksWithoutInternet: 'कम नेटवर्क में भी काम करता है',
    designedForLowLiteracy: 'सरल आवाज़ आधारित डिज़ाइन',

    chooseLanguageHeader: 'अपनी भाषा चुनें',
    whichLanguageTitle: 'मैं आपसे किस भाषा में बात करूं?',
    whichLanguageSubtitle: 'आप अपनी क्षेत्रीय भाषा या बोली में सहजता से बोल सकते हैं।',
    autoDetectTitle: 'बोली पहचानें (Auto-Detect)',
    autoDetectSubtitle: 'किसी भी भाषा में बोलें — हम आपकी बोली समझ लेंगे',
    speakToDetectBtn: 'बोलकर भाषा पहचानें',
    detectingLanguage: 'भाषा पहचानी जा रही है...',
    languageDetected: (name: string) => `पहचानी गई भाषा: ${name}`,
    autoDetectActiveBadge: '⚡ ऑटो डिटेक्ट सक्रिय',
    continueBtn: 'आगे बढ़ें',
    changeLanguageLater: 'भाषा कभी भी बदली जा सकती है।',
    speakNormallyTip: 'सुझाव: सामान्य रूप से बोलें, आपको पढ़ने या लिखने की आवश्यकता नहीं है।',

    consentHeader: 'सहमति और गोपनीयता',
    consentTitle: 'क्या हम बातचीत शुरू कर सकते हैं?',
    consentBody: 'आपके लिए सबसे अच्छा सरकारी हुनर प्रशिक्षण खोजने के लिए, हम आपकी आवाज़ सुनकर आपकी जानकारी सुरक्षित रूप से दर्ज करेंगे।',
    consentSpokenPrompt: 'कृपया "हाँ" कहें या बटन दबाकर सहमति दें।',
    consentAgreeBtn: 'हाँ, मुझे स्वीकार है',
    consentDeclineBtn: 'नहीं, बाद में करेंगे',

    interviewHeader: 'आवाज़ से बातचीत',
    stepIndicator: (cur, tot) => `${cur} / ${tot}`,
    defaultQuestionTitle: 'अपने काम और अनुभव के बारे में बताएं।',
    defaultQuestionSubtitle: 'जैसे: खेती, सिलाई, ड्राइविंग, मरम्मत, दुकानदारी या कोई अन्य हुनर।',
    listeningState: 'सुन रहा हूँ...',
    speakPrompt: 'जितना चाहें उतनी देर आराम से बोलें।',
    answerInOwnWords: 'आप अपने शब्दों में जवाब दे सकते हैं।',
    examplesTitle: 'हम क्या पूछ सकते हैं:',
    examples: [
      'आप अभी क्या काम करते हैं?',
      'आपने काम करके क्या-क्या सीखा है?',
      'आप ट्रेनिंग के लिए कितनी दूर जा सकते हैं?',
    ],
    skipRepeatBtn: 'छोड़ें / सवाल दोहराएं',
    interviewCompleteTitle: 'जानकारी पूरी हो गई है!',
    analyzingProfileMsg: 'आपके हुनर के अनुसार सर्वोत्तम प्रशिक्षण खोजा जा रहा है...',

    offlineModeNotice: 'ऑफ़लाइन मोड: नेटवर्क उपलब्ध नहीं है। आपकी बातचीत डिवाइस पर सुरक्षित सेव हो रही है।',
    offlineStatusBadge: 'ऑफ़लाइन सेव मोड',
    onlineSyncedBadge: 'ऑनलाइन व सुरक्षित',
    unsyncedTurnsCount: (c) => `${c} उत्तर डिवाइस पर सेव हैं (अनसिंक्ड)`,
    syncRetryBtn: 'पुनः सिंक करें (Sync Now)',
    syncingProgress: 'सर्वर से सिंक हो रहा है...',
    syncSuccessToast: 'सत्र सफलतापूर्वक सिंक हो गया!',
    syncFailedToast: 'सिंक विफल रहा। कृपया इंटरनेट जांचकर पुनः प्रयास करें।',
    cachedProgressSavedLocally: 'आपका जवाब सुरक्षित स्थानीय मेमोरी में सेव कर लिया गया है।',
    resumeSavedInterviewBtn: 'पिछला अधूरा सत्र पुनः शुरू करें',
    resumeSavedInterviewNotice: 'आपका पिछला साक्षात्कार सुरक्षित है। क्या आप वहीं से आगे बढ़ना चाहते हैं?',
    discardSavedInterviewBtn: 'नया सत्र शुरू करें',

    uploadVoiceTitle: 'वॉइस नोट / ऑडियो रिकॉर्डिंग अपलोड करें',
    uploadVoiceSubtitle: 'अपने फोन या कंप्यूटर से रिकॉर्ड की गई आवाज़ या ऑडियो फाइल चुनें।',
    uploadVoiceBtn: 'वॉइस फाइल अपलोड करें',
    dragAndDropAudio: 'ऑडियो फाइल यहाँ खींचें और छोड़ें या चुनने के लिए टैप करें',
    chooseAudioFile: 'ऑडियो फाइल चुनें',
    transcribingAudio: 'एआई द्वारा आपकी आवाज़ का विश्लेषण किया जा रहा है...',
    transcribeAndSubmit: 'वॉइस नोट सबमिट करें',
    audioPreview: 'ऑडियो सुनें',
    recordVoiceClip: 'नया वॉइस क्लिप रिकॉर्ड करें',
    stopRecording: 'रिकॉर्डिंग रोकें',
    audioUploadedSuccess: 'वॉइस नोट सफलतापूर्वक अपलोड हो गया!',
    supportedAudioFormats: 'समर्थित फॉर्मेट: MP3, WAV, M4A, OGG, WebM, AAC (25 MB तक)',

    talkBackHeader: 'टॉक-बैक / आवाज़ नियंत्रण',
    talkBackSubtitle: 'छोटे, स्पष्ट आदेश। बड़ी बटन के साथ।',
    actions: {
      hearAgain: { title: 'फिर से सुनें', desc: 'पिछला बोला गया उत्तर दोबारा सुनें' },
      repeatQuestion: { title: 'सवाल दोहराएं', desc: 'सहायक से सवाल फिर पूछने को कहें' },
      speak: { title: 'बोलें', desc: 'अपनी आवाज़ में उत्तर देना शुरू करें' },
      yes: { title: 'हाँ', desc: 'पुष्टि करें या आगे बढ़ें' },
      no: { title: 'नहीं', desc: 'अस्वीकार करें या दूसरा विकल्प चुनें' },
      goBack: { title: 'पीछे जाएं', desc: 'पिछले कदम पर वापस जाएं' },
      slower: { title: 'धीरे बोलें', desc: 'सहायक की आवाज़ धीमी गति से सुनें' },
      stopListening: { title: 'सुनना बंद करें', desc: 'माइक को रोकें' },
    },
    recommendedControlsNote: 'सुझाव: फिर से सुनें • सवाल दोहराएं • बोलें • पीछे जाएं',

    recommendationsHeader: 'आपके लिए प्रशिक्षण सुझाव',
    basedOnWhatYouToldMe: 'आपकी बातचीत के आधार पर',
    recommendationsSubtitle: 'ये विकल्प आपके हुनर, यात्रा सीमा और स्थानीय रोज़गार की मांग से मेल खाते हैं।',
    bestMatchBadge: 'सबसे उत्तम मेल',
    kmAway: (km) => `प्रशिक्षण केंद्र ${km} किमी दूर`,
    seeTrainingCentersBtn: 'प्रशिक्षण केंद्र देखें',
    listenToOptionsTip: 'आप प्रत्येक विकल्प को आवाज़ में सुन सकते हैं',
    speakThisCard: 'इसे सुनें',
    estimatedDemand: (level) => `स्थानीय मांग: ${level === 'High' ? 'उच्च' : level === 'Medium' ? 'मध्यम' : 'उभरती'}`,

    centerHeader: 'प्रशिक्षण केंद्र',
    skillCenterTitle: 'पीएम-अजय कौशल विकास केंद्र',
    travelEstimate: (km, mins) => `${km} किमी • लगभग ${mins} मिनट`,
    nextBatchLabel: 'अगला बैच',
    seatsAvailableLabel: (seats) => `उपलब्ध सीटें: ${seats}`,
    trainingSupportAvailable: 'मुफ्त प्रशिक्षण व आवास सहायता उपलब्ध',
    whatHappensNextTitle: 'आगे क्या होगा?',
    step1: '1. अपनी रुचि दर्ज करें',
    step2: '2. हम आपका निःशुल्क दाखिला कराएंगे',
    step3: '3. केंद्र पर प्रशिक्षण शुरू करें',
    confirmEnrollmentBtn: 'दाखिला सहायता की पुष्टि करें',
    callMeBackBtn: 'मुझे वापस कॉल करें / सवाल पूछें',
    enrollmentSuccessMsg: 'आपकी रुचि दर्ज कर ली गई है! केंद्र समन्वयक आपसे संपर्क करेंगे।',

    myProgressHeader: 'मेरी प्रगति',
    currentStatusLabel: 'वर्तमान स्थिति',
    trainingInProgress: 'प्रशिक्षण जारी है',
    percentComplete: (pct) => `${pct}% पूरा हुआ`,
    enrollmentConfirmed: 'दाखिला पक्का हुआ',
    trainingStarted: 'प्रशिक्षण शुरू हुआ',
    trainingCompletedStep: (pct) => `${pct}% प्रशिक्षण पूर्ण`,
    certificationStep: 'प्रमाणपत्र परीक्षा',
    employmentFollowUpStep: 'रोज़गार व आजीविका सहायता',
    upcomingStatus: 'आगामी',
    todayStatus: 'आज',
    postTrainingCallNote: 'प्रशिक्षण के बाद हम रोज़गार के अवसर के लिए आपको कॉल करेंगे।',
    updatesByVoiceNote: 'सभी जानकारी और अपडेट आवाज़ से सुने जा सकते हैं।',

    narrations: {
      entry: 'पीएम-अजय वॉइस सहायक में आपका स्वागत है। अपने भविष्य के लिए सही हुनर खोजने के लिए बोलने वाले बटन को दबाएं।',
      language: 'कृपया वह भाषा चुनें जिसमें आप बात करना चाहते हैं। आप हिन्दी, बांग्ला, मराठी या तमिल चुन सकते हैं।',
      consent: 'नमस्ते! आपके लिए सही प्रशिक्षण योजना खोजने हेतु, क्या हम आपकी बातचीत को सुनकर दर्ज कर सकते हैं? कृपया हाँ कहें या बटन दबाएं।',
      interviewIntro: 'कृपया अपने काम और हुनर के बारे में बताएं। आप आराम से अपने शब्दों में बोल सकते हैं।',
      recommendations: 'आपकी बताई गई बातों के आधार पर हमने आपके लिए सबसे उपयुक्त प्रशिक्षण विकल्प चुने हैं। आप किसी भी विकल्प को सुन सकते हैं।',
      center: 'यह आपका नजदीकी पीएम-अजय कौशल केंद्र है। दाखिला सहायता के लिए नीचे दिए गए बटन पर दबाएं।',
      progress: 'यहाँ आपके प्रशिक्षण की वर्तमान प्रगति दिखाई दे रही है। आपका 60 प्रतिशत प्रशिक्षण पूरा हो चुका है।',
      ivrWelcome: 'नमस्ते, आप पीएम-अजय वॉइस हेल्पलाइन 1800 पर जुड़े हैं। अपना हुनर बताने के लिए बोलना शुरू करें।',
    },
  },

  bn: {
    appTitle: 'পিএম-অজয় ভয়েস সহকারী',
    headerTitle: 'পিএম-অজয় ভয়েস সহকারী',
    heroTitle: 'আপনার ভবিষ্যতের জন্য সঠিক দক্ষতা খুঁজুন।',
    heroSubtitle: 'কোনো ফর্ম নেই। কোনো জটিল অ্যাপ নেই। শুধু নিজের ভাষায় কথা বলুন।',
    tapToSpeak: 'কথা বলতে চাপুন',
    startWithVoice: 'কণ্ঠে শুরু করুন',
    callIvrOption: 'আইভিআর কল / ভয়েস নোট পাঠান',
    worksWithoutInternet: 'কম ইন্টারনেটেও সহজে চলে',
    designedForLowLiteracy: 'সহজ কণ্ঠভিত্তিক ব্যবস্থা',

    chooseLanguageHeader: 'ভাষা নির্বাচন করুন',
    whichLanguageTitle: 'আমি কোন ভাষায় কথা বলব?',
    whichLanguageSubtitle: 'আপনি আপনার আঞ্চলিক ভাষায় স্বাচ্ছন্দ্যে কথা বলতে পারেন।',
    autoDetectTitle: 'স্বয়ংক্রিয় ভাষা সনাক্তকরণ (Auto-Detect)',
    autoDetectSubtitle: 'যেকোনো ভাষায় কথা বলুন — আমরা আপনার ভাষা বুঝে নেব',
    speakToDetectBtn: 'কথা বলে ভাষা সনাক্ত করুন',
    detectingLanguage: 'ভাষা সনাক্ত করা হচ্ছে...',
    languageDetected: (name: string) => `সনাক্তকৃত ভাষা: ${name}`,
    autoDetectActiveBadge: '⚡ স্বয়ংক্রিয় সনাক্তকরণ সক্রিয়',
    continueBtn: 'এগিয়ে যান',
    changeLanguageLater: 'ভাষা যেকোনো সময় পরিবর্তন করা যাবে।',
    speakNormallyTip: 'পরামর্শ: স্বাভাবিকভাবে কথা বলুন, পড়তে বা টাইপ করতে হবে না।',

    consentHeader: 'সম্মতি ও গোপনীয়তা',
    consentTitle: 'আমরা কি কথা বলা শুরু করতে পারি?',
    consentBody: 'আপনার জন্য সেরা সরকারি প্রশিক্ষণ খুঁজে পেতে আপনার দক্ষতা সম্পর্কিত কথা রেকর্ড ও বিশ্লেষণ করার অনুমতি চাইছি।',
    consentSpokenPrompt: 'দয়া করে "হ্যাঁ" বলুন অথবা বোতাম টিপুন।',
    consentAgreeBtn: 'হ্যাঁ, আমি সম্মত',
    consentDeclineBtn: 'না, পরে করব',

    interviewHeader: 'কণ্ঠভিত্তিক সাক্ষাৎকার',
    stepIndicator: (cur, tot) => `${cur} / ${tot}`,
    defaultQuestionTitle: 'আপনার কাজ ও অভিজ্ঞতা সম্পর্কে বলুন।',
    defaultQuestionSubtitle: 'যেমন: চাষাবাদ, সেলাই, গাড়ি চালানো, মেরামত, দোকান বা অন্য কোনো কাজ।',
    listeningState: 'শুনছি...',
    speakPrompt: 'যতক্ষণ ইচ্ছা স্বাচ্ছন্দ্যে বলুন।',
    answerInOwnWords: 'আপনি নিজের ভাষায় উত্তর দিতে পারেন।',
    examplesTitle: 'আমরা যা জিজ্ঞাসা করতে পারি:',
    examples: [
      'আপনি এখন কী কাজ করেন?',
      'কাজের মাধ্যমে আপনি কী শিখেছেন?',
      'প্রশিক্ষণের জন্য আপনি কত দূর যেতে পারবেন?',
    ],
    skipRepeatBtn: 'এড়িয়ে যান / প্রশ্নটি পুনরাবৃত্তি করুন',
    interviewCompleteTitle: 'তথ্য সংগ্রহ সম্পন্ন!',
    analyzingProfileMsg: 'আপনার জন্য সেরা প্রশিক্ষণ পথ তৈরি করা হচ্ছে...',

    offlineModeNotice: 'অফলাইন মোড: ইন্টারনেট সংযোগ নেই। আপনার উত্তর ডিভাইসে সুরক্ষিতভাবে সংরক্ষিত হচ্ছে।',
    offlineStatusBadge: 'অফলাইন সেভ মোড',
    onlineSyncedBadge: 'অনলাইন ও সুরক্ষিত',
    unsyncedTurnsCount: (c) => `${c}টি উত্তর ডিভাইসে জমা আছে`,
    syncRetryBtn: 'এখনই সিঙ্ক করুন (Sync Now)',
    syncingProgress: 'সার্ভারের সাথে সিঙ্ক হচ্ছে...',
    syncSuccessToast: 'সেশন সফলভাবে সিঙ্ক হয়েছে!',
    syncFailedToast: 'সিঙ্ক ব্যর্থ হয়েছে। দয়া করে পুনরায় চেষ্টা করুন।',
    cachedProgressSavedLocally: 'আপনার উত্তর লোকাল স্টোরেজে সংরক্ষিত হয়েছে।',
    resumeSavedInterviewBtn: 'সংরক্ষিত সাক্ষাৎকার পুনরায় শুরু করুন',
    resumeSavedInterviewNotice: 'আপনার পূর্ববর্তী সাক্ষাৎকার সংরক্ষিত আছে। আপনি কি সেখান থেকেই চালিয়ে যেতে চান?',
    discardSavedInterviewBtn: 'নতুন সাক্ষাৎকার শুরু করুন',

    uploadVoiceTitle: 'ভয়েস নোট বা অডিও ফাইল আপলোড করুন',
    uploadVoiceSubtitle: 'আপনার মোবাইল বা কম্পিউটার থেকে রেকর্ড করা অডিও বেছে নিন।',
    uploadVoiceBtn: 'ভয়েস আপলোড করুন',
    dragAndDropAudio: 'অডিও ফাইল এখানে টেনে আনুন বা বেছে নিতে চাপুন',
    chooseAudioFile: 'অডিও ফাইল বেছে নিন',
    transcribingAudio: 'এআই দিয়ে আপনার কণ্ঠের কথা বিশ্লেষণ করা হচ্ছে...',
    transcribeAndSubmit: 'ভয়েস নোট জমা দিন',
    audioPreview: 'অডিও প্রিভিউ',
    recordVoiceClip: 'নতুন ভয়েস ক্লিপ রেকর্ড করুন',
    stopRecording: 'রেকর্ডিং থামান',
    audioUploadedSuccess: 'ভয়েস নোট সফলভাবে আপলোড হয়েছে!',
    supportedAudioFormats: 'সমর্থিত ফরম্যাট: MP3, WAV, M4A, OGG, WebM, AAC (২৫ এমবি পর্যন্ত)',

    talkBackHeader: 'টক-ব্যাক / ভয়েস নিয়ন্ত্রণ',
    talkBackSubtitle: 'সহজ ও স্পষ্ট নির্দেশ। বড় বোতাম সহ।',
    actions: {
      hearAgain: { title: 'আবার শুনুন', desc: 'শেষ উত্তরটি পুনরায় শুনুন' },
      repeatQuestion: { title: 'প্রশ্ন পুনরাবৃত্তি', desc: 'সহকারীকে প্রশ্নটি আবার বলতে বলুন' },
      speak: { title: 'বলুন', desc: 'আপনার ভয়েস উত্তর শুরু করুন' },
      yes: { title: 'হ্যাঁ', desc: 'নিশ্চিত করুন বা এগিয়ে যান' },
      no: { title: 'না', desc: 'বাতিল করুন বা অন্য বিকল্প বেছে নিন' },
      goBack: { title: 'পেছনে যান', desc: 'পূর্ববর্তী ধাপে ফিরে যান' },
      slower: { title: 'ধীরে বলুন', desc: 'সহকারীর কণ্ঠের গতি কমান' },
      stopListening: { title: 'শোনা বন্ধ করুন', desc: 'মাইক থামান' },
    },
    recommendedControlsNote: 'পরামর্শ: আবার শুনুন • প্রশ্ন পুনরাবৃত্তি • বলুন • পেছনে যান',

    recommendationsHeader: 'আপনার প্রশিক্ষণ সুপারিশ',
    basedOnWhatYouToldMe: 'আপনার দেওয়া তথ্যের ভিত্তিতে',
    recommendationsSubtitle: 'এই বিকল্পগুলি আপনার দক্ষতা, যাতায়াত সীমা এবং স্থানীয় কাজের চাহিদার সাথে মেলে।',
    bestMatchBadge: 'সেরা মিল',
    kmAway: (km) => `প্রশিক্ষণ কেন্দ্র ${km} কিমি দূরে`,
    seeTrainingCentersBtn: 'প্রশিক্ষণ কেন্দ্র দেখুন',
    listenToOptionsTip: 'আপনি প্রতিটি বিকল্প শুনে নিতে পারেন',
    speakThisCard: 'শুনুন',
    estimatedDemand: (level) => `স্থানীয় চাহিদা: ${level === 'High' ? 'উচ্চ' : level === 'Medium' ? 'মাঝারি' : 'উদীয়মান'}`,

    centerHeader: 'প্রশিক্ষণ কেন্দ্র',
    skillCenterTitle: 'পিএম-অজয় দক্ষতা কেন্দ্র',
    travelEstimate: (km, mins) => `${km} কিমি • প্রায় ${mins} মিনিট`,
    nextBatchLabel: 'পরবর্তী ব্যাচ',
    seatsAvailableLabel: (seats) => `আসন খালি আছে: ${seats}`,
    trainingSupportAvailable: 'বিনামূল্যে প্রশিক্ষণ ও সহায়তা উপলব্ধ',
    whatHappensNextTitle: 'এরপর কী হবে?',
    step1: '১. আপনার আগ্রহ নিশ্চিত করুন',
    step2: '২. আমরা আপনার ভর্তি সহায়তা করব',
    step3: '৩. কেন্দ্রে প্রশিক্ষণ শুরু করুন',
    confirmEnrollmentBtn: 'ভর্তি সহায়তার অনুরোধ পাঠান',
    callMeBackBtn: 'আমাকে কল ব্যাক করুন / প্রশ্ন আছে',
    enrollmentSuccessMsg: 'আপনার আগ্রহ সংরক্ষিত হয়েছে! প্রশিক্ষণ কেন্দ্রের সমন্বয়কারী শীঘ্রই যোগাযোগ করবেন।',

    myProgressHeader: 'আমার অগ্রগতি',
    currentStatusLabel: 'বর্তমান অবস্থা',
    trainingInProgress: 'প্রশিক্ষণ চলছে',
    percentComplete: (pct) => `${pct}% সম্পন্ন`,
    enrollmentConfirmed: 'ভর্তি নিশ্চিত হয়েছে',
    trainingStarted: 'প্রশিক্ষণ শুরু হয়েছে',
    trainingCompletedStep: (pct) => `${pct}% প্রশিক্ষণ সম্পন্ন`,
    certificationStep: 'সার্টিফিকেশন পরীক্ষা',
    employmentFollowUpStep: 'কর্মসংস্থান সহায়তা',
    upcomingStatus: 'আসন্ন',
    todayStatus: 'আজ',
    postTrainingCallNote: 'প্রশিক্ষণের পর চাকরির সুযোগ নিয়ে আমরা আপনাকে কল করব।',
    updatesByVoiceNote: 'সব আপডেট কণ্ঠে শোনা যাবে।',

    narrations: {
      entry: 'পিএম-অজয় ভয়েস সহকারীতে স্বাগতম। আপনার সঠিক জীবিকা প্রশিক্ষণ খুঁজে পেতে কথা বলার বোতামে চাপুন।',
      language: 'দয়া করে আপনার পছন্দের ভাষা নির্বাচন করুন। আপনি বাংলা, হিন্দি, মারাঠি বা তামিল বেছে নিতে পারেন।',
      consent: 'নমস্কার! আপনার জন্য উপযুক্ত সরকারি প্রশিক্ষণ খুঁজতে আমরা কি আপনার কথা শুনতে পারি? হ্যাঁ বলুন বা বোতাম চাপুন।',
      interviewIntro: 'আপনার কাজ ও পূর্ব অভিজ্ঞতা সম্পর্কে বলুন। যেকোনো কথা নিজের ভাষায় বলতে পারেন।',
      recommendations: 'আপনার কথার ভিত্তিতে আমরা সেরা প্রশিক্ষণ সুপারিশ প্রস্তুত করেছি। যেকোনো বিকল্প শুনুন।',
      center: 'এটি আপনার নিকটবর্তী পিএম-অজয় প্রশিক্ষণ কেন্দ্র। ভর্তির জন্য নিচের বোতাম চাপুন।',
      progress: 'এখানে আপনার প্রশিক্ষণের অগ্রগতি দেখা যাচ্ছে। আপনার ষাট শতাংশ প্রশিক্ষণ সম্পন্ন হয়েছে।',
      ivrWelcome: 'নমস্কার, পিএম-অজয় হেল্পলাইনে যুক্ত হয়েছেন। নিজের অভিজ্ঞতা সম্পর্কে বলুন।',
    },
  },

  mr: {
    appTitle: 'पीएम-अजय व्हॉइस सहाय्यक',
    headerTitle: 'पीएम-अजय व्हॉइस सहाय्यक',
    heroTitle: 'आपल्या भविष्यासाठी योग्य कौशल्य शोधा.',
    heroSubtitle: 'कोणताही फॉर्म नाही. सोप्या पद्धतीने आपल्या भाषेत बोला.',
    tapToSpeak: 'बोलण्यासाठी दाबा',
    startWithVoice: 'आवाजाने सुरू करा',
    callIvrOption: 'IVR कॉल / व्हॉइस नोट पाठवा',
    worksWithoutInternet: 'कमी इंटरनेटवरही चालते',
    designedForLowLiteracy: 'सोपे व्हॉइस-आधारित डिझाईन',

    chooseLanguageHeader: 'भाषा निवडा',
    whichLanguageTitle: 'मी कोणत्या भाषेत बोलावे?',
    whichLanguageSubtitle: 'तुम्ही तुमच्या स्थानिक भाषेत किंवा बोलीभाषेत बोलू शकता.',
    autoDetectTitle: 'स्वयं भाषा ओळखा (Auto-Detect)',
    autoDetectSubtitle: 'कोणत्याही भाषेत बोला — आम्ही तुमची बोली आपोआप ओळखू',
    speakToDetectBtn: 'बोलून भाषा ओळखा',
    detectingLanguage: 'भाषा ओळखली जात आहे...',
    languageDetected: (name: string) => `ओळखलेली भाषा: ${name}`,
    autoDetectActiveBadge: '⚡ ऑटो डिटेक्ट सक्रिय',
    continueBtn: 'पुढे जा',
    changeLanguageLater: 'भाषा नंतरही बदलता येईल.',
    speakNormallyTip: 'टीप: नेहमीसारखे बोला, वाचण्याची किंवा टाईप करण्याची गरज नाही.',

    consentHeader: 'संमती आणि गोपनीयता',
    consentTitle: 'आपण संभाषण सुरू करू शकतो का?',
    consentBody: 'योग्य कौशल्य प्रशिक्षण शोधण्यासाठी आम्ही तुमचे बोलणे समजून घेण्याची संमती मागत आहोत.',
    consentSpokenPrompt: 'कृपया "होय" म्हणा किंवा बटण दाबा.',
    consentAgreeBtn: 'होय, मला मान्य आहे',
    consentDeclineBtn: 'नाही, नंतर पाहू',

    interviewHeader: 'व्हॉइस मुलाखत',
    stepIndicator: (cur, tot) => `${cur} / ${tot}`,
    defaultQuestionTitle: 'तुमच्या कामाबद्दल व कौशल्याबद्दल सांगा.',
    defaultQuestionSubtitle: 'उदा. शेती, शिलाई काम, ड्रायव्हिंग, दुरुस्ती, विक्री किंवा इतर कौशल्य.',
    listeningState: 'ऐकत आहे...',
    speakPrompt: 'हवे तितका वेळ आरामात बोला.',
    answerInOwnWords: 'तुम्ही तुमच्या स्वतःच्या शब्दात उत्तर देऊ शकता.',
    examplesTitle: 'आम्ही काय विचारू शकतो:',
    examples: [
      'तुम्ही सध्या काय काम करता?',
      'तुम्ही कामातून काय शिकलात?',
      'प्रशिक्षणासाठी तुम्ही किती लांब जाऊ शकता?',
    ],
    skipRepeatBtn: 'पुढे जा / प्रश्न पुन्हा विचारा',
    interviewCompleteTitle: 'माहिती पूर्ण झाली!',
    analyzingProfileMsg: 'तुमच्या कौशल्यानुसार योग्य प्रशिक्षण शोधले जात आहे...',

    offlineModeNotice: 'ऑफलाइन मोड: इंटरनेट उपलब्ध नाही. तुमची उत्तरे फोनमध्ये सुरक्षित सेव्ह होत आहेत.',
    offlineStatusBadge: 'ऑफलाइन सेव्ह मोड',
    onlineSyncedBadge: 'ऑनलाइन व सुरक्षित',
    unsyncedTurnsCount: (c) => `${c} उत्तरे फोनमध्ये सेव्ह आहेत (असिंक)`,
    syncRetryBtn: 'आता सिंक करा (Sync Now)',
    syncingProgress: 'सर्व्हरशी सिंक होत आहे...',
    syncSuccessToast: 'माहिती यशस्वीरित्या सिंक झाली!',
    syncFailedToast: 'सिंक अयशस्वी. कृपया इंटरनेट तपासून पुन्हा प्रयत्न करा.',
    cachedProgressSavedLocally: 'तुमचे उत्तर सुरक्षितपणे लोकल मेमरीमध्ये सेव्ह केले आहे.',
    resumeSavedInterviewBtn: 'मागील सेव्ह केलेले संभाषण सुरू करा',
    resumeSavedInterviewNotice: 'तुमचे मागील संभाषण सेव्ह आहे. तुम्हाला तिथूनच पुढे सुरू ठेवायचे आहे का?',
    discardSavedInterviewBtn: 'नवीन संभाषण सुरू करा',

    uploadVoiceTitle: 'व्हॉइस नोट / ऑडिओ रेकॉर्डिंग अपलोड करा',
    uploadVoiceSubtitle: 'तुमच्या फोन किंवा कॉम्प्युटरवरून रेकॉर्ड केलेला ऑडिओ निवडा.',
    uploadVoiceBtn: 'व्हॉइस ऑडिओ अपलोड करा',
    dragAndDropAudio: 'ऑडिओ फाइल येथे ड्रॅग करा किंवा निवडण्यासाठी टॅप करा',
    chooseAudioFile: 'ऑडिओ फाइल निवडा',
    transcribingAudio: 'एआय द्वारे तुमच्या आवाजाचे विश्लेषण केले जात आहे...',
    transcribeAndSubmit: 'व्हॉइस नोट सबमिट करा',
    audioPreview: 'ऑडिओ ऐका',
    recordVoiceClip: 'नवीन व्हॉइस क्लिप रेकॉर्ड करा',
    stopRecording: 'रेकॉर्डिंग थांबवा',
    audioUploadedSuccess: 'व्हॉइस नोट यशस्वीरीत्या अपलोड झाली!',
    supportedAudioFormats: 'समर्थित फॉरमॅट: MP3, WAV, M4A, OGG, WebM, AAC (25 MB पर्यंत)',

    talkBackHeader: 'टॉक-बॅक / व्हॉइस नियंत्रणे',
    talkBackSubtitle: 'लहान, स्पष्ट आज्ञा. मोठ्या बटणांसह.',
    actions: {
      hearAgain: { title: 'पुन्हा ऐका', desc: 'शेवटचे बोललेले उत्तर पुन्हा ऐका' },
      repeatQuestion: { title: 'प्रश्न पुन्हा सांगा', desc: 'सहाय्यकाला प्रश्न पुन्हा सांगण्यास सांगा' },
      speak: { title: 'बोला', desc: 'तुमचे व्हॉइस उत्तर सुरू करा' },
      yes: { title: 'होय', desc: 'पुष्टी करा किंवा पुढे जा' },
      no: { title: 'नाही', desc: 'नकार द्या किंवा दुसरा पर्याय निवडा' },
      goBack: { title: 'मागे जा', desc: 'मागील पायरीवर परत जा' },
      slower: { title: 'हळू बोला', desc: 'सहाय्यकाचा आवाज हळू ऐका' },
      stopListening: { title: 'ऐकणे थांबवा', desc: 'माईक बंद करा' },
    },
    recommendedControlsNote: 'शिफारस: पुन्हा ऐका • प्रश्न पुन्हा सांगा • बोला • मागे जा',

    recommendationsHeader: 'तुमच्यासाठी शिफारसी',
    basedOnWhatYouToldMe: 'तुम्ही दिलेल्या माहितीच्या आधारे',
    recommendationsSubtitle: 'हे पर्याय तुमचे कौशल्य, प्रवासाची मर्यादा आणि स्थानिक मागणीशी जुळतात.',
    bestMatchBadge: 'सर्वोत्तम पर्याय',
    kmAway: (km) => `प्रशिक्षण केंद्र ${km} किमी अंतरावर`,
    seeTrainingCentersBtn: 'प्रशिक्षण केंद्र पहा',
    listenToOptionsTip: 'तुम्ही प्रत्येक पर्याय ऐकू शकता',
    speakThisCard: 'ऐका',
    estimatedDemand: (level) => `स्थानिक मागणी: ${level === 'High' ? 'जास्त' : level === 'Medium' ? 'मध्यम' : 'वाढती'}`,

    centerHeader: 'प्रशिक्षण केंद्र',
    skillCenterTitle: 'पीएम-अजय कौशल्य केंद्र',
    travelEstimate: (km, mins) => `${km} किमी • सुमारे ${mins} मिनिटे`,
    nextBatchLabel: 'पुढील बॅच',
    seatsAvailableLabel: (seats) => `उपलब्ध जागा: ${seats}`,
    trainingSupportAvailable: 'मोफत प्रशिक्षण व सहाय्य उपलब्ध',
    whatHappensNextTitle: 'पुढे काय होईल?',
    step1: '१. तुमची आवड नोंदवा',
    step2: '२. आम्ही प्रवेश मिळवून देऊ',
    step3: '३. केंद्रावर प्रशिक्षण सुरू करा',
    confirmEnrollmentBtn: 'प्रवेश मदतीची पुष्टी करा',
    callMeBackBtn: 'मला कॉल करा / प्रश्न विचारा',
    enrollmentSuccessMsg: 'तुमची नोंदणी यशस्वी झाली आहे! केंद्र समन्वयक लवकरच संपर्क साधतील.',

    myProgressHeader: 'माझी प्रगती',
    currentStatusLabel: 'सध्याची स्थिती',
    trainingInProgress: 'प्रशिक्षण सुरू आहे',
    percentComplete: (pct) => `${pct}% पूर्ण`,
    enrollmentConfirmed: 'प्रवेश निश्चित झाला',
    trainingStarted: 'प्रशिक्षण सुरू झाले',
    trainingCompletedStep: (pct) => `${pct}% प्रशिक्षण पूर्ण`,
    certificationStep: 'प्रमाणपत्र परीक्षा',
    employmentFollowUpStep: 'रोजगार सहाय्य',
    upcomingStatus: 'आगामी',
    todayStatus: 'आज',
    postTrainingCallNote: 'प्रशिक्षणानंतर आम्ही नोकरी किंवा व्यवसायासाठी कॉल करू.',
    updatesByVoiceNote: 'सर्व अपडेट्स आवाजात ऐकले जाऊ शकतात.',

    narrations: {
      entry: 'पीएम-अजय व्हॉइस सहाय्यकामध्ये आपले स्वागत आहे. योग्य कौशल्य शोधण्यासाठी बोलण्याचे बटण दाबा.',
      language: 'कृपया आपली भाषा निवडा. तुम्ही मराठी, हिंदी, बंगाली किंवा तमिळ निवडू शकता.',
      consent: 'योग्य सरकारी प्रशिक्षण शोधण्यासाठी आम्ही तुमचे बोलणे नोंदवू शकतो का? कृपया होय म्हणा किंवा बटण दाबा.',
      interviewIntro: 'कृपया तुमच्या कामाबद्दल आणि कौशल्याबद्दल सांगा. तुम्ही मोकळेपणाने बोलू शकता.',
      recommendations: 'तुमच्या कौशल्यानुसार आम्ही सर्वोत्तम प्रशिक्षण पर्याय निवडले आहेत. तुम्ही ते ऐकू शकता.',
      center: 'हे तुमचे जवळचे पीएम-अजय कौशल्य केंद्र आहे. प्रवेशासाठी खालील बटण दाबा.',
      progress: 'येथे तुमची प्रशिक्षण प्रगती दिसत आहे. तुमचे साठ टक्के प्रशिक्षण पूर्ण झाले आहे.',
      ivrWelcome: 'नमस्कार, पीएम-अजय हेल्पलाईनवर आपले स्वागत आहे. आपले कौशल्य सांगा.',
    },
  },

  ta: {
    appTitle: 'பிஎம்-அஜய் குரல் உதவியாளர்',
    headerTitle: 'பிஎம்-அஜய் குரல் உதவியாளர்',
    heroTitle: 'உங்கள் எதிர்காலத்திற்கான சரியான திறனைக் கண்டறியவும்.',
    heroSubtitle: 'படிவங்கள் இல்லை. சிக்கலான செயலிகள் இல்லை. உங்கள் மொழியில் பேசினால் போதும்.',
    tapToSpeak: 'பேச தட்டவும்',
    startWithVoice: 'குரல் மூலம் தொடங்குங்கள்',
    callIvrOption: 'IVR அழைப்பு / குரல் குறிப்பு அனுப்பவும்',
    worksWithoutInternet: 'குறைந்த இணையத்திலும் இயங்கும்',
    designedForLowLiteracy: 'எளிய குரல் சார்ந்த வடிவமைப்பு',

    chooseLanguageHeader: 'மொழியைத் தேர்ந்தெடுக்கவும்',
    whichLanguageTitle: 'நான் எந்த மொழியில் பேச வேண்டும்?',
    whichLanguageSubtitle: 'உங்கள் பிராந்திய மொழியிலேயே இயல்பாகப் பேசலாம்.',
    autoDetectTitle: 'தானியங்கி மொழி கண்டறிதல் (Auto-Detect)',
    autoDetectSubtitle: 'எந்த மொழியிலும் பேசுங்கள் — உங்கள் பேச்சு வழக்கை தானாக கண்டறிவோம்',
    speakToDetectBtn: 'பேசி மொழியைக் கண்டறியவும்',
    detectingLanguage: 'மொழி கண்டறியப்படுகிறது...',
    languageDetected: (name: string) => `கண்டறியப்பட்ட மொழி: ${name}`,
    autoDetectActiveBadge: '⚡ தானியங்கி மொழி இயக்கம்',
    continueBtn: 'தொடரவும்',
    changeLanguageLater: 'மொழியை எப்போது வேண்டுமானாலும் மாற்றலாம்.',
    speakNormallyTip: 'குறிப்பு: சாதாரணமாகப் பேசுங்கள், படிக்கவோ தட்டச்சு செய்யவோ தேவையில்லை.',

    consentHeader: 'ஒப்புதல் மற்றும் தனியுரிமை',
    consentTitle: 'நாம் உரையாடலைத் தொடங்கலாமா?',
    consentBody: 'உங்களுக்கு ஏற்ற அரசு பயிற்சி திட்டத்தை கண்டறிய உங்கள் குரல் விவரங்களை பதிவு செய்ய ஒப்புதல் தேவை.',
    consentSpokenPrompt: 'தயவுசெய்து "ஆம்" என்று கூறவும் அல்லது பொத்தானை அழுத்தவும்.',
    consentAgreeBtn: 'ஆம், நான் ஒப்புக்கொள்கிறேன்',
    consentDeclineBtn: 'இல்லை, பிறகு பார்க்கலாம்',

    interviewHeader: 'குரல் நேர்காணல்',
    stepIndicator: (cur, tot) => `${cur} / ${tot}`,
    defaultQuestionTitle: 'உங்கள் பணி மற்றும் திறன்கள் பற்றி கூறுங்கள்.',
    defaultQuestionSubtitle: 'எடுத்துக்காட்டாக: விவசாயம், தையல், ஓட்டுநர், பழுதுபார்த்தல் அல்லது ஏதேனும் தொழில்.',
    listeningState: 'கேட்கிறது...',
    speakPrompt: 'எவ்வளவு நேரம் வேண்டுமானாலும் நிதானமாகப் பேசுங்கள்.',
    answerInOwnWords: 'உங்கள் சொந்த வார்த்தைகளில் பதிலளிக்கலாம்.',
    examplesTitle: 'நாங்கள் கேட்கக்கூடிய கேள்விகள்:',
    examples: [
      'நீங்கள் இப்போது என்ன வேலை செய்கிறீர்கள்?',
      'பணி அனுபவத்தின் மூலம் என்ன கற்றுக்கொண்டீர்கள்?',
      'பயிற்சிக்கு நீங்கள் எவ்வளவு தூரம் பயணிக்க முடியும்?',
    ],
    skipRepeatBtn: 'தவிர் / கேள்வியை மீண்டும் கேட்கவும்',
    interviewCompleteTitle: 'விவரங்கள் பெறப்பட்டன!',
    analyzingProfileMsg: 'உங்களுக்கான சிறந்த பயிற்சி வழிகள் ஆராயப்படுகின்றன...',

    offlineModeNotice: 'ஆஃப்லைன் முறை: இணைய இணைப்பு இல்லை. உங்கள் குரல் பதில் சாதனத்தில் பாதுகாப்பாக சேமிக்கப்படுகிறது.',
    offlineStatusBadge: 'ஆஃப்லைன் சேமிப்பு முறை',
    onlineSyncedBadge: 'ஆன்லைனில் இணைக்கப்பட்டுள்ளது',
    unsyncedTurnsCount: (c) => `${c} பதில்கள் சாதனத்தில் சேமிக்கப்பட்டுள்ளன`,
    syncRetryBtn: 'இப்போது ஒத்திசைக்கவும் (Sync Now)',
    syncingProgress: 'ஒத்திசைக்கப்படுகிறது...',
    syncSuccessToast: 'வெற்றிகரமாக ஒத்திசைக்கப்பட்டது!',
    syncFailedToast: 'ஒத்திசைவு தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.',
    cachedProgressSavedLocally: 'உங்கள் பதில் சாதனத்தில் பாதுகாப்பாக சேமிக்கப்பட்டுள்ளது.',
    resumeSavedInterviewBtn: 'சேமிக்கப்பட்ட நேர்காணலைத் தொடரவும்',
    resumeSavedInterviewNotice: 'உங்கள் முந்தைய நேர்காணல் சேமிக்கப்பட்டுள்ளது. அதைத் தொடர விரும்புகிறீர்களா?',
    discardSavedInterviewBtn: 'புதிய நேர்காணலைத் தொடங்கவும்',

    uploadVoiceTitle: 'குரல் பதிவு / ஆடியோ கோப்பை பதிவேற்றவும்',
    uploadVoiceSubtitle: 'உங்கள் தொலைபேசி அல்லது கணினியிலிருந்து பதிவு செய்த ஆடியோவை தேர்வு செய்யவும்.',
    uploadVoiceBtn: 'குரல் ஆடியோ பதிவேற்றவும்',
    dragAndDropAudio: 'ஆடியோ கோப்பை இங்கே இழுத்து விடவும் அல்லது தேர்ந்தெடுக்க தட்டவும்',
    chooseAudioFile: 'ஆடியோ கோப்பைத் தேர்ந்தெடுக்கவும்',
    transcribingAudio: 'ஏஐ மூலம் உங்கள் குரல் பகுப்பாய்வு செய்யப்படுகிறது...',
    transcribeAndSubmit: 'குரல் பதிவை சமர்ப்பிக்கவும்',
    audioPreview: 'ஆடியோ முன்னோட்டம்',
    recordVoiceClip: 'புதிய குரல் பதிவை பதிவு செய்யவும்',
    stopRecording: 'பதிவை நிறுத்தவும்',
    audioUploadedSuccess: 'குரல் பதிவு வெற்றிகரமாக பதிவேற்றப்பட்டது!',
    supportedAudioFormats: 'ஆதரிக்கப்படும் வடிவங்கள்: MP3, WAV, M4A, OGG, WebM, AAC (25 MB வரை)',

    talkBackHeader: 'டாக்-பேக் / குரல் கட்டுப்பாடுகள்',
    talkBackSubtitle: 'சுருக்கமான, தெளிவான கட்டளைகள். பெரிய பொத்தான்களுடன்.',
    actions: {
      hearAgain: { title: 'மீண்டும் கேளுங்கள்', desc: 'கடைசி பதிலை மீண்டும் கேளுங்கள்' },
      repeatQuestion: { title: 'கேள்வியை மீண்டும் சொல்லவும்', desc: 'உதவியாளரை கேள்வியை மீண்டும் கேட்க சொல்லவும்' },
      speak: { title: 'பேசுங்கள்', desc: 'உங்கள் குரல் பதிலை தொடங்கவும்' },
      yes: { title: 'ஆம்', desc: 'உறுதிப்படுத்தவும் அல்லது தொடரவும்' },
      no: { title: 'இல்லை', desc: 'நிராகரிக்கவும் அல்லது மற்றொரு தேர்வை எடுக்கவும்' },
      goBack: { title: 'பின்னே செல்லவும்', desc: 'முந்தைய படிக்கு திரும்பவும்' },
      slower: { title: 'மெதுவாக பேசவும்', desc: 'உதவியாளரின் வேகத்தைக் குறைக்கவும்' },
      stopListening: { title: 'கேட்பதை நிறுத்துங்கள்', desc: 'மைக் பதிவை நிறுத்தவும்' },
    },
    recommendedControlsNote: 'பரிந்துரை: மீண்டும் கேளுங்கள் • கேள்வியை மீண்டும் சொல்லவும் • பேசுங்கள் • பின்னே செல்லவும்',

    recommendationsHeader: 'உங்களுக்கான பயிற்சி பரிந்துரைகள்',
    basedOnWhatYouToldMe: 'நீங்கள் கூறியதன் அடிப்படையில்',
    recommendationsSubtitle: 'இவை உங்கள் திறன், பயண வரம்பு மற்றும் உள்ளூர் வேலை வாய்ப்புகளுடன் பொருந்துகின்றன.',
    bestMatchBadge: 'சிறந்த பொருத்தம்',
    kmAway: (km) => `பயிற்சி மையம் ${km} கி.மீ தொலைவில் உள்ளது`,
    seeTrainingCentersBtn: 'பயிற்சி மையங்களைப் பார்க்கவும்',
    listenToOptionsTip: 'ஒவ்வொரு தேர்வையும் நீங்கள் குரல் வழியே கேட்கலாம்',
    speakThisCard: 'கேளுங்கள்',
    estimatedDemand: (level) => `உள்ளூர் தேவை: ${level === 'High' ? 'அதிகம்' : level === 'Medium' ? 'நடுத்தரம்' : 'வளர்ந்து வருகிறது'}`,

    centerHeader: 'பயிற்சி மையம்',
    skillCenterTitle: 'பிஎம்-அஜய் திறன் மேம்பாட்டு மையம்',
    travelEstimate: (km, mins) => `${km} கி.மீ • சுமார் ${mins} நிமிடங்கள்`,
    nextBatchLabel: 'அடுத்த தொகுதி',
    seatsAvailableLabel: (seats) => `கிடைக்கும் இடங்கள்: ${seats}`,
    trainingSupportAvailable: 'இலவச பயிற்சி மற்றும் தங்கும் வசதி உதவி உண்டு',
    whatHappensNextTitle: 'அடுத்து என்ன நடக்கும்?',
    step1: '1. உங்கள் ஆர்வத்தை உறுதிப்படுத்தவும்',
    step2: '2. சேர்க்கை வழிகாட்டலை நாங்கள் செய்வோம்',
    step3: '3. மையத்தில் பயிற்சியைத் தொடங்குங்கள்',
    confirmEnrollmentBtn: 'சேர்க்கை உதவியை உறுதிசெய்க',
    callMeBackBtn: 'என்னை மீண்டும் அழைக்கவும் / கேள்வி கேட்கவும்',
    enrollmentSuccessMsg: 'உங்கள் ஆர்வம் பதிவாகிவிட்டது! மைய ஒருங்கிணைப்பாளர் உங்களை தொடர்புகொள்வார்.',

    myProgressHeader: 'எனது முன்னேற்றம்',
    currentStatusLabel: 'தற்போதைய நிலை',
    trainingInProgress: 'பயிற்சி நடைபெறுகிறது',
    percentComplete: (pct) => `${pct}% முடிந்தது`,
    enrollmentConfirmed: 'சேர்க்கை உறுதியானது',
    trainingStarted: 'பயிற்சி தொடங்கியது',
    trainingCompletedStep: (pct) => `${pct}% பயிற்சி முடிந்தது`,
    certificationStep: 'சான்றிதழ் தேர்வு',
    employmentFollowUpStep: 'வேலைவாய்ப்பு உதவி',
    upcomingStatus: 'வரவிருக்கிறது',
    todayStatus: 'இன்று',
    postTrainingCallNote: 'பயிற்சிக்குப் பிறகு வேலை வாய்ப்புகளுக்காக நாங்கள் உங்களை தொடர்புகொள்வோம்.',
    updatesByVoiceNote: 'அனைத்து தகவல்களையும் குரல் வழியே கேட்கலாம்.',

    narrations: {
      entry: 'பிஎம்-அஜய் குரல் உதவியாளருக்கு நல்வரவு. உங்களுக்கான சரியான திறன் பயிற்சியைக் கண்டறிய பேசும் பொத்தானைத் தட்டவும்.',
      language: 'தயவுசெய்து மொழியைத் தேர்ந்தெடுக்கவும். தமிழ், இந்தி, பெங்காலி அல்லது மராத்தி தேர்ந்தெடுக்கலாம்.',
      consent: 'உங்களுக்கு ஏற்ற அரசுப் பயிற்சியைக் கண்டறிய உங்கள் குரல் விவரங்களை பதிவு செய்யலாமா? ஆம் என்று கூறவும் அல்லது பொத்தானை அழுத்தவும்.',
      interviewIntro: 'உங்கள் பணி மற்றும் முந்தைய திறன்கள் பற்றி கூறுங்கள். இயல்பாக உங்கள் சொந்த வார்த்தைகளில் பேசலாம்.',
      recommendations: 'உங்கள் பதில்களின் அடிப்படையில் சிறந்த பயிற்சி வழிகளைத் தேர்ந்தெடுத்துள்ளோம். எதையும் குரல் மூலம் கேட்கலாம்.',
      center: 'இது உங்களுக்கு அருகிலுள்ள பிஎம்-அஜய் திறன் மையம். சேர்க்கை உதவிக்கு கீழே உள்ள பொத்தானைத் தட்டவும்.',
      progress: 'உங்கள் பயிற்சி முன்னேற்றம் இங்கே காட்டப்படுகிறது. அறுபது சதவீத பயிற்சி முடிந்துவிட்டது.',
      ivrWelcome: 'வணக்கம், பிஎம்-அஜய் உதவி மையத்தை அழைத்துள்ளீர்கள். உங்கள் திறன்களைப் பற்றி பேசத் தொடங்குங்கள்.',
    },
  },

  en: {
    appTitle: 'PM-AJAY Voice Assistant',
    headerTitle: 'PM-AJAY Voice Assistant',
    heroTitle: 'Find the right livelihood skill for your future.',
    heroSubtitle: 'No forms. No complex apps. Just speak in your own language.',
    tapToSpeak: 'Tap to speak',
    startWithVoice: 'Start with Voice',
    callIvrOption: 'Toll-free IVR / Voice Note Option',
    worksWithoutInternet: 'Optimized for low-bandwidth rural networks',
    designedForLowLiteracy: 'Voice-first design for low-literacy beneficiaries',

    chooseLanguageHeader: 'Choose Language',
    whichLanguageTitle: 'Which language should I speak in?',
    whichLanguageSubtitle: 'Speak comfortably in your native regional language or English.',
    autoDetectTitle: 'Auto-Detect Language',
    autoDetectSubtitle: 'Speak or type in any language — we automatically adapt to your dialect',
    speakToDetectBtn: 'Speak to Auto-Detect',
    detectingLanguage: 'Listening & detecting language...',
    languageDetected: (name: string) => `Detected language: ${name}`,
    autoDetectActiveBadge: '⚡ Auto-Detect Active',
    continueBtn: 'Continue',
    changeLanguageLater: 'You can switch languages anytime during the session.',
    speakNormallyTip: 'Tip: Speak naturally as you would to a friend. No reading or typing needed.',

    consentHeader: 'Consent & Privacy',
    consentTitle: 'Shall we begin our conversation?',
    consentBody: 'To recommend the best PM-AJAY government skill training and nearby centers, we record your voice responses with strict data privacy.',
    consentSpokenPrompt: 'Please say "Yes" or tap the green button below.',
    consentAgreeBtn: 'Yes, I agree',
    consentDeclineBtn: 'No, cancel',

    interviewHeader: 'Voice Interview',
    stepIndicator: (cur, tot) => `${cur} of ${tot}`,
    defaultQuestionTitle: 'Tell us about your work and past skills.',
    defaultQuestionSubtitle: 'For example: farming, tailoring, electrical repair, driving, or handicrafts.',
    listeningState: 'Listening...',
    speakPrompt: 'Speak for as long as you like. We are listening.',
    answerInOwnWords: 'Answer comfortably in your own everyday words.',
    examplesTitle: 'Questions we might explore:',
    examples: [
      'What work or informal tasks do you currently do?',
      'What practical skills have you learned by doing?',
      'How far are you able to travel for training?',
    ],
    skipRepeatBtn: 'Repeat question / Hear again',
    interviewCompleteTitle: 'Profile Complete!',
    analyzingProfileMsg: 'Analyzing your profile and finding NSQF pathways...',

    offlineModeNotice: 'Offline Mode: No network connection. Your spoken responses are safely cached in local device storage.',
    offlineStatusBadge: 'Offline Local Storage Mode',
    onlineSyncedBadge: 'Online & Synced',
    unsyncedTurnsCount: (c) => `${c} pending response${c > 1 ? 's' : ''} saved locally`,
    syncRetryBtn: 'Sync Now (Retry)',
    syncingProgress: 'Synchronizing with server...',
    syncSuccessToast: 'Interview session successfully synchronized!',
    syncFailedToast: 'Sync failed. Please check connection and retry.',
    cachedProgressSavedLocally: 'Your response has been safely cached to local storage.',
    resumeSavedInterviewBtn: 'Resume Saved Interview',
    resumeSavedInterviewNotice: 'We found an existing saved interview session from earlier. Would you like to resume where you left off?',
    discardSavedInterviewBtn: 'Start Fresh Session',

    uploadVoiceTitle: 'Upload Voice Note or Audio File',
    uploadVoiceSubtitle: 'Select or drag a pre-recorded audio file from your phone or computer.',
    uploadVoiceBtn: 'Upload Voice Note',
    dragAndDropAudio: 'Drag & drop audio here or click to browse files',
    chooseAudioFile: 'Choose Audio File',
    transcribingAudio: 'Transcribing and analyzing your voice with AI...',
    transcribeAndSubmit: 'Transcribe & Submit Voice',
    audioPreview: 'Audio Preview',
    recordVoiceClip: 'Record Voice Clip in App',
    stopRecording: 'Stop Recording',
    audioUploadedSuccess: 'Voice note uploaded and processed successfully!',
    supportedAudioFormats: 'Supported formats: MP3, WAV, M4A, OGG, WebM, AAC (up to 25 MB)',

    talkBackHeader: 'Talk-Back & Voice Controls',
    talkBackSubtitle: 'Short, clear spoken commands with large accessible buttons.',
    actions: {
      hearAgain: { title: 'Hear again', desc: 'Replay the last assistant message' },
      repeatQuestion: { title: 'Repeat question', desc: 'Ask the assistant to repeat the current interview prompt' },
      speak: { title: 'Speak', desc: 'Activate the microphone to answer' },
      yes: { title: 'Yes', desc: 'Confirm or proceed to the next step' },
      no: { title: 'No', desc: 'Decline or explore another option' },
      goBack: { title: 'Go back', desc: 'Return to the previous screen' },
      slower: { title: 'Speak slower', desc: 'Reduce assistant speech rate for clarity' },
      stopListening: { title: 'Stop listening', desc: 'Pause voice capture' },
    },
    recommendedControlsNote: 'Core controls: Hear again • Repeat question • Speak • Go back',

    recommendationsHeader: 'Your Recommended Skill Pathways',
    basedOnWhatYouToldMe: 'Based on what you told me',
    recommendationsSubtitle: 'These courses match your informal skills, mobility range, and local district job demand.',
    bestMatchBadge: 'Best Match',
    kmAway: (km) => `Training center ${km} km away`,
    seeTrainingCentersBtn: 'View Training Center',
    listenToOptionsTip: 'You can listen to each recommendation by tapping the speaker',
    speakThisCard: 'Listen',
    estimatedDemand: (level) => `Local Demand: ${level === 'High' ? 'High' : level === 'Medium' ? 'Medium' : 'Growing'}`,

    centerHeader: 'Training Center',
    skillCenterTitle: 'PM-AJAY Skill Development Center',
    travelEstimate: (km, mins) => `${km} km • approx ${mins} mins travel`,
    nextBatchLabel: 'Next Batch',
    seatsAvailableLabel: (seats) => `Seats Available: ${seats}`,
    trainingSupportAvailable: 'Free NSQF training, toolkits & stipend support available',
    whatHappensNextTitle: 'What happens next?',
    step1: '1. Confirm your training interest',
    step2: '2. Our local coordinator provides enrollment guidance',
    step3: '3. Begin hands-on training at the verified center',
    confirmEnrollmentBtn: 'Confirm Enrollment Assistance',
    callMeBackBtn: 'Request Callback / Inquire',
    enrollmentSuccessMsg: 'Interest recorded! A local PM-AJAY coordinator will call you.',

    myProgressHeader: 'My Progress',
    currentStatusLabel: 'Current Status',
    trainingInProgress: 'Training in Progress',
    percentComplete: (pct) => `${pct}% Completed`,
    enrollmentConfirmed: 'Enrollment Confirmed',
    trainingStarted: 'Training Commenced',
    trainingCompletedStep: (pct) => `${pct}% Training Completed`,
    certificationStep: 'NSQF Certification Assessment',
    employmentFollowUpStep: 'Livelihood & Placement Assistance',
    upcomingStatus: 'Upcoming',
    todayStatus: 'Today',
    postTrainingCallNote: 'Post-training, we assist you with wage employment or micro-enterprise setup under PM-AJAY.',
    updatesByVoiceNote: 'All status updates can be heard aloud in your preferred language.',

    narrations: {
      entry: 'Welcome to the PM-AJAY Voice Livelihood Assistant. Tap the green button to start spoken profiling.',
      language: 'Please choose your language. You can speak in English, Hindi, Bengali, Marathi, or Tamil.',
      consent: 'To match you with government skill training, may we record your voice responses? Please say yes or tap the button.',
      interviewIntro: 'Tell us about your work experience and practical skills. Speak naturally in your own words.',
      recommendations: 'Based on your spoken answers, we have selected top NSQF skill courses and nearby centers.',
      center: 'Here is your nearby PM-AJAY Skill Center. Tap the button below to confirm enrollment support.',
      progress: 'Here is your training progress tracker. Your practical modules are actively underway.',
      ivrWelcome: 'Welcome to PM-AJAY Helpline. Please speak to tell us about your skills.',
    },
  },
};

export function getLocale(lang: SupportedLanguage = 'hi'): LocaleStrings {
  return LOCALES[lang] || LOCALES.hi;
}

# PM-AJAY Voice Livelihood Assistant

**Government of India — Ministry of Social Justice & Empowerment**  
*Pradhan Mantri Anusuchit Jaati Abhyuday Yojana (PM-AJAY) Grant-in-Aid Scheme*  
*Smart India Hackathon 2026 Working Prototype*

---

## 1. Overview & Core Mission
The **PM-AJAY Voice Livelihood Assistant** is a voice-first application designed specifically for Scheduled Caste beneficiaries in rural India. Addressing low literacy, limited smartphone familiarity, and form aversion, the application replaces government paperwork with a multi-turn, natural **spoken interview** in the beneficiary's regional language.

### Core Capabilities
- **Voice-First Citizen Flow**: Zero mandatory reading or typing; every screen is narrated with automatic speech synthesis (TTS) and spoken input recognition (STT).
- **Multi-Turn Adaptive AI Interview**: Server-side Gemini reasoning analyzes conversational answers, extracts structured livelihood profiles (formal/informal skills, mobility limit, earning goals), and determines dynamic follow-up questions.
- **NSQF Alignment & Matching Engine**: Maps candidate skills and travel distance to nearby PM-AJAY training centers offering NSQF Level 3–5 certifications.
- **Talk-Back Voice Control System**: Built-in voice command parser with barge-in support (`"Hear again"`, `"Repeat question"`, `"Slower"`, `"Go back"`, `"Stop listening"`).
- **Alternate Channel Adapters**: Extensible interfaces for Toll-Free IVR (1800-PM-AJAY) and WhatsApp Voice Notes.
- **Hidden, Role-Gated Admin Portal**: District Welfare Officer dashboard with candidate record inspections, audit logging, NSQF catalog management, and manual milestone override tools.

---

## 2. Architecture & Design Implementation
The UI strictly implements the mobile layout specifications:
1. **Entry Screen**: Central pulsing green voice card, "Start with voice", and alternate IVR option.
2. **Language Selection**: Regional language picker supporting English, Hindi (हिन्दी), Bengali (বাংলা), Marathi (मराठी), and Tamil (தமிழ்).
3. **Explicit Spoken Consent**: Step-zero privacy consent logged before any audio processing.
4. **Voice Interview**: 5-step conversational intake with live transcription and audio prompts.
5. **Recommendations**: Ranked NSQF pathways with proximity, demand badges, and audio preview.
6. **Training Center Details**: Next batch dates, seat availability, stipend support, and one-tap enrollment confirmation.
7. **Progress Tracker**: 5-stage milestone progression with real-time sync.

---

## 3. Language Extension Procedure
Adding a new regional language (e.g. Telugu, Odia, Punjabi):
1. **Declare Language Code**: In `src/types.ts`, add the language code to `SupportedLanguage` (e.g. `'te' | 'or' | 'pa'`).
2. **Add Translations**: In `src/locales/i18n.ts`, append a new dictionary entry with localized titles, subtitles, voice command triggers, and system messages.
3. **Configure Speech Synthesis & Recognition**: Update `src/audio/speechEngine.ts` to map the language code to the corresponding BCP-47 voice tag (e.g., `te-IN`).
4. **Catalog Localization**: In `server/db.ts`, add the translated trade names and descriptions under `localizedNames` and `localizedDescriptions`.

---

## 4. Admin Security & Citizen Isolation
- **Strict Separation**: The Admin Panel is completely isolated from the citizen flow.
- **Authentication**: Auth-gated with administrator credentials (`admin` / `pmajay2026`).
- **Audit Logging**: Every create, update, delete, and manual stage override action is logged in an immutable `AuditLog` entry detailing timestamp, administrator ID, entity, and action.

---

## 5. Channel Adapters & System Status
- **Web Voice (Primary)**: Fully implemented with browser Web Speech API + server-side Gemini multi-turn reasoning.
- **Toll-Free IVR (1800-202-PMAJAY)**: Channel adapter interface with working dialer simulator in `ChannelSimulatorModal`.
- **WhatsApp Voice Note**: Channel adapter handling simulated `.ogg`/`.m4a` voice messages and return voice note payloads.

---

## 6. Development & Production Run
- **Development**: `npm run dev` (Express backend with Vite middleware on port 3000)
- **Production Build**: `npm run build`
- **Production Server**: `npm start`

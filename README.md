# PM-AJAY Voice Livelihood Assistant

AI-powered multilingual voice-first skilling and livelihood counselor for PM-AJAY beneficiaries. Conducts natural voice interviews in 12 Indian languages, extracts vocational skills, maps them to NSQF Qualification Packs, and connects beneficiaries to nearby training centres and enterprise opportunities.

Built for **Smart India Hackathon (SIH)** — Ministry of Social Justice & Empowerment.

---

## How It Works

1. **Listens** — Speech-to-text via IndicWhisper / Bhashini ASR (12 languages + dialects)
2. **Understands** — Gemini AI extracts structured livelihood slots (skills, tools, experience, RPL signals) from spoken input(Later we will be using our own NLP)
3. **Matches** — Multi-factor NSQF engine scores Qualification Packs against skills, local demand, mobility, and enterprise potential
4. **Recommends** — Delivers personalised training, RPL certification, and career pathways in the beneficiary's language
5. **Escalates** — Routes complex cases to district officers with full context

### Delivery Channels

- **Toll-Free Voice Call** — Asterisk/FreeSWITCH SIP gateway
- **WhatsApp Voice Notes** — WhatsApp Business API integration[Not yet integrated]
- **Panchayat Kiosk** — Offline-capable with IndexedDB and batch sync
- **Web Browser** — Full voice interview with Web Speech API fallback
---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, TailwindCSS 4, Motion, Recharts, D3.js |
| Backend | Node.js, Express 4, TypeScript (tsx) |
| AI / NLU | Google Gemini API (`@google/genai`) with structured JSON output |
| Speech | IndicWhisper (gemini API for the prototype) (adapter layer) |
| Vector Search | In-memory cosine term-frequency engine (Qdrant-ready) |
| Database | In-memory store + Cloud Firestore (real-time sync) |
| Offline | IndexedDB via Panchayat Kiosk with batch sync |
| Build | Vite 6, esbuild |

---

## Getting Started

**Prerequisites:** Node.js >= 18, a [Gemini API Key](https://aistudio.google.com/apikey)

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env — set GEMINI_API_KEY

# Start dev server (Express + Vite HMR on port 3000)
npm run dev
```

> Without `GEMINI_API_KEY`, the system falls back to a deterministic multilingual counselor that still extracts skills and generates recommendations.

### Production

```bash
npm run build   # Vite frontend + esbuild server bundle
npm start       # Runs dist/server.cjs
```

---

## Project Structure

```
├── server.ts                      # Express entry point
├── src/
│   ├── App.tsx                    # Root component — view routing & session state
│   ├── types.ts                   # All TypeScript interfaces
│   ├── components/
│   │   ├── landing/LandingPage.tsx
│   │   ├── beneficiary/           # Consent, Language, Voice Interview, Profile, Recommendations
│   │   ├── whatsapp/              # WhatsApp voice note simulator
│   │   ├── kiosk/                 # Offline Panchayat kiosk
│   │   ├── admin/                 # Dashboard, Geospatial map
│   │   └── common/               # TalkBack bar, Demo modal, Escalation modal
│   ├── lib/
│   │   ├── api.ts                 # Client-side fetch wrapper
│   │   ├── firebase.ts            # Firestore CRUD & real-time listeners
│   │   ├── audio.ts               # Web Audio utilities
│   │   └── translations.ts        # i18n strings (12 languages)
│   └── server/
│       ├── api.ts                 # All REST endpoints
│       ├── services/
│       │   ├── geminiDialogue.ts   # Gemini AI dialogue + deterministic fallback
│       │   ├── matchingEngine.ts   # NSQF recommendation scoring engine
│       │   ├── speechService.ts    # ASR, TTS, language detection adapters
│       │   └── vectorSearch.ts     # In-memory vector similarity search
│       └── db/
│           ├── store.ts           # In-memory data store
│           └── seedData.ts        # Seed: QPs, providers, courses, districts
```

---

## API Endpoints

All endpoints prefixed with `/api`. Server runs on port 3000.

**Interviews:** `POST /interviews` | `POST /interviews/:id/message` | `POST /interviews/:id/audio`

**Candidates:** `GET /candidates` | `GET /candidates/:id` | `PATCH /candidates/:id` | `POST /candidates/:id/confirm`

**Recommendations:** `POST /candidates/:id/recommendations` | `PATCH /recommendations/:id/status`

**Master Data:** `GET /providers` | `GET /courses` | `GET /qualification-packs` | `GET /economic-demand`

**Escalations:** `GET /escalations` | `POST /escalations` | `PATCH /escalations/:id`

**Analytics:** `GET /analytics/overview` | `GET /analytics/districts` | `GET /analytics/trades` | `GET /analytics/beneficiaries` | `GET /analytics/operational`

**System:** `GET /health` | `GET /integrations/status` | `GET /audit-logs` | `POST /sync` | `POST /demo/sample-conversation`

---

## NSQF Matching Engine

Weighted multi-factor scoring (max 100):

| Factor | Weight | Measures |
|---|---|---|
| Skill & Tool Overlap | 30 | Direct match + synonym map + vector similarity |
| Experience | 22 | Years of hands-on work + family trade recognition |
| Interest Alignment | 15 | Stated aspirations vs. QP sector keywords |
| Education | 10 | NSQF level accessibility |
| Mobility & Proximity | 15 | Haversine distance to nearest centre vs. travel willingness |
| Economic Demand | 15 | Local vacancies, wages, growth forecast |
| Enterprise Potential | 10 | Self-employment viability + subsidy eligibility |
| RPL Eligibility | 8 | >= 3 years experience or family trade → fast-track certification |

---

## Supported Languages

Hindi (+ Bhojpuri, Maithili), Bengali, Marathi, Tamil, Telugu, Kannada, Malayalam, Gujarati, Punjabi, Odia (+ Sambalpuri), Assamese, English.

---

## User Roles

| Role | Access |
|---|---|
| `beneficiary` | Voice interview, profile confirmation, recommendations |
| `field_worker` | Kiosk operation, offline sync |
| `district_admin` | District analytics, escalation management |
| `state_admin` | Multi-district oversight |
| `super_admin` | Full system access, integration monitoring |

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Dev server (Express + Vite HMR) on port 3000 |
| `npm run build` | Production build (Vite + esbuild) |
| `npm start` | Run production server |
| `npm run lint` | TypeScript type-checking |
| `npm run clean` | Remove build artifacts |

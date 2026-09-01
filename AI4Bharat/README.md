# PM-AJAY Bhashini Indic Speech Microservice

A production-ready **FastAPI Python microservice** wrapping Bhashini's Cloud API (MeitY / Govt. of India / AI4Bharat) for Speech-to-Text (ASR) and Text-to-Speech (TTS) across 12 Indic languages.

---

## 🚀 Quick Deploy to Render

### Option A: Automatic Blueprint (Recommended)
1. In Render Dashboard, click **New +** -> **Blueprint**.
2. Connect your GitHub repository (`PM-AJAY-Voice-Dossier`) and select the `model` branch.
3. Render will auto-detect `render.yaml`.
4. Enter your environment variables when prompted:
   - `BHASHINI_USER_ID`: Your Bhashini ULCA User ID
   - `BHASHINI_API_KEY`: Your Bhashini ULCA API Key
5. Click **Apply**. Render will build and deploy the service.

### Option B: Manual Web Service Setup
1. In Render Dashboard, click **New +** -> **Web Service**.
2. Connect repository and select the `model` branch.
3. Configure the settings:
   - **Name**: `pmajay-bhashini-model-service`
   - **Root Directory**: `AI4Bharat`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: `Free`
4. Under **Environment Variables**, add:
   - `BHASHINI_USER_ID`: `<your_user_id>`
   - `BHASHINI_API_KEY`: `<your_api_key>`
5. Click **Create Web Service**.

---

## 🔑 Getting Bhashini Credentials

1. Register at the ULCA Integrator Portal: [bhashini.gov.in/ulca/user/register](https://bhashini.gov.in/ulca/user/register)
2. Obtain your `userID` and `ulcaApiKey`.
3. Set `BHASHINI_USER_ID` and `BHASHINI_API_KEY` in Render environment variables.

---

## 📡 API Endpoints

### 1. Health Check
`GET /` or `GET /health`
```json
{
  "status": "ok",
  "service": "PM-AJAY Bhashini Indic Speech Microservice",
  "credentials_configured": true,
  "bhashini_pipeline_ready": true
}
```

### 2. Speech-to-Text (ASR)
`POST /transcribe` (multipart/form-data)
- `audio`: WAV file upload
- `language`: `hi`, `bn`, `ta`, `te`, `mr`, `gu`, `kn`, `ml`, `pa`, `or`, `as`, etc.

`POST /transcribe-json` (JSON)
```json
{
  "audio_base64": "<base64_wav_data>",
  "language": "hi"
}
```

### 3. Text-to-Speech (TTS)
`POST /synthesize` (Form)
- `text`: Text string to synthesize
- `language`: Target language code (e.g. `hi`, `bn`, `ta`)
- `gender`: `female` or `male`

`POST /synthesize-json` (JSON)
```json
{
  "text": "नमस्ते, आपका स्वागत है।",
  "language": "hi",
  "gender": "female"
}
```
Returns Base64 encoded WAV audio in response.

---

## 🧪 Local Testing

```bash
# Install dependencies
pip install -r requirements.txt

# Run server locally
uvicorn app:app --reload --port 8000
```
Visit `http://localhost:8000/docs` for interactive Swagger UI documentation.

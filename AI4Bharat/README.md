# /model — Bhashini-based ASR/TTS

Thin wrapper around Bhashini's API for speech-to-text and text-to-speech.
No heavy models loaded here — this calls Bhashini's servers, so it's
lightweight enough to deploy on a free-tier host.

## 1. Get Bhashini credentials

1. Register at the ULCA integrator portal: bhashini.gov.in/ulca/user/register
2. Get your `userID` and `ulcaApiKey`.
3. Copy `.env.example` to `.env` and fill both in.

If `DEFAULT_PIPELINE_ID` in `bhashini_client.py` doesn't work for your
account, use Bhashini's Pipeline Search API to find a valid pipeline ID
that supports `asr` and `tts` for your language, then swap it in.

## 2. Install dependencies

```
pip install -r requirements.txt --break-system-packages
```

## 3. Test locally

```
uvicorn app:app --reload
```

Health check: `curl http://127.0.0.1:8000/` should return `{"status":"ok"}`.

Or run the standalone script (needs a `sample_input.wav` in this folder):
```
python demo.py
```

## 4. Deploy

Push this folder to your repo, connect it on Render:
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn app:app --host 0.0.0.0 --port $PORT`
- Environment variables: `BHASHINI_USER_ID`, `BHASHINI_API_KEY`
- Free tier is fine here — no heavy model is loaded locally.

## Files

- `bhashini_client.py` — wraps Bhashini's pipeline search/config/compute
  calls for ASR and TTS
- `app.py` — FastAPI server: `POST /transcribe` (audio in, text out),
  `POST /synthesize` (text in, audio out)
- `demo.py` — minimal standalone ASR → TTS script
- `.env.example` — credential template
- `Procfile` — Render start command

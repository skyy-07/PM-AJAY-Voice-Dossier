import os
import uuid
import base64
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Body
from fastapi.responses import FileResponse, JSONResponse, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

from bhashini_client import BhashiniClient

app = FastAPI(
    title="PM-AJAY Bhashini Speech Service",
    description="Thin FastAPI wrapper around Government of India Bhashini ULCA Indic speech pipelines (ASR & TTS)",
    version="1.0.0"
)

# Enable CORS for cross-origin frontend & Node.js server access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = BhashiniClient()

TMP_DIR = "tmp_audio"
os.makedirs(TMP_DIR, exist_ok=True)


class TranscribeJSONRequest(BaseModel):
    audio_base64: str
    language: Optional[str] = "hi"


class SynthesizeJSONRequest(BaseModel):
    text: str
    language: Optional[str] = "hi"
    gender: Optional[str] = "female"


@app.get("/")
def health():
    credentials_set = bool(os.getenv("BHASHINI_USER_ID") and os.getenv("BHASHINI_API_KEY"))
    return {
        "status": "ok" if client.is_ready else "degraded",
        "service": "PM-AJAY Bhashini Indic Speech Microservice",
        "credentials_configured": credentials_set,
        "bhashini_pipeline_ready": client.is_ready,
        "last_error": client.last_error,
        "supported_asr_languages": list(client.asr_service_id.keys()) if client.is_ready else [],
        "supported_tts_languages": list(client.tts_service_id.keys()) if client.is_ready else []
    }


@app.get("/health")
def health_check():
    return health()


@app.post("/transcribe")
async def transcribe(
    audio: Optional[UploadFile] = File(None),
    language: str = Form("hi")
):
    if not audio:
        raise HTTPException(status_code=400, detail="Missing audio file upload")

    in_path = os.path.join(TMP_DIR, f"{uuid.uuid4()}.wav")
    try:
        content = await audio.read()
        with open(in_path, "wb") as f:
            f.write(content)

        text = client.asr(in_path, language)
        return JSONResponse({"text": text, "language": language, "status": "success"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ASR transcription failed: {str(e)}")
    finally:
        if os.path.exists(in_path):
            os.remove(in_path)


@app.post("/transcribe-json")
async def transcribe_json(payload: TranscribeJSONRequest):
    try:
        audio_bytes = base64.b64decode(payload.audio_base64)
        text = client.asr(audio_bytes, payload.language or "hi")
        return JSONResponse({"text": text, "language": payload.language, "status": "success"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ASR transcription failed: {str(e)}")


@app.post("/synthesize")
async def synthesize(
    text: str = Form(...),
    language: str = Form("hi"),
    gender: str = Form("female")
):
    out_path = os.path.join(TMP_DIR, f"{uuid.uuid4()}.wav")
    try:
        client.tts(text, language, gender=gender, out_path=out_path)
        return FileResponse(
            out_path,
            media_type="audio/wav",
            filename="response.wav",
            headers={"Content-Disposition": "inline; filename=response.wav"}
        )
    except Exception as e:
        if os.path.exists(out_path):
            os.remove(out_path)
        raise HTTPException(status_code=500, detail=f"TTS synthesis failed: {str(e)}")


@app.post("/synthesize-json")
async def synthesize_json(payload: SynthesizeJSONRequest):
    try:
        audio_bytes = client.tts(payload.text, payload.language or "hi", gender=payload.gender or "female", out_path=None)
        audio_b64 = base64.b64encode(audio_bytes).decode("utf-8")
        return JSONResponse({
            "audio_base64": audio_b64,
            "media_type": "audio/wav",
            "text": payload.text,
            "language": payload.language
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TTS synthesis failed: {str(e)}")

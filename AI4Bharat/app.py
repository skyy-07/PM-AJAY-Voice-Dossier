import os
import uuid
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import FileResponse, JSONResponse

from bhashini_client import BhashiniClient

app = FastAPI()

client = BhashiniClient()

TMP_DIR = "tmp_audio"
os.makedirs(TMP_DIR, exist_ok=True)


@app.get("/")
def health():
    return {"status": "ok"}


@app.post("/transcribe")
async def transcribe(audio: UploadFile = File(...), language: str = Form("hi")):
    in_path = os.path.join(TMP_DIR, f"{uuid.uuid4()}.wav")
    with open(in_path, "wb") as f:
        f.write(await audio.read())

    try:
        text = client.asr(in_path, language)
    finally:
        os.remove(in_path)

    return JSONResponse({"text": text})


@app.post("/synthesize")
async def synthesize(text: str = Form(...), language: str = Form("hi")):
    out_path = os.path.join(TMP_DIR, f"{uuid.uuid4()}.wav")
    client.tts(text, language, out_path=out_path)
    return FileResponse(out_path, media_type="audio/wav", filename="response.wav")

import numpy as np
import soundfile as sf
import torch
from transformers import AutoModel

MODEL_ID = "ai4bharat/indic-conformer-600m-multilingual"


def remove_repetition(text, min_repeat_words=4):
    words = text.split()
    n = len(words)
    for size in range(n // 2, min_repeat_words - 1, -1):
        for start in range(n - 2 * size + 1):
            first = words[start:start + size]
            second = words[start + size:start + 2 * size]
            if first == second:
                return " ".join(words[:start + size])
    return text


class IndicASRClient:
    def __init__(self, device=None):
        self.device = device or ("cuda" if torch.cuda.is_available() else "cpu")
        self.model = AutoModel.from_pretrained(MODEL_ID, trust_remote_code=True).to(self.device)
        self.model.eval()

    def transcribe(self, audio_path, language="hi", decoding="ctc"):
        audio, sr = sf.read(audio_path, dtype="float32")
        if audio.ndim > 1:
            audio = audio.mean(axis=1)

        target_sr = 16000
        if sr != target_sr:
            num_samples = int(len(audio) * target_sr / sr)
            audio = np.interp(
                np.linspace(0, len(audio), num_samples, endpoint=False),
                np.arange(len(audio)),
                audio,
            ).astype(np.float32)

        wav = torch.from_numpy(audio).unsqueeze(0).to(self.device)
        with torch.no_grad():
            transcription = self.model(wav, language, decoding)

        return remove_repetition(transcription)
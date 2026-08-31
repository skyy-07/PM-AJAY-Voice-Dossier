import os
import io
import csv
from datasets import load_dataset, Audio
import soundfile as sf

FLEURS_CODES = {
    "hi": "hi_in",
    "ta": "ta_in",
    "te": "te_in",
    "kn": "kn_in",
    "bn": "bn_in",
    "mr": "mr_in",
}

SAMPLES_PER_LANGUAGE = 5
OUT_DIR = "test_data"
MANIFEST_PATH = "test_set.csv"


def build():
    os.makedirs(OUT_DIR, exist_ok=True)
    rows = []

    for lang_code, fleurs_code in FLEURS_CODES.items():
        print(f"Downloading {fleurs_code}...")
        dataset = load_dataset("google/fleurs", fleurs_code, split="test", streaming=True)
        dataset = dataset.cast_column("audio", Audio(decode=False))

        lang_dir = os.path.join(OUT_DIR, lang_code)
        os.makedirs(lang_dir, exist_ok=True)

        count = 0
        for sample in dataset:
            if count >= SAMPLES_PER_LANGUAGE:
                break

            audio_bytes = sample["audio"]["bytes"]
            audio_array, sr = sf.read(io.BytesIO(audio_bytes))

            audio_path = os.path.join(lang_dir, f"sample_{count}.wav")
            sf.write(audio_path, audio_array, sr)

            rows.append({
                "audio_path": audio_path,
                "reference_text": sample["transcription"],
                "language": lang_code,
            })
            count += 1

    with open(MANIFEST_PATH, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["audio_path", "reference_text", "language"])
        writer.writeheader()
        writer.writerows(rows)

    print(f"Built manifest with {len(rows)} samples across {len(FLEURS_CODES)} languages: {MANIFEST_PATH}")


if __name__ == "__main__":
    build()
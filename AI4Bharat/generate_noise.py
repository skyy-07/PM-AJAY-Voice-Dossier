import os
import numpy as np
import soundfile as sf

DURATION_SEC = 5
SAMPLE_RATE = 16000
OUT_PATH = "noise_samples/ambient.wav"


def generate():
    os.makedirs("noise_samples", exist_ok=True)
    noise = np.random.normal(0, 0.05, DURATION_SEC * SAMPLE_RATE).astype(np.float32)
    sf.write(OUT_PATH, noise, SAMPLE_RATE)
    print(f"Generated synthetic noise at {OUT_PATH}")


if __name__ == "__main__":
    generate()

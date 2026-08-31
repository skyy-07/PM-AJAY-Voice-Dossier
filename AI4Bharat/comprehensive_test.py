import csv
import time
from collections import defaultdict

import numpy as np
import soundfile as sf
import jiwer

from asr_client import IndicASRClient
from tts_client import IndicTTSClient
from audio_augment import simulate_telephony

MANIFEST_PATH = "test_set.csv"
NOISE_FILE = "noise_samples/ambient.wav"
REPORT_PATH = "test_report.txt"

WER_TRANSFORM = jiwer.Compose([
    jiwer.ToLowerCase(),
    jiwer.RemovePunctuation(),
    jiwer.RemoveMultipleSpaces(),
    jiwer.Strip(),
    jiwer.ReduceToListOfListOfWords(),
])


def compute_wer(refs, hyps):
    return jiwer.wer(refs, hyps, reference_transform=WER_TRANSFORM, hypothesis_transform=WER_TRANSFORM)


def load_manifest():
    with open(MANIFEST_PATH, encoding="utf-8") as f:
        return list(csv.DictReader(f))


def test_asr(rows):
    asr = IndicASRClient()
    results = defaultdict(lambda: {
        "refs": [], "hyps": [],
        "degraded_refs": [], "degraded_hyps": [],
        "latencies": [],
    })

    for row in rows:
        lang = row["language"]
        audio_path = row["audio_path"]
        reference = row["reference_text"]

        start = time.time()
        hyp = asr.transcribe(audio_path, lang)
        latency = time.time() - start

        results[lang]["refs"].append(reference)
        results[lang]["hyps"].append(hyp)
        results[lang]["latencies"].append(latency)

        degraded_path = audio_path.replace(".wav", "_degraded.wav")
        simulate_telephony(audio_path, degraded_path, noise_path=NOISE_FILE)
        degraded_hyp = asr.transcribe(degraded_path, lang)
        results[lang]["degraded_refs"].append(reference)
        results[lang]["degraded_hyps"].append(degraded_hyp)

    return results


TTS_TEST_TEXT = {
    "hi": "यह एक परीक्षण है।",
    "ta": "இது ஒரு சோதனை.",
    "te": "ఇది ఒక పరీక్ష.",
    "kn": "ಇದು ಒಂದು ಪರೀಕ್ಷೆ.",
    "bn": "এটি একটি পরীক্ষা।",
    "mr": "ही एक चाचणी आहे.",
}


def test_tts(languages):
    status = {}
    for lang in languages:
        try:
            tts = IndicTTSClient(language=lang)
            out_path = f"tts_test_{lang}.wav"
            text = TTS_TEST_TEXT.get(lang, "test")
            tts.synthesize(text, out_path=out_path)
            status[lang] = "OK"
        except Exception as e:
            status[lang] = f"FAILED: {e}"
    return status


def test_edge_cases(languages):
    asr = IndicASRClient()
    results = {}

    silence = np.zeros(16000, dtype=np.float32)
    sf.write("edge_silence.wav", silence, 16000)

    very_short = np.random.normal(0, 0.01, 800).astype(np.float32)
    sf.write("edge_short.wav", very_short, 16000)

    for lang in languages:
        for name, path in [("silence", "edge_silence.wav"), ("very_short", "edge_short.wav")]:
            try:
                result = asr.transcribe(path, lang)
                results[f"{lang}_{name}"] = f"OK (returned: {result!r})"
            except Exception as e:
                results[f"{lang}_{name}"] = f"CRASHED: {e}"

    return results


def write_report(asr_results, tts_status, edge_results):
    lines = ["=== ASR Results ===\n"]

    for lang, data in asr_results.items():
        clean_wer = compute_wer(data["refs"], data["hyps"])
        degraded_wer = compute_wer(data["degraded_refs"], data["degraded_hyps"])
        avg_latency = sum(data["latencies"]) / len(data["latencies"])

        lines.append(f"[{lang}]")
        lines.append(f"  Clean WER:     {clean_wer:.2%}")
        lines.append(f"  Degraded WER:  {degraded_wer:.2%}")
        lines.append(f"  Avg latency:   {avg_latency:.2f}s")
        lines.append("")

    lines.append("=== TTS Results ===\n")
    for lang, status in tts_status.items():
        lines.append(f"[{lang}] {status}")
    lines.append("")

    lines.append("=== Edge Case Results ===\n")
    for key, status in edge_results.items():
        lines.append(f"[{key}] {status}")

    report = "\n".join(lines)
    print(report)

    with open(REPORT_PATH, "w", encoding="utf-8") as f:
        f.write(report)

    print(f"\nFull report saved to {REPORT_PATH}")


if __name__ == "__main__":
    rows = load_manifest()
    languages = sorted(set(row["language"] for row in rows))

    asr_results = test_asr(rows)
    tts_status = test_tts(languages)
    edge_results = test_edge_cases(languages)

    write_report(asr_results, tts_status, edge_results)
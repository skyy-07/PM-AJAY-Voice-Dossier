import csv
import jiwer
from asr_client import IndicASRClient

MANIFEST_PATH = "test_set.csv"
LANGUAGE = "ta"

WER_TRANSFORM = jiwer.Compose([
    jiwer.ToLowerCase(),
    jiwer.RemovePunctuation(),
    jiwer.RemoveMultipleSpaces(),
    jiwer.Strip(),
    jiwer.ReduceToListOfListOfWords(),
])


def load_tamil_rows():
    with open(MANIFEST_PATH, encoding="utf-8") as f:
        return [row for row in csv.DictReader(f) if row["language"] == LANGUAGE]


def run():
    rows = load_tamil_rows()
    asr = IndicASRClient()

    for decoding in ["ctc", "rnnt"]:
        refs, hyps = [], []
        for row in rows:
            hyp = asr.transcribe(row["audio_path"], LANGUAGE, decoding=decoding)
            refs.append(row["reference_text"])
            hyps.append(hyp)
            print(f"[{decoding}] ref: {row['reference_text']}")
            print(f"[{decoding}] hyp: {hyp}\n")

        wer = jiwer.wer(refs, hyps, reference_transform=WER_TRANSFORM, hypothesis_transform=WER_TRANSFORM)
        print(f"=== {decoding.upper()} WER: {wer:.2%} ===\n")


if __name__ == "__main__":
    run()
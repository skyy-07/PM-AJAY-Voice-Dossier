import time
from asr_client import IndicASRClient

TEST_FILE = "sample_input.wav"
LANGUAGE = "hi"
NUM_RUNS = 5


def run_latency_test():
    client = IndicASRClient()

    warm_times = []
    for i in range(NUM_RUNS):
        start = time.time()
        text = client.transcribe(TEST_FILE, LANGUAGE)
        elapsed = time.time() - start
        warm_times.append(elapsed)
        print(f"Run {i + 1}: {elapsed:.2f}s -> {text}")

    avg = sum(warm_times) / len(warm_times)
    print(f"\nAverage warm-inference latency: {avg:.2f}s over {NUM_RUNS} runs")
    print(f"Min: {min(warm_times):.2f}s, Max: {max(warm_times):.2f}s")


if __name__ == "__main__":
    run_latency_test()

from bhashini_client import BhashiniClient

LANGUAGE = "hi"


def run_demo(audio_path):
    client = BhashiniClient()

    text = client.asr(audio_path, LANGUAGE)
    print(f"Beneficiary said: {text}")

    response_text = (
        "धन्यवाद। आपकी जानकारी के आधार पर, सिलाई प्रशिक्षण कार्यक्रम "
        "की सिफारिश की जाती है।"
    )

    out_path = client.tts(response_text, LANGUAGE, out_path="assistant_response.wav")
    print(f"Assistant response saved to: {out_path}")


if __name__ == "__main__":
    run_demo("sample_input.wav")

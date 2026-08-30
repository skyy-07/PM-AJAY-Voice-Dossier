import os
import base64
import requests

ULCA_BASE_URL = "https://meity-auth.ulcacontrib.org"
MODEL_PIPELINE_ENDPOINT = "/ulca/apis/v0/model/getModelsPipeline"
DEFAULT_PIPELINE_ID = "64392f96daac500b55c543cd"


class BhashiniClient:
    def __init__(self, user_id=None, api_key=None, pipeline_id=DEFAULT_PIPELINE_ID):
        self.user_id = user_id or os.getenv("BHASHINI_USER_ID")
        self.api_key = api_key or os.getenv("BHASHINI_API_KEY")
        self.pipeline_id = pipeline_id
        self.asr_service_id = {}
        self.tts_service_id = {}
        self.inference_key = None
        self.callback_url = None
        self._load_pipeline_config()

    def _load_pipeline_config(self):
        body = {
            "pipelineTasks": [
                {"taskType": "asr"},
                {"taskType": "tts"},
            ],
            "pipelineRequestConfig": {"pipelineId": self.pipeline_id},
        }
        headers = {"userID": self.user_id, "ulcaApiKey": self.api_key}
        resp = requests.post(ULCA_BASE_URL + MODEL_PIPELINE_ENDPOINT, json=body, headers=headers)
        resp.raise_for_status()
        data = resp.json()

        for task in data["pipelineResponseConfig"]:
            if task["taskType"] == "asr":
                for lang in task["config"]:
                    self.asr_service_id[lang["language"]["sourceLanguage"]] = lang["serviceId"]
            if task["taskType"] == "tts":
                for lang in task["config"]:
                    self.tts_service_id[lang["language"]["sourceLanguage"]] = lang["serviceId"]

        auth = data["pipelineInferenceAPIEndPoint"]["inferenceApiKey"]
        self.inference_key = {auth["name"]: auth["value"]}
        self.callback_url = data["pipelineInferenceAPIEndPoint"]["callbackUrl"]

    def asr(self, audio_path, source_language, sampling_rate=16000):
        if source_language not in self.asr_service_id:
            raise ValueError(f"No ASR service available for language '{source_language}'")

        with open(audio_path, "rb") as f:
            audio_b64 = base64.b64encode(f.read()).decode("utf-8")

        payload = {
            "pipelineTasks": [
                {
                    "taskType": "asr",
                    "config": {
                        "language": {"sourceLanguage": source_language},
                        "serviceId": self.asr_service_id[source_language],
                        "audioFormat": "wav",
                        "samplingRate": sampling_rate,
                    },
                }
            ],
            "inputData": {"audio": [{"audioContent": audio_b64}]},
        }
        resp = requests.post(self.callback_url, json=payload, headers=self.inference_key)
        resp.raise_for_status()
        result = resp.json()
        return result["pipelineResponse"][0]["output"][0]["source"]

    def tts(self, text, source_language, gender="female", out_path="output.wav"):
        if source_language not in self.tts_service_id:
            raise ValueError(f"No TTS service available for language '{source_language}'")

        payload = {
            "pipelineTasks": [
                {
                    "taskType": "tts",
                    "config": {
                        "language": {"sourceLanguage": source_language},
                        "serviceId": self.tts_service_id[source_language],
                        "gender": gender,
                        "samplingRate": 16000,
                    },
                }
            ],
            "inputData": {"input": [{"source": text}]},
        }
        resp = requests.post(self.callback_url, json=payload, headers=self.inference_key)
        resp.raise_for_status()
        result = resp.json()
        audio_b64 = result["pipelineResponse"][0]["audio"][0]["audioContent"]

        with open(out_path, "wb") as f:
            f.write(base64.b64decode(audio_b64))
        return out_path

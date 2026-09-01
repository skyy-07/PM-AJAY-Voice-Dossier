import os
import base64
import logging
import requests

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("bhashini")

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
        self.is_ready = False
        self.last_error = None

        if self.user_id and self.api_key:
            self.load_pipeline_config()
        else:
            self.last_error = "BHASHINI_USER_ID or BHASHINI_API_KEY environment variable not set."
            logger.warning("Bhashini credentials missing. Pipeline config will load when credentials are provided.")

    def load_pipeline_config(self):
        if not self.user_id or not self.api_key:
            self.user_id = os.getenv("BHASHINI_USER_ID")
            self.api_key = os.getenv("BHASHINI_API_KEY")

        if not self.user_id or not self.api_key:
            self.is_ready = False
            self.last_error = "BHASHINI_USER_ID and BHASHINI_API_KEY must be configured."
            return False

        try:
            body = {
                "pipelineTasks": [
                    {"taskType": "asr"},
                    {"taskType": "tts"},
                ],
                "pipelineRequestConfig": {"pipelineId": self.pipeline_id},
            }
            headers = {"userID": self.user_id, "ulcaApiKey": self.api_key}
            resp = requests.post(ULCA_BASE_URL + MODEL_PIPELINE_ENDPOINT, json=body, headers=headers, timeout=10)
            resp.raise_for_status()
            data = resp.json()

            self.asr_service_id = {}
            self.tts_service_id = {}

            for task in data.get("pipelineResponseConfig", []):
                if task.get("taskType") == "asr":
                    for lang in task.get("config", []):
                        self.asr_service_id[lang["language"]["sourceLanguage"]] = lang["serviceId"]
                if task.get("taskType") == "tts":
                    for lang in task.get("config", []):
                        self.tts_service_id[lang["language"]["sourceLanguage"]] = lang["serviceId"]

            auth = data["pipelineInferenceAPIEndPoint"]["inferenceApiKey"]
            self.inference_key = {auth["name"]: auth["value"]}
            self.callback_url = data["pipelineInferenceAPIEndPoint"]["callbackUrl"]
            self.is_ready = True
            self.last_error = None
            logger.info("Bhashini pipeline configured successfully.")
            return True
        except Exception as e:
            self.is_ready = False
            self.last_error = f"Failed to load Bhashini pipeline config: {str(e)}"
            logger.error(self.last_error)
            return False

    def asr(self, audio_path_or_bytes, source_language, sampling_rate=16000):
        if not self.is_ready:
            if not self.load_pipeline_config():
                raise RuntimeError(f"Bhashini pipeline not ready: {self.last_error}")

        if source_language not in self.asr_service_id:
            supported = list(self.asr_service_id.keys())
            raise ValueError(f"No ASR service available for '{source_language}'. Supported languages: {supported}")

        if isinstance(audio_path_or_bytes, bytes):
            audio_b64 = base64.b64encode(audio_path_or_bytes).decode("utf-8")
        elif isinstance(audio_path_or_bytes, str) and os.path.exists(audio_path_or_bytes):
            with open(audio_path_or_bytes, "rb") as f:
                audio_b64 = base64.b64encode(f.read()).decode("utf-8")
        else:
            # Assume base64 string
            audio_b64 = str(audio_path_or_bytes)

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
        resp = requests.post(self.callback_url, json=payload, headers=self.inference_key, timeout=15)
        resp.raise_for_status()
        result = resp.json()
        return result["pipelineResponse"][0]["output"][0]["source"]

    def tts(self, text, source_language, gender="female", out_path="output.wav"):
        if not self.is_ready:
            if not self.load_pipeline_config():
                raise RuntimeError(f"Bhashini pipeline not ready: {self.last_error}")

        if source_language not in self.tts_service_id:
            supported = list(self.tts_service_id.keys())
            raise ValueError(f"No TTS service available for '{source_language}'. Supported languages: {supported}")

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
        resp = requests.post(self.callback_url, json=payload, headers=self.inference_key, timeout=15)
        resp.raise_for_status()
        result = resp.json()
        audio_b64 = result["pipelineResponse"][0]["audio"][0]["audioContent"]
        audio_bytes = base64.b64decode(audio_b64)

        if out_path:
            with open(out_path, "wb") as f:
                f.write(audio_bytes)

        return audio_bytes

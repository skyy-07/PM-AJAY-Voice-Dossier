import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  UploadCloud,
  FileAudio,
  Play,
  Pause,
  Trash2,
  Loader2,
  Mic,
  Square,
  CheckCircle2,
  Volume2,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { SupportedLanguage } from '../types';
import { getLocale } from '../locales/i18n';

interface VoiceUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: SupportedLanguage;
  sessionId?: string | null;
  onTranscriptionComplete: (text: string, autoSubmitted?: boolean) => void;
}

export const VoiceUploadModal: React.FC<VoiceUploadModalProps> = ({
  isOpen,
  onClose,
  language,
  sessionId,
  onTranscriptionComplete,
}) => {
  const locale = getLocale(language);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [transcribedText, setTranscribedText] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // In-app recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<number | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      // Clean up states when closed
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      setSelectedFile(null);
      setAudioBase64(null);
      setAudioUrl(null);
      setIsPlaying(false);
      setIsUploading(false);
      setTranscribedText(null);
      setErrorMessage(null);
      if (isRecording) {
        stopRecording();
      }
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  if (!isOpen) return null;

  const handleFileChange = (file: File) => {
    setErrorMessage(null);
    setTranscribedText(null);

    // Validate size (max 25MB)
    if (file.size > 25 * 1024 * 1024) {
      setErrorMessage('Audio file size must be under 25 MB');
      return;
    }

    // Set preview URL
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    setSelectedFile(file);

    // Read as Base64
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setAudioBase64(result);
    };
    reader.onerror = () => {
      setErrorMessage('Failed to read audio file');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('audio/') || /\.(mp3|wav|m4a|ogg|webm|aac|flac|3gp)$/i.test(file.name)) {
        handleFileChange(file);
      } else {
        setErrorMessage('Please select a valid audio file (.mp3, .wav, .m4a, .webm, .ogg, .aac)');
      }
    }
  };

  const startRecording = async () => {
    try {
      setErrorMessage(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const recordedFile = new File([audioBlob], `voice-recording-${Date.now()}.webm`, {
          type: 'audio/webm',
        });
        handleFileChange(recordedFile);

        // Stop all audio tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(250);
      setIsRecording(true);
      setRecordingSeconds(0);

      recordingTimerRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Error starting audio recording:', err);
      setErrorMessage('Microphone access denied or not available');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((e) => console.error('Audio play error:', e));
    }
  };

  const handleUploadAndTranscribe = async (autoSubmit: boolean = true) => {
    if (!audioBase64) return;
    setIsUploading(true);
    setErrorMessage(null);

    try {
      const mime = selectedFile?.type || 'audio/webm';
      const res = await fetch('/api/voice/transcribe-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioBase64,
          mimeType: mime,
          language,
          sessionId: autoSubmit ? sessionId : undefined,
          autoSubmit,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to process audio');
      }

      setTranscribedText(data.transcription);
      setIsUploading(false);

      // Trigger completion callback
      onTranscriptionComplete(data.transcription, data.autoSubmitted);

      // Auto close after brief display
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      console.error('Upload transcription error:', err);
      setErrorMessage(err.message || 'Error processing audio with AI');
      setIsUploading(false);
    }
  };

  const handleRemoveAudio = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setSelectedFile(null);
    setAudioBase64(null);
    setAudioUrl(null);
    setIsPlaying(false);
    setTranscribedText(null);
    setErrorMessage(null);
  };

  // Preset sample voice recordings for instant one-click testing
  const sampleVoiceAudios = [
    {
      title: 'Farmer & Electric Motor Repair (Sample Voice Note)',
      subtitle: 'Hindi / Bengali vernacular response',
      text:
        language === 'bn'
          ? 'আমি গ্রামে চাষের কাজ করি এবং সেচ পাম্প মোটর ও ওয়্যারিংয়ের কাজ জানি।'
          : language === 'mr'
          ? 'मी शेती आणि इलेक्ट्रिक मोटर दुरुस्तीचे काम करतो.'
          : 'मैं खेती और बिजली की मोटर ठीक करने का काम करता हूँ।',
    },
    {
      title: 'Tailoring & Traditional Crafts (Sample Voice Note)',
      subtitle: 'Hands-on apparel & stitching response',
      text:
        language === 'bn'
          ? 'আমাদের পরিবারে ঐতিহ্যবাহী সেলাই এবং পোশাক তৈরির কাজ করা হয়।'
          : language === 'mr'
          ? 'आमच्या घरात शिलाई व हस्तकलेचे काम केले जाते.'
          : 'हमारे घर में सिलाई और कपड़ों के काम का अनुभव है।',
    },
  ];

  const handleUseSampleTranscript = (sample: (typeof sampleVoiceAudios)[0]) => {
    onTranscriptionComplete(sample.text, true);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-[#F8F8F4] shadow-2xl border border-stone-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 bg-white px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800">
              <UploadCloud className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">
                {locale.uploadVoiceTitle}
              </h2>
              <p className="text-xs text-stone-500">
                {locale.uploadVoiceSubtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-stone-600 hover:bg-stone-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* In-app Voice Recorder Bar */}
          <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-700">
                <Mic className="h-4 w-4 text-emerald-700" />
                <span>{locale.recordVoiceClip}</span>
              </div>
              {isRecording && (
                <span className="flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-700 animate-pulse">
                  <span className="h-2 w-2 rounded-full bg-red-600" />
                  Recording: {recordingSeconds}s
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {!isRecording ? (
                <button
                  type="button"
                  onClick={startRecording}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-800 transition active:scale-[0.98]"
                >
                  <Mic className="h-4 w-4" />
                  <span>Record Voice Note</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-red-700 transition animate-pulse"
                >
                  <Square className="h-4 w-4 fill-current" />
                  <span>{locale.stopRecording} ({recordingSeconds}s)</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-stone-200" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
              OR UPLOAD AUDIO FILE
            </span>
            <div className="h-px flex-1 bg-stone-200" />
          </div>

          {/* Drag & Drop Audio Upload Zone */}
          {!selectedFile ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition ${
                isDragOver
                  ? 'border-emerald-600 bg-emerald-50/60'
                  : 'border-stone-300 bg-white hover:border-emerald-500 hover:bg-stone-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*,.mp3,.wav,.m4a,.ogg,.webm,.aac,.flac,.3gp"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleFileChange(e.target.files[0]);
                  }
                }}
              />
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                <FileAudio className="h-7 w-7" />
              </div>
              <p className="text-xs font-bold text-stone-800 mb-1">
                {locale.dragAndDropAudio}
              </p>
              <p className="text-[11px] text-stone-500 max-w-xs">
                {locale.supportedAudioFormats}
              </p>
            </div>
          ) : (
            /* Selected Audio Player Card */
            <div className="rounded-2xl border border-emerald-300 bg-emerald-50/50 p-4 shadow-2xs">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white">
                    <FileAudio className="h-5 w-5" />
                  </div>
                  <div className="overflow-hidden text-left">
                    <div className="truncate text-xs font-bold text-stone-900">
                      {selectedFile.name}
                    </div>
                    <div className="text-[11px] text-stone-500">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedFile.type || 'audio file'}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveAudio}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-stone-400 hover:bg-stone-200 hover:text-stone-700"
                  title="Remove file"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Audio player element & waveform bar */}
              {audioUrl && (
                <div className="rounded-xl bg-white p-3 border border-emerald-200 flex items-center gap-3">
                  <audio
                    ref={audioRef}
                    src={audioUrl}
                    onEnded={() => setIsPlaying(false)}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={togglePlayPause}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-white shadow-xs hover:bg-emerald-800"
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                  </button>

                  <div className="flex-1">
                    <div className="flex items-center gap-1 h-5">
                      {[0.4, 0.8, 1.2, 0.6, 1.5, 1.1, 0.7, 1.3, 0.9, 0.5, 1.2, 0.7].map((height, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-full bg-emerald-600 transition-all duration-150"
                          style={{
                            height: `${isPlaying ? Math.max(4, height * 12) : 6}px`,
                            opacity: isPlaying ? 1 : 0.4,
                          }}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between text-[10px] text-stone-500 mt-1">
                      <span>{isPlaying ? 'Playing...' : 'Ready to listen'}</span>
                      <span>Audio Preview</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-3.5 flex gap-2">
                <button
                  type="button"
                  onClick={() => handleUploadAndTranscribe(true)}
                  disabled={isUploading}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#166534] px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#14532d] disabled:opacity-50 transition active:scale-[0.98]"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>{locale.transcribingAudio}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span>{locale.transcribeAndSubmit}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Error notice */}
          {errorMessage && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-700 border border-red-200">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Transcribed Text Feedback Display */}
          {transcribedText && (
            <div className="rounded-2xl border border-emerald-400 bg-emerald-100/60 p-3.5 text-center animate-fade-in">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-900 mb-1">
                <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                <span>{locale.audioUploadedSuccess}</span>
              </div>
              <p className="text-xs text-emerald-950 font-medium italic">
                "{transcribedText}"
              </p>
            </div>
          )}

          {/* Quick Pre-recorded Voice Samples for immediate testing */}
          <div className="rounded-2xl border border-stone-200 bg-stone-50 p-3.5">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-2">
              <Volume2 className="h-3.5 w-3.5 text-emerald-700" />
              <span>Test with Sample Voice Clips:</span>
            </div>
            <div className="space-y-1.5">
              {sampleVoiceAudios.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleUseSampleTranscript(sample)}
                  className="flex w-full items-center justify-between rounded-xl border border-stone-300/80 bg-white px-3 py-2 text-left text-xs transition hover:border-emerald-600 hover:bg-emerald-50 active:scale-[0.99]"
                >
                  <div>
                    <div className="font-bold text-stone-800">{sample.title}</div>
                    <div className="text-[11px] text-stone-500">"{sample.text}"</div>
                  </div>
                  <span className="shrink-0 rounded-lg bg-emerald-100 px-2 py-1 text-[10px] font-bold text-emerald-800">
                    Use Clip
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-stone-200 bg-white px-5 py-3 flex justify-between items-center text-xs text-stone-500">
          <span>AI-Powered Multimodal Transcription</span>
          <button
            type="button"
            onClick={onClose}
            className="font-bold text-stone-700 hover:text-stone-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useRef, useState } from 'react';
import { Mic, Activity, Radio, Volume2, Sparkles } from 'lucide-react';
import { audioController } from '../../lib/audio.js';

interface AudioFrequencyVisualizerProps {
  isActive: boolean;
  isProcessing?: boolean;
  theme?: 'amber' | 'emerald' | 'indigo' | 'cyan';
  height?: number;
  barCount?: number;
  showFrequencies?: boolean;
  showDecibels?: boolean;
  label?: string;
  className?: string;
}

export const AudioFrequencyVisualizer: React.FC<AudioFrequencyVisualizerProps> = ({
  isActive,
  isProcessing = false,
  theme = 'amber',
  height = 72,
  barCount = 32,
  showFrequencies = true,
  showDecibels = true,
  label,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [decibels, setDecibels] = useState<number>(-60);
  const [voiceDetected, setVoiceDetected] = useState<boolean>(false);
  const [dominantFrequency, setDominantFrequency] = useState<string>('0 Hz');

  // Color schemes
  const colorThemes = {
    amber: {
      barGradientTop: '#F59E0B',     // amber-500
      barGradientBottom: '#D97706',  // amber-600
      barGlow: 'rgba(245, 158, 11, 0.4)',
      accentText: 'text-amber-400',
      badgeBg: 'bg-amber-500/10',
      badgeBorder: 'border-amber-500/30',
      peakColor: '#FEF3C7',
      sineLine: '#FBBF24'
    },
    emerald: {
      barGradientTop: '#10B981',     // emerald-500
      barGradientBottom: '#059669',  // emerald-600
      barGlow: 'rgba(16, 185, 129, 0.4)',
      accentText: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/10',
      badgeBorder: 'border-emerald-500/30',
      peakColor: '#D1FAE5',
      sineLine: '#34D399'
    },
    indigo: {
      barGradientTop: '#6366F1',     // indigo-500
      barGradientBottom: '#4F46E5',  // indigo-600
      barGlow: 'rgba(99, 102, 241, 0.4)',
      accentText: 'text-indigo-400',
      badgeBg: 'bg-indigo-500/10',
      badgeBorder: 'border-indigo-500/30',
      peakColor: '#E0E7FF',
      sineLine: '#818CF8'
    },
    cyan: {
      barGradientTop: '#06B6D4',     // cyan-500
      barGradientBottom: '#0891B2',  // cyan-600
      barGlow: 'rgba(6, 182, 212, 0.4)',
      accentText: 'text-cyan-400',
      badgeBg: 'bg-cyan-500/10',
      badgeBorder: 'border-cyan-500/30',
      peakColor: '#CFFAFE',
      sineLine: '#22D3EE'
    }
  };

  const currentTheme = colorThemes[theme] || colorThemes.amber;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let analyser = audioController.getAnalyserNode();
    if (!analyser && isActive) {
      analyser = audioController.setupAnalyser();
    }

    const bufferLength = analyser ? analyser.frequencyBinCount : 128;
    const dataArray = new Uint8Array(bufferLength);
    const peaks = new Array(barCount).fill(0);

    let phase = 0;

    const render = () => {
      animationFrameRef.current = requestAnimationFrame(render);

      // Handle canvas resolution scaling
      const width = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, width, h);

      let maxVolume = 0;
      let maxFreqIndex = 0;
      let maxFreqVal = 0;

      if (isActive && analyser) {
        analyser.getByteFrequencyData(dataArray);

        // Calculate average volume & find dominant frequency
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          const val = dataArray[i];
          sum += val * val;
          if (val > maxFreqVal) {
            maxFreqVal = val;
            maxFreqIndex = i;
          }
        }
        const rms = Math.sqrt(sum / bufferLength);
        maxVolume = rms;

        // Approximate dB
        const db = rms > 0 ? Math.round(20 * Math.log10(rms / 255)) : -60;
        setDecibels(Math.max(-60, Math.min(0, db)));
        setVoiceDetected(rms > 12);

        // Approximate dominant Hz (assuming 44100Hz audio context sample rate)
        const audioCtx = audioController.getAudioContext();
        const sampleRate = audioCtx ? audioCtx.sampleRate : 44100;
        const nyquist = sampleRate / 2;
        const dominantHz = Math.round((maxFreqIndex / bufferLength) * nyquist);
        if (rms > 15 && dominantHz > 80 && dominantHz < 4000) {
          setDominantFrequency(`${dominantHz} Hz`);
        } else if (rms <= 15) {
          setDominantFrequency('Ambient');
        }
      } else if (isActive) {
        // Fallback mathematical simulation if direct Web Audio node isn't attached
        phase += 0.12;
        maxVolume = 35 + Math.sin(phase * 1.5) * 20;
        setDecibels(-28 + Math.round(Math.sin(phase) * 6));
        setVoiceDetected(true);
        setDominantFrequency(`${240 + Math.round(Math.sin(phase * 2) * 80)} Hz`);
      } else if (isProcessing) {
        phase += 0.08;
        maxVolume = 18 + Math.sin(phase * 3) * 10;
        setDecibels(-45);
        setVoiceDetected(false);
        setDominantFrequency('Processing');
      } else {
        maxVolume = 0;
        setDecibels(-60);
        setVoiceDetected(false);
        setDominantFrequency('Idle');
      }

      // Draw subtle background grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, h * 0.25);
      ctx.lineTo(width, h * 0.25);
      ctx.moveTo(0, h * 0.5);
      ctx.lineTo(width, h * 0.5);
      ctx.moveTo(0, h * 0.75);
      ctx.lineTo(width, h * 0.75);
      ctx.stroke();

      // Render Frequency Bars
      const gap = 3;
      const totalGaps = (barCount - 1) * gap;
      const barWidth = Math.max(2, (width - totalGaps) / barCount);

      for (let i = 0; i < barCount; i++) {
        let barHeight = 4;

        if (isActive && analyser) {
          // Sample across human vocal spectrum (bins 2 to 48)
          const binIndex = Math.min(bufferLength - 1, Math.floor((i / barCount) * Math.min(bufferLength, 54)) + 2);
          const rawVal = dataArray[binIndex] || 0;
          const normalized = rawVal / 255;
          barHeight = Math.max(4, normalized * (h - 10));
        } else if (isActive) {
          // Simulated organic wave
          const wave = Math.sin(phase + i * 0.25) * 0.5 + 0.5;
          const harmonic = Math.sin(phase * 2 + i * 0.4) * 0.3;
          barHeight = Math.max(4, (wave + harmonic) * (h - 14));
        } else if (isProcessing) {
          // Gentle shimmer wave during AI reasoning
          const wave = Math.sin(phase + i * 0.2) * 0.4 + 0.4;
          barHeight = Math.max(3, wave * (h * 0.4));
        } else {
          // Idle flat baseline
          barHeight = 4;
        }

        // Peak drop physics
        if (barHeight > peaks[i]) {
          peaks[i] = barHeight;
        } else {
          peaks[i] = Math.max(4, peaks[i] - 0.75);
        }

        const x = i * (barWidth + gap);
        const y = h - barHeight;

        // Bar Gradient
        const gradient = ctx.createLinearGradient(x, y, x, h);
        if (isActive) {
          gradient.addColorStop(0, currentTheme.barGradientTop);
          gradient.addColorStop(1, currentTheme.barGradientBottom);
        } else if (isProcessing) {
          gradient.addColorStop(0, '#A855F7');
          gradient.addColorStop(1, '#6366F1');
        } else {
          gradient.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0.05)');
        }

        // Draw rounded bar
        ctx.fillStyle = gradient;
        const radius = Math.min(barWidth / 2, 3);
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, [radius, radius, 0, 0]);
        ctx.fill();

        // Draw peak indicator dot
        if (isActive && peaks[i] > 8) {
          ctx.fillStyle = currentTheme.peakColor;
          ctx.beginPath();
          ctx.arc(x + barWidth / 2, h - peaks[i] - 2, Math.min(2, barWidth / 2), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw active sine contour across top of bars for vocal continuity
      if (isActive && maxVolume > 10) {
        ctx.beginPath();
        ctx.strokeStyle = currentTheme.sineLine;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = currentTheme.barGlow;
        ctx.shadowBlur = 8;

        for (let i = 0; i < barCount; i++) {
          const x = i * (barWidth + gap) + barWidth / 2;
          const y = Math.max(4, h - peaks[i] - 3);
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
        ctx.shadowBlur = 0; // Reset shadow
      }
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive, isProcessing, theme, barCount]);

  return (
    <div className={`w-full bg-[#121212] rounded-xl border border-white/10 p-3.5 shadow-inner ${className}`}>
      {/* Top telemetry & status bar */}
      <div className="flex items-center justify-between text-[11px] mb-2.5">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5">
            <span className="relative flex h-2 w-2">
              {isActive ? (
                <>
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${theme === 'amber' ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${theme === 'amber' ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                </>
              ) : isProcessing ? (
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-400 animate-pulse"></span>
              ) : (
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white/30"></span>
              )}
            </span>
            <span className="font-mono uppercase tracking-wider text-white/70 text-[10px]">
              {isActive ? (
                <span className={currentTheme.accentText}>
                  {voiceDetected ? '🎙️ Audio Signal Detected' : '🎙️ Microphone Active (Speak)'}
                </span>
              ) : isProcessing ? (
                <span className="text-purple-400">⚡ AI Processing Speech...</span>
              ) : (
                <span className="text-white/40">Mic Standby</span>
              )}
            </span>
          </div>

          {label && (
            <span className="hidden sm:inline-block text-[10px] text-white/40 border-l border-white/10 pl-2">
              {label}
            </span>
          )}
        </div>

        {/* Real-time decibels and frequency telemetry */}
        <div className="flex items-center space-x-2 font-mono text-[10px]">
          {showDecibels && (
            <div className={`px-2 py-0.5 rounded border ${currentTheme.badgeBg} ${currentTheme.badgeBorder} ${currentTheme.accentText}`}>
              <span className="text-white/50 mr-1">Level:</span>
              <span className="font-semibold">{isActive ? `${decibels} dB` : '-- dB'}</span>
            </div>
          )}

          {showFrequencies && (
            <div className="hidden sm:flex items-center px-2 py-0.5 rounded border border-white/10 bg-white/5 text-white/80">
              <span className="text-white/40 mr-1">Pitch:</span>
              <span className="font-semibold">{dominantFrequency}</span>
            </div>
          )}
        </div>
      </div>

      {/* Frequency Canvas Waveform */}
      <div className="relative w-full rounded-lg overflow-hidden bg-black/40 border border-white/5">
        <canvas
          ref={canvasRef}
          width={480}
          height={height}
          className="w-full block"
          style={{ height: `${height}px` }}
        />

        {/* Ambient Overlay label if not active */}
        {!isActive && !isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
            <span className="text-[10px] font-mono text-white/30 tracking-wider uppercase flex items-center space-x-1.5">
              <Activity className="w-3 h-3 text-white/20" />
              <span>Tap Microphone to Start Voice Intake</span>
            </span>
          </div>
        )}
      </div>

      {/* Frequency range labels across bottom */}
      {showFrequencies && (
        <div className="flex items-center justify-between text-[8px] font-mono text-white/30 mt-1.5 px-1 uppercase">
          <span>80Hz (Bass)</span>
          <span>300Hz (Vocal Root)</span>
          <span>1.5kHz (Speech Clarity)</span>
          <span>4kHz (Presence)</span>
        </div>
      )}
    </div>
  );
};

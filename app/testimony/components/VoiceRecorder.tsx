"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Mic,
  Square,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  CheckCircle,
  AlertCircle,
  Download,
  Trash2,
  Sparkles,
} from "lucide-react";

interface VoiceRecorderProps {
  onAudioRecorded: (data: { blob: Blob; url: string; duration: number } | null) => void;
  existingAudioUrl?: string | null;
}

export default function VoiceRecorder({ onAudioRecorded, existingAudioUrl }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(existingAudioUrl || null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioDuration, setAudioDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const drawVisualizer = useCallback(() => {
    if (!canvasRef.current || !analyserRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      animationFrameRef.current = requestAnimationFrame(render);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barCount = 36;
      const barWidth = (canvas.width / barCount) - 3;
      const step = Math.floor(bufferLength / barCount);

      for (let i = 0; i < barCount; i++) {
        const value = dataArray[i * step] || 0;
        const percent = value / 255;
        const barHeight = Math.max(4, percent * (canvas.height - 10));
        const x = i * (barWidth + 3);
        const y = (canvas.height - barHeight) / 2;

        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        gradient.addColorStop(0, "#dfa458");
        gradient.addColorStop(0.5, "#f3c053");
        gradient.addColorStop(1, "#1f5ea8");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 3);
        ctx.fill();
      }
    };

    render();
  }, []);

  const startRecording = async () => {
    setErrorMessage(null);
    audioChunksRef.current = [];
    setRecordingTime(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      streamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 128;
      source.connect(analyser);
      analyserRef.current = analyser;

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/mp4")
          ? "audio/mp4"
          : "";

      const mediaRecorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };


      mediaRecorder.onstop = () => {
        const actualMimeType =
          mediaRecorder.mimeType || mimeType || "audio/webm";

        const finalBlob = new Blob(audioChunksRef.current, {
          type: actualMimeType,
        });

        if (finalBlob.size === 0) {
          setErrorMessage("L'enregistrement est vide. Veuillez réessayer.");
          return;
        }

        const url = URL.createObjectURL(finalBlob);

        setAudioBlob(finalBlob);
        setAudioUrl(url);

        onAudioRecorded({
          blob: finalBlob,
          url,
          duration: recordingTime,
        });
      };

      mediaRecorder.start(200);
      setIsRecording(true);
      setIsPaused(false);

      timerIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      drawVisualizer();
    } catch (err: unknown) {
      console.error("Microphone access error:", err);
      if (err instanceof DOMException && err.name === "NotAllowedError") {
        setErrorMessage("Microphone access was denied. Please allow microphone permissions in your browser to record.");
      } else {
        setErrorMessage("Could not connect to microphone. Please check your audio input settings.");
      }
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording && !isPaused) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isRecording && isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      timerIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      setAudioDuration(recordingTime);

      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close();
      }
    }
  };

  const resetRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setAudioBlob(null);
    setRecordingTime(0);
    setAudioDuration(0);
    setIsPlaying(false);
    setPlaybackProgress(0);
    onAudioRecorded(null);
  };

  const togglePlay = () => {
    if (!audioPlayerRef.current) return;
    if (isPlaying) {
      audioPlayerRef.current.pause();
      setIsPlaying(false);
    } else {
      audioPlayerRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (audioPlayerRef.current) {
      const current = audioPlayerRef.current.currentTime;
      const total = audioPlayerRef.current.duration || audioDuration || 1;
      setPlaybackProgress((current / total) * 100);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setPlaybackProgress(0);
  };

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div className="rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-[#f3c053]/25 p-6 sm:p-8 space-y-6 shadow-sm dark:shadow-[0_12px_30px_rgba(0,0,0,0.4)] transition-colors">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-[#dfa458] dark:text-[#f3c053]" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-wide">
              Voice Testimony Recorder
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Speak from your heart. High-definition microphone audio capture with instant review.
          </p>
        </div>

        {/* Status Pill */}
        <div className="flex items-center gap-2">
          {isRecording ? (
            <span className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              {isPaused ? "Recording Paused" : "Recording Live"}
            </span>
          ) : audioUrl ? (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              <CheckCircle className="w-3.5 h-3.5" />
              Audio Ready
            </span>
          ) : (
            <span className="text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-white/5 px-3 py-1 rounded-full border border-slate-200 dark:border-white/10">
              Ready to record
            </span>
          )}
        </div>
      </div>

      {/* Error notification */}
      {errorMessage && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-200 text-sm">
          <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-red-700 dark:text-red-300">Microphone Issue</p>
            <p className="text-xs text-red-600 dark:text-red-200/90 mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Visualizer Canvas & Time */}
      <div className="relative rounded-xl bg-slate-50 dark:bg-[#070b16] border border-slate-200 dark:border-[#1f5ea8]/30 p-6 flex flex-col items-center justify-center min-h-[160px] overflow-hidden transition-colors">
        <div className="absolute inset-0 pointer-events-none opacity-10 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full bg-[#f3c053] blur-2xl" />
        </div>

        {/* Real-time Frequency Canvas */}
        <canvas
          ref={canvasRef}
          width={480}
          height={70}
          className="w-full max-w-md h-16 object-contain z-10"
        />

        {/* Timer display */}
        <div className="mt-3 flex items-center gap-2 z-10">
          <span
            className={`font-mono text-2xl font-bold tracking-widest ${isRecording && !isPaused
                ? "text-[#dfa458] dark:text-[#fce39e] drop-shadow-sm"
                : "text-slate-600 dark:text-slate-400"
              }`}
          >
            {isRecording ? formatTime(recordingTime) : audioDuration ? formatTime(audioDuration) : "00:00"}
          </span>
          {isRecording && (
            <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest font-mono">
              / 10:00 Max
            </span>
          )}
        </div>
      </div>

      {/* Recording Controls */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
        {!isRecording && !audioUrl && (
          <button
            type="button"
            onClick={startRecording}
            className="gold-glow-btn flex items-center gap-3 px-8 py-3.5 rounded-full font-bold text-base cursor-pointer tracking-wide"
          >
            <Mic className="w-5 h-5 text-[#0b1120]" />
            <span>Tap to Record Voice</span>
          </button>
        )}

        {isRecording && (
          <>
            {isPaused ? (
              <button
                type="button"
                onClick={resumeRecording}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1f5ea8] hover:bg-[#256ec2] text-white text-sm font-semibold transition cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Resume</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={pauseRecording}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-600 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-sm font-semibold transition cursor-pointer"
              >
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </button>
            )}

            <button
              type="button"
              onClick={stopRecording}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-sm font-semibold shadow-md transition cursor-pointer"
            >
              <Square className="w-4 h-4 fill-white" />
              <span>Finish & Keep</span>
            </button>
          </>
        )}

        {/* Audio Review Player */}
        {audioUrl && !isRecording && (
          <div className="w-full space-y-4">
            <audio
              ref={audioPlayerRef}
              src={audioUrl}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleAudioEnded}
              className="hidden"
            />

            <div className="rounded-xl bg-slate-100 dark:bg-[#141f36] border border-slate-300 dark:border-[#f3c053]/30 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="w-12 h-12 rounded-full bg-[#f3c053] hover:bg-[#fce39e] text-[#090d18] flex items-center justify-center shadow-md transition cursor-pointer flex-shrink-0"
                  aria-label={isPlaying ? "Pause playback" : "Play audio"}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 fill-current" />
                  ) : (
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  )}
                </button>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>Voice Testimony Note</span>
                    <Sparkles className="w-3.5 h-3.5 text-[#dfa458] dark:text-[#f3c053]" />
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Duration: {formatTime(audioDuration || (audioPlayerRef.current?.duration || 0))}
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="flex-1 w-full max-w-xs mx-2">
                <div className="w-full h-2 rounded-full bg-slate-300 dark:bg-slate-800 overflow-hidden cursor-pointer">
                  <div
                    className="h-full bg-gradient-to-r from-[#dfa458] to-[#1f5ea8] transition-all duration-150"
                    style={{ width: `${playbackProgress}%` }}
                  />
                </div>
              </div>

              {/* Player Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <a
                  href={audioUrl}
                  download="revival-bearer-testimony.webm"
                  className="p-2.5 rounded-lg bg-white dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-transparent transition"
                  title="Download copy"
                >
                  <Download className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={resetRecording}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-300 border border-red-500/20 text-xs font-semibold transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Re-record</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400">
        💡 <span className="font-semibold text-slate-700 dark:text-slate-300">Tip:</span> Speak clearly about your challenge, how God answered prayer, and how your faith was strengthened!
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import {
  X,
  Sparkles,
  Heart,
  Share2,
  Shield,
  BookOpen,
  Calendar,
  Volume2,
  Play,
  Pause,
} from "lucide-react";
import { useState, useRef } from "react";

export interface TestimonyData {
  title: string;
  category: string;
  scripture: string;
  story: string;
  authorName: string;
  isAnonymous: boolean;
  campusOrCity: string;
  audioUrl?: string | null;
  audioDuration?: number;
  inputMode: "text" | "voice" | "dictate";
  createdAt?: string;
}

interface TestimonyCardPreviewProps {
  testimony: TestimonyData;
  isOpen: boolean;
  onClose: () => void;
}

export default function TestimonyCardPreview({
  testimony,
  isOpen,
  onClose,
}: TestimonyCardPreviewProps) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  if (!isOpen) return null;

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play();
      setIsPlayingAudio(true);
    }
  };

  const displayName = testimony.isAnonymous
    ? "A Youth Believer (Anonymous)"
    : testimony.authorName || "Revival Bearer Member";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-[#0b1222] border border-slate-200 dark:border-[#f3c053]/40 p-6 sm:p-8 shadow-2xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-colors">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition cursor-pointer"
          aria-label="Close Preview"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-200 dark:border-white/10">
          <Sparkles className="w-5 h-5 text-[#dfa458] dark:text-[#f3c053]" />
          <span className="text-xs uppercase tracking-widest font-bold text-[#dfa458] dark:text-[#f3c053]">
            Feed Card Preview
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">• How it appears to the community</span>
        </div>

        {/* The Card Itself */}
        <div className="relative rounded-2xl bg-slate-50 dark:bg-gradient-to-b dark:from-[#101a30] dark:to-[#0c1324] border border-slate-200 dark:border-[#f3c053]/25 p-6 sm:p-7 space-y-5 overflow-hidden transition-colors">
          {/* Star Watermark */}
          <div className="absolute top-0 right-0 pointer-events-none opacity-5 dark:opacity-5 translate-x-1/4 -translate-y-1/4">
            <Image
              src="/logos/rb-star-gold.png"
              alt="Revival Star"
              width={260}
              height={260}
            />
          </div>

          {/* Top metadata row */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#1f5ea8]/10 text-[#1f5ea8] dark:bg-[#1f5ea8]/30 dark:text-[#60a5fa] border border-[#1f5ea8]/25 dark:border-[#1f5ea8]/60">
                {testimony.category || "General Testimony"}
              </span>
              {testimony.audioUrl && (
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#dfa458]/15 text-[#996515] dark:bg-[#f3c053]/20 dark:text-[#fce39e] border border-[#dfa458]/30 dark:border-[#f3c053]/40">
                  <Volume2 className="w-3 h-3 text-[#dfa458] dark:text-[#f3c053]" />
                  <span>Voice Note</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>Just now</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-snug">
            {testimony.title || "Untitled Testimony"}
          </h3>

          {/* Scripture Anchor if provided */}
          {testimony.scripture && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 dark:bg-[#f3c053]/10 border border-amber-200 dark:border-[#f3c053]/25 text-xs text-[#996515] dark:text-[#fce39e]">
              <BookOpen className="w-4 h-4 text-[#dfa458] dark:text-[#f3c053] flex-shrink-0" />
              <span className="font-semibold">{testimony.scripture}</span>
            </div>
          )}

          {/* Audio Player if present */}
          {testimony.audioUrl && (
            <div className="p-4 rounded-xl bg-white dark:bg-[#090e1a] border border-slate-200 dark:border-[#1f5ea8]/40 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={toggleAudio}
                  className="w-10 h-10 rounded-full bg-[#f3c053] text-[#090d18] flex items-center justify-center hover:bg-[#fce39e] transition cursor-pointer shadow-sm"
                >
                  {isPlayingAudio ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  )}
                </button>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Audio Testimony Note</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Listen to this voice recording</p>
                </div>
              </div>
              <audio
                ref={audioRef}
                src={testimony.audioUrl}
                onEnded={() => setIsPlayingAudio(false)}
                className="hidden"
              />
              <span className="text-xs font-mono text-[#1f5ea8] dark:text-[#f3c053]">
                {testimony.audioDuration ? `${Math.floor(testimony.audioDuration / 60)}:${(testimony.audioDuration % 60).toString().padStart(2, "0")}` : "Voice"}
              </span>
            </div>
          )}

          {/* Story Body */}
          <div className="text-slate-700 dark:text-slate-200 text-sm sm:text-base leading-relaxed whitespace-pre-line border-t border-slate-200 dark:border-white/5 pt-4">
            {testimony.story || "No written story provided yet."}
          </div>

          {/* Author Badge & Location */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-white/10 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#1f5ea8] flex items-center justify-center text-white font-bold text-xs">
                {testimony.isAnonymous ? (
                  <Shield className="w-3.5 h-3.5 text-[#fce39e]" />
                ) : (
                  displayName.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">{displayName}</span>
                {testimony.campusOrCity && (
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">{testimony.campusOrCity}</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-red-500 transition cursor-pointer">
                <Heart className="w-4 h-4" />
                <span>Encourage</span>
              </span>
              <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-[#dfa458] dark:hover:text-[#f3c053] transition cursor-pointer">
                <Share2 className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm font-semibold transition cursor-pointer"
          >
            Back to Editor
          </button>
        </div>
      </div>
    </div>
  );
}

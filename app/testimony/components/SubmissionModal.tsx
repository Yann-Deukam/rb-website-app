"use client";

import Image from "next/image";
import {
  Sparkles,
  CheckCircle2,
  Database,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { TestimonyData } from "./TestimonyCardPreview";

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  testimony: TestimonyData | null;
  onResetForm: () => void;
  onOpenPreview: () => void;
}

export default function SubmissionModal({
  isOpen,
  onClose,
  testimony,
  onResetForm,
  onOpenPreview,
}: SubmissionModalProps) {
  if (!isOpen || !testimony) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#0a101f] border border-slate-200 dark:border-[#f3c053]/40 p-6 sm:p-8 text-center space-y-6 shadow-2xl dark:shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden transition-colors">
        {/* Radiant Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#dfa458]/20 dark:bg-[#f3c053]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Golden Star Icon Animation */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-[#131e36] border-2 border-[#dfa458] dark:border-[#f3c053] flex items-center justify-center shadow-md dark:shadow-[0_0_30px_rgba(243,192,83,0.5)]">
              <Image
                src="/logos/rb-star-gold.png"
                alt="Revival Star Emblem"
                width={50}
                height={50}
                className="object-contain animate-pulse"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        {/* Main Heading */}
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-widest font-extrabold text-[#b87b1e] dark:text-[#f3c053]">
            Praise God!
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Testimony Received!
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-sm mx-auto">
            Thank you for bearing witness to God&apos;s faithfulness in your life. Your story
            will inspire our youth community.
          </p>
        </div>

        {/* Submission Details Card */}
        <div className="text-left rounded-xl bg-slate-50 dark:bg-[#0f172c] border border-slate-200 dark:border-white/10 p-4 space-y-2.5 text-xs transition-colors">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-white/5">
            <span className="text-slate-500 dark:text-slate-400">Title:</span>
            <span className="font-bold text-slate-900 dark:text-white max-w-[200px] truncate">
              {testimony.title || "Untitled"}
            </span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-white/5">
            <span className="text-slate-500 dark:text-slate-400">Category:</span>
            <span className="text-[#996515] dark:text-[#fce39e] font-semibold">{testimony.category}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-white/5">
            <span className="text-slate-500 dark:text-slate-400">Input Method:</span>
            <span className="text-slate-800 dark:text-slate-200 uppercase font-mono font-semibold">
              {testimony.inputMode === "voice"
                ? "🎙️ Voice Recording"
                : testimony.inputMode === "dictate"
                ? "🗣️ Live Dictation"
                : "✍️ Written Story"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400">Identity:</span>
            <span className="text-slate-700 dark:text-slate-300">
              {testimony.isAnonymous ? "Protected (Anonymous)" : testimony.authorName || "Member"}
            </span>
          </div>
        </div>

        {/* Real-time Storage & Moderation Pipeline Status */}
        <div className="rounded-xl bg-amber-50 dark:bg-[#142340]/70 border border-amber-200 dark:border-[#f3c053]/40 p-3.5 text-left text-xs space-y-1.5 transition-colors">
          <div className="flex items-center gap-2 text-[#996515] dark:text-[#f3c053] font-semibold">
            <ShieldCheck className="w-4 h-4 text-[#dfa458] dark:text-[#f3c053]" />
            <span>Enregistré dans la base de données & Modération</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-normal">
            Votre témoignage a été transmis et sauvegardé de manière sécurisée.
            L&apos;équipe pastorale effectue une relecture bienveillante avant mise en avant sur le Mur du Réveil.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={onOpenPreview}
            className="flex-1 py-3 px-4 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-[#16223d] dark:hover:bg-[#1d2d50] text-slate-800 dark:text-[#fce39e] border border-slate-300 dark:border-[#f3c053]/30 font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <span>View Card Preview</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              onResetForm();
              onClose();
            }}
            className="gold-glow-btn flex-1 py-3 px-4 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Submit Another</span>
          </button>
        </div>
      </div>
    </div>
  );
}

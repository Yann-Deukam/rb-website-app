"use client";

import Image from "next/image";
import { Sparkles, Mic, PenLine, Volume2, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

export default function TestimonyHero() {
  const { t } = useLanguage();

  return (
    <div className="relative pt-8 pb-12 sm:pt-14 sm:pb-16 text-center overflow-hidden">
      {/* Background celestial aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-[#1f5ea8]/15 via-[#f3c053]/15 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Star Emblem with Radiant Halo */}
      <div className="flex justify-center mb-6">
        <div className="relative group">
          <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-[#dfa458]/30 via-[#1f5ea8]/20 to-[#dfa458]/30 dark:from-[#f3c053]/30 dark:via-[#1f5ea8]/30 dark:to-[#f3c053]/30 blur-xl opacity-70 group-hover:opacity-100 transition duration-1000 animate-pulse-ring" />
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white dark:bg-[#0b1120] border-2 border-[#dfa458]/50 dark:border-[#f3c053]/40 flex items-center justify-center p-3 shadow-[0_10px_30px_rgba(223,164,88,0.25)] dark:shadow-[0_0_35px_rgba(243,192,83,0.35)] transition-colors">
            <Image
              src="/logos/rb-star-gold.png"
              alt="Revival Bearer Star Emblem"
              width={100}
              height={100}
              priority
              className="object-contain drop-shadow-[0_0_15px_rgba(243,192,83,0.6)]"
            />
          </div>
        </div>
      </div>

      {/* Community Tag & Scripture Pill */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#dfa458]/15 dark:bg-[#f3c053]/10 border border-[#dfa458]/35 dark:border-[#f3c053]/30 text-xs sm:text-sm font-semibold text-[#996515] dark:text-[#fce39e] mb-4 shadow-sm dark:shadow-[0_0_20px_-3px_rgba(243,192,83,0.25)] transition-colors">
        <Sparkles className="w-3.5 h-3.5 text-[#dfa458] dark:text-[#f3c053]" />
        <span>{t("testimony.hero_portal")}</span>
      </div>

      {/* Main Title */}
      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight sm:leading-none transition-colors">
        {t("testimony.hero_title")}{" "}
        <span className="gold-gradient-text">{t("testimony.hero_title_highlight")}</span>
      </h1>

      {/* Subtitle */}
      <p className="mt-4 sm:mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed px-4 transition-colors">
        {t("testimony.hero_desc")}
      </p>

      {/* Three Input Capabilities Highlight */}
      <div className="mt-8 flex flex-wrap justify-center items-center gap-3 sm:gap-4 px-4">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#16223d]/80 border border-slate-200 dark:border-[#1f5ea8]/40 text-xs text-slate-700 dark:text-slate-200 shadow-sm transition-colors">
          <PenLine className="w-3.5 h-3.5 text-[#dfa458] dark:text-[#f3c053]" />
          <span>{t("testimony.write_pill")}</span>
        </div>
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#16223d]/80 border border-slate-200 dark:border-[#f3c053]/40 text-xs text-slate-700 dark:text-slate-200 shadow-sm transition-colors">
          <Volume2 className="w-3.5 h-3.5 text-[#dfa458] dark:text-[#f3c053]" />
          <span>{t("testimony.record_pill")}</span>
        </div>
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#16223d]/80 border border-slate-200 dark:border-[#1f5ea8]/40 text-xs text-slate-700 dark:text-slate-200 shadow-sm transition-colors">
          <Mic className="w-3.5 h-3.5 text-[#1f5ea8] dark:text-[#60a5fa]" />
          <span>{t("testimony.dictate_pill")}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
          <span>{t("testimony.anon_pill")}</span>
        </div>
      </div>

      {/* Scripture Anchor Banner */}
      <div className="mt-6 max-w-2xl mx-auto px-4">
        <blockquote className="italic text-xs sm:text-sm text-slate-700 bg-amber-50/80 dark:bg-gradient-to-r dark:from-transparent dark:via-[#f3c053]/10 dark:to-transparent py-2.5 px-4 rounded-xl border border-amber-200/80 dark:border-y dark:border-[#f3c053]/15 shadow-sm transition-colors">
          {t("statement.verse")}
        </blockquote>
      </div>
    </div>
  );
}

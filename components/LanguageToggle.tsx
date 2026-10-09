"use client";

import { useLanguage } from "./LanguageProvider";
import { Globe } from "lucide-react";

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      aria-label="Changer de langue / Switch language"
      title={language === "fr" ? "Passer en Anglais" : "Switch to French"}
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 transition cursor-pointer"
    >
      <Globe className="w-3.5 h-3.5 text-[#dfa458] dark:text-[#f3c053]" />
      <span className="uppercase tracking-wider font-mono">
        {language === "fr" ? "FR" : "EN"}
      </span>
    </button>
  );
}

"use client";

import { useTheme } from "./ThemeProvider";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative p-2 rounded-full transition-all duration-300 cursor-pointer flex items-center justify-center ${
        isDark
          ? "bg-[#141e34] hover:bg-[#1c2b4a] text-[#fce39e] border border-[#f3c053]/30 shadow-[0_0_12px_rgba(243,192,83,0.2)]"
          : "bg-slate-100 hover:bg-slate-200 text-[#1f5ea8] border border-slate-300 shadow-sm"
      } ${className}`}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      title={`Current: ${theme} theme. Tap to switch to ${isDark ? "light" : "dark"} theme.`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-4 h-4 text-[#f3c053] transition-transform duration-500 rotate-0 hover:rotate-90" />
        ) : (
          <Moon className="w-4 h-4 text-[#1f5ea8] transition-transform duration-500 -rotate-12 hover:rotate-0" />
        )}
      </div>
      <span className="sr-only">Toggle {isDark ? "light" : "dark"} theme</span>
    </button>
  );
}

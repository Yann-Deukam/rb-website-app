"use client";

import { useEffect, useState } from "react";
import { Megaphone, X, ArrowRight, Calendar } from "lucide-react";
import Link from "next/link";
import { supabase, AnnouncementRecord } from "@/lib/supabase";

interface AnnouncementBannerProps {
  clear?: boolean;
}

export default function AnnouncementBanner({ clear = false }: AnnouncementBannerProps) {
  const [announcement, setAnnouncement] = useState<AnnouncementRecord | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadActiveAnnouncement() {
      try {
        const { data, error } = await supabase
          .from("announcements")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (!error && data && isMounted) {
          setAnnouncement(data as AnnouncementRecord);
        }
      } catch (err) {
        console.warn("Announcement fetch:", err);
      }
    }

    loadActiveAnnouncement();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!announcement || !isVisible) return null;

  return (
    <aside
      aria-label="Annonce officielle"
      className={`w-full border-b transition-colors duration-300 px-4 py-2 sm:py-2.5 text-xs ${
        clear
          ? "bg-[#070a12]/75 backdrop-blur-md border-[#f3c053]/25 text-white"
          : "bg-amber-50/90 dark:bg-[#080d19]/95 backdrop-blur-md border-amber-200/80 dark:border-[#f3c053]/20 text-slate-800 dark:text-slate-200"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#dfa458] text-[#090d18] font-black text-[10px] uppercase tracking-wider shadow-sm">
            <Megaphone className="w-3 h-3" />
            <span>{announcement.tag || "Annonce"}</span>
          </span>

          <p className="font-semibold truncate">
            <span>{announcement.title}</span>
            <span className="hidden sm:inline font-normal opacity-80 ml-2">
              — {announcement.content}
            </span>
          </p>

          {announcement.event_date && (
            <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-medium text-[#996515] dark:text-[#fce39e] bg-[#dfa458]/15 px-2 py-0.5 rounded-md shrink-0">
              <Calendar className="w-3 h-3 text-[#dfa458] dark:text-[#f3c053]" />
              {announcement.event_date}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {announcement.link_url && (
            <Link
              href={announcement.link_url}
              className="inline-flex items-center gap-1 font-bold text-xs text-[#1f5ea8] dark:text-[#f3c053] hover:underline"
            >
              <span>{announcement.link_label || "En savoir plus"}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}

          <button
            type="button"
            onClick={() => setIsVisible(false)}
            aria-label="Fermer l'annonce"
            className="p-1 rounded-full text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}

"use client";

import { useRef } from "react";
import Image from "next/image";
import { Sparkles, Users, Crown, ArrowRight, ShieldCheck, HeartHandshake } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface MembershipHeroProps {
  activeTab: "member" | "partner";
  setActiveTab: (tab: "member" | "partner") => void;
}

export default function MembershipHero({ activeTab, setActiveTab }: MembershipHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const starRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const toggleRef = useRef<HTMLDivElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        starRef.current,
        { scale: 0.6, opacity: 0, rotation: -20 },
        { scale: 1, opacity: 1, rotation: 0, duration: 0.9 }
      )
        .fromTo(
          titleRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          "-=0.5"
        )
        .fromTo(
          subtitleRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7 },
          "-=0.4"
        )
        .fromTo(
          toggleRef.current,
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7 },
          "-=0.3"
        )
        .fromTo(
          badgesRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.6 },
          "-=0.2"
        );
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="relative pt-8 pb-12 sm:pt-14 sm:pb-16 text-center overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#1f5ea8]/15 via-[#dfa458]/15 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Emblem */}
      <div ref={starRef} className="flex justify-center mb-6">
        <div className="relative group">
          <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-[#dfa458]/30 via-[#1f5ea8]/30 to-[#dfa458]/30 blur-xl opacity-70 group-hover:opacity-100 transition duration-700 animate-pulse-ring" />
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white dark:bg-[#0b1120] border-2 border-[#dfa458]/50 dark:border-[#f3c053]/40 flex items-center justify-center p-3 shadow-md dark:shadow-[0_0_35px_rgba(243,192,83,0.35)] transition-colors">
            <Image
              src="/logos/rb-star-gold.png"
              alt="Revival Bearer Star Emblem"
              width={100}
              height={100}
              priority
              className="object-contain drop-shadow-[0_0_15px_rgba(243,192,83,0.5)]"
            />
          </div>
        </div>
      </div>

      {/* Community Subheading Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#dfa458]/15 dark:bg-[#f3c053]/10 border border-[#dfa458]/35 dark:border-[#f3c053]/30 text-xs sm:text-sm font-semibold text-[#996515] dark:text-[#fce39e] mb-4 shadow-sm transition-colors">
        <Sparkles className="w-3.5 h-3.5 text-[#dfa458] dark:text-[#f3c053]" />
        <span>Revival Bearer Community & Alliance</span>
      </div>

      {/* Title */}
      <h1
        ref={titleRef}
        className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight sm:leading-none transition-colors"
      >
        Rejoindre <span className="gold-gradient-text">l&apos;Alliance</span> du Réveil
      </h1>

      {/* Subtitle */}
      <p
        ref={subtitleRef}
        className="mt-4 sm:mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed px-4 transition-colors"
      >
        Deux manières complémentaires de s&apos;engager dans le mouvement : devenez{" "}
        <strong className="text-slate-900 dark:text-white">Membre</strong> pour grandir dans la
        communion et les enseignements, ou devenez{" "}
        <strong className="text-[#dfa458] dark:text-[#f3c053]">Partenaire</strong> pour soutenir
        financièrement la moisson avec notre programme de classes.
      </p>

      {/* Segmented Switcher Control */}
      <div ref={toggleRef} className="mt-8 flex justify-center px-4">
        <div className="p-1.5 rounded-2xl bg-slate-100 dark:bg-[#0b1222] border border-slate-200 dark:border-[#f3c053]/25 shadow-sm dark:shadow-[0_10px_30px_rgba(0,0,0,0.4)] flex items-center gap-2 max-w-md w-full transition-colors">
          <button
            type="button"
            onClick={() => setActiveTab("member")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 cursor-pointer ${
              activeTab === "member"
                ? "bg-[#1f5ea8] text-white shadow-md"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Membre de la Communauté</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("partner")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 cursor-pointer ${
              activeTab === "partner"
                ? "bg-gradient-to-r from-[#dfa458] to-[#f3c053] text-[#090d18] shadow-md dark:shadow-[0_0_20px_rgba(243,192,83,0.35)]"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Crown className="w-4 h-4" />
            <span>Partenaires RB (Classes)</span>
          </button>
        </div>
      </div>

      {/* Key Guarantees */}
      <div ref={badgesRef} className="mt-8 flex flex-wrap justify-center items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <HeartHandshake className="w-4 h-4 text-[#1f5ea8] dark:text-[#60a5fa]" />
          <span>Accès libre à la communion et aux messages</span>
        </div>
        <span className="hidden sm:inline">•</span>
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Transparence & Intégrité ministérielle</span>
        </div>
        <span className="hidden sm:inline">•</span>
        <div className="flex items-center gap-1.5">
          <Crown className="w-4 h-4 text-[#dfa458] dark:text-[#f3c053]" />
          <span>Classes de partenariat en FCFA</span>
        </div>
      </div>
    </div>
  );
}

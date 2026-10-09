"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  Crown,
  Sparkles,
  Check,
  ArrowRight,
  Shield,
  Star,
  Coins,
  HeartHandshake,
  Calendar,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export interface PartnerTier {
  id: "vip" | "class_a" | "class_b" | "class_c";
  name: string;
  badge: string;
  amount: number;
  displayAmount: string;
  isPopular?: boolean;
  tagline: string;
  impact: string;
  features: string[];
}

export const PARTNER_TIERS: PartnerTier[] = [
  {
    id: "vip",
    name: "PARTENAIRE VIP",
    badge: "Pilier Visionnaire",
    amount: 25000,
    displayAmount: "25.000+ FCFA",
    isPopular: true,
    tagline: "Pour les aînés, professionnels et visionnaires portant la charge des grandes avancées du Réveil.",
    impact: "Finance les grandes croisades régionales, l'équipement audiovisuel broadcast et les missions de pionniers.",
    features: [
      "Tous les privilèges Membres (fellowship & enseignements)",
      "Table ronde mensuelle privée avec la direction pastorale",
      "Sièges VIP d'honneur réservés à toutes les conférences",
      "Ligne directe d'intercession pour vos projets & famille",
      "Certificat d'Alliance Partenaire VIP avec sceau doré",
      "Rapport stratégique d'impact missionnaire annuel",
    ],
  },
  {
    id: "class_a",
    name: "PARTENAIRE CLASS A",
    badge: "Bâtisseur Stratégique",
    amount: 20000,
    displayAmount: "20.000 FCFA",
    tagline: "Le cœur logistique assurant la régularité et la puissance de nos rassemblements de jeunesse.",
    impact: "Soutient les frais techniques des rassemblements, la sonorisation et les déplacements des équipes d'évangélisation.",
    features: [
      "Tous les privilèges Membres (fellowship & enseignements)",
      "Accès prioritaire aux retraites spirituelles & séminaires",
      "Rapports d'impact trimestriels avec témoignages exclusifs",
      "Couverture de prière dédiée pour votre carrière et vos études",
      "Badge d'honneur Partenaire Bâtisseur",
    ],
  },
  {
    id: "class_b",
    name: "PARTENAIRE CLASS B",
    badge: "Porteur Actif",
    amount: 10000,
    displayAmount: "10.000 FCFA",
    tagline: "Un engagement constant qui multiplie la portée des messages sur les campus et les réseaux sociaux.",
    impact: "Permet l'édition de guides de discipleship, la diffusion des messages vidéo et les paniers d'accueil des nouveaux.",
    features: [
      "Tous les privilèges Membres (fellowship & enseignements)",
      "Bulletins d'édification spirituelle et nouvelles de mission",
      "Inclusion dans la chaîne de prière hebdomadaire des partenaires",
      "Accès privilégié aux rediffusions et archives d'enseignements",
    ],
  },
  {
    id: "class_c",
    name: "PARTENAIRE CLASS C",
    badge: "Semeur de Réveil",
    amount: 5000,
    displayAmount: "5.000 FCFA",
    tagline: "Accessible à chaque jeune, étudiant ou lycéen désireux d'honorer Dieu avec fidélité.",
    impact: "Finance le carburant des maraudes d'évangélisation, les bibles offertes et le matériel pour nouveaux convertis.",
    features: [
      "Tous les privilèges Membres (fellowship & enseignements)",
      "Lettre mensuelle de bénédiction apostolique",
      "Inclusion au réseau des jeunes semeurs du Royaume",
      "La joie de savoir qu'une vie est touchée chaque mois",
    ],
  },
];

interface PartnerClassesProps {
  onSelectTier: (tier: PartnerTier) => void;
}

export default function PartnerClasses({ onSelectTier }: PartnerClassesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [frequency, setFrequency] = useState<"monthly" | "quarterly" | "annual">("monthly");

  useGSAP(
    () => {
      // Animate the intro header
      gsap.from(".partner-section-intro", {
        scrollTrigger: {
          trigger: ".partner-section-intro",
          start: "top 85%",
          toggleActions: "play none none none",
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      // Animate the cards with stagger
      const cards = gsap.utils.toArray<HTMLElement>(".partner-card");
      if (cards.length > 0) {
        gsap.from(cards, {
          scrollTrigger: {
            trigger: ".partner-cards-grid",
            start: "top 82%",
            toggleActions: "play none none none",
          },
          y: 50,
          opacity: 0,
          stagger: 0.15,
          duration: 0.9,
          ease: "power3.out",
        });
      }

      // Animate the scripture footer
      gsap.from(".partner-scripture", {
        scrollTrigger: {
          trigger: ".partner-scripture",
          start: "top 90%",
          toggleActions: "play none none none",
        },
        y: 20,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
      });
    },
    { scope: containerRef }
  );

  const getAmountString = (tier: PartnerTier) => {
    let multiplier = 1;
    let label = "/ mois";
    if (frequency === "quarterly") {
      multiplier = 3;
      label = "/ trimestre";
    } else if (frequency === "annual") {
      multiplier = 12;
      label = "/ an";
    }

    const total = tier.amount * multiplier;
    const formatted = new Intl.NumberFormat("fr-FR").format(total);
    return {
      formatted: tier.id === "vip" ? `${formatted}+ FCFA` : `${formatted} FCFA`,
      period: label,
    };
  };

  return (
    <div ref={containerRef} className="space-y-12 overflow-hidden">
      {/* Intro Header */}
      <div className="partner-section-intro text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#dfa458]/15 dark:bg-[#f3c053]/10 border border-[#dfa458]/30 dark:border-[#f3c053]/20 text-xs font-semibold text-[#996515] dark:text-[#fce39e]">
          <Crown className="w-3.5 h-3.5 text-[#dfa458] dark:text-[#f3c053]" />
          <span>Alliance Stratégique des Partenaires RB</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Programme des <span className="gold-gradient-text">Classes de Partenariat</span>
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          En devenant Partenaire RB, vous ne consommez pas seulement la bénédiction : vous la
          provoquez. Choisissez la classe de sacrifice selon votre foi et vos moyens.
        </p>

        {/* Frequency Toggles */}
        <div className="flex justify-center pt-2">
          <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-[#0c1424] border border-slate-200 dark:border-white/10 text-xs">
            <button
              type="button"
              onClick={() => setFrequency("monthly")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                frequency === "monthly"
                  ? "bg-[#1f5ea8] text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Mensuel
            </button>
            <button
              type="button"
              onClick={() => setFrequency("quarterly")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                frequency === "quarterly"
                  ? "bg-[#1f5ea8] text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Trimestriel (x3)
            </button>
            <button
              type="button"
              onClick={() => setFrequency("annual")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                frequency === "annual"
                  ? "bg-[#1f5ea8] text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Annuel (x12)
            </button>
          </div>
        </div>
      </div>

      {/* The 4 Cards Grid */}
      <div className="partner-cards-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PARTNER_TIERS.map((tier) => {
          const { formatted, period } = getAmountString(tier);
          const isVip = tier.id === "vip";

          return (
            <div
              key={tier.id}
              className={`partner-card rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 relative group overflow-hidden ${
                isVip
                  ? "bg-gradient-to-b from-amber-500/10 via-white to-white dark:from-[#f3c053]/15 dark:via-[#0c1424] dark:to-[#090e1a] border-2 border-[#dfa458] dark:border-[#f3c053] shadow-lg dark:shadow-[0_10px_35px_rgba(243,192,83,0.2)]"
                  : "bg-white dark:bg-[#0c1424] border border-slate-200 dark:border-white/10 hover:border-[#dfa458] dark:hover:border-[#f3c053]/50 shadow-sm dark:shadow-[0_8px_25px_rgba(0,0,0,0.4)]"
              }`}
            >
              {/* Star watermark on VIP */}
              {isVip && (
                <div className="absolute top-0 right-0 pointer-events-none opacity-10 translate-x-1/4 -translate-y-1/4">
                  <Image
                    src="/logos/rb-star-gold.png"
                    alt="Star"
                    width={180}
                    height={180}
                  />
                </div>
              )}

              <div className="space-y-5">
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase ${
                      isVip
                        ? "bg-[#dfa458] text-[#090d18] font-extrabold shadow-sm"
                        : "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-300"
                    }`}
                  >
                    {tier.badge}
                  </span>
                  {isVip && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-[#b87b1e] dark:text-[#fce39e]">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>Elite</span>
                    </span>
                  )}
                </div>

                {/* Title & Amount */}
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-wide">
                    {tier.name}
                  </h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                      {formatted}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {period}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {tier.tagline}
                  </p>
                </div>

                {/* Impact Statement */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#070b16] border border-slate-200 dark:border-white/5 text-[11px] text-slate-600 dark:text-slate-300">
                  <span className="font-bold text-[#1f5ea8] dark:text-[#60a5fa] block mb-0.5">
                    Impact direct :
                  </span>
                  {tier.impact}
                </div>

                {/* Features list */}
                <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-white/5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 block">
                    Privilèges Inclus :
                  </span>
                  <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                    {tier.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#dfa458] dark:text-[#f3c053] flex-shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-white/5">
                <button
                  type="button"
                  onClick={() => onSelectTier(tier)}
                  className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer ${
                    isVip
                      ? "gold-glow-btn text-[#090d18] shadow-md hover:scale-[1.01]"
                      : tier.id === "class_a"
                      ? "bg-amber-500 hover:bg-amber-600 text-[#090d18] font-black shadow-sm"
                      : "bg-[#1f5ea8] hover:bg-[#256ec2] text-white shadow-sm"
                  }`}
                >
                  <span>
                    {isVip || tier.id === "class_a"
                      ? "Laisser mes coordonnées au Leader"
                      : `S'engager en ${tier.name.replace("PARTENAIRE ", "")}`}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Scriptural Assurance */}
      <div className="partner-scripture max-w-xl mx-auto text-center p-4 rounded-2xl bg-amber-50/70 dark:bg-[#0c1424] border border-amber-200 dark:border-[#f3c053]/20 text-xs text-slate-700 dark:text-[#fce39e] italic">
        &ldquo;Que chacun donne comme il l&apos;a résolu en son cœur, sans tristesse ni contrainte;
        car Dieu aime celui qui donne avec joie.&rdquo;
        <span className="not-italic font-bold text-[#b87b1e] dark:text-[#f3c053] ml-2">
          — 2 Corinthiens 9:7
        </span>
      </div>
    </div>
  );
}

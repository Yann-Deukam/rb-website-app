"use client";

import { useRef } from "react";
import { Check, X, Sparkles, Users, Crown } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const COMPARISON_ROWS = [
  {
    feature: "Accès aux enseignements bibliques & notes d'étude",
    member: true,
    partner: true,
  },
  {
    feature: "Intégration dans les cellules de réveil & hangouts",
    member: true,
    partner: true,
  },
  {
    feature: "Participation aux cultes de jeunesse et retraites",
    member: true,
    partner: true,
  },
  {
    feature: "Possibilité de servir dans un pôle ministériel",
    member: true,
    partner: true,
  },
  {
    feature: "Soutien financier sacrificiel régulier (Classes FCFA)",
    member: false,
    partner: true,
    highlight: true,
  },
  {
    feature: "Rapports stratégiques d'impact & coulisses de mission",
    member: false,
    partner: true,
  },
  {
    feature: "Ligne d'intercession dédiée pour affaires, famille & études",
    member: false,
    partner: true,
  },
  {
    feature: "Rencontres & tables rondes privées avec la direction",
    member: false,
    partner: "VIP & Class A",
  },
  {
    feature: "Sièges d'honneur réservés lors des grandes conférences",
    member: false,
    partner: "VIP & Class A",
  },
  {
    feature: "Certificat d'Alliance Partenaire avec sceau doré",
    member: false,
    partner: true,
  },
];

export default function MembershipComparison() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(containerRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="pt-12 border-t border-slate-200 dark:border-[#f3c053]/15">
      <div className="text-center space-y-3 mb-10 max-w-xl mx-auto">
        <span className="text-xs uppercase tracking-widest font-extrabold text-[#dfa458] dark:text-[#f3c053]">
          Vue Comparative
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Membre ou Partenaire : <span className="gold-gradient-text">Quelle Différence ?</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Les membres nourrissent leur foi au sein du corps; les partenaires propulsent
          financièrement la vision pour atteindre les nations.
        </p>
      </div>

      <div className="rounded-3xl bg-white dark:bg-[#0c1424] border border-slate-200 dark:border-[#f3c053]/25 overflow-hidden shadow-sm dark:shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#080d19]">
                <th className="py-4 px-6 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider text-xs">
                  Privilèges & Engagements
                </th>
                <th className="py-4 px-6 text-center text-[#1f5ea8] dark:text-[#60a5fa] font-black uppercase tracking-wider text-xs">
                  <div className="inline-flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>Membres</span>
                  </div>
                </th>
                <th className="py-4 px-6 text-center text-[#dfa458] dark:text-[#f3c053] font-black uppercase tracking-wider text-xs bg-amber-500/5 dark:bg-[#f3c053]/5">
                  <div className="inline-flex items-center gap-1">
                    <Crown className="w-4 h-4" />
                    <span>Partenaires RB</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {COMPARISON_ROWS.map((row, idx) => (
                <tr
                  key={idx}
                  className={`hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors ${
                    row.highlight
                      ? "bg-amber-50/50 dark:bg-[#f3c053]/5 font-semibold text-slate-900 dark:text-white"
                      : "text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <td className="py-3.5 px-6 leading-relaxed">{row.feature}</td>

                  {/* Member Column */}
                  <td className="py-3.5 px-6 text-center">
                    {row.member ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-white/5 text-slate-400">
                        <X className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </td>

                  {/* Partner Column */}
                  <td className="py-3.5 px-6 text-center bg-amber-500/5 dark:bg-[#f3c053]/5">
                    {typeof row.partner === "string" ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#dfa458]/20 text-[#b87b1e] dark:text-[#fce39e]">
                        {row.partner}
                      </span>
                    ) : row.partner ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#dfa458]/20 text-[#b87b1e] dark:text-[#f3c053]">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-white/5 text-slate-400">
                        <X className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

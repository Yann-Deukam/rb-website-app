"use client";

import { useState, useRef } from "react";
import { HelpCircle } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const FAQS = [
  {
    q: "Est-ce payant de devenir membre ?",
    points: [
      {
        title: "Adhésion 100% Gratuite",
        desc: "L'adhésion Membre de la communauté Revival Bearer est entièrement gratuite et ouverte à tous, sans aucune contribution financière exigée.",
      },
      {
        title: "Accès Complet à la Fellowship",
        desc: "Vous bénéficiez immédiatement de l'accès aux cellules de réveil, enseignements bibliques, et à toute la communion fraternelle.",
      },
      {
        title: "Engagement Volontaire",
        desc: "Seul votre désir sincère d'aimer Jésus, de grandir dans Sa parole et de vivre une communion authentique est demandé.",
      },
    ],
  },
  {
    q: "Quelle est la vocation des Partenaires RB ?",
    points: [
      {
        title: "Alliance Financière Stratégique",
        desc: "Les Partenaires s'engagent par une contribution en FCFA (Classes VIP, A, B, C) pour soutenir l'avancement concret de la vision.",
      },
      {
        title: "Impact Direct & Mesurable",
        desc: "Vos fonds financent l'équipement des salles, les grandes croisades régionales, les missions campus et la production médiatique.",
      },
      {
        title: "Privilèges Exclusifs",
        desc: "En plus des avantages Membres, vous accédez aux rapports d'impact, tables rondes pastorales et couvertures de prière dédiées.",
      },
    ],
  },
  {
    q: "Puis-je être membre ET partenaire ?",
    points: [
      {
        title: "Le Modèle Recommandé",
        desc: "La grande majorité de nos partenaires sont d'abord des membres actifs nourris par la parole et la communion fraternelle.",
      },
      {
        title: "Une Progression Naturelle",
        desc: "Après avoir été enraciné en tant que Membre, choisir de devenir Partenaire est une étape de maturité et d'engagement spirituel.",
      },
      {
        title: "Double Bénédiction",
        desc: "Vous bénéficiez simultanément de tous les avantages Membres ET des privilèges exclusifs de votre classe de partenariat.",
      },
    ],
  },
  {
    q: "Comment s'effectuent les versements en FCFA ?",
    points: [
      {
        title: "Mobile Money (Wave, Orange, MTN)",
        desc: "Les contributions s'effectuent facilement et rapidement via les plateformes de paiement mobile les plus répandues en Côte d'Ivoire.",
      },
      {
        title: "Virement Bancaire",
        desc: "Un virement bancaire sécurisé est disponible pour les contributions de classe VIP ou Class A, sur demande auprès du secrétariat.",
      },
      {
        title: "En Présentiel",
        desc: "Vous pouvez remettre votre enveloppe partenaire en main propre lors des grands cultes de jeunesse et rassemblements RB.",
      },
    ],
  },
  {
    q: "Puis-je changer de classe ou arrêter ?",
    points: [
      {
        title: "Liberté Totale",
        desc: "Le don dans le Royaume doit toujours être fait avec joie et liberté. Vous pouvez modifier ou suspendre votre engagement à tout moment.",
      },
      {
        title: "Changement de Classe",
        desc: "Vous pouvez monter (Class C → B → A → VIP) ou ajuster à la baisse selon l'évolution de votre situation, sans aucun frais.",
      },
      {
        title: "Contact Secrétariat",
        desc: "Il vous suffit de contacter le secrétariat des partenaires pour toute modification. La démarche est simple, rapide et sans jugement.",
      },
    ],
  },
];

export default function MembershipFAQ() {
  const [openIdx, setOpenIdx] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".faq-section-header", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      gsap.from(".faq-left-col", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        x: -40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        delay: 0.2,
      });

      gsap.from(".faq-right-col", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        x: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        delay: 0.3,
      });
    },
    { scope: containerRef }
  );

  const activePoints = FAQS[openIdx]?.points ?? [];

  return (
    <section
      ref={containerRef}
      className="pt-16 border-t border-slate-200 dark:border-[#f3c053]/15"
    >
      {/* Header */}
      <div className="faq-section-header text-center space-y-3 mb-12 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 text-xs font-semibold">
          <HelpCircle className="w-3.5 h-3.5 text-[#dfa458] dark:text-[#f3c053]" />
          <span>Foire Aux Questions</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Questions Fréquentes
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Tout ce que vous devez savoir avant de vous engager dans l&apos;Alliance RB.
        </p>
      </div>

      {/* Two-column layout */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-12 items-start">
        {/* LEFT — Question List */}
        <div className="faq-left-col">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setOpenIdx(idx)}
                className={`group w-full flex items-center justify-between gap-4 py-5 text-left border-b transition-colors cursor-pointer ${
                  idx === 0 ? "border-t" : ""
                } ${
                  isOpen
                    ? "border-slate-300 dark:border-[#f3c053]/25"
                    : "border-slate-200 dark:border-white/8 hover:border-slate-300 dark:hover:border-white/20"
                }`}
              >
                <span
                  className={`text-sm sm:text-base font-semibold leading-snug transition-colors ${
                    isOpen
                      ? "text-slate-900 dark:text-white"
                      : "text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white"
                  }`}
                >
                  {faq.q}
                </span>

                {/* +/× circle button */}
                <span
                  className={`flex-shrink-0 w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-300 text-lg font-thin ${
                    isOpen
                      ? "border-[#dfa458] dark:border-[#f3c053] text-[#dfa458] dark:text-[#f3c053] rotate-0"
                      : "border-slate-300 dark:border-white/25 text-slate-400 dark:text-slate-500 group-hover:border-slate-500 dark:group-hover:border-white/50 group-hover:text-slate-700 dark:group-hover:text-slate-300"
                  }`}
                >
                  {isOpen ? "×" : "+"}
                </span>
              </button>
            );
          })}
        </div>

        {/* RIGHT — Answer Content */}
        <div className="faq-right-col pt-6 lg:pt-2 min-h-[260px]">
          <div key={openIdx} className="space-y-6 animate-fade-in">
            {activePoints.map((point, i) => (
              <div key={i} className="flex gap-4 items-start">
                {/* Diamond bullet */}
                <span className="flex-shrink-0 mt-1.5">
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="5"
                      y="0.5"
                      width="6.36"
                      height="6.36"
                      rx="0.5"
                      transform="rotate(45 5 0.5)"
                      fill="#dfa458"
                      className="dark:fill-[#f3c053]"
                    />
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    {point.title}
                  </p>
                  <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {point.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

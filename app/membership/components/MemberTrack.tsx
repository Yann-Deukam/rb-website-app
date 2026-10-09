"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  Users,
  BookOpen,
  Flame,
  HeartHandshake,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Shield,
  Download,
  Share2,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { supabase } from "@/lib/supabase";

gsap.registerPlugin(ScrollTrigger);

const MEMBER_BENEFITS = [
  {
    icon: BookOpen,
    title: "Accès Libre aux Enseignements & Notes",
    desc: "Plongez dans des messages théologiques et spirituels profonds, audios et guides d'études bibliques pour affermir vos racines en Christ.",
  },
  {
    icon: Users,
    title: "Communion Fraternelle & Cellules de Réveil",
    desc: "Intégrez une cellule de prière dynamique sur votre campus ou dans votre quartier pour partager, prier et ne plus marcher seul.",
  },
  {
    icon: Flame,
    title: "Autels de Prière & Réveils Étudiants",
    desc: "Participez aux nuits d'adoration, veillées prophétiques et retraites spirituelles animées par la passion de la présence de Dieu.",
  },
  {
    icon: HeartHandshake,
    title: "Déploiement des Dons & Service",
    desc: "Rejoignez une équipe ministérielle (Louange, Média, Évangélisation, Accueil, Intercession) pour servir le Seigneur avec excellence.",
  },
];

const DEPARTMENTS = [
  "Évangélisation & Missions Campus",
  "Louange & Adoration",
  "Média, Son & Création Digitale",
  "Intercession & Guerre Spirituelle",
  "Accueil & Intégration des Nouveaux",
  "Logistique & Organisation",
];

export default function MemberTrack() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Form states
  const [fullName, setFullName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [cityOrCampus, setCityOrCampus] = useState("");
  const [department, setDepartment] = useState("Évangélisation & Missions Campus");
  const [isRegistered, setIsRegistered] = useState(false);
  const [memberId, setMemberId] = useState("");

  useGSAP(
    () => {
      // Intro header
      gsap.from(".member-section-intro", {
        scrollTrigger: {
          trigger: ".member-section-intro",
          start: "top 85%",
          toggleActions: "play none none none",
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      // Benefit cards stagger
      const cards = gsap.utils.toArray<HTMLElement>(".member-card");
      if (cards.length > 0) {
        gsap.from(cards, {
          scrollTrigger: {
            trigger: ".member-cards-grid",
            start: "top 82%",
            toggleActions: "play none none none",
          },
          y: 45,
          opacity: 0,
          stagger: 0.15,
          duration: 0.9,
          ease: "power3.out",
        });
      }

      // Registration box
      gsap.from(".member-reg-box", {
        scrollTrigger: {
          trigger: ".member-reg-box",
          start: "top 88%",
          toggleActions: "play none none none",
        },
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
      });
    },
    { scope: containerRef }
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !whatsapp.trim()) return;

    setIsSubmitting(true);
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const code = `RB-M-${randomNum}`;

    try {
      await supabase.from("members").insert([
        {
          full_name: fullName.trim(),
          whatsapp: whatsapp.trim(),
          email: email.trim() || null,
          campus_city: cityOrCampus.trim() || null,
          department: department,
          notes: `Member Code: ${code}`,
        },
      ]);
    } catch (err) {
      console.warn("Member insert caught:", err);
    } finally {
      setMemberId(code);
      setIsRegistered(true);
      setIsSubmitting(false);
    }
  };

  return (
    <div ref={containerRef} className="space-y-12 overflow-hidden">
      {/* Track Intro */}
      <div className="member-section-intro text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#1f5ea8]/10 text-[#1f5ea8] dark:bg-[#1f5ea8]/20 dark:text-[#60a5fa] border border-[#1f5ea8]/25 dark:border-[#1f5ea8]/40 text-xs font-semibold">
          <Users className="w-3.5 h-3.5 text-[#1f5ea8] dark:text-[#60a5fa]" />
          <span>Communion & Croissance Spirituelle</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Devenir <span className="gold-gradient-text">Membre de la Communauté</span>
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          L&apos;adhésion à la communauté Revival Bearer est libre et sans frais financiers. Elle
          repose sur le désir sincère d&apos;aimer Jésus, de grandir dans Sa parole et de vivre
          une communion fraternelle authentique.
        </p>
      </div>

      {/* 4 Pillars Grid */}
      <div className="member-cards-grid grid grid-cols-1 md:grid-cols-2 gap-6">
        {MEMBER_BENEFITS.map((benefit, idx) => {
          const Icon = benefit.icon;
          return (
            <div
              key={idx}
              className="member-card rounded-3xl bg-white dark:bg-[#0c1424] border border-slate-200 dark:border-white/10 p-7 space-y-3 hover:border-[#1f5ea8] dark:hover:border-[#1f5ea8]/60 transition-all duration-300 shadow-sm dark:shadow-[0_8px_25px_rgba(0,0,0,0.4)]"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#1f5ea8]/10 text-[#1f5ea8] dark:bg-[#1f5ea8]/20 dark:text-[#60a5fa] border border-[#1f5ea8]/20 flex items-center justify-center">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{benefit.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {benefit.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Registration Section */}
      <div className="member-reg-box max-w-2xl mx-auto rounded-3xl bg-white dark:bg-[#0c1424] border border-slate-200 dark:border-[#f3c053]/25 p-6 sm:p-10 shadow-sm dark:shadow-[0_15px_40px_rgba(0,0,0,0.5)] transition-colors">
        {!isRegistered ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center space-y-1 pb-4 border-b border-slate-200 dark:border-white/10">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Fiche d&apos;Adhésion Gratuite
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Remplissez ces informations pour recevoir votre pass membre et être contacté(e) par
                un responsable de cellule.
              </p>
            </div>

            <div className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Nom & Prénoms <span className="text-[#dfa458]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: David Kouassi"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#070b16] border border-slate-200 dark:border-white/15 focus:border-[#1f5ea8] text-slate-900 dark:text-white text-sm outline-none transition"
                />
              </div>

              {/* Phone / WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Numéro WhatsApp <span className="text-[#dfa458]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+225 07..."
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#070b16] border border-slate-200 dark:border-white/15 focus:border-[#1f5ea8] text-slate-900 dark:text-white text-sm outline-none transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Adresse Email
                  </label>
                  <input
                    type="email"
                    placeholder="exemple@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#070b16] border border-slate-200 dark:border-white/15 focus:border-[#1f5ea8] text-slate-900 dark:text-white text-sm outline-none transition"
                  />
                </div>
              </div>

              {/* Campus / City */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Ville / Université / Quartier
                </label>
                <input
                  type="text"
                  placeholder="Ex: Abidjan, Campus Cocody"
                  value={cityOrCampus}
                  onChange={(e) => setCityOrCampus(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#070b16] border border-slate-200 dark:border-white/15 focus:border-[#1f5ea8] text-slate-900 dark:text-white text-sm outline-none transition"
                />
              </div>

              {/* Department of Interest */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Pôle où vous désirez servir / grandir
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#070b16] border border-slate-200 dark:border-white/15 focus:border-[#1f5ea8] text-slate-900 dark:text-white text-sm outline-none transition cursor-pointer"
                >
                  {DEPARTMENTS.map((dep) => (
                    <option key={dep} value={dep} className="bg-white dark:bg-[#0b1222]">
                      {dep}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-[#1f5ea8] hover:bg-[#256ec2] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
            >
              <span>Valider Mon Adhésion Gratuite</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* Interactive Digital Membership Card */
          <div className="space-y-6 text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Adhésion Validée avec Succès !</span>
            </div>

            {/* The Badge */}
            <div className="relative max-w-sm mx-auto rounded-3xl bg-gradient-to-br from-[#101a30] to-[#070b16] border-2 border-[#dfa458] p-6 text-white text-left shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 pointer-events-none opacity-10 translate-x-1/4 -translate-y-1/4">
                <Image
                  src="/logos/rb-star-gold.png"
                  alt="Star"
                  width={200}
                  height={200}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center p-1">
                      <Image
                        src="/logos/rb-star-gold.png"
                        alt="Logo"
                        width={24}
                        height={24}
                      />
                    </div>
                    <div>
                      <p className="text-[10px] tracking-widest uppercase font-bold text-[#dfa458]">
                        REVIVAL BEARER
                      </p>
                      <p className="text-[9px] text-slate-400">Pass Membre Officiel</p>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-[#fce39e] font-bold">{memberId}</span>
                </div>

                <div>
                  <p className="text-[10px] uppercase text-slate-400 tracking-wider">Membre</p>
                  <p className="text-lg font-black text-white">{fullName}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-[10px] uppercase text-slate-400">Pôle d&apos;impact</p>
                    <p className="text-[11px] font-semibold text-slate-200 truncate">{department}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-slate-400">Localisation</p>
                    <p className="text-[11px] font-semibold text-slate-200">
                      {cityOrCampus || "Côte d'Ivoire"}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
                  <span>&ldquo;Porteur de Réveil dans ma génération&rdquo;</span>
                  <span className="text-[#dfa458] font-bold">2026</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
              Bienvenue dans la famille ! Un responsable vous ajoutera au groupe d&apos;enseignement
              et de prière WhatsApp sous 24h.
            </p>

            <button
              type="button"
              onClick={() => setIsRegistered(false)}
              className="text-xs text-[#1f5ea8] dark:text-[#f3c053] font-bold hover:underline cursor-pointer"
            >
              ← Modifier mes informations
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

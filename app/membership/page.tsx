"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MembershipHero from "./components/MembershipHero";
import PartnerClasses, { PartnerTier } from "./components/PartnerClasses";
import MemberTrack from "./components/MemberTrack";
import PartnerPledgeModal from "./components/PartnerPledgeModal";
import MembershipComparison from "./components/MembershipComparison";
import MembershipFAQ from "./components/MembershipFAQ";

gsap.registerPlugin(ScrollTrigger);

export default function MembershipPage() {
  const [activeTab, setActiveTab] = useState<"member" | "partner">("partner");
  const [selectedTier, setSelectedTier] = useState<PartnerTier | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const handleSelectTier = (tier: PartnerTier) => {
    setSelectedTier(tier);
    setIsModalOpen(true);
  };

  // 1) Polices + images chargées : la mise en page bouge, on recalcule.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);
    return () => window.removeEventListener("load", refresh);
  }, []);

  // 2) Changement d'onglet : les enfants ont déjà créé leurs triggers
  //    (leurs effets s'exécutent avant celui du parent). On recalcule une fois
  //    la mise en page posée, puis une seconde fois après l'animation fade-in.
  useEffect(() => {
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    const timer = setTimeout(() => ScrollTrigger.refresh(), 500);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [activeTab]);

  // 3) Toute variation de hauteur du contenu dynamique (carte membre affichée,
  //    images qui chargent, etc.) déclenche un refresh (debounced).
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let timer: ReturnType<typeof setTimeout>;
    const ro = new ResizeObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(() => ScrollTrigger.refresh(), 150);
    });
    ro.observe(el);
    return () => {
      clearTimeout(timer);
      ro.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 dark:bg-[#070a12] dark:text-slate-100 selection:bg-[#f3c053]/30 selection:text-[#996515] dark:selection:text-[#fce39e] relative transition-colors duration-300">
      {/* Global Navbar */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
        {/* Animated Hero with Tab Switcher */}
        <MembershipHero activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Dynamic Track Content */}
        <div ref={trackRef}>
          {activeTab === "partner" ? (
            <div key="partner" className="space-y-12">
              <PartnerClasses onSelectTier={handleSelectTier} />
            </div>
          ) : (
            <div key="member" className="space-y-12">
              <MemberTrack />
            </div>
          )}
        </div>

        {/* Comparison Matrix */}
        <MembershipComparison />

        {/* FAQ Accordion */}
        <MembershipFAQ />
      </main>

      {/* Partner Commitment Modal */}
      <PartnerPledgeModal
        tier={selectedTier}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTier(null);
        }}
      />

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
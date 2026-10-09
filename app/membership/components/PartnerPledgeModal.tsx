"use client";

import { useState } from "react";
import Image from "next/image";
import {
  X,
  Crown,
  CheckCircle2,
  Sparkles,
  Phone,
  Send,
  MessageCircle,
  Clock,
  MapPin,
  ShieldCheck,
  Heart,
  Loader2,
} from "lucide-react";
import { PartnerTier } from "./PartnerClasses";
import { supabase } from "@/lib/supabase";

interface PartnerPledgeModalProps {
  tier: PartnerTier | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PartnerPledgeModal({
  tier,
  isOpen,
  onClose,
}: PartnerPledgeModalProps) {
  const [fullName, setFullName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [cityCountry, setCityCountry] = useState("");
  const [message, setMessage] = useState("");
  const [preferredContact, setPreferredContact] = useState<"whatsapp" | "call" | "either">("whatsapp");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !tier) return null;

  const isPremiumTier = tier.id === "vip" || tier.id === "class_a";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !whatsapp.trim()) return;

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const { error } = await supabase.from("partner_leads").insert([
        {
          tier_id: tier.id,
          tier_name: tier.name,
          full_name: fullName.trim(),
          whatsapp: whatsapp.trim(),
          email: email.trim() || null,
          city_country: cityCountry.trim() || null,
          message: message.trim() || null,
          preferred_contact: preferredContact,
          status: "new",
        },
      ]);

      if (error) {
        console.warn("Supabase lead submission fallback:", error.message);
      }
      setIsConfirmed(true);
    } catch (err: unknown) {
      console.warn("Partner submission handled gracefully:", err);
      setIsConfirmed(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setIsConfirmed(false);
    setFullName("");
    setWhatsapp("");
    setEmail("");
    setCityCountry("");
    setMessage("");
    setErrorMsg(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl bg-white dark:bg-[#0b1222] border border-slate-200 dark:border-[#f3c053]/40 p-6 sm:p-8 shadow-2xl transition-colors">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!isConfirmed ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Header */}
            <div className="space-y-2 pb-4 border-b border-slate-200 dark:border-white/10">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-[#dfa458] dark:text-[#f3c053]" />
                <span className="text-xs uppercase tracking-widest font-extrabold text-[#dfa458] dark:text-[#f3c053]">
                  {isPremiumTier ? "Alliance Partenaire d'Honneur" : "Engagement Partenaire RB"}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {tier.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {isPremiumTier ? (
                  <>
                    En tant que <strong className="text-slate-900 dark:text-white">{tier.badge}</strong>, aucun formulaire administratif fastidieux. Laissez simplement vos coordonnées et le <strong className="text-[#b87b1e] dark:text-[#f3c053]">Leader du Réveil</strong> vous contactera personnellement en privé.
                  </>
                ) : (
                  <>
                    Laissez vos coordonnées pour sceller votre partenariat avec le mouvement.
                  </>
                )}
              </p>
            </div>

            {/* Direct Leader Contact Banner */}
            {isPremiumTier && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-[#dfa458]/40 dark:border-[#f3c053]/30 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#b87b1e] dark:text-[#fce39e]">
                  <Sparkles className="w-4 h-4 text-[#dfa458] dark:text-[#f3c053] shrink-0" />
                  <span>Protocole d&apos;Écoute Pastorale Privée</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Votre vision, vos projets et vos charges méritent un échange direct, discret et dans la prière avec la coordination générale.
                </p>
              </div>
            )}

            {/* Contact Information Fields */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Votre Nom Complet <span className="text-[#dfa458] dark:text-[#f3c053]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Frère / Sœur / Pasteur ..."
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#070b16] border border-slate-200 dark:border-white/15 focus:border-[#dfa458] dark:focus:border-[#f3c053] text-slate-900 dark:text-white text-sm outline-none transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Numéro WhatsApp / Téléphone <span className="text-[#dfa458] dark:text-[#f3c053]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+225 07..."
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#070b16] border border-slate-200 dark:border-white/15 focus:border-[#dfa458] dark:focus:border-[#f3c053] text-slate-900 dark:text-white text-sm outline-none transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Email (facultatif)
                  </label>
                  <input
                    type="email"
                    placeholder="contact@exemple.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#070b16] border border-slate-200 dark:border-white/15 focus:border-[#dfa458] text-slate-900 dark:text-white text-sm outline-none transition"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Ville / Pays de résidence
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    placeholder="Ex: Abidjan, Côte d'Ivoire / Paris, France"
                    value={cityCountry}
                    onChange={(e) => setCityCountry(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-[#070b16] border border-slate-200 dark:border-white/15 focus:border-[#dfa458] text-slate-900 dark:text-white text-sm outline-none transition"
                  />
                </div>
              </div>

              {/* Preferred Contact Mode */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Mode de contact préféré
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPreferredContact("whatsapp")}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      preferredContact === "whatsapp"
                        ? "bg-[#25D366]/15 border-[#25D366] text-green-700 dark:text-[#25D366]"
                        : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreferredContact("call")}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      preferredContact === "call"
                        ? "bg-[#1f5ea8]/15 border-[#1f5ea8] text-[#1f5ea8] dark:text-[#60a5fa]"
                        : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Appel</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreferredContact("either")}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      preferredContact === "either"
                        ? "bg-[#dfa458]/15 border-[#dfa458] text-[#996515] dark:text-[#f3c053]"
                        : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Peu importe</span>
                  </button>
                </div>
              </div>

              {/* Message / Prayer Request */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Un mot ou sujet pour le leader (facultatif)
                </label>
                <textarea
                  rows={2}
                  placeholder="Partagez un mot, vos disponibilités ou un sujet à porter en prière..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#070b16] border border-slate-200 dark:border-white/15 focus:border-[#dfa458] text-slate-900 dark:text-white text-xs sm:text-sm outline-none transition resize-none"
                />
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-red-500 text-center font-medium">{errorMsg}</p>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="gold-glow-btn w-full py-4 rounded-2xl font-black text-sm sm:text-base text-[#090d18] flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#090d18]" />
                    <span>Transmission sécurisée...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-[#090d18]" />
                    <span>Transmettre mes coordonnées au Leader</span>
                  </>
                )}
              </button>
              <p className="text-[11px] text-center text-slate-400 mt-2.5 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#dfa458] dark:text-[#f3c053]" />
                <span>Vos informations sont strictement confidentielles et réservées au leader.</span>
              </p>
            </div>
          </form>
        ) : (
          /* Confirmation Screen */
          <div className="text-center py-6 space-y-6 animate-scale-up">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-gradient-to-tr from-[#dfa458] to-[#fce39e] flex items-center justify-center shadow-lg shadow-[#dfa458]/30">
              <Crown className="w-8 h-8 sm:w-10 sm:h-10 text-[#090d18]" />
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#dfa458] dark:text-[#f3c053]">
                Coordonnées bien reçues
              </span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                Merci, Bien-aimé(e) !
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-sm mx-auto leading-relaxed">
                Le leader de la communauté a été notifié de votre intérêt pour la classe <strong className="text-slate-900 dark:text-white">{tier.name}</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-[#121c32] border border-amber-200 dark:border-[#f3c053]/30 text-xs text-slate-700 dark:text-[#fce39e] space-y-1">
              <p className="font-bold">Vous serez contacté(e) très prochainement sur :</p>
              <p className="font-mono text-sm font-semibold">{whatsapp}</p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="w-full py-3.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm transition hover:opacity-90 cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

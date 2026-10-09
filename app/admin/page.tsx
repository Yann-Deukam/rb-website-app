"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Shield,
  Download,
  Megaphone,
  MessageCircle,
  FileSpreadsheet,
  FileText,
  Phone,
  CheckCircle2,
  Clock,
  Sparkles,
  LogOut,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
  Users,
  Search,
  RefreshCw,
  Heart,
  Calendar,
  Lock,
  Copy,
  Check,
} from "lucide-react";
import {
  supabase,
  TestimonyRecord,
  AnnouncementRecord,
  MemberRecord,
  PartnerLeadRecord,
} from "@/lib/supabase";
import {
  FileAudio,
} from "lucide-react";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [loginError, setLoginError] = useState(false);

  // Tabs
  const [activeTab, setActiveTab] = useState<"testimonies" | "partners" | "members" | "announcements">("testimonies");

  // Data states
  const [testimonies, setTestimonies] = useState<TestimonyRecord[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementRecord[]>([]);
  const [members, setMembers] = useState<MemberRecord[]>([]);
  const [partnerLeads, setPartnerLeads] = useState<PartnerLeadRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Copy feedback state (ID of testimony copied)
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New announcement form state
  const [showNewAnnounceModal, setShowNewAnnounceModal] = useState(false);
  const [newAnnounceTitle, setNewAnnounceTitle] = useState("");
  const [newAnnounceTag, setNewAnnounceTag] = useState("Événement Spécial");
  const [newAnnounceContent, setNewAnnounceContent] = useState("");
  const [newAnnounceDate, setNewAnnounceDate] = useState("");
  const [newAnnounceLink, setNewAnnounceLink] = useState("");
  const [isSubmittingAnnounce, setIsSubmittingAnnounce] = useState(false);

  // Auth persistence
  useEffect(() => {
    const saved = localStorage.getItem("rb_admin_auth");
    if (saved === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch all admin data
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [testRes, annRes, memRes, partRes] = await Promise.all([
        supabase.from("testimonies").select("*").order("created_at", { ascending: false }),
        supabase.from("announcements").select("*").order("created_at", { ascending: false }),
        supabase.from("members").select("*").order("created_at", { ascending: false }),
        supabase.from("partner_leads").select("*").order("created_at", { ascending: false }),
      ]);

      if (testRes.data) setTestimonies(testRes.data);
      if (annRes.data) setAnnouncements(annRes.data);
      if (memRes.data) setMembers(memRes.data);
      if (partRes.data) setPartnerLeads(partRes.data);
    } catch (err) {
      console.warn("Admin fetch data error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === "2026" || passcode.trim() === "rb-revival-2026") {
      setIsAuthenticated(true);
      localStorage.setItem("rb_admin_auth", "true");
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("rb_admin_auth");
  };

  // Toggle announcement active status
  const toggleAnnouncement = async (id: string, current: boolean) => {
    try {
      await supabase.from("announcements").update({ is_active: !current }).eq("id", id);
      setAnnouncements((prev) =>
        prev.map((a) => (a.id === id ? { ...a, is_active: !current } : a))
      );
    } catch (e) {
      console.warn("Toggle announce error:", e);
    }
  };

  // Delete announcement
  const deleteAnnouncement = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cette annonce ?")) return;
    try {
      await supabase.from("announcements").delete().eq("id", id);
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    } catch (e) {
      console.warn("Delete error:", e);
    }
  };

  // Create announcement
  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnounceTitle.trim() || !newAnnounceContent.trim()) return;
    setIsSubmittingAnnounce(true);

    try {
      const { data, error } = await supabase
        .from("announcements")
        .insert([
          {
            title: newAnnounceTitle.trim(),
            tag: newAnnounceTag.trim() || "Annonce",
            content: newAnnounceContent.trim(),
            event_date: newAnnounceDate.trim() || null,
            link_url: newAnnounceLink.trim() || null,
            link_label: newAnnounceLink.trim() ? "Participer" : null,
            is_active: true,
          },
        ])
        .select()
        .single();

      if (data) {
        setAnnouncements([data, ...announcements]);
        setShowNewAnnounceModal(false);
        setNewAnnounceTitle("");
        setNewAnnounceContent("");
        setNewAnnounceDate("");
        setNewAnnounceLink("");
      }
    } catch (e) {
      console.warn("Create announce error:", e);
    } finally {
      setIsSubmittingAnnounce(false);
    }
  };

  // Toggle testimony status
  const updateTestimonyStatus = async (id: string, status: "pending" | "approved" | "featured") => {
    try {
      await supabase.from("testimonies").update({ status }).eq("id", id);
      setTestimonies((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status } : t))
      );
    } catch (e) {
      console.warn("Testimony status error:", e);
    }
  };

  // Format single testimony into clean structured text
  const formatSingleTestimony = (t: TestimonyRecord) => {
    let str = `🔥 TÉMOIGNAGE — REVIVAL BEARER\n`;
    str += `----------------------------------------------------\n`;
    str += `Titre        : ${t.title}\n`;
    str += `Auteur       : ${t.is_anonymous ? "Anonyme (Protégé)" : t.author_name}\n`;
    str += `Catégorie    : ${t.category}\n`;
    if (t.campus_city) str += `Lieu/Campus  : ${t.campus_city}\n`;
    if (t.scripture) str += `Verset Clé   : ${t.scripture}\n`;
    str += `Date         : ${t.created_at ? new Date(t.created_at).toLocaleDateString("fr-FR") : "N/A"}\n`;
    if (t.audio_url) str += `Audio        : ${t.audio_url}\n`;
    str += `----------------------------------------------------\n\n`;
    str += `${t.story}\n`;
    return str;
  };

  // Action: Copy individual testimony text to clipboard
  const handleCopyTestimony = (t: TestimonyRecord) => {
    const text = formatSingleTestimony(t);
    navigator.clipboard.writeText(text);
    if (t.id) {
      setCopiedId(t.id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  // Action: Download individual testimony as .txt file
  const handleDownloadSingleTestimony = (t: TestimonyRecord) => {
    const text = formatSingleTestimony(t);
    const cleanSlug = (t.title || "temoignage")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "_")
      .slice(0, 30);
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `RB_Temoignage_${cleanSlug}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };


  const handleDownloadAudio = async (
    audioUrl: string,
    title: string
  ) => {
    try {
      const parsedUrl = new URL(audioUrl);

      const marker =
        "/storage/v1/object/public/testimony-audio/";

      const markerIndex = parsedUrl.pathname.indexOf(marker);

      if (markerIndex === -1) {
        throw new Error(
          "Cette URL ne correspond pas au bucket audio attendu."
        );
      }

      const filePath = decodeURIComponent(
        parsedUrl.pathname.slice(markerIndex + marker.length)
      );

      const { data, error } = await supabase.storage
        .from("testimony-audio")
        .download(filePath);

      if (error) {
        throw new Error(error.message);
      }

      if (!data || data.size === 0) {
        throw new Error("Le fichier audio est vide ou introuvable.");
      }

      const extension = filePath.split(".").pop() || "audio";

      const cleanSlug = (title || "temoignage")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "")
        .slice(0, 50);

      const blobUrl = URL.createObjectURL(data);
      const link = document.createElement("a");

      link.href = blobUrl;
      link.download = `RB_Audio_${cleanSlug}.${extension}`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
      }, 1000);
    } catch (error) {
      console.error("Audio download error:", error);

      alert(
        error instanceof Error
          ? `Échec du téléchargement : ${error.message}`
          : "Impossible de télécharger cet audio."
      );
    }
  };


  // Batch CSV
  const downloadCSV = () => {
    if (testimonies.length === 0) {
      alert("Aucun témoignage à télécharger pour le moment.");
      return;
    }

    const headers = ["ID", "Titre", "Catégorie", "Auteur", "Anonyme", "Lieu / Campus", "Passage Biblique", "Histoire", "Statut", "Date"];
    const rows = testimonies.map((t) => [
      `"${t.id || ""}"`,
      `"${(t.title || "").replace(/"/g, '""')}"`,
      `"${(t.category || "").replace(/"/g, '""')}"`,
      `"${(t.author_name || "").replace(/"/g, '""')}"`,
      t.is_anonymous ? "Oui" : "Non",
      `"${(t.campus_city || "").replace(/"/g, '""')}"`,
      `"${(t.scripture || "").replace(/"/g, '""')}"`,
      `"${(t.story || "").replace(/"/g, '""').replace(/\n/g, ' ')}"`,
      `"${t.status || "pending"}"`,
      `"${t.created_at ? new Date(t.created_at).toLocaleString("fr-FR") : ""}"`,
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `RB_Temoignages_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Batch TXT
  const downloadMobileTextDigest = () => {
    if (testimonies.length === 0) {
      alert("Aucun témoignage disponible.");
      return;
    }

    let doc = `====================================================\n`;
    doc += `🔥 REVIVAL BEARER — RECUEIL DES TÉMOIGNAGES\n`;
    doc += `Génération Réveil • Tous les témoignages reçus\n`;
    doc += `Date d'export : ${new Date().toLocaleDateString("fr-FR")} à ${new Date().toLocaleTimeString("fr-FR")}\n`;
    doc += `Nombre total : ${testimonies.length}\n`;
    doc += `====================================================\n\n`;

    testimonies.forEach((t, idx) => {
      doc += `----------------------------------------------------\n`;
      doc += `#${idx + 1} | ${t.title.toUpperCase()}\n`;
      doc += `----------------------------------------------------\n`;
      doc += `Auteur       : ${t.is_anonymous ? "Anonyme (Confidentiel)" : t.author_name}\n`;
      doc += `Catégorie    : ${t.category}\n`;
      if (t.campus_city) doc += `Lieu/Campus  : ${t.campus_city}\n`;
      if (t.scripture) doc += `Verset Clé   : ${t.scripture}\n`;
      doc += `Statut       : ${t.status?.toUpperCase() || "PENDING"}\n`;
      if (t.audio_url) doc += `Note Vocale  : ${t.audio_url}\n`;
      doc += `Date d'envoi : ${t.created_at ? new Date(t.created_at).toLocaleDateString("fr-FR") : "N/A"}\n\n`;
      doc += `RÉCIT :\n${t.story}\n\n\n`;
    });

    const blob = new Blob([doc], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `RB_Recueil_Temoignages_${new Date().toISOString().slice(0, 10)}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // WhatsApp lead direct link
  const getWhatsAppLink = (phone: string, name: string, tierName?: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const message = encodeURIComponent(
      `Bonjour ${name}, paix et grâce du Seigneur ! Je suis le leader de Revival Bearer. Je vous contacte suite à vos coordonnées laissées sur notre plateforme pour le partenariat ${tierName || ""}.`
    );
    return `https://wa.me/${cleanPhone}?text=${message}`;
  };

  // Login view
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#070a12] text-white">
        <div className="w-full max-w-sm rounded-3xl bg-[#0c1424] border border-[#f3c053]/30 p-6 sm:p-8 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#f3c053]/15 border border-[#f3c053]/30 flex items-center justify-center">
            <Lock className="w-8 h-8 text-[#f3c053]" />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-widest font-extrabold text-[#f3c053]">
              Accès Mobile Sécurisé
            </span>
            <h1 className="text-xl font-black text-white">Espace Admin Revival</h1>
            <p className="text-xs text-slate-400">
              Entrez votre code d&apos;accès leader pour gérer les annonces et témoignages.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1 text-left">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Code PIN / Clé Admin
              </label>
              <input
                type="password"
                required
                placeholder="Ex: 2026"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#070b16] border border-white/15 focus:border-[#f3c053] text-white text-center font-mono text-lg tracking-widest outline-none transition"
              />
              {loginError && (
                <p className="text-[11px] text-red-400 text-center font-semibold pt-1">
                  Code incorrect. (Astuce: 2026)
                </p>
              )}
            </div>

            <button
              type="submit"
              className="gold-glow-btn w-full py-3.5 rounded-xl font-black text-sm text-[#090d18] cursor-pointer shadow-md"
            >
              Déverrouiller l&apos;Administration
            </button>
          </form>

          <p className="text-[10px] text-slate-500">
            Réservé à l&apos;équipe pastorale & lead Revival Bearer.
          </p>
        </div>
      </div>
    );
  }

  // Filtered testimonies
  const filteredTestimonies = testimonies.filter((t) =>
    searchQuery
      ? t.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.author_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category?.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 pb-20">
      {/* Mobile Top Header */}
      <header className="sticky top-0 z-30 bg-[#0c1424]/95 backdrop-blur-md border-b border-white/10 px-4 py-3.5 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#f3c053]/15 border border-[#f3c053]/30 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-[#f3c053]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold text-[#f3c053] tracking-wider">
                  Leader Portal
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded-full font-bold">
                  En ligne
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-black text-white leading-tight">
                Revival Bearer Admin
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchAllData}
              title="Rafraîchir les données"
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              type="button"
              onClick={handleLogout}
              title="Déconnexion"
              className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 space-y-6">
        {/* Quick Batch Mobile Export Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-amber-500/20 via-[#1f5ea8]/20 to-transparent border border-[#f3c053]/30 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-[#f3c053]" />
              <h2 className="text-sm sm:text-base font-bold text-white">
                Téléchargement Express Témoignages (Format Mobile)
              </h2>
            </div>
            <p className="text-xs text-slate-300">
              Exportez en un clic l&apos;ensemble des témoignages sur votre téléphone (Excel, Google Sheets ou Document texte).
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={downloadCSV}
              className="gold-glow-btn flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black text-[#090d18] cursor-pointer shadow-md"
            >
              <FileSpreadsheet className="w-4 h-4 text-[#090d18]" />
              <span>Tout Exporter (Excel/CSV)</span>
            </button>

            <button
              type="button"
              onClick={downloadMobileTextDigest}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs font-bold transition cursor-pointer"
            >
              <FileText className="w-4 h-4 text-[#f3c053]" />
              <span>Tout Exporter (.txt)</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("testimonies")}
            className={`py-3 px-3 rounded-2xl text-xs font-bold border transition flex items-center justify-center gap-2 cursor-pointer ${activeTab === "testimonies"
              ? "bg-[#f3c053] text-[#090d18] border-[#f3c053] shadow-md"
              : "bg-[#0c1424] text-slate-300 border-white/10 hover:bg-white/5"
              }`}
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>Témoignages ({testimonies.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("partners")}
            className={`py-3 px-3 rounded-2xl text-xs font-bold border transition flex items-center justify-center gap-2 cursor-pointer ${activeTab === "partners"
              ? "bg-[#f3c053] text-[#090d18] border-[#f3c053] shadow-md"
              : "bg-[#0c1424] text-slate-300 border-white/10 hover:bg-white/5"
              }`}
          >
            <Heart className="w-4 h-4 shrink-0" />
            <span>Partenaires VIP ({partnerLeads.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("members")}
            className={`py-3 px-3 rounded-2xl text-xs font-bold border transition flex items-center justify-center gap-2 cursor-pointer ${activeTab === "members"
              ? "bg-[#f3c053] text-[#090d18] border-[#f3c053] shadow-md"
              : "bg-[#0c1424] text-slate-300 border-white/10 hover:bg-white/5"
              }`}
          >
            <Users className="w-4 h-4 shrink-0" />
            <span>Membres ({members.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("announcements")}
            className={`py-3 px-3 rounded-2xl text-xs font-bold border transition flex items-center justify-center gap-2 cursor-pointer ${activeTab === "announcements"
              ? "bg-[#f3c053] text-[#090d18] border-[#f3c053] shadow-md"
              : "bg-[#0c1424] text-slate-300 border-white/10 hover:bg-white/5"
              }`}
          >
            <Megaphone className="w-4 h-4 shrink-0" />
            <span>Annonces ({announcements.length})</span>
          </button>
        </div>

        {/* ================================================================= */}
        {/* TAB 1: TESTIMONIES LIST */}
        {/* ================================================================= */}
        {activeTab === "testimonies" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  placeholder="Rechercher par mot, auteur..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#0c1424] border border-white/10 text-xs text-white outline-none focus:border-[#f3c053]"
                />
              </div>

              <div className="text-xs text-slate-400 w-full sm:w-auto text-right">
                {filteredTestimonies.length} témoignage(s) affiché(s)
              </div>
            </div>

            {filteredTestimonies.length === 0 ? (
              <div className="rounded-2xl bg-[#0c1424] border border-white/10 p-8 text-center text-slate-400 text-xs">
                Aucun témoignage trouvé.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTestimonies.map((t) => (
                  <div
                    key={t.id}
                    className="rounded-2xl bg-[#0c1424] border border-white/10 p-5 space-y-4 hover:border-[#f3c053]/40 transition flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#f3c053] bg-[#f3c053]/10 px-2 py-0.5 rounded-md">
                            {t.category}
                          </span>
                          <h3 className="text-base font-bold text-white mt-1.5">{t.title}</h3>
                        </div>

                        <div className="shrink-0 flex items-center gap-1">
                          <select
                            value={t.status || "pending"}
                            onChange={(e) =>
                              t.id && updateTestimonyStatus(t.id, e.target.value as any)
                            }
                            className="text-[11px] font-bold rounded-lg px-2 py-1 bg-[#070b16] border border-white/20 text-white outline-none cursor-pointer"
                          >
                            <option value="pending">⏳ En attente</option>
                            <option value="approved">✅ Approuvé</option>
                            <option value="featured">⭐ À la une</option>
                          </select>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                        {t.story}
                      </p>

                      {t.scripture && (
                        <p className="text-[11px] text-[#fce39e] italic border-l-2 border-[#f3c053] pl-2">
                          {t.scripture}
                        </p>
                      )}


                      {t.audio_url && (
                        <div className="mt-3 p-3 rounded-xl bg-[#070b16] border border-white/10 space-y-3">
                          {/* <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 text-xs font-semibold text-[#f3c053]">
                              <FileAudio className="w-4 h-4" />
                              <span>Note vocale du témoignage</span>
                            </div>

                            <a
                              href={t.audio_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-400 hover:underline"
                            >
                              Ouvrir l'audio
                            </a>
                          </div> */}

                          <audio
                            controls
                            preload="metadata"
                            src={t.audio_url}
                            className="w-full"
                            onError={(e) => {
                              console.error("Erreur de lecture audio :", {
                                url: t.audio_url,
                                code: e.currentTarget.error?.code,
                                message: e.currentTarget.error?.message,
                              });
                            }}
                          >
                            Votre navigateur ne peut pas lire cet audio.
                          </audio>


                          <a
                            href={t.audio_url}
                            download={`RB_Audio_${(t.title || "temoignage")
                              .normalize("NFD")
                              .replace(/[\u0300-\u036f]/g, "")
                              .toLowerCase()
                              .replace(/[^a-z0-9]+/g, "_")
                              .slice(0, 50)}.webm`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2.5 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-[#f3c053]/30 text-xs font-semibold text-[#fce39e] flex items-center justify-center gap-2 transition"
                          >
                            <Download className="w-4 h-4" />
                            <span>Télécharger l'audio</span>
                          </a>
                        </div>
                      )}

                    </div>

                    {/* Metadata & Actions row */}
                    <div className="space-y-3 pt-3 border-t border-white/10">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>
                          Par : <strong className="text-white">{t.is_anonymous ? "Anonyme" : t.author_name}</strong>
                          {t.campus_city && ` (${t.campus_city})`}
                        </span>
                        <span>
                          {t.created_at ? new Date(t.created_at).toLocaleDateString("fr-FR") : ""}
                        </span>
                      </div>

                      {/* INDIVIDUAL DOWNLOAD & COPY BUTTONS */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleCopyTestimony(t)}
                          className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition cursor-pointer"
                          title="Copier le texte complet du témoignage"
                        >
                          {copiedId === t.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copié !</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-[#f3c053]" />
                              <span>Copier</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDownloadSingleTestimony(t)}
                          className="py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-[#f3c053]/30 text-xs font-semibold text-[#fce39e] flex items-center justify-center gap-1.5 transition cursor-pointer"
                          title="Télécharger ce témoignage en fichier .txt sur mobile"
                        >
                          <Download className="w-3.5 h-3.5 text-[#f3c053]" />
                          <span>Fichier (.txt)</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: PARTNER LEADS (DIRECT LEADER CONTACT) */}
        {/* ================================================================= */}
        {activeTab === "partners" && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-amber-500/10 border border-[#f3c053]/30 p-4 text-xs text-slate-300">
              <strong className="text-[#f3c053] block mb-1">
                🌟 Contacts directs Partenaires & Visionnaires
              </strong>
              Ces personnes ont manifesté leur volonté de soutenir l&apos;œuvre sans remplir de formulaire complexe. Un simple bouton vous permet de leur écrire sur WhatsApp en un clic.
            </div>

            {partnerLeads.length === 0 ? (
              <div className="rounded-2xl bg-[#0c1424] border border-white/10 p-8 text-center text-slate-400 text-xs">
                Aucun contact partenaire pour le moment.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {partnerLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="rounded-2xl bg-[#0c1424] border border-[#f3c053]/30 p-5 space-y-4 shadow-lg"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-[#f3c053] text-[#090d18]">
                          {lead.tier_name}
                        </span>
                        <h3 className="text-lg font-black text-white mt-1.5">
                          {lead.full_name}
                        </h3>
                        {lead.city_country && (
                          <p className="text-xs text-slate-400">{lead.city_country}</p>
                        )}
                      </div>

                      <span className="text-[10px] font-mono text-slate-400">
                        {lead.created_at ? new Date(lead.created_at).toLocaleDateString("fr-FR") : ""}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#070b16] border border-white/5 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Téléphone / WhatsApp :</span>
                        <span className="font-mono font-bold text-white">{lead.whatsapp}</span>
                      </div>
                      {lead.email && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Email :</span>
                          <span className="text-slate-200">{lead.email}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Préférence contact :</span>
                        <span className="capitalize text-[#fce39e]">{lead.preferred_contact}</span>
                      </div>
                    </div>

                    {lead.message && (
                      <div className="text-xs text-slate-300 italic bg-white/5 p-2.5 rounded-lg border-l-2 border-[#f3c053]">
                        &ldquo;{lead.message}&rdquo;
                      </div>
                    )}

                    {/* Leader Direct Contact Action Buttons */}
                    <div className="flex gap-2 pt-1">
                      <a
                        href={getWhatsAppLink(lead.whatsapp, lead.full_name, lead.tier_name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold flex items-center justify-center gap-2 transition"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Écrire sur WhatsApp</span>
                      </a>

                      <a
                        href={`tel:${lead.whatsapp}`}
                        className="p-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white transition flex items-center justify-center"
                        title="Appeler directement"
                      >
                        <Phone className="w-4 h-4 text-[#f3c053]" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: MEMBERS */}
        {/* ================================================================= */}
        {activeTab === "members" && (
          <div className="space-y-4">
            <div className="text-xs text-slate-400">
              Total inscrits membre : {members.length}
            </div>

            {members.length === 0 ? (
              <div className="rounded-2xl bg-[#0c1424] border border-white/10 p-8 text-center text-slate-400 text-xs">
                Aucun membre enregistré pour le moment.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {members.map((m) => (
                  <div
                    key={m.id}
                    className="rounded-2xl bg-[#0c1424] border border-white/10 p-4 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-sm">{m.full_name}</h4>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {m.created_at ? new Date(m.created_at).toLocaleDateString("fr-FR") : ""}
                      </span>
                    </div>

                    <p className="text-[#f3c053] font-semibold">{m.department || "Général"}</p>
                    <p className="text-slate-400">{m.campus_city || "Non spécifié"}</p>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                      <span className="font-mono text-slate-300">{m.whatsapp}</span>
                      <a
                        href={`https://wa.me/${m.whatsapp.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#25D366] hover:underline flex items-center gap-1 font-bold"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 4: ANNOUNCEMENTS MANAGER */}
        {/* ================================================================= */}
        {activeTab === "announcements" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  Gestion des Annonces Officielles
                </h3>
                <p className="text-xs text-slate-400">
                  L&apos;annonce active s&apos;affiche en haut de tout le site pour tous les visiteurs.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowNewAnnounceModal(true)}
                className="gold-glow-btn flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black text-[#090d18] cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#090d18]" />
                <span>Publier</span>
              </button>
            </div>

            {announcements.length === 0 ? (
              <div className="rounded-2xl bg-[#0c1424] border border-white/10 p-8 text-center text-slate-400 text-xs">
                Aucune annonce enregistrée. Cliquez sur &quot;Publier&quot; pour en créer une.
              </div>
            ) : (
              <div className="space-y-3">
                {announcements.map((ann) => (
                  <div
                    key={ann.id}
                    className={`rounded-2xl p-4 sm:p-5 border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${ann.is_active
                      ? "bg-[#0c1424] border-[#f3c053]/40 shadow-md"
                      : "bg-[#090e1a]/60 border-white/5 opacity-70"
                      }`}
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-[#f3c053] text-[#090d18]">
                          {ann.tag}
                        </span>
                        {ann.event_date && (
                          <span className="text-[11px] text-[#fce39e] flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-[#f3c053]" />
                            {ann.event_date}
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ann.is_active
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-slate-700 text-slate-300"
                            }`}
                        >
                          {ann.is_active ? "En ligne" : "Désactivée"}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-white">{ann.title}</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">{ann.content}</p>
                      {ann.link_url && (
                        <p className="text-[11px] text-blue-400 truncate">Lien: {ann.link_url}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                      <button
                        type="button"
                        onClick={() => ann.id && toggleAnnouncement(ann.id, ann.is_active)}
                        className={`p-2 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer ${ann.is_active
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                          : "bg-white/5 text-slate-300 border-white/10"
                          }`}
                      >
                        {ann.is_active ? (
                          <>
                            <ToggleRight className="w-4 h-4 text-emerald-400" />
                            <span>Visible</span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-4 h-4 text-slate-400" />
                            <span>Masquée</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => ann.id && deleteAnnouncement(ann.id)}
                        className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition cursor-pointer"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ================================================================= */}
      {/* MODAL: ADD ANNOUNCEMENT */}
      {/* ================================================================= */}
      {showNewAnnounceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-[#0c1424] border border-[#f3c053]/40 p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest font-extrabold text-[#f3c053]">
                Communication Officielle
              </span>
              <h3 className="text-xl font-black text-white">Nouvelle Annonce</h3>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                  Titre de l&apos;annonce <span className="text-[#f3c053]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Grande Croisade Étudiante ce Vendredi"
                  value={newAnnounceTitle}
                  onChange={(e) => setNewAnnounceTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#070b16] border border-white/15 focus:border-[#f3c053] text-white text-xs sm:text-sm outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                    Badge / Tag
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Événement Spécial / Appel"
                    value={newAnnounceTag}
                    onChange={(e) => setNewAnnounceTag(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#070b16] border border-white/15 focus:border-[#f3c053] text-white text-xs outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                    Date & Heure (optionnel)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Samedi 25 Octobre • 18h00"
                    value={newAnnounceDate}
                    onChange={(e) => setNewAnnounceDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#070b16] border border-white/15 focus:border-[#f3c053] text-white text-xs outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                  Message / Détails <span className="text-[#f3c053]">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Description complète pour la communauté..."
                  value={newAnnounceContent}
                  onChange={(e) => setNewAnnounceContent(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#070b16] border border-white/15 focus:border-[#f3c053] text-white text-xs sm:text-sm outline-none resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                  Lien d&apos;action (optionnel)
                </label>
                <input
                  type="text"
                  placeholder="Ex: /membership ou https://..."
                  value={newAnnounceLink}
                  onChange={(e) => setNewAnnounceLink(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#070b16] border border-white/15 focus:border-[#f3c053] text-white text-xs outline-none"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewAnnounceModal(false)}
                  className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingAnnounce}
                  className="gold-glow-btn flex-1 py-3 rounded-xl font-black text-xs text-[#090d18] cursor-pointer shadow-md disabled:opacity-50"
                >
                  {isSubmittingAnnounce ? "Publication..." : "Publier l'annonce"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

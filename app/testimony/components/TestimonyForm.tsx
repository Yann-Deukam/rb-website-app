"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  PenLine,
  Volume2,
  Mic,
  Sparkles,
  BookOpen,
  User,
  Shield,
  Eye,
  Send,
  Save,
  Trash2,
  Check,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Radio,
  FileText,
} from "lucide-react";
import VoiceRecorder from "./VoiceRecorder";
import LiveDictation from "./LiveDictation";
import TestimonyCardPreview, { TestimonyData } from "./TestimonyCardPreview";
import SubmissionModal from "./SubmissionModal";
import { supabase } from "@/lib/supabase";

const CATEGORIES = [
  { id: "healing", name: "Healing & Miracles", icon: "✨" },
  { id: "peace", name: "Peace & Mental Health", icon: "🕊️" },
  { id: "provision", name: "Divine Provision", icon: "🍞" },
  { id: "salvation", name: "Salvation & Encounter", icon: "❤️" },
  { id: "academics", name: "Academics & Career", icon: "🎓" },
  { id: "deliverance", name: "Freedom & Deliverance", icon: "⛓️" },
  { id: "family", name: "Family Restoration", icon: "🏡" },
  { id: "faith", name: "Faith & Breakthrough", icon: "🔥" },
];

export default function TestimonyForm() {
  const [inputMode, setInputMode] = useState<"text" | "voice" | "dictate">("text");

  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Healing & Miracles");
  const [scripture, setScripture] = useState("");
  const [story, setStory] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [campusOrCity, setCampusOrCity] = useState("");
  const [audioData, setAudioData] = useState<{
    blob: Blob;
    url: string;
    duration: number;
  } | null>(null);

  // UI state
  const [showPrompts, setShowPrompts] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);
  const [submittedData, setSubmittedData] = useState<TestimonyData | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  const formTopRef = useRef<HTMLDivElement>(null);

  // Restore draft from localStorage
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem("rb_testimony_draft_v1");
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed.title) setTitle(parsed.title);
        if (parsed.category) setCategory(parsed.category);
        if (parsed.scripture) setScripture(parsed.scripture);
        if (parsed.story) setStory(parsed.story);
        if (parsed.authorName) setAuthorName(parsed.authorName);
        if (parsed.isAnonymous !== undefined) setIsAnonymous(parsed.isAnonymous);
        if (parsed.campusOrCity) setCampusOrCity(parsed.campusOrCity);
        if (parsed.inputMode) setInputMode(parsed.inputMode);
        setLastSavedTime("Draft restored from browser");
      }
    } catch (e) {
      console.warn("Could not load local draft:", e);
    }
  }, []);

  // Save draft helper
  const handleSaveDraft = () => {
    try {
      const draftObj = {
        title,
        category,
        scripture,
        story,
        authorName,
        isAnonymous,
        campusOrCity,
        inputMode,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem("rb_testimony_draft_v1", JSON.stringify(draftObj));
      const now = new Date();
      setLastSavedTime(`Saved at ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`);
      setTimeout(() => setLastSavedTime(null), 4000);
    } catch (e) {
      console.warn("Error saving draft:", e);
    }
  };

  // Reset Form
  const handleResetForm = () => {
    setTitle("");
    setCategory("Healing & Miracles");
    setScripture("");
    setStory("");
    setAuthorName("");
    setIsAnonymous(false);
    setCampusOrCity("");
    setAudioData(null);
    setValidationError(null);
    try {
      localStorage.removeItem("rb_testimony_draft_v1");
    } catch {
      // Ignore
    }
  };

  // Validation & Submit

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!title.trim()) {
      setValidationError(
        "Please give your testimony a title."
      );
      return;
    }

    const hasStory = story.trim().length >= 15;
    const hasAudio = !!audioData?.blob;

    if (inputMode === "voice" && !hasAudio) {
      setValidationError(
        "Please record and finish your audio message before submitting."
      );
      return;
    }

    if (inputMode === "dictate" && !hasStory) {
      setValidationError(
        "Please dictate your testimony (at least 15 characters)."
      );
      return;
    }

    if (inputMode === "text" && !hasStory) {
      setValidationError(
        "Please write your story (at least 15 characters)."
      );
      return;
    }

    try {
      let permanentAudioUrl: string | null = null;

      // 1. Upload the real audio file to Supabase Storage.
      if (inputMode === "voice" && audioData?.blob) {
        const audioBlob = audioData.blob;

        const extension = audioBlob.type.includes("mp4")
          ? "mp4"
          : "webm";

        const filePath =
          `testimonies/${crypto.randomUUID()}.${extension}`;

        const { error: uploadError } = await supabase.storage
          .from("testimony-audio")
          .upload(filePath, audioBlob, {
            contentType: audioBlob.type || "audio/webm",
            upsert: false,
          });

        if (uploadError) {
          throw new Error(
            `Audio upload failed: ${uploadError.message}`
          );
        }

        // 2. Get the permanent URL of the uploaded file.
        const { data: publicUrlData } = supabase.storage
          .from("testimony-audio")
          .getPublicUrl(filePath);

        permanentAudioUrl = publicUrlData.publicUrl;
      }

      // 3. Prepare the testimony.
      const compiledData: TestimonyData = {
        title: title.trim(),
        category,
        scripture: scripture.trim(),
        story:
          story.trim() ||
          (audioData
            ? `[Enregistrement vocal - ${Math.floor(
              audioData.duration / 60
            )}m${audioData.duration % 60}s]`
            : ""),
        authorName: authorName.trim(),
        isAnonymous,
        campusOrCity: campusOrCity.trim(),
        audioUrl: permanentAudioUrl,
        audioDuration: audioData?.duration,
        inputMode,
        createdAt: new Date().toISOString(),
      };

      // 4. Save the testimony with the permanent audio URL.
      const { error: insertError } = await supabase
        .from("testimonies")
        .insert([
          {
            title: compiledData.title,
            category: compiledData.category,
            scripture: compiledData.scripture || null,
            story: compiledData.story,
            author_name:
              compiledData.authorName ||
              (compiledData.isAnonymous ? "Anonymous" : "Témoin"),
            is_anonymous: compiledData.isAnonymous,
            campus_city: compiledData.campusOrCity || null,
            audio_url: permanentAudioUrl,
            audio_duration: compiledData.audioDuration || null,
            status: "pending",
          },
        ]);

      if (insertError) {
        throw new Error(
          `Testimony save failed: ${insertError.message}`
        );
      }

      // 5. Open the confirmation modal only after success.
      setSubmittedData(compiledData);
      setIsSubmissionModalOpen(true);
    } catch (err) {
      console.error("Testimony submission failed:", err);

      setValidationError(
        err instanceof Error
          ? err.message
          : "Could not submit your testimony. Please try again."
      );
    }
  };

  return (
    <div ref={formTopRef} className="w-full max-w-4xl mx-auto space-y-8">
      {/* Three Input Modes Selector Tabs */}
      <div className="space-y-3">
        <div className="text-center sm:text-left">
          <span className="text-[10px] uppercase tracking-widest font-extrabold text-[#b87b1e] dark:text-[#f3c053]">
            Format de votre témoignage
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            Choisissez comment vous souhaitez témoigner :
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-2 rounded-2xl bg-slate-100/90 dark:bg-[#090e1a] border border-slate-200 dark:border-[#f3c053]/25 shadow-sm">
          {/* Mode 1: Written */}
          <button
            type="button"
            onClick={() => setInputMode("text")}
            className={`flex flex-col items-start gap-1 p-3.5 rounded-xl text-left transition-all duration-200 cursor-pointer border ${inputMode === "text"
                ? "bg-white dark:bg-[#121c32] border-[#dfa458] dark:border-[#f3c053] shadow-md"
                : "border-transparent text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-white/5"
              }`}
          >
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg ${inputMode === "text" ? "bg-[#dfa458] text-[#090d18]" : "bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300"}`}>
                <PenLine className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-sm text-slate-900 dark:text-white">1. Récit Écrit</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-1">
              Rédigez votre histoire avec vos propres mots et structure.
            </p>
          </button>

          {/* Mode 2: Voice Note */}
          <button
            type="button"
            onClick={() => setInputMode("voice")}
            className={`flex flex-col items-start gap-1 p-3.5 rounded-xl text-left transition-all duration-200 cursor-pointer border ${inputMode === "voice"
                ? "bg-white dark:bg-[#121c32] border-[#1f5ea8] dark:border-[#38bdf8] shadow-md"
                : "border-transparent text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-white/5"
              }`}
          >
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg ${inputMode === "voice" ? "bg-[#1f5ea8] text-white" : "bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300"}`}>
                <Volume2 className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm text-slate-900 dark:text-white">2. Note Vocale</span>
                {audioData && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Audio enregistré" />
                )}
              </div>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-1">
              Enregistrez directement avec le micro de votre smartphone.
            </p>
          </button>

          {/* Mode 3: Live Dictation */}
          <button
            type="button"
            onClick={() => setInputMode("dictate")}
            className={`flex flex-col items-start gap-1 p-3.5 rounded-xl text-left transition-all duration-200 cursor-pointer border ${inputMode === "dictate"
                ? "bg-white dark:bg-[#121c32] border-[#dfa458] dark:border-[#f3c053] shadow-md"
                : "border-transparent text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-white/5"
              }`}
          >
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg ${inputMode === "dictate" ? "bg-[#256ec2] text-white" : "bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300"}`}>
                <Mic className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-sm text-slate-900 dark:text-white">3. Dictée Vocale</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-1">
              Parlez librement, vos paroles sont transcrites en direct.
            </p>
          </button>
        </div>
      </div>

      {/* Main Unified Testimony Form */}
      <form onSubmit={handleSubmit} className="rounded-3xl bg-white dark:bg-[#0c1424] border border-slate-200 dark:border-[#f3c053]/25 p-6 sm:p-10 space-y-8 shadow-[0_15px_40px_rgba(31,94,168,0.06)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.6)] transition-colors">
        {/* Form Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-white/10">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2 transition-colors">
              <span>Détails & Informations du Témoignage</span>
              <Sparkles className="w-5 h-5 text-[#dfa458] dark:text-[#f3c053]" />
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 transition-colors">
              Renseignez le contexte essentiel pour que votre témoignage édifie et inspire toute la jeunesse.
            </p>
          </div>

          {/* Quick Draft Status */}
          <div className="flex items-center gap-3">
            {lastSavedTime && (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                {lastSavedTime}
              </span>
            )}
            <button
              type="button"
              onClick={handleSaveDraft}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 text-xs font-semibold transition cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Sauvegarder</span>
            </button>
          </div>
        </div>

        {/* Validation error display */}
        {validationError && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-200 text-sm">
            <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm">{validationError}</p>
          </div>
        )}

        {/* 1. Title */}
        <div className="space-y-2">
          <label htmlFor="testimony-title" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
            Titre du Témoignage <span className="text-[#dfa458] dark:text-[#f3c053]">*</span>
          </label>
          <input
            id="testimony-title"
            type="text"
            required
            placeholder="Ex: Guéri de migraines chroniques lors de la veillée du vendredi"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-[#070b16] border border-slate-200 dark:border-white/15 focus:border-[#dfa458] dark:focus:border-[#f3c053] focus:ring-1 focus:ring-[#dfa458] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm sm:text-base outline-none transition"
          />
        </div>

        {/* 2. Category Selection Pills */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
            Domaine / Sphère de la Visitation divine <span className="text-[#dfa458] dark:text-[#f3c053]">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.name)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${category === cat.name
                    ? "bg-[#1f5ea8] text-white border border-[#1f5ea8] shadow-sm"
                    : "bg-slate-50 dark:bg-[#070b16] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-[#dfa458] dark:hover:border-[#f3c053]/40 hover:bg-slate-100 dark:hover:bg-white/5"
                  }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Scripture Anchor (Optional) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="testimony-scripture" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
              Verset Biblique d&apos;Ancrage <span className="text-slate-400 font-normal lowercase">(facultatif)</span>
            </label>
            <span className="text-[11px] text-[#996515] dark:text-[#f3c053] font-semibold">Parole de Dieu</span>
          </div>
          <div className="relative">
            <BookOpen className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              id="testimony-scripture"
              type="text"
              placeholder="Ex: Psaume 34:4 — 'J'ai cherché l'Éternel, et il m'a répondu...'"
              value={scripture}
              onChange={(e) => setScripture(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-[#070b16] border border-slate-200 dark:border-white/15 focus:border-[#dfa458] dark:focus:border-[#f3c053] text-slate-900 dark:text-white placeholder:text-slate-400 text-xs sm:text-sm outline-none transition"
            />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. DYNAMIC BODY DEPENDING ON CHOSEN INPUT MODE */}
        {/* ========================================================================= */}

        {/* MODE A: VOICE RECORDER */}
        {inputMode === "voice" && (
          <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-white/10 animate-fade-in">
            <div className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-[#1f5ea8] dark:text-[#38bdf8]" />
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Enregistrement de votre Note Vocale
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Appuyez sur le micro pour enregistrer votre voix en toute simplicité.
                </p>
              </div>
            </div>

            <VoiceRecorder
              onAudioRecorded={(data) => setAudioData(data)}
              existingAudioUrl={audioData?.url}
            />

            {/* Optional text summary for the audio note */}
            <div className="space-y-1.5 pt-2">
              <label htmlFor="testimony-story" className="block text-xs font-semibold text-slate-600 dark:text-slate-300">
                Résumé ou mot d&apos;accompagnement pour l&apos;audio <span className="text-slate-400 font-normal">(facultatif)</span>
              </label>
              <textarea
                id="testimony-story"
                rows={3}
                placeholder="Ajoutez un court résumé ou une phrase clé pour accompagner votre message audio..."
                value={story}
                onChange={(e) => setStory(e.target.value)}
                className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-[#070b16] border border-slate-200 dark:border-white/15 focus:border-[#dfa458] text-slate-900 dark:text-white text-xs sm:text-sm outline-none transition resize-none"
              />
            </div>
          </div>
        )}

        {/* MODE B: LIVE DICTATION */}
        {inputMode === "dictate" && (
          <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-white/10 animate-fade-in">
            <div className="flex items-center gap-2">
              <Mic className="w-5 h-5 text-[#dfa458] dark:text-[#f3c053]" />
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Dictée Vocale Intelligente
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Parlez naturellement. Votre récit s&apos;écrit et se structure en direct sous vos yeux.
                </p>
              </div>
            </div>

            <LiveDictation
              currentText={story}
              onTextChange={(newText) => setStory(newText)}
              onSwitchToVoice={() => setInputMode("voice")}
            />
          </div>
        )}

        {/* MODE C: WRITTEN STORY */}
        {inputMode === "text" && (
          <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-white/10 animate-fade-in">
            <div className="flex items-center justify-between">
              <label htmlFor="testimony-story" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                Récit de votre Témoignage <span className="text-[#dfa458] dark:text-[#f3c053]">*</span>
              </label>

              {/* Prompt Helper Accordion Toggle */}
              <button
                type="button"
                onClick={() => setShowPrompts(!showPrompts)}
                className="text-xs text-[#1f5ea8] dark:text-[#f3c053] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{showPrompts ? "Masquer les conseils" : "Guide de rédaction"}</span>
                {showPrompts ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>

            {/* Prompts Drawer */}
            {showPrompts && (
              <div className="p-4 rounded-xl bg-amber-50/80 dark:bg-[#070b16] border border-amber-200/80 dark:border-[#f3c053]/25 space-y-2 text-xs text-slate-700 dark:text-slate-300 animate-fade-in transition-colors">
                <p className="font-bold text-[#996515] dark:text-[#fce39e]">4 étapes pour un témoignage puissant :</p>
                <ol className="list-decimal list-inside space-y-1 text-slate-700 dark:text-slate-300">
                  <li><strong className="text-slate-900 dark:text-white">La Situation :</strong> Quelle difficulté, maladie, angoisse ou épreuve viviez-vous ?</li>
                  <li><strong className="text-slate-900 dark:text-white">La Prière / Rencontre :</strong> Comment avez-vous cherché Jésus ou participé à la prière ?</li>
                  <li><strong className="text-slate-900 dark:text-white">L&apos;Action de Dieu :</strong> Que s&apos;est-il passé ? Comment Jésus est intervenu avec puissance ?</li>
                  <li><strong className="text-slate-900 dark:text-white">Encouragement :</strong> Quel message partagez-vous à ceux qui traversent la même épreuve ?</li>
                </ol>
              </div>
            )}

            {/* Text Area */}
            <div className="relative">
              <textarea
                id="testimony-story"
                rows={8}
                placeholder="Racontez les merveilles de l'Éternel ! Partagez les détails avec foi et humilité..."
                value={story}
                onChange={(e) => setStory(e.target.value)}
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-[#070b16] border border-slate-200 dark:border-white/15 focus:border-[#dfa458] dark:focus:border-[#f3c053] focus:ring-1 focus:ring-[#dfa458] text-slate-900 dark:text-white placeholder:text-slate-400 text-sm sm:text-base leading-relaxed outline-none transition resize-y min-h-[180px]"
              />
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400">
              {story.trim().split(/\s+/).filter(Boolean).length} mots • {story.length} caractères
            </div>
          </div>
        )}

        {/* 5. Author Identity & Privacy */}
        <div className="pt-4 border-t border-slate-200 dark:border-white/10 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                Informations Auteur & Confidentialité
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Vous contrôlez totalement la manière dont votre identité est présentée.
              </p>
            </div>

            {/* Anonymous Toggle Pill */}
            <label className="flex items-center gap-2.5 p-2 px-3 rounded-xl bg-slate-50 dark:bg-[#070b16] border border-slate-200 dark:border-white/15 cursor-pointer hover:border-[#dfa458] dark:hover:border-[#f3c053]/40 transition">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 rounded text-[#dfa458] dark:text-[#f3c053] focus:ring-[#dfa458] accent-[#dfa458]"
              />
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-[#1f5ea8] dark:text-[#f3c053]" />
                <span>Témoigner de manière Anonyme</span>
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Author Name */}
            <div className="space-y-1.5">
              <label htmlFor="testimony-author" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                {isAnonymous ? "Votre Vrai Nom (Réservé à la modération)" : "Nom d'affichage ou Surnom"}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  id="testimony-author"
                  type="text"
                  placeholder={isAnonymous ? "Confidentiel pour les pasteurs" : "Ex: David K. ou Sœur Sarah"}
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#070b16] border border-slate-200 dark:border-white/15 focus:border-[#dfa458] dark:focus:border-[#f3c053] text-slate-900 dark:text-white text-xs sm:text-sm outline-none transition"
                />
              </div>
            </div>

            {/* Campus / City */}
            <div className="space-y-1.5">
              <label htmlFor="testimony-campus" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                Campus / Église / Ville <span className="text-slate-400 font-normal">(facultatif)</span>
              </label>
              <input
                id="testimony-campus"
                type="text"
                placeholder="Ex: Campus Cocody, Abidjan"
                value={campusOrCity}
                onChange={(e) => setCampusOrCity(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#070b16] border border-slate-200 dark:border-white/15 focus:border-[#dfa458] dark:focus:border-[#f3c053] text-slate-900 dark:text-white text-xs sm:text-sm outline-none transition"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="pt-6 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Preview Button */}
            <button
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-[#16223d] dark:hover:bg-[#1d2d50] text-[#1f5ea8] dark:text-[#fce39e] border border-slate-300 dark:border-[#f3c053]/30 text-xs sm:text-sm font-bold transition cursor-pointer"
            >
              <Eye className="w-4 h-4 text-[#dfa458] dark:text-[#f3c053]" />
              <span>Aperçu de la Carte</span>
            </button>

            {/* Reset Form */}
            <button
              type="button"
              onClick={handleResetForm}
              className="p-3 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition cursor-pointer"
              title="Réinitialiser"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Submit Testimony Button */}
          <button
            type="submit"
            className="gold-glow-btn w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full font-extrabold text-sm sm:text-base cursor-pointer tracking-wide"
          >
            <Send className="w-4 h-4 text-[#090d18]" />
            <span>
              {inputMode === "voice"
                ? "Envoyer le Témoignage Vocal"
                : inputMode === "dictate"
                  ? "Envoyer le Témoignage Dicté"
                  : "Envoyer le Témoignage Écrit"}
            </span>
          </button>
        </div>
      </form>

      {/* Modals */}
      <TestimonyCardPreview
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        testimony={{
          title: title || "Titre de votre témoignage",
          category,
          scripture,
          story: story || (audioData ? "[Témoignage vocal enregistré]" : "Votre récit s'affichera ici avec une mise en page soignée..."),
          authorName,
          isAnonymous,
          campusOrCity,
          audioUrl: audioData?.url,
          audioDuration: audioData?.duration,
          inputMode,
          createdAt: new Date().toISOString(),
        }}
      />

      <SubmissionModal
        isOpen={isSubmissionModalOpen}
        onClose={() => setIsSubmissionModalOpen(false)}
        testimony={submittedData}
        onResetForm={handleResetForm}
        onOpenPreview={() => setIsPreviewOpen(true)}
      />
    </div>
  );
}

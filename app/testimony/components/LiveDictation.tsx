"use client";

import { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  AlertCircle,
  Pause,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: {
      isFinal: boolean;
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionErrorEventLike {
  error: string;
  message?: string;
}

interface BrowserSpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
}

interface LiveDictationProps {
  currentText: string;
  onTextChange: (text: string) => void;
  onSwitchToVoice: () => void;
}

export default function LiveDictation({
  currentText,
  onTextChange,
  onSwitchToVoice,
}: LiveDictationProps) {
  const { language } = useLanguage();
  const [isDictating, setIsDictating] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [isSupported, setIsSupported] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const isListeningRef = useRef(false);
  const currentTextRef = useRef(currentText);
  const onTextChangeRef = useRef(onTextChange);

  // Keep refs synchronized with latest props without triggering recreation
  useEffect(() => {
    currentTextRef.current = currentText;
  }, [currentText]);

  useEffect(() => {
    onTextChangeRef.current = onTextChange;
  }, [onTextChange]);

  const dictationLangCode = language === "en" ? "en-US" : "fr-FR";

  // Setup Web Speech Recognition once per language
  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognitionAPI =
      (window as unknown as { SpeechRecognition?: new () => BrowserSpeechRecognition }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: new () => BrowserSpeechRecognition }).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setIsSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = dictationLangCode;

      recognition.onstart = () => {
        setIsDictating(true);
        isListeningRef.current = true;
        setErrorMessage(null);
      };

      recognition.onresult = (event: SpeechRecognitionEventLike) => {
        let finalChunk = "";
        let interimChunk = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalChunk += transcript + " ";
          } else {
            interimChunk += transcript;
          }
        }

        if (finalChunk) {
          const prev = currentTextRef.current;
          const separator = prev && !prev.endsWith(" ") && !prev.endsWith("\n") ? " " : "";
          const next = prev + separator + finalChunk;
          currentTextRef.current = next;
          onTextChangeRef.current(next);
        }

        setInterimText(interimChunk);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEventLike) => {
        // "aborted" and "no-speech" are normal lifecycle events in Chrome/Edge, not user-facing bugs
        if (event.error === "aborted" || event.error === "no-speech") {
          return;
        }

        if (event.error === "not-allowed") {
          setErrorMessage(
            language === "fr"
              ? "Accès micro refusé. Veuillez autoriser le microphone dans votre navigateur."
              : "Microphone access denied. Please allow microphone permissions."
          );
          setIsDictating(false);
          isListeningRef.current = false;
        } else {
          setErrorMessage(
            language === "fr"
              ? `Remarque reconnaissance vocale : ${event.error}`
              : `Speech recognition notice: ${event.error}`
          );
        }
      };

      recognition.onend = () => {
        // If the user hasn't explicitly clicked pause, auto-restart to prevent timeout silence abort
        if (isListeningRef.current) {
          try {
            recognition.start();
          } catch {
            // Wait slightly before restarting if still active
            setTimeout(() => {
              if (isListeningRef.current) {
                try {
                  recognition.start();
                } catch {
                  setIsDictating(false);
                  isListeningRef.current = false;
                }
              }
            }, 200);
          }
        } else {
          setIsDictating(false);
          setInterimText("");
        }
      };

      recognitionRef.current = recognition;
    } catch {
      setIsSupported(false);
    }

    return () => {
      isListeningRef.current = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // Ignore
        }
      }
    };
  }, [dictationLangCode, language]);

  const startDictation = () => {
    setErrorMessage(null);
    if (!recognitionRef.current) return;
    try {
      isListeningRef.current = true;
      recognitionRef.current.start();
      setIsDictating(true);
    } catch {
      // If already started, ensure state is aligned
      setIsDictating(true);
      isListeningRef.current = true;
    }
  };

  const stopDictation = () => {
    isListeningRef.current = false;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore
      }
    }
    setIsDictating(false);
    setInterimText("");
  };

  const insertPunctuation = (punct: string) => {
    const prev = (currentTextRef.current || "").trimEnd();
    const updated = prev + punct + " ";
    currentTextRef.current = updated;
    onTextChangeRef.current(updated);
  };

  const clearText = () => {
    currentTextRef.current = "";
    onTextChangeRef.current("");
    setInterimText("");
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-[#f3c053]/25 p-5 sm:p-7 space-y-5 shadow-sm dark:shadow-[0_12px_30px_rgba(0,0,0,0.4)] transition-colors">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <Mic className="w-5 h-5 text-[#dfa458] dark:text-[#f3c053]" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-wide">
              {language === "fr" ? "Dictée Vocale Intelligente" : "Live Speech-to-Text Dictation"}
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {language === "fr"
              ? "Parlez à votre rythme. Le texte s'accumule sans se réinitialiser."
              : "Speak naturally. Your words accumulate permanently without resetting."}
          </p>
        </div>

        {/* Status Pill */}
        <div className="flex items-center gap-2">
          {isDictating ? (
            <span className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              {language === "fr" ? "Microphone actif & écoute..." : "Listening & transcribing..."}
            </span>
          ) : (
            <span className="text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-white/5 px-3 py-1 rounded-full border border-slate-200 dark:border-white/10">
              {language === "fr" ? "En attente" : "Standby"}
            </span>
          )}
        </div>
      </div>

      {/* Browser Support Check */}
      {!isSupported && (
        <div className="p-4 rounded-xl bg-slate-100 dark:bg-[#1f5ea8]/15 border border-slate-200 dark:border-[#1f5ea8]/30 space-y-2">
          <div className="flex items-center gap-2 text-slate-900 dark:text-[#fce39e] font-semibold text-sm">
            <AlertCircle className="w-4 h-4 text-[#dfa458] dark:text-[#f3c053]" />
            <span>
              {language === "fr"
                ? "Reconnaissance vocale non disponible sur ce navigateur"
                : "Speech recognition not available in this browser"}
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {language === "fr"
              ? "La dictée en direct fonctionne sur Google Chrome, Microsoft Edge et Safari mobile. Vous pouvez aussi utiliser l'enregistreur de note vocale !"
              : "Live dictation works best in Chrome, Edge, and Safari. You can also use the Voice Note recorder!"}
          </p>
          <button
            type="button"
            onClick={onSwitchToVoice}
            className="text-xs font-semibold text-[#1f5ea8] dark:text-[#f3c053] hover:underline cursor-pointer"
          >
            {language === "fr" ? "Passer à la Note Vocale →" : "Switch to Voice Note →"}
          </button>
        </div>
      )}

      {/* Error notification */}
      {errorMessage && (
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-200 text-xs">
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <p>{errorMessage}</p>
        </div>
      )}

      {/* Active Dictation Visual Box */}
      <div className="relative rounded-2xl bg-slate-50 dark:bg-[#070b16] border border-slate-200 dark:border-[#1f5ea8]/30 p-5 sm:p-6 flex flex-col items-center justify-center min-h-[140px] text-center overflow-hidden transition-colors">
        {/* Pulsing acoustic rings when dictating */}
        {isDictating && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-24 h-24 rounded-full bg-[#dfa458]/15 dark:bg-[#f3c053]/10 animate-ping" />
            <div className="w-40 h-40 rounded-full bg-[#1f5ea8]/10 animate-pulse" />
          </div>
        )}

        <div className="relative z-10 flex flex-col items-center gap-3">
          <div
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
              isDictating
                ? "bg-gradient-to-tr from-[#f3c053] to-[#dfa458] text-[#090d18] shadow-[0_0_25px_rgba(243,192,83,0.6)] scale-105"
                : "bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
            }`}
          >
            {isDictating ? (
              <Mic className="w-7 h-7 animate-pulse text-[#090d18]" />
            ) : (
              <MicOff className="w-6 h-6" />
            )}
          </div>

          {/* Real-time streaming interim text preview */}
          {interimText ? (
            <div className="max-w-md px-3.5 py-1.5 rounded-lg bg-amber-50 dark:bg-white/5 border border-amber-200 dark:border-[#f3c053]/30">
              <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-mono">
                {language === "fr" ? "En cours de parole :" : "Speaking live:"}
              </p>
              <p className="text-xs sm:text-sm font-medium text-[#996515] dark:text-[#fce39e] italic leading-relaxed">
                &ldquo;{interimText}&rdquo;
              </p>
            </div>
          ) : (
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
              {isDictating
                ? language === "fr"
                  ? "Parlez... vos phrases s'ajoutent directement dans la zone de texte ci-dessous."
                  : "Listening... speak freely, your words are added to the text area below."
                : language === "fr"
                ? "Appuyez sur 'Démarrer la dictée' pour commencer."
                : "Click 'Start Live Dictation' to begin speaking."}
            </p>
          )}
        </div>
      </div>

      {/* Dictation Action Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2">
          {isSupported && (
            <>
              {!isDictating ? (
                <button
                  type="button"
                  onClick={startDictation}
                  className="gold-glow-btn flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm cursor-pointer shadow-md"
                >
                  <Mic className="w-4 h-4 text-[#090d18]" />
                  <span>{language === "fr" ? "Démarrer la dictée" : "Start Live Dictation"}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopDictation}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs sm:text-sm shadow-md transition cursor-pointer"
                >
                  <Pause className="w-4 h-4" />
                  <span>{language === "fr" ? "Mettre en pause" : "Pause Dictation"}</span>
                </button>
              )}
            </>
          )}

          {currentText && (
            <button
              type="button"
              onClick={clearText}
              className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-white/5 transition"
              title={language === "fr" ? "Effacer le texte dicté" : "Clear dictated text"}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Dictation Punctuation Helpers */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mr-0.5">
            {language === "fr" ? "Ponctuation :" : "Punctuation:"}
          </span>
          <button
            type="button"
            onClick={() => insertPunctuation(".")}
            className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-mono font-bold transition cursor-pointer"
          >
            . (Point)
          </button>
          <button
            type="button"
            onClick={() => insertPunctuation(",")}
            className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-mono font-bold transition cursor-pointer"
          >
            , (Virgule)
          </button>
          <button
            type="button"
            onClick={() => insertPunctuation("\n\n")}
            className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-mono font-bold transition cursor-pointer"
          >
            ↵ {language === "fr" ? "Saut de ligne" : "Paragraph"}
          </button>
        </div>
      </div>

      {/* Editable Text Area to see & fine-tune the transcribed story in real-time */}
      <div className="space-y-1.5 pt-3 border-t border-slate-200 dark:border-white/5">
        <div className="flex items-center justify-between text-xs">
          <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
            {language === "fr" ? "Texte dicté (Modifiable au clavier)" : "Dictated Story (Editable with keyboard)"}
          </label>
          <span className="text-slate-400 text-[11px]">
            {currentText.trim().split(/\s+/).filter(Boolean).length} {language === "fr" ? "mots" : "words"}
          </span>
        </div>
        <textarea
          rows={6}
          value={currentText}
          onChange={(e) => {
            currentTextRef.current = e.target.value;
            onTextChangeRef.current(e.target.value);
          }}
          placeholder={
            language === "fr"
              ? "Vos paroles transcrites s'affichent ici au fur et à mesure. Vous pouvez aussi retoucher le texte au clavier..."
              : "Your transcribed words will appear here as you speak. You can also edit and fine-tune with your keyboard..."
          }
          className="w-full p-4 rounded-xl bg-slate-50 dark:bg-[#070b16] border border-slate-200 dark:border-white/15 focus:border-[#dfa458] dark:focus:border-[#f3c053] text-slate-900 dark:text-white text-xs sm:text-sm leading-relaxed outline-none transition resize-y min-h-[140px]"
        />
      </div>
    </div>
  );
}

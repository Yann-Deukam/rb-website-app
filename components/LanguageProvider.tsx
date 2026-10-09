"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Language = "fr" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const DICTIONARY: Record<Language, Record<string, string>> = {
  fr: {
    // Nav & Common
    "nav.home": "Accueil",
    "nav.membership": "Communauté",
    "nav.membership_badge": "Rejoindre",
    "nav.testimony": "Témoigner",
    "nav.wall": "Mur du Réveil",
    "nav.give_testimony": "Partager un Témoignage",
    "nav.share_action": "Témoigner (Vocal & Écrit)",
    "nav.admin": "Administration",

    // Home Hero
    "hero.subtitle": "Revival Bearer — Mouvement Chrétien de Jeunesse",
    "hero.line1": "Porter la lumière",
    "hero.line2": "du Christ à cette",
    "hero.line3": "génération.",
    "hero.desc": "Un mouvement rempli de l'Esprit unissant les jeunes croyants pour élever le nom de Jésus et proclamer ce qu'Il a accompli.",
    "hero.cta_testimony": "Partager votre témoignage",
    "hero.cta_member": "Devenir membre",

    // Statement
    "statement.text": "Nous sommes de jeunes croyants qui refusent de chuchoter. Chaque témoignage est un flambeau, chaque rassemblement est un feu, et chaque cœur qui s'éveille en enflamme un autre.",
    "statement.verse": "« Ils l'ont vaincu à cause du sang de l'Agneau et à cause de la parole de leur témoignage. » — Apocalypse 12:11",

    // Home Testimonies
    "stories.heading": "Des récits qui\nenflamment les cœurs",
    "stories.explore": "Explorer le Mur du Réveil",

    // Home Membership Promo
    "m_promo.title": "Vous n'avez pas été créé pour porter ce feu seul.",
    "m_promo.desc": "L'adhésion est votre manière d'appartenir : à une famille, un appel et une génération qui se réveille.",
    "m_promo.cta": "Rejoindre le mouvement",

    // Programs
    "programs.title": "Rassemblements & Présence",
    "programs.desc": "Là où la foi prend vie : venez adorer, prier et célébrer avec d'autres jeunes disciples.",

    // Gallery
    "gallery.title": "En images",
    "gallery.desc": "Aperçu de nos temps d'adoration, veillées, retraites et missions.",

    // Footer
    "footer.desc": "Une génération réveillée par Jésus. Nous nous rassemblons pour expérimenter Sa présence, proclamer Ses merveilles et porter Sa lumière dans les nations.",
    "footer.connect_title": "Restez connectés",
    "footer.connect_heading": "Le feu ne s'arrête pas ici.",
    "footer.connect_sub": "Suivez le mouvement, écoutez les témoignages et participez à ce que Dieu fait aujourd'hui.",
    "footer.social_note": "Retrouvez-nous sur tous nos réseaux officiels.",
    "footer.explore": "Explorer",
    "footer.heart_title": "Notre Cœur",
    "footer.heart_desc": "Une communauté de jeunes centrée sur Christ, fondée sur la Parole et engagée à faire grandir chaque croyant dans la foi et sa destinée.",
    "footer.find_place": "Trouver sa place",
    "footer.story_care_title": "Un sanctuaire pour chaque histoire",
    "footer.story_care_desc": "Chaque témoignage est accueilli avec bienveillance pastorale et respect. Possibilité de témoigner de façon anonyme.",
    "footer.share_cta": "Partager un témoignage",
    "footer.copyright": "Mouvement Revival Bearer. Tout pour la seule gloire de Jésus.",
    "footer.nations": "Lumière pour les Nations",

    // Testimony Page
    "testimony.hero_portal": "Portail des Témoignages Revival Bearer",
    "testimony.hero_title": "Votre histoire allume le",
    "testimony.hero_title_highlight": "Réveil",
    "testimony.hero_desc": "Racontez les bienfaits de l'Éternel ! Enregistrez votre voix, dictez en direct ou écrivez votre histoire. Chaque victoire affermit la foi de quelqu'un d'autre.",
    "testimony.write_pill": "Récit Écrit",
    "testimony.record_pill": "Note Vocale",
    "testimony.dictate_pill": "Dictée Vocale",
    "testimony.anon_pill": "Option anonyme disponible",

    // Testimony Categories
    "cat.all": "Tous",
    "cat.healing": "Guérison & Miracles",
    "cat.peace": "Paix & Santé Mentale",
    "cat.provision": "Provision Divine",
    "cat.salvation": "Salut & Rencontre",
    "cat.academics": "Études & Carrière",
    "cat.deliverance": "Délivrance & Liberté",
    "cat.family": "Restauration Familiale",
    "cat.faith": "Foi & Percée",
    "cat.voice_notes": "Notes Vocales",

    // Wall Feed
    "wall.tag": "Mur du Réveil",
    "wall.heading": "Dernières Victoires de la",
    "wall.heading_highlight": "Jeunesse",
    "wall.sub": "Lisez et écoutez comment Jésus agit au sein des lycées, universités et campus.",
    "wall.search_placeholder": "Rechercher par mot-clé, ville ou auteur...",
    "wall.share_btn": "Partager mon témoignage",
    "wall.empty": "Aucun témoignage trouvé dans cette catégorie.",
    "wall.prev": "Précédent",
    "wall.next": "Suivant",
    "wall.page_of": "Page {page} sur {total}",
  },
  en: {
    // Nav & Common
    "nav.home": "Home",
    "nav.membership": "Community",
    "nav.membership_badge": "Join",
    "nav.testimony": "Testimonies",
    "nav.wall": "Wall of Revival",
    "nav.give_testimony": "Share Testimony",
    "nav.share_action": "Share (Voice & Text)",
    "nav.admin": "Admin Portal",

    // Home Hero
    "hero.subtitle": "Revival Bearer — Youth Christian Movement",
    "hero.line1": "Bearing the light",
    "hero.line2": "of Christ to this",
    "hero.line3": "generation.",
    "hero.desc": "A spirit-filled movement uniting young believers to lift the name of Jesus and declare what He has done.",
    "hero.cta_testimony": "Share your testimony",
    "hero.cta_member": "Become a member",

    // Statement
    "statement.text": "We are young believers who refuse to whisper. Every testimony is a torch, every gathering is a fire, and every heart that wakes up lights another.",
    "statement.verse": "“They overcame him by the blood of the Lamb and by the word of their testimony.” — Revelation 12:11",

    // Home Testimonies
    "stories.heading": "Stories that\nset hearts on fire",
    "stories.explore": "Explore the Wall of Revival",

    // Home Membership Promo
    "m_promo.title": "You were not made to carry the fire alone.",
    "m_promo.desc": "Membership is how you belong: to a family, a calling and a generation that is waking up.",
    "m_promo.cta": "Join the movement",

    // Programs
    "programs.title": "Gatherings & Presence",
    "programs.desc": "Where faith comes alive: come worship, pray, and witness alongside other young disciples.",

    // Gallery
    "gallery.title": "In Focus",
    "gallery.desc": "Snapshots from worship nights, student outpourings, retreats, and mission outreaches.",

    // Footer
    "footer.desc": "A generation awakened by Jesus. We gather to encounter His presence, share what He has done, and carry His light into the world.",
    "footer.connect_title": "Stay connected",
    "footer.connect_heading": "The fire doesn’t stop here.",
    "footer.connect_sub": "Follow the movement, hear the stories, and be part of what God is doing in this generation.",
    "footer.social_note": "Find us across the community’s social channels.",
    "footer.explore": "Explore",
    "footer.heart_title": "Our Heart",
    "footer.heart_desc": "A youth fellowship centred on Christ, grounded in the Word, and committed to helping young believers grow in faith and purpose.",
    "footer.find_place": "Find your place",
    "footer.story_care_title": "A space for every story",
    "footer.story_care_desc": "Every testimony is received with pastoral care, dignity, and integrity. You can choose anonymous submission anytime.",
    "footer.share_cta": "Share your testimony",
    "footer.copyright": "Revival Bearer Movement. All for the glory of Jesus.",
    "footer.nations": "Light to the Nations",

    // Testimony Page
    "testimony.hero_portal": "Revival Bearer Testimony Portal",
    "testimony.hero_title": "Your Story Sparks",
    "testimony.hero_title_highlight": "Revival",
    "testimony.hero_desc": "Tell of the Lord’s goodness! Record your voice, dictate in real time, or type your story. Every breakthrough brings courage to another believer.",
    "testimony.write_pill": "Written Story",
    "testimony.record_pill": "Voice Note",
    "testimony.dictate_pill": "Live Dictation",
    "testimony.anon_pill": "Anonymous mode available",

    // Testimony Categories
    "cat.all": "All",
    "cat.healing": "Healing & Miracles",
    "cat.peace": "Peace & Mental Health",
    "cat.provision": "Divine Provision",
    "cat.salvation": "Salvation & Encounter",
    "cat.academics": "Academics & Career",
    "cat.deliverance": "Freedom & Deliverance",
    "cat.family": "Family Restoration",
    "cat.faith": "Faith & Breakthrough",
    "cat.voice_notes": "Voice Notes",

    // Wall Feed
    "wall.tag": "Wall of Revival",
    "wall.heading": "Recent Youth",
    "wall.heading_highlight": "Encounters",
    "wall.sub": "Read and listen to how Jesus is moving in colleges, high schools, and youth ministries worldwide.",
    "wall.search_placeholder": "Search by keyword, city or author...",
    "wall.share_btn": "Share your testimony",
    "wall.empty": "No testimonies found in this category.",
    "wall.prev": "Previous",
    "wall.next": "Next",
    "wall.page_of": "Page {page} of {total}",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("fr");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("rb_lang") as Language | null;
      if (saved === "fr" || saved === "en") {
        setLanguageState(saved);
        document.documentElement.lang = saved;
        return;
      }

      // Detect browser language default
      const browserLang = navigator.language?.toLowerCase() || "";
      const defaultLang: Language = browserLang.startsWith("en") ? "en" : "fr";
      setLanguageState(defaultLang);
      document.documentElement.lang = defaultLang;
    } catch {
      // Default to French
      setLanguageState("fr");
      document.documentElement.lang = "fr";
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("rb_lang", lang);
      document.documentElement.lang = lang;
    } catch (e) {
      console.warn("Could not save language preference:", e);
    }
  };

  const toggleLanguage = () => {
    const next: Language = language === "fr" ? "en" : "fr";
    setLanguage(next);
  };

  const t = (key: string): string => {
    return DICTIONARY[language]?.[key] || DICTIONARY.fr[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

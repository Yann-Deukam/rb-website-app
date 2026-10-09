"use client";

import { useState } from "react";
import {
  Sparkles,
  Heart,
  Play,
  Pause,
  BookOpen,
  ArrowUp,
} from "lucide-react";

interface SampleTestimony {
  id: string;
  title: string;
  category: string;
  scripture: string;
  story: string;
  author: string;
  campus: string;
  isVoice: boolean;
  audioDuration?: string;
  likes: number;
  date: string;
}

const SAMPLE_TESTIMONIES: SampleTestimony[] = [
  {
    id: "1",
    title: "Overcoming Chronic Panic Attacks During Finals Week",
    category: "Mental Health & Peace",
    scripture: "Philippians 4:6-7 — 'Do not be anxious about anything...'",
    story:
      "During my final semester exams, anxiety was so overwhelming that I couldn't sleep for four days straight. One of the Revival Bearer prayer leaders prayed with me over the phone at midnight. The peace that entered the room was tangible. Not only did I sleep peacefully, but I walked into the exam hall with supernatural clarity and passed with honors. Jesus is truly our Prince of Peace!",
    author: "Jessica T.",
    campus: "Varsity Campus Fellowship",
    isVoice: false,
    likes: 42,
    date: "2 days ago",
  },
  {
    id: "2",
    title: "Instant Knee Healing in the Middle of Youth Worship Night",
    category: "Healing & Miracles",
    scripture: "Isaiah 53:5 — 'By His stripes we are healed.'",
    story:
      "Listen to this 45-second voice note! I had a torn meniscus from soccer and couldn't bend my right knee without sharp pain for 8 months. During the worship night chorus, warmth shot through my leg. I bent my knee, jumped, and had zero pain. The doctor confirmed the meniscus was completely sound!",
    author: "Brother David (Anonymous)",
    campus: "Revival Bearer London Hub",
    isVoice: true,
    audioDuration: "00:45",
    likes: 67,
    date: "5 days ago",
  },
  {
    id: "3",
    title: "Supernatural $1,200 Provision Exactly When Rent Was Due",
    category: "Divine Provision",
    scripture: "Matthew 6:33 — 'Seek first the kingdom of God...'",
    story:
      "As an international student, my funds were exhausted and my landlord gave me 24 hours to clear the remaining rent balance. Instead of panicking, I sowed my last tithe and went to our Tuesday prayer altar. At 11:30 AM the next day, an anonymous donor sent the exact amount to my university portal. God provides right on time!",
    author: "Michael K.",
    campus: "City College Fellowship",
    isVoice: false,
    likes: 58,
    date: "1 week ago",
  },
];

export default function CommunityFeed({
  onScrollToForm,
}: {
  onScrollToForm: () => void;
}) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [likesState, setLikesState] = useState<{ [key: string]: number }>({
    "1": 42,
    "2": 67,
    "3": 58,
  });
  const [hasLiked, setHasLiked] = useState<{ [key: string]: boolean }>({});
  const [activeVoicePlaying, setActiveVoicePlaying] = useState<string | null>(null);

  const categories = [
    "All",
    "Healing & Miracles",
    "Mental Health & Peace",
    "Divine Provision",
    "Voice Notes",
  ];

  const handleLike = (id: string) => {
    if (hasLiked[id]) {
      setLikesState((prev) => ({ ...prev, [id]: prev[id] - 1 }));
      setHasLiked((prev) => ({ ...prev, [id]: false }));
    } else {
      setLikesState((prev) => ({ ...prev, [id]: prev[id] + 1 }));
      setHasLiked((prev) => ({ ...prev, [id]: true }));
    }
  };

  const filtered = SAMPLE_TESTIMONIES.filter((t) => {
    if (selectedCategory === "All") return true;
    if (selectedCategory === "Voice Notes") return t.isVoice;
    return t.category === selectedCategory;
  });

  return (
    <section id="wall" className="mt-20 pt-12 border-t border-slate-200 dark:border-[#f3c053]/15 transition-colors">
      {/* Section Header */}
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1f5ea8]/10 text-[#1f5ea8] dark:bg-[#1f5ea8]/20 dark:text-[#60a5fa] border border-[#1f5ea8]/25 dark:border-[#1f5ea8]/40 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-[#dfa458] dark:text-[#f3c053]" />
          <span>Wall of Revival</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white transition-colors">
          Recent Youth <span className="gold-gradient-text">Encounters</span>
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto transition-colors">
          Read and listen to how Jesus is moving in colleges, high schools, and youth ministries
          worldwide.
        </p>

        {/* Filter Pills */}
        <div className="flex flex-wrap justify-center gap-2 pt-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#dfa458] dark:bg-[#f3c053] text-[#090d18] font-bold shadow-sm dark:shadow-[0_0_12px_rgba(243,192,83,0.35)]"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Testimonies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((testimony) => (
          <div
            key={testimony.id}
            className="rounded-2xl bg-white dark:bg-[#0c1424] border border-slate-200 dark:border-[#f3c053]/20 p-6 flex flex-col justify-between hover:border-[#dfa458] dark:hover:border-[#f3c053]/50 transition duration-300 shadow-[0_8px_25px_rgba(31,94,168,0.06)] dark:shadow-[0_8px_25px_rgba(0,0,0,0.5)] relative overflow-hidden group"
          >
            {/* Top accent */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-b from-[#dfa458]/10 dark:from-[#f3c053]/10 to-transparent rounded-bl-full pointer-events-none" />

            <div className="space-y-4">
              {/* Category & Date */}
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#1f5ea8]/10 text-[#1f5ea8] dark:bg-[#1f5ea8]/30 dark:text-[#60a5fa] border border-[#1f5ea8]/25 dark:border-[#1f5ea8]/40">
                  {testimony.category}
                </span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500">{testimony.date}</span>
              </div>

              {/* Title */}
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#b87b1e] dark:group-hover:text-[#fce39e] transition">
                {testimony.title}
              </h3>

              {/* Scripture quote */}
              <div className="flex items-start gap-1.5 text-xs text-[#996515] dark:text-[#fce39e] bg-amber-50 dark:bg-[#f3c053]/10 p-2.5 rounded-lg border border-amber-200 dark:border-[#f3c053]/20">
                <BookOpen className="w-3.5 h-3.5 text-[#dfa458] dark:text-[#f3c053] flex-shrink-0 mt-0.5" />
                <span className="italic">{testimony.scripture}</span>
              </div>

              {/* Voice note simulation if applicable */}
              {testimony.isVoice && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#080d19] border border-slate-200 dark:border-[#1f5ea8]/40 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveVoicePlaying(
                          activeVoicePlaying === testimony.id ? null : testimony.id
                        )
                      }
                      className="w-8 h-8 rounded-full bg-[#f3c053] text-[#090d18] flex items-center justify-center cursor-pointer hover:bg-[#fce39e] transition shadow-sm"
                    >
                      {activeVoicePlaying === testimony.id ? (
                        <Pause className="w-3.5 h-3.5 fill-current" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      )}
                    </button>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Voice Note</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        {activeVoicePlaying === testimony.id ? "Playing preview..." : "Recorded testimony"}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-[#1f5ea8] dark:text-[#f3c053]">{testimony.audioDuration}</span>
                </div>
              )}

              {/* Story content */}
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-4">
                {testimony.story}
              </p>
            </div>

            {/* Author and Engagement Footer */}
            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#1f5ea8] flex items-center justify-center text-white font-bold text-[10px]">
                  {testimony.author.charAt(0)}
                </div>
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block">{testimony.author}</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">{testimony.campus}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleLike(testimony.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition cursor-pointer ${
                  hasLiked[testimony.id]
                    ? "bg-red-500/15 border-red-500/30 text-red-600 dark:text-red-400"
                    : "bg-slate-100 border-slate-200 dark:bg-white/5 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-red-500"
                }`}
              >
                <Heart
                  className={`w-3.5 h-3.5 ${
                    hasLiked[testimony.id] ? "fill-red-500 text-red-500" : ""
                  }`}
                />
                <span>{likesState[testimony.id]}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CTA to scroll up to form */}
      <div className="mt-10 text-center">
        <button
          type="button"
          onClick={onScrollToForm}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white dark:bg-[#16223d] hover:bg-slate-50 dark:hover:bg-[#1f2f54] text-[#1f5ea8] dark:text-[#fce39e] border border-slate-200 dark:border-[#f3c053]/30 text-sm font-semibold transition cursor-pointer shadow-sm dark:shadow-lg"
        >
          <ArrowUp className="w-4 h-4 text-[#dfa458] dark:text-[#f3c053]" />
          <span>Has God moved in your life too? Add your testimony above</span>
        </button>
      </div>
    </section>
  );
}

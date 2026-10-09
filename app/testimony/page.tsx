import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TestimonyHero from "./components/TestimonyHero";
import TestimonyForm from "./components/TestimonyForm";
import CommunityFeedWrapper from "./components/CommunityFeedWrapper";

export const metadata: Metadata = {
  title: "Share Your Testimony | Revival Bearer Youth Community",
  description:
    "Record voice notes, dictate live with speech-to-text, or write your testimony of what Jesus has done. Your story sparks revival across campuses and cities.",
  openGraph: {
    title: "Revival Bearer | Testimony Portal",
    description:
      "Share your testimony by voice, live dictation, or text. High-end platform for the next generation of believers.",
    images: ["/logos/rb-logo-vertical-gold.png"],
  },
};

export default function TestimonyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 dark:bg-[#070a12] dark:text-slate-100 selection:bg-[#f3c053]/30 selection:text-[#996515] dark:selection:text-[#fce39e] relative transition-colors duration-300">
      {/* Global Navbar with Theme Toggle */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        {/* Hero Section */}
        <TestimonyHero />

        {/* Central Testimony Form (Voice, Dictation, Text) */}
        <div id="testimony-form-section">
          <TestimonyForm />
        </div>

        {/* Community Feed / Wall of Revival */}
        <CommunityFeedWrapper />
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}

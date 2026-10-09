"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  Heart,
  Music2,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  FiInstagram,
  FiFacebook,
  FiYoutube,
} from "react-icons/fi";
import { useLanguage } from "./LanguageProvider";

const SOCIALS = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/",
    Icon: FiInstagram,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/",
    Icon: FiFacebook,
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/",
    Icon: Music2,
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/",
    Icon: FiYoutube,
  },
  {
    name: "WhatsApp",
    href: "https://www.whatsapp.com/",
    Icon: MessageCircle,
  },
];

export default function Footer() {
  const { t } = useLanguage();

  const PLATFORM_LINKS = [
    { label: t("nav.home"), href: "/" },
    { label: t("nav.membership"), href: "/membership" },
    { label: t("nav.testimony"), href: "/testimony" },
    { label: t("nav.wall"), href: "/testimony#wall" },
  ];

  return (
    <footer className="relative isolate overflow-hidden border-t border-[#d9b56d]/20 bg-[#080b12] text-slate-300">
      {/* Subtle ambient light */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-40 -z-10 h-[28rem] w-[28rem] rounded-full bg-[#c99a45]/[0.08] blur-[100px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-48 -left-32 -z-10 h-[24rem] w-[24rem] rounded-full bg-[#1f5ea8]/[0.10] blur-[100px]"
      />

      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* Brand statement */}
        <div className="grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.35fr_0.65fr] lg:items-end lg:gap-20">
          <div>
            <Link
              href="/"
              aria-label="Revival Bearer home"
              className="relative mb-7 block h-16 w-56 transition-opacity hover:opacity-80"
            >
              <Image
                src="/logos/rb-logo-horizontal-gold.png"
                alt="Revival Bearer"
                fill
                priority
                sizes="224px"
                className="object-contain object-left"
              />
            </Link>

            <p className="max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
              {t("footer.desc")}
            </p>

            <div className="mt-7 flex max-w-xl items-start gap-3 border-l border-[#d9b56d]/60 pl-4">
              <Sparkles
                aria-hidden="true"
                className="mt-1 h-4 w-4 shrink-0 text-[#f3c053]"
              />
              <p className="text-sm italic leading-6 text-[#e7d4ad]">
                {t("statement.verse")}
              </p>
            </div>
          </div>

          <div className="lg:justify-self-end">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#f3c053]">
              {t("footer.connect_title")}
            </p>
            <h2 className="mt-3 max-w-sm text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              {t("footer.connect_heading")}
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">
              {t("footer.connect_sub")}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {SOCIALS.map(({ name, href, Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Revival Bearer on ${name}`}
                  title={name}
                  className="group flex h-11 w-11 items-center justify-center border border-white/10 bg-white/[0.03] text-slate-300 transition duration-300 hover:border-[#f3c053]/60 hover:bg-[#f3c053]/10 hover:text-[#f3c053] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f3c053]"
                >
                  <Icon className="h-[18px] w-[18px] transition-transform duration-300 group-hover:-translate-y-0.5" />
                </a>
              ))}
            </div>
            <p className="mt-3 text-xs text-slate-500">
              {t("footer.social_note")}
            </p>
          </div>
        </div>

        {/* Navigation and community care */}
        <div className="grid gap-10 border-t border-white/10 py-10 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.2fr] lg:gap-16">
          <nav aria-label="Footer navigation">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-white">
              {t("footer.explore")}
            </h3>
            <ul className="mt-5 space-y-3">
              {PLATFORM_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-[#f3c053]"
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-white">
              {t("footer.heart_title")}
            </h3>
            <p className="mt-5 max-w-xs text-sm leading-7 text-slate-400">
              {t("footer.heart_desc")}
            </p>
            <Link
              href="/membership"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#f3c053] transition-colors hover:text-[#ffe3a0]"
            >
              {t("footer.find_place")}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="border border-white/10 bg-white/[0.025] p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#f3c053]/25 bg-[#f3c053]/10">
                <ShieldCheck className="h-4 w-4 text-[#f3c053]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">
                  {t("footer.story_care_title")}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {t("footer.story_care_desc")}
                </p>
                <Link
                  href="/testimony"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#f3c053] transition-colors hover:text-[#ffe3a0]"
                >
                  {t("footer.share_cta")}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-4 border-t border-white/10 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {t("footer.copyright")}
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="text-slate-600 hover:text-[#f3c053] transition-colors"
            >
              {t("nav.admin")}
            </Link>
            <span className="text-slate-700">•</span>
            <p className="inline-flex items-center gap-1.5 tracking-wide">
              Made with
              <Heart
                aria-label="love"
                className="h-3.5 w-3.5 fill-[#f3c053] text-[#f3c053]"
              />
              <span className="font-medium text-[#d9b56d]">
                {t("footer.nations")}
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

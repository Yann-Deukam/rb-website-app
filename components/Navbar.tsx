"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Sparkles, Mic, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import LanguageToggle from "./LanguageToggle";
import AnnouncementBanner from "./AnnouncementBanner";
import { useLanguage } from "./LanguageProvider";

export default function Navbar() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isHome = pathname === "/";
  // Transparent only on the home hero, before scrolling
  const clear = isHome && !scrolled && !mobileMenuOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { name: t("nav.home"), href: "/" },
    { name: t("nav.membership"), href: "/membership", badge: t("nav.membership_badge") },
    { name: t("nav.testimony"), href: "/testimony" },
    { name: t("nav.wall"), href: "/testimony#wall" },
  ];

  return (
    <header
      className={`${isHome ? "fixed" : "sticky"} top-0 z-50 w-full transition-all duration-500 ${clear
        ? "border-b border-transparent bg-transparent"
        : "border-b border-slate-200/80 bg-white/95 backdrop-blur-md dark:border-[#f3c053]/15 dark:bg-[#070a12]/95"
        }`}
    >
      <AnnouncementBanner clear={clear} />
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label="Revival Bearers home"
          className="relative z-10 flex shrink-0 items-center"
        >
          {/* Full logo on desktop */}
          <span className="relative hidden h-20 w-80 sm:block">
            <Image
              src="/logos/logo-light.png"
              alt="Revival Bearers — Youth Christian Movement"
              fill
              priority
              sizes="208px"
              className={`object-contain object-left transition-opacity duration-300 ${clear ? "opacity-0" : "opacity-100 dark:opacity-0"
                }`}
            />

            <Image
              src="/logos/logo-dark.png"
              alt=""
              fill
              priority
              sizes="208px"
              className={`object-contain object-left transition-opacity duration-300 ${clear ? "opacity-100" : "opacity-0 dark:opacity-100"
                }`}
            />
          </span>

          {/* Single icon on mobile */}
          <span className="relative block size-10 shrink-0 sm:hidden">
            <Image
              src="/logos/logo-icon.png"
              alt=""
              fill
              priority
              sizes="40px"
              className="object-contain"
            />
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex lg:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${clear
                  ? isActive
                    ? "border border-white/30 bg-white/15 text-white"
                    : "text-white/85 hover:bg-white/10 hover:text-white"
                  : isActive
                    ? "border border-[#1f5ea8]/30 bg-[#1f5ea8]/10 text-[#1f5ea8] dark:border-[#f3c053]/30 dark:bg-[#f3c053]/15 dark:text-[#fce39e]"
                    : "text-slate-700 hover:bg-slate-100 hover:text-[#1f5ea8] dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
                  }`}
              >
                {link.name}
                {link.badge && (
                  <span className="inline-flex items-center rounded-full bg-[#1f5ea8] px-1.5 py-0.5 text-[10px] font-semibold text-white">{link.badge}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 sm:flex">
          <LanguageToggle />
          <ThemeToggle />
          <Link href="/testimony" className="gold-glow-btn flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold tracking-wide text-[#090d18]">
            <Sparkles className="h-4 w-4" />
            <span>{t("nav.give_testimony")}</span>
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:hidden">
          <LanguageToggle />
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`rounded-lg p-2 transition ${clear ? "text-white hover:bg-white/10" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"}`}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden ${mobileMenuOpen
            ? "grid-rows-[1fr] opacity-100"
            : "pointer-events-none grid-rows-[0fr] opacity-0"
            }`}
          aria-hidden={!mobileMenuOpen}
        >
          <div className="overflow-hidden">
            <div
              className={`border-t border-slate-200/70 bg-white/95 px-4 pb-6 pt-4 backdrop-blur-2xl dark:border-[#f3c053]/15 dark:bg-[#070a12]/95 ${mobileMenuOpen
                ? "translate-y-0"
                : "-translate-y-3"
                } transform transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]`}
            >
              <nav className="space-y-2">
                {navLinks.map((link, index) => {
                  const isActive =
                    pathname === link.href ||
                    (link.href.includes("#") &&
                      pathname === link.href.split("#")[0]);

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      tabIndex={mobileMenuOpen ? 0 : -1}
                      style={{
                        transitionDelay: mobileMenuOpen
                          ? `${index * 55}ms`
                          : "0ms",
                      }}
                      className={`flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition-[background-color,color,transform] duration-300 ${mobileMenuOpen
                        ? "translate-x-0 opacity-100"
                        : "translate-x-2 opacity-0"
                        } ${isActive
                          ? "bg-[#1f5ea8]/10 text-[#1f5ea8] dark:bg-[#f3c053]/15 dark:text-[#fce39e]"
                          : "text-slate-700 hover:bg-slate-100 hover:text-[#1f5ea8] dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
                        }`}
                    >
                      <span>{link.name}</span>

                      {link.badge && (
                        <span className="rounded-full bg-[#1f5ea8] px-2 py-0.5 text-xs font-semibold text-white">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-4 border-t border-slate-200/70 pt-4 dark:border-white/10">
                <Link
                  href="/testimony"
                  onClick={() => setMobileMenuOpen(false)}
                  tabIndex={mobileMenuOpen ? 0 : -1}
                  className="gold-glow-btn flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-base font-semibold text-[#090d18] transition-transform duration-300 active:scale-[0.98]"
                >
                  <Mic className="h-4 w-4" />
                  <span>{t("nav.share_action")}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mic, ArrowRight, ArrowDown, Quote, MapPin, Check } from "lucide-react";
import { CONTENT, GALLERY } from "@/constants/home";
import { useLanguage } from "@/components/LanguageProvider";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const { language, t } = useLanguage();
  const c = CONTENT[language] || CONTENT.fr;

  const root = useRef<HTMLDivElement>(null);
  const progSection = useRef<HTMLElement>(null);
  const progTrack = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Smooth scrolling synced with ScrollTrigger
    const lenis = new Lenis({ lerp: 0.1 });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        /* Hero intro: one orchestrated sequence */
        gsap.set(".h-word", { yPercent: 110 });
        gsap.set(".h-fade", { autoAlpha: 0, y: 24 });
        gsap.set(".h-video", { scale: 1.25 });
        gsap
          .timeline({ defaults: { ease: "power4.out" } })
          .to(".h-video", { scale: 1, duration: 2.4, ease: "power2.out" }, 0)
          .to(".h-word", { yPercent: 0, duration: 1.3, stagger: 0.14 }, 0.3)
          .to(".h-fade", { autoAlpha: 1, y: 0, duration: 1, stagger: 0.12 }, 1.1);

        /* Hero parallax on scroll */
        gsap.to(".h-video", {
          yPercent: 18,
          ease: "none",
          scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to(".h-content", {
          yPercent: -12,
          autoAlpha: 0.2,
          ease: "none",
          scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom 30%", scrub: true },
        });

        /* Statement: reveal words on scroll */
        gsap.from(".s-word", {
          opacity: 0.15,
          stagger: 0.08,
          ease: "none",
          scrollTrigger: {
            trigger: ".statement",
            start: "top 75%",
            end: "bottom 55%",
            scrub: 0.6,
          },
        });

        /* Testimonies header */
        gsap.from(".t-title", {
          yPercent: 100,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".t-title", start: "top 85%" },
        });

        /* Testimonies cards */
        gsap.from(".t-card", {
          y: 60,
          autoAlpha: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: ".t-grid", start: "top 80%" },
        });

        /* Membership banner */
        gsap.from(".m-panel", {
          scale: 0.96,
          autoAlpha: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: { trigger: ".m-panel", start: "top 75%" },
        });
        gsap.from(".m-perk", {
          x: 30,
          autoAlpha: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: { trigger: ".m-list", start: "top 80%" },
        });

        /* Gallery: subtle stagger */
        gsap.from(".g-item", {
          scale: 0.94,
          autoAlpha: 0,
          duration: 0.8,
          stagger: { amount: 0.6, from: "center" },
          ease: "power3.out",
          scrollTrigger: { trigger: ".g-item", start: "top 85%" },
        });

        /* Final CTA */
        gsap.from(".c-line", {
          yPercent: 100,
          duration: 1.1,
          stagger: 0.15,
          ease: "power4.out",
          scrollTrigger: { trigger: ".cta", start: "top 75%" },
        });
      });

      /* Programs: pinned horizontal scroll on desktop only */
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const track = progTrack.current!;
        const dist = () => track.scrollWidth - window.innerWidth + 96;
        gsap.to(track, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: {
            trigger: progSection.current,
            pin: true,
            scrub: 1,
            start: "top top",
            end: () => "+=" + dist(),
            invalidateOnRefresh: true,
          },
        });
      });
    }, root);

    return () => {
      ctx.revert();
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [language]);

  const gold = "text-[#dfa458] dark:text-[#f3c053]";

  return (
    <div
      ref={root}
      className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 dark:bg-[#070a12] dark:text-slate-100 selection:bg-[#f3c053]/30 transition-colors duration-300"
    >
      <Navbar />

      <main className="flex-1">
        {/* ============ HERO ============ */}
        <section className="hero relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-[#070a12] text-white">
          <video
            className="h-video absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/images/hero.jpg"
          >
            <source src="/videos/hero.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-[#070a12]/70 via-[#070a12]/35 to-[#070a12]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_60%,rgba(243,192,83,0.18),transparent_60%)]" />

          <div className="h-content relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-20 pt-28 sm:px-6 lg:px-8">
            <div className="h-fade mb-6 flex items-center gap-3">
              <Image
                src="/logos/rb-star-gold.png"
                alt=""
                width={36}
                height={36}
                className="drop-shadow-[0_0_14px_rgba(243,192,83,0.7)]"
              />
              <span className="text-sm font-medium tracking-wide text-[#fce39e]">
                {t("hero.subtitle")}
              </span>
            </div>

            <h1 className="text-[clamp(2.6rem,8vw,7.5rem)] font-extrabold leading-[0.95] tracking-tight">
              {c.headline.map((line) => (
                <span key={line} className="block overflow-hidden pb-[0.08em]">
                  <span className="h-word block">{line}</span>
                </span>
              ))}
            </h1>

            <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <p className="h-fade max-w-xl text-base leading-relaxed text-slate-200 sm:text-lg">
                {c.heroDesc}
              </p>
              <div className="h-fade flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/testimony"
                  className="gold-glow-btn flex items-center justify-center gap-3 rounded-full px-8 py-4 text-base font-bold text-[#090d18]"
                >
                  <Mic className="h-5 w-5" /> {c.ctaTestimony} <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/membership"
                  className="flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/5 px-7 py-4 text-base font-semibold backdrop-blur transition hover:bg-white/15"
                >
                  {c.ctaMember}
                </Link>
              </div>
            </div>
            <ArrowDown className="h-fade absolute bottom-6 left-1/2 hidden h-5 w-5 -translate-x-1/2 animate-bounce text-white/60 sm:block" />
          </div>
        </section>

        {/* ============ STATEMENT ============ */}
        <section className="statement mx-auto max-w-5xl px-4 py-32 sm:px-6 lg:py-48">
          <p className="text-[clamp(1.6rem,4vw,3.4rem)] font-semibold leading-[1.2] tracking-tight">
            {c.statement.split(" ").map((w, i) => (
              <span key={i} className="s-word inline-block pr-[0.28em]">
                {w}
              </span>
            ))}
          </p>
          <p className={`mt-10 max-w-md text-sm italic ${gold}`}>{c.verse}</p>
        </section>

        {/* ============ TESTIMONIES ============ */}
        <section className="border-t border-slate-200 py-24 dark:border-[#f3c053]/15">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <h2 className="overflow-hidden pb-2 text-4xl font-extrabold tracking-tight sm:text-6xl">
                <span className="t-title block">
                  {c.storiesTitle[0]}
                  <br />
                  {c.storiesTitle[1]}
                </span>
              </h2>
              <Link
                href="/testimony#wall"
                className="flex items-center gap-2 font-semibold text-[#1f5ea8] hover:underline dark:text-[#f3c053]"
              >
                {c.exploreWall} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="t-grid mt-14 grid gap-6 md:grid-cols-3">
              {c.testimonies.map((item, i) => (
                <figure
                  key={item.name}
                  className={`t-card flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-8 dark:border-[#f3c053]/20 dark:bg-[#0c1424] ${
                    i === 1 ? "md:mt-12" : ""
                  }`}
                >
                  <Quote className={`mb-6 h-8 w-8 ${gold}`} />
                  <blockquote className="text-lg leading-relaxed">{item.text}</blockquote>
                  <figcaption className="mt-8 flex items-center justify-between text-sm">
                    <span className="font-bold">{item.name}</span>
                    <span className="rounded-full bg-[#1f5ea8]/10 px-3 py-1 text-[#1f5ea8] dark:bg-[#f3c053]/10 dark:text-[#fce39e]">
                      {item.tag}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* ============ MEMBERSHIP ============ */}
        <section className="m-panel relative overflow-hidden bg-[#0b1530] py-28 text-white">
          <div className="absolute -right-40 top-0 h-[520px] w-[520px] rounded-full bg-[#1f5ea8]/40 blur-3xl" />
          <div className="absolute -left-40 bottom-0 h-[420px] w-[420px] rounded-full bg-[#f3c053]/15 blur-3xl" />
          <div className="relative mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <h2 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
                {c.membershipPromo.title}
              </h2>
              <p className="mt-6 max-w-md text-lg text-slate-300">
                {c.membershipPromo.desc}
              </p>
              <Link
                href="/membership"
                className="gold-glow-btn mt-10 inline-flex items-center gap-3 rounded-full px-8 py-4 font-bold text-[#090d18]"
              >
                {c.membershipPromo.cta} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <ul className="m-list space-y-4 self-center">
              {c.perks.map((p) => (
                <li
                  key={p}
                  className="m-perk flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
                >
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#f3c053]" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ============ GALLERY ============ */}
        <section className="mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8">
          <h2 className="max-w-2xl text-4xl font-extrabold tracking-tight sm:text-6xl">
            {c.galleryTitle}
          </h2>
          <div className="mt-14 grid grid-cols-1 items-stretch gap-4 md:grid-cols-12 md:auto-rows-[200px]">
            {GALLERY.map((g) => (
              <div
                key={g.src}
                className={`g-item relative isolate min-w-0 overflow-hidden rounded-3xl bg-gradient-to-br from-[#1f5ea8]/40 to-[#f3c053]/30 aspect-[4/3] md:aspect-auto ${g.cls}`}
              >
                <div className="g-img absolute inset-0 overflow-hidden will-change-transform">
                  <Image
                    src={g.src}
                    alt={g.alt}
                    fill
                    sizes="(min-width: 1280px) 1100px, (min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============ PROGRAMS & ANNOUNCEMENTS ============ */}
        <section
          ref={progSection}
          className="overflow-hidden border-t border-slate-200 py-24 dark:border-[#f3c053]/15 lg:flex lg:min-h-screen lg:flex-col lg:justify-center lg:py-0"
        >
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
              {c.programsHeading}
            </h2>
            <p className="mt-4 max-w-lg text-slate-600 dark:text-slate-400">
              {c.programsSub}
            </p>
          </div>
          <div
            ref={progTrack}
            className="mt-12 flex gap-6 overflow-x-auto px-4 pb-6 sm:px-6 lg:overflow-visible lg:px-12 lg:pb-0 will-change-transform"
          >
            {c.programs.map((p) => (
              <article
                key={p.title}
                className="flex min-h-[340px] w-[82vw] shrink-0 flex-col justify-between rounded-3xl border border-slate-200 bg-white p-8 sm:w-[420px] dark:border-[#f3c053]/20 dark:bg-[#0c1424]"
              >
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span className={`font-bold ${gold}`}>{p.date}</span>
                    <span className="rounded-full border border-slate-300 px-3 py-1 text-xs dark:border-white/20">
                      {p.tag}
                    </span>
                  </div>
                  <h3 className="mt-8 text-3xl font-extrabold tracking-tight">{p.title}</h3>
                  <p className="mt-3 text-slate-600 dark:text-slate-300">{p.text}</p>
                </div>
                <p className="mt-8 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <MapPin className="h-4 w-4" />
                  {p.place}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* ============ FINAL CTA ============ */}
        <section className="cta relative overflow-hidden px-4 py-40 text-center">
          <div className="absolute left-1/2 top-1/2 -z-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-[#1f5ea8]/20 via-[#f3c053]/20 to-transparent blur-3xl" />
          <h2 className="relative text-[clamp(2.4rem,7vw,6rem)] font-extrabold leading-[1] tracking-tight">
            <span className="block overflow-hidden pb-2">
              <span className="c-line block">{c.finalCtaLine1}</span>
            </span>
            <span className="block overflow-hidden pb-2">
              <span className="c-line block">{c.finalCtaLine2}</span>
            </span>
          </h2>
          <Link
            href="/testimony"
            className="gold-glow-btn relative mt-12 inline-flex items-center gap-3 rounded-full px-10 py-5 text-lg font-bold text-[#090d18]"
          >
            <Mic className="h-5 w-5" /> {c.ctaTestimony}
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
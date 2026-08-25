"use client";

import Image from "next/image";
import { hero, cta } from "@/content";
import { TelegramIcon } from "./ui";
import ApplyButton from "./ApplyButton";
import { track } from "@/lib/analytics";

const CARDS = [
  {
    src: "/hero/tape-3.jpg",
    alt: "Сітчаста аплікація тейпа на стегні",
    cls: "left-[1%] top-[16%] h-28 w-28 sm:h-40 sm:w-40 lg:h-48 lg:w-48",
    delay: "0s",
  },
  {
    src: "/hero/tape-1.jpg",
    alt: "Аплікація тейпа на гомілці й стопі",
    cls: "left-[4%] top-[62%] h-32 w-32 sm:h-44 sm:w-44 lg:h-52 lg:w-52",
    delay: "1.1s",
  },
  {
    src: "/hero/tape-6.jpg",
    alt: "Тейпування кисті та пальців",
    cls: "left-[13%] top-[3%] h-28 w-28 sm:h-36 sm:w-36 lg:h-44 lg:w-44",
    delay: "2.2s",
  },
  {
    src: "/hero/tape-5.jpg",
    alt: "Аплікація тейпа на шийному відділі",
    cls: "right-[13%] top-[3%] h-28 w-28 sm:h-36 sm:w-36 lg:h-44 lg:w-44",
    delay: "0.6s",
  },
  {
    src: "/hero/tape-2.jpg",
    alt: "Віяльна аплікація на литковому м'язі",
    cls: "right-[4%] top-[62%] h-32 w-32 sm:h-44 sm:w-44 lg:h-52 lg:w-52",
    delay: "1.7s",
  },
  {
    src: "/hero/tape-4.jpg",
    alt: "Тейпування кисті в бічному світлі",
    cls: "right-[1%] top-[16%] h-28 w-28 sm:h-40 sm:w-40 lg:h-48 lg:w-48",
    delay: "2.6s",
  },
];


export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-24 sm:pt-28">
      <div className="relative w-full overflow-hidden bg-cream px-4 py-16 sm:py-20 md:py-24">
        {/* wave */}
        <svg
          className="pointer-events-none absolute inset-x-0 top-1/2 h-[120%] w-[140%] -translate-x-[14%] -translate-y-1/2 opacity-90"
          viewBox="0 0 1200 600"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M-100 380 C 150 130, 330 130, 520 300 S 880 500, 1080 250 L 1400 180 L 1400 700 L -100 700 Z"
            fill="#F4A8F2"
            opacity="0.55"
          />
          <path
            d="M-100 440 C 180 220, 360 220, 560 370 S 900 560, 1100 330 L 1400 260 L 1400 700 L -100 700 Z"
            fill="#FBE0FA"
            opacity="0.75"
          />
        </svg>

        {/* floating cards */}
        <div className="pointer-events-none absolute inset-0 hidden sm:block">
          {CARDS.map((c) => (
            <div
              key={c.src}
              className={`absolute animate-floaty overflow-hidden rounded-3xl shadow-xl shadow-ink/15 ring-1 ring-white/50 ${c.cls}`}
              style={{ animationDelay: c.delay }}
            >
              <Image
                src={c.src}
                alt={c.alt}
                fill
                sizes="(min-width: 1024px) 224px, (min-width: 640px) 192px, 144px"
                className="object-cover"
                priority
              />
            </div>
          ))}
        </div>

        <div className="relative z-10 mx-auto max-w-3xl pt-10 text-center sm:pt-16 lg:pt-20">
          <p className="animate-rise text-xs font-bold uppercase tracking-[0.3em] text-ink/45 sm:text-sm">
            {hero.kicker}
          </p>

          <h1 className="mt-6 animate-rise text-[8vw] font-extrabold leading-[1.02] tracking-tighter sm:text-5xl lg:text-6xl">
            {hero.title}
            <span className="mt-2 block text-pink-deep">{hero.titleAccent}</span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl animate-rise text-base leading-relaxed text-ink/70 sm:text-lg">
            {hero.subtitle}
          </p>

          <div className="mx-auto mt-12 flex w-full max-w-xl animate-rise flex-col items-stretch gap-3">
            <ApplyButton
              source="hero"
              className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-lime px-7 py-4 text-sm font-extrabold uppercase leading-tight tracking-tight text-ink shadow-lg shadow-lime/30 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-lime/40 hover:brightness-105 sm:px-9 sm:py-5 sm:text-base"
            >
              {cta.primary}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1 sm:h-[18px] sm:w-[18px]"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </ApplyButton>

            <a
              href={cta.secondaryHref}
              className="inline-flex items-center justify-center rounded-full border border-ink/15 bg-white/70 px-7 py-4 text-sm font-bold backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-ink/30 hover:bg-white sm:px-9 sm:py-5 sm:text-base"
            >
              {cta.secondary}
            </a>
          </div>

          <p className="mx-auto mt-8 max-w-none animate-rise whitespace-nowrap text-[2.6vw] leading-relaxed text-ink/50 sm:text-sm">
            {hero.audienceLine}
          </p>

          {/* фото на мобільному — горизонтальна стрічка */}
          <div className="mt-12 flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] sm:hidden [&::-webkit-scrollbar]:hidden">
            {CARDS.map((c) => (
              <div
                key={c.src}
                className="relative h-36 w-36 shrink-0 overflow-hidden rounded-3xl shadow-lg shadow-ink/10 ring-1 ring-white/50"
              >
                <Image src={c.src} alt={c.alt} fill sizes="144px" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}

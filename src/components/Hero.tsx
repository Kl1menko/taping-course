"use client";

import Image from "next/image";
import { hero, marquee } from "@/content";
import { Arrow, TelegramIcon } from "./ui";
import { CountingNumber } from "@/components/animate-ui/primitives/texts/counting-number";
import GlowButton from "./GlowButton";

const CARDS = [
  {
    src: "/hero/tape-3.jpg",
    alt: "Сітчаста аплікація тейпа на стегні",
    cls: "left-[3%] top-[20%] h-32 w-32 sm:h-44 sm:w-44 lg:h-52 lg:w-52",
    delay: "0s",
  },
  {
    src: "/hero/tape-1.jpg",
    alt: "Аплікація тейпа на гомілці й стопі",
    cls: "left-[10%] top-[56%] h-36 w-36 sm:h-48 sm:w-48 lg:h-56 lg:w-56",
    delay: "1.1s",
  },
  {
    src: "/hero/tape-6.jpg",
    alt: "Тейпування кисті та пальців",
    cls: "left-[24%] top-[6%] h-32 w-32 sm:h-40 sm:w-40 lg:h-48 lg:w-48",
    delay: "2.2s",
  },
  {
    src: "/hero/tape-5.jpg",
    alt: "Аплікація тейпа на шийному відділі",
    cls: "right-[23%] top-[7%] h-32 w-32 sm:h-40 sm:w-40 lg:h-48 lg:w-48",
    delay: "0.6s",
  },
  {
    src: "/hero/tape-2.jpg",
    alt: "Віяльна аплікація на литковому м'язі",
    cls: "right-[8%] top-[52%] h-36 w-36 sm:h-48 sm:w-48 lg:h-56 lg:w-56",
    delay: "1.7s",
  },
  {
    src: "/hero/tape-4.jpg",
    alt: "Тейпування кисті в бічному світлі",
    cls: "right-[2%] top-[18%] h-32 w-32 sm:h-44 sm:w-44 lg:h-52 lg:w-52",
    delay: "2.6s",
  },
];


export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-24 sm:pt-28">
      <div className="relative w-full overflow-hidden bg-cream px-4 py-20 sm:py-28 md:py-36">
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

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <h1 className="animate-rise">
            <span className="block text-[17vw] font-extrabold leading-[0.85] tracking-tighter sm:text-[10rem] md:text-[12.5rem]">
              {hero.title}
            </span>
            <span className="mt-1 block text-[5.5vw] font-bold uppercase tracking-[0.35em] text-ink/55 sm:text-[2rem] sm:tracking-[0.42em]">
              {hero.titleSub}
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl animate-rise text-base text-ink/75 sm:text-lg">
            {hero.subtitle}
          </p>

          <div className="mt-10 flex animate-rise flex-col items-center justify-center gap-4 sm:flex-row">
            <GlowButton>
              {hero.ctaPrimary.label}
            </GlowButton>
            <a
              href={hero.ctaSecondary.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-white/80 px-6 py-4 text-sm font-semibold backdrop-blur transition hover:bg-white sm:w-auto"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-lime text-ink">
                <TelegramIcon className="h-4 w-4" />
              </span>
              {hero.ctaSecondary.label}
            </a>
          </div>

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

          <dl className="mx-auto mt-14 grid max-w-lg grid-cols-3 gap-4">
            {hero.stats.map((s) => (
              <div key={s.label} className="animate-rise rounded-3xl bg-white/70 px-3 py-4 backdrop-blur">
                <dt className="text-2xl font-extrabold tabular-nums sm:text-3xl">
                  <CountingNumber number={s.n} inView decimalSeparator=" " />
                  {s.suffix}
                </dt>
                <dd className="mt-1 text-xs text-ink/60">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* marquee */}
      <div className="mx-[10px] mt-4 overflow-hidden rounded-full bg-ink py-4">
        <div className="flex w-max animate-marquee">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0 items-center" aria-hidden={dup === 1}>
              {marquee.map((word) => (
                <span
                  key={word}
                  className="flex items-center gap-6 px-6 text-sm font-bold uppercase tracking-widest text-white sm:text-base"
                >
                  {word}
                  <span className="text-lime">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

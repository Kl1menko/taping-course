"use client";

import { useRef } from "react";
import { reviews } from "@/content";
import { Reveal, SectionTitle } from "./ui";

export default function Reviews() {
  const track = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector("article");
    const step = card ? card.clientWidth + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section id="proof" className="py-16 sm:py-24">
      <div className="wrap">
        <Reveal>
          <SectionTitle highlight="ЩО КАЖУТЬ" rest="ВИПУСКНИКИ" />
        </Reveal>
      </div>

      <div
        ref={track}
        className="mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto px-[10px] pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {reviews.items.map((r, i) => (
          <article
            key={r.name}
            className={`w-[85vw] shrink-0 snap-center rounded-4xl p-8 sm:w-[380px] ${
              i % 2 === 0 ? "bg-white" : "bg-lime/40"
            } border border-ink/5`}
          >
            <div className="flex gap-1 text-lg text-pink-deep" aria-label="5 з 5">
              {"★★★★★"}
            </div>
            <p className="mt-5 text-sm leading-relaxed text-ink/75 sm:text-base">
              «{r.text}»
            </p>
            <footer className="mt-7 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-sm font-bold text-lime">
                {r.name.charAt(0)}
              </span>
              <span>
                <span className="block text-sm font-bold">{r.name}</span>
                <span className="block text-xs text-ink/50">{r.role}</span>
              </span>
            </footer>
          </article>
        ))}
      </div>

      <div className="wrap flex justify-center gap-3 sm:justify-end">
        <button
          onClick={() => scrollBy(-1)}
          aria-label="Попередній відгук"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/10 bg-white transition hover:bg-lime"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
            <path d="M15 5 8 12l7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          onClick={() => scrollBy(1)}
          aria-label="Наступний відгук"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/10 bg-white transition hover:bg-lime"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
            <path d="m9 5 7 7-7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </section>
  );
}

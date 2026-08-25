"use client";

import { useState } from "react";
import { faq } from "@/content";
import { Reveal } from "./ui";
import { track } from "@/lib/analytics";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-16 sm:py-24">
      <div className="wrap"><div className="mx-auto max-w-3xl">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold uppercase leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              {faq.title}
            </h2>
          </div>
        </Reveal>

        <div className="mt-14 space-y-3">
          {faq.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={item.q} delay={i * 50}>
                <div
                  className={`overflow-hidden rounded-4xl border transition-colors ${
                    isOpen ? "border-ink/10 bg-white" : "border-ink/5 bg-white/60"
                  }`}
                >
                  <h3>
                    <button
                      onClick={() => {
                        const next = isOpen ? null : i;
                        setOpen(next);
                        if (next !== null) track("faq_open", { question: item.q });
                      }}
                      aria-expanded={isOpen}
                      aria-controls={`faq-${i}`}
                      className="flex w-full items-center gap-4 px-6 py-5 text-left sm:px-8"
                    >
                      <span className="flex-1 text-base font-bold sm:text-lg">{item.q}</span>
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                          isOpen ? "rotate-45 bg-pink" : "bg-ink/5"
                        }`}
                        aria-hidden="true"
                      >
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none">
                          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
                        </svg>
                      </span>
                    </button>
                  </h3>
                  <div
                    id={`faq-${i}`}
                    className={`grid transition-all duration-400 ease-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-6 text-sm leading-relaxed text-ink/70 sm:px-8 sm:text-base">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
      </div>
    </section>
  );
}

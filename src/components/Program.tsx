"use client";

import { useState } from "react";
import { program } from "@/content";
import { Reveal, SectionTitle } from "./ui";
import { MedicalIcon, type MedicalIconName } from "./icons";

export default function Program() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="program" className="py-16 sm:py-24">
      <div className="wrap"><div className="mx-auto max-w-5xl">
        <Reveal>
          <SectionTitle highlight="ПРОГРАМА" rest="КУРСУ" sub={program.subtitle} />
        </Reveal>

        <div className="mt-14 space-y-3">
          {program.modules.map((m, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={m.n} delay={i * 60}>
                <div
                  className={`overflow-hidden rounded-4xl border transition-colors duration-300 ${
                    isOpen ? "border-ink/10 bg-white shadow-lg shadow-ink/5" : "border-ink/5 bg-white/60"
                  }`}
                >
                  <h3>
                    <button
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      aria-controls={`module-${i}`}
                      className="flex w-full items-center gap-4 px-6 py-6 text-left sm:gap-6 sm:px-8"
                    >
                      <span
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                          isOpen ? "bg-pink-deep text-white" : "bg-ink/5 text-ink/45"
                        }`}
                        aria-hidden="true"
                      >
                        <MedicalIcon name={m.icon as MedicalIconName} className="h-[22px] w-[22px]" />
                      </span>
                      <span
                        className={`shrink-0 text-2xl font-extrabold transition-colors sm:text-3xl ${
                          isOpen ? "text-pink-deep" : "text-ink/25"
                        }`}
                      >
                        {m.n}
                      </span>
                      <span className="flex-1 text-lg font-bold leading-snug sm:text-xl">
                        {m.title}
                      </span>
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                          isOpen ? "rotate-45 bg-lime" : "bg-ink/5"
                        }`}
                        aria-hidden="true"
                      >
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                        </svg>
                      </span>
                    </button>
                  </h3>

                  <div
                    id={`module-${i}`}
                    className={`grid transition-all duration-400 ease-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <ul className="space-y-3 px-6 pb-7 sm:px-8 sm:pl-[5.5rem]">
                        {m.lessons.map((lesson) => (
                          <li key={lesson} className="flex gap-3 text-sm text-ink/70 sm:text-base">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-pink-deep" />
                            {lesson}
                          </li>
                        ))}
                      </ul>
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

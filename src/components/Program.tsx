"use client";

import { useState } from "react";
import { program } from "@/content";
import { Reveal } from "./ui";
import { MedicalIcon, type MedicalIconName } from "./icons";
import { track } from "@/lib/analytics";

export default function Program() {
  const [open, setOpen] = useState<number | null>(0);

  // наскрізна нумерація уроків 01..13
  let counter = 0;

  return (
    <section id="program" className="py-16 sm:py-24">
      <div className="wrap">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <div className="text-center">
              <h2 className="text-3xl font-extrabold uppercase leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                {program.title}
              </h2>
              <p className="mt-5 text-sm font-bold uppercase tracking-widest text-pink-deep sm:text-base">
                {program.subtitle}
              </p>
            </div>
          </Reveal>

          <div className="mt-14 space-y-3">
            {program.modules.map((m, i) => {
              const isOpen = open === i;
              return (
                <Reveal key={m.slug} delay={i * 60}>
                  <div
                    className={`overflow-hidden rounded-4xl border transition-colors duration-300 ${
                      isOpen
                        ? "border-ink/10 bg-white shadow-lg shadow-ink/5"
                        : "border-ink/5 bg-white/60"
                    }`}
                  >
                    <h3>
                      <button
                        onClick={() => {
                          const next = isOpen ? null : i;
                          setOpen(next);
                          if (next !== null) track("program_open", { module: m.slug });
                        }}
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
                          <MedicalIcon
                            name={m.icon as MedicalIconName}
                            className="h-[22px] w-[22px]"
                          />
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="block text-xs font-extrabold uppercase tracking-widest text-ink/35">
                            Модуль {m.n} — {m.name}
                          </span>
                          <span className="mt-1 block text-lg font-bold leading-snug sm:text-xl">
                            {m.title}
                          </span>
                        </span>

                        {/* Плюс/хрестик розкриття — фірмовим синім.
                            Закритий стан теж синій, лише блідий: так
                            видно, що це та сама кнопка в двох станах. */}
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                            isOpen
                              ? "rotate-45 bg-blue text-white"
                              : "bg-blue/10 text-blue"
                          }`}
                          aria-hidden="true"
                        >
                          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.4"
                                  strokeLinecap="round" />
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
                          {m.lessons.map((lesson) => {
                            counter += 1;
                            const n = String(counter).padStart(2, "0");
                            return (
                              <li
                                key={lesson}
                                className="flex gap-3 text-sm text-ink/70 sm:text-base"
                              >
                                <span className="shrink-0 font-extrabold text-ink/25">{n}</span>
                                {lesson}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={250}>
            <p className="mt-10 text-center text-sm font-bold uppercase tracking-widest text-ink/45 sm:text-base">
              {program.outro}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

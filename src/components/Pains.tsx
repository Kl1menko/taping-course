"use client";

import { useState } from "react";
import { pains } from "@/content";
import { Arrow, Reveal, SectionTitle } from "./ui";
import SignupButton from "./SignupButton";

export default function Pains() {
  const [picked, setPicked] = useState<number[]>([]);
  const count = picked.length;

  const toggle = (i: number) =>
    setPicked((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]));

  return (
    <section id="pains" className="py-16 sm:py-24">
      <div className="wrap">
        <Reveal>
          <SectionTitle highlight="ЗНАЙОМО" rest="?" sub={pains.subtitle} />
        </Reveal>

        <ul className="mt-14 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {pains.items.map((item, i) => {
            const on = picked.includes(i);
            return (
              <Reveal key={item} delay={i * 70} className="h-full">
                <li className="h-full">
                  <button
                    type="button"
                    onClick={() => toggle(i)}
                    aria-pressed={on}
                    className={`group relative flex h-full w-full items-start gap-4 overflow-hidden rounded-[1.75rem] p-7 text-left transition-all duration-300 ${
                      on
                        ? "bg-ink shadow-xl shadow-ink/20"
                        : "border border-ink/5 bg-white hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/5"
                    }`}
                  >
                    {/* чекбокс */}
                    <span
                      aria-hidden="true"
                      className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 transition-all duration-300 ${
                        on
                          ? "border-lime bg-lime text-ink"
                          : "border-ink/15 bg-transparent text-transparent group-hover:border-pink-deep"
                      }`}
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                        <path
                          d="m5 13 4 4L19 7"
                          stroke="currentColor"
                          strokeWidth="3.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>

                    <p
                      className={`text-sm leading-relaxed transition-colors duration-300 sm:text-base ${
                        on ? "text-white" : "text-ink/75"
                      }`}
                    >
                      {item}
                    </p>
                  </button>
                </li>
              </Reveal>
            );
          })}
        </ul>

        {/* підсумок */}
        <div
          className={`mx-auto mt-8 grid max-w-3xl transition-all duration-500 ${
            count > 0 ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
          aria-live="polite"
        >
          <div className="overflow-hidden">
            <div className="flex flex-col items-center gap-5 rounded-[1.75rem] bg-lime px-7 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
              <p className="text-base font-bold leading-snug sm:text-lg">
                {count >= 3
                  ? `Впізнав себе у ${count} пунктах — курс саме для тебе.`
                  : `Відмітив ${count} — а тепер чесно перечитай решту.`}
              </p>
              <SignupButton className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-ink/85">
                що з цим робити
                <Arrow className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </SignupButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

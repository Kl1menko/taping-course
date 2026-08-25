"use client";

import { useState } from "react";
import Link from "next/link";
import { MedicalIcon, type MedicalIconName } from "@/components/icons";
import type { ModuleWithLessons } from "@/lib/course";

// Модуль-акордеон. На телефоні 24 уроки суцільним списком — це
// нескінченний скрол, тому за замовчуванням розгорнутий лише той
// модуль, де людина зупинилась.
export default function ModuleCard({
  module: m,
  progress,
  defaultOpen,
  currentLessonId,
}: {
  module: ModuleWithLessons;
  progress: Record<string, boolean>;
  defaultOpen: boolean;
  currentLessonId?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);

  const done = m.lessons.filter((l) => progress[l.id]).length;
  const complete = m.lessons.length > 0 && done === m.lessons.length;

  return (
    <section className="overflow-hidden rounded-3xl border border-ink/10 bg-white sm:rounded-4xl">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-3.5 px-4 py-4 text-left transition active:bg-ink/[0.03] sm:gap-4 sm:px-8 sm:py-6"
      >
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full sm:h-12 sm:w-12 ${
            complete ? "bg-lime text-ink" : "bg-ink/5 text-ink/45"
          }`}
          aria-hidden="true"
        >
          {complete ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
                 strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <path d="m5 13 4 4L19 7" />
            </svg>
          ) : (
            m.icon && (
              <MedicalIcon
                name={m.icon as MedicalIconName}
                className="h-[21px] w-[21px]"
              />
            )
          )}
        </span>

        <span className="flex min-w-0 flex-1 flex-col gap-2">
          <span className="flex items-baseline gap-2">
            <span className="shrink-0 text-xs font-extrabold text-ink/30">
              {m.number}
            </span>
            <span className="truncate text-[15px] font-bold sm:text-xl">
              {m.title}
            </span>
          </span>

          {/* Тонкий прогрес-бар замість тексту — читається з одного погляду. */}
          <span className="flex items-center gap-2.5">
            <span className="h-1 w-full max-w-[160px] overflow-hidden rounded-full bg-ink/10">
              <span
                className={`block h-full rounded-full transition-all duration-500 ${
                  complete ? "bg-lime" : "bg-ink/35"
                }`}
                style={{ width: `${(done / m.lessons.length) * 100}%` }}
              />
            </span>
            <span className="shrink-0 text-[11px] font-semibold tabular-nums text-ink/40">
              {done}/{m.lessons.length}
            </span>
          </span>
        </span>

        <svg
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
          className={`h-4 w-4 shrink-0 text-ink/30 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <ul className="border-t border-ink/5">
          {m.lessons.map((l, i) => {
            const isDone = progress[l.id];
            const isCurrent = l.id === currentLessonId;

            return (
              <li key={l.id} className="border-b border-ink/5 last:border-0">
                <Link
                  href={`/cabinet/${m.slug}/${l.slug}`}
                  className={`flex min-h-14 items-center gap-3.5 px-4 py-3 transition active:bg-ink/[0.05] sm:px-8 sm:py-4 sm:hover:bg-ink/[0.03] ${
                    isCurrent ? "bg-lime/15" : ""
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold ${
                      isDone
                        ? "border-lime bg-lime text-ink"
                        : "border-ink/15 text-ink/35"
                    }`}
                    aria-hidden="true"
                  >
                    {isDone ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                           strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
                           className="h-3 w-3">
                        <path d="m5 13 4 4L19 7" />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </span>

                  <span
                    className={`min-w-0 flex-1 text-[14px] leading-snug sm:text-base ${
                      isDone ? "text-ink/50" : ""
                    } ${isCurrent ? "font-semibold" : ""}`}
                  >
                    {l.title}
                  </span>

                  {l.duration_sec && (
                    <span className="shrink-0 text-[11px] tabular-nums text-ink/35">
                      {Math.round(l.duration_sec / 60)} хв
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

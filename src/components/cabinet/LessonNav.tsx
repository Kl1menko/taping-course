import Link from "next/link";
import type { Lesson, ModuleWithLessons } from "@/lib/course-types";

type Item = { module: ModuleWithLessons; lesson: Lesson } | undefined;

// На мобільних «попередній/наступний» стають картками одна під одною —
// у рядок вони стискаються так, що назви уроків не прочитати.
// Назва в них займає до двох рядків: обрізати її на півслові гірше,
// ніж віддати трохи висоти (line-clamp-2, на десктопі — один рядок).
export default function LessonNav({
  prev,
  next,
  nextBlocked = false,
}: {
  prev: Item;
  next: Item;
  /** Наступний урок під замком, поки не здано ДЗ цього. */
  nextBlocked?: boolean;
}) {
  if (!prev && !next) return null;

  return (
    <nav className="mt-9 grid gap-2.5 border-t border-ink/10 pt-6 sm:mt-12 sm:grid-cols-2 sm:gap-4 sm:pt-8">
      {prev ? (
        <Link
          href={`/cabinet/${prev.module.slug}/${prev.lesson.slug}`}
          className="group flex min-h-16 items-center gap-3 rounded-2xl border border-ink/10 bg-white p-4 transition active:bg-ink/[0.04] sm:hover:border-ink/25"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
               strokeLinecap="round" strokeLinejoin="round"
               className="h-4 w-4 shrink-0 self-center text-ink/35">
            <path d="m15 18-6-6 6-6" />
          </svg>
          <span className="min-w-0">
            <span className="block text-[11px] font-bold uppercase tracking-widest text-ink/40">
              попередній
            </span>
            <span className="mt-0.5 block text-sm font-semibold leading-snug line-clamp-2 sm:truncate">
              {prev.lesson.title}
            </span>
          </span>
        </Link>
      ) : (
        <span className="hidden sm:block" />
      )}

      {next &&
        (nextBlocked ? (
          // Замість посилання — підказка: клік по ньому впирався б в екран замка.
          <a
            href="#homework"
            className="flex min-h-16 items-center gap-3 rounded-2xl border border-dashed border-ink/20 bg-ink/[0.02] p-4 transition active:bg-ink/5 sm:justify-end sm:text-right"
          >
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] font-bold uppercase tracking-widest text-ink/40">
                наступний — після домашньої
              </span>
              <span className="mt-0.5 block text-sm font-semibold leading-snug line-clamp-2 text-ink/50 sm:truncate">
                {next.lesson.title}
              </span>
            </span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                 strokeLinecap="round" strokeLinejoin="round"
                 className="h-4 w-4 shrink-0 text-ink/35">
              <rect x="4" y="10" width="16" height="11" rx="2" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" />
            </svg>
          </a>
        ) : (
          <Link
            href={`/cabinet/${next.module.slug}/${next.lesson.slug}`}
            className="group flex min-h-16 items-center gap-3 rounded-2xl border border-ink/10 bg-white p-4 transition active:bg-ink/[0.04] sm:hover:border-ink/25 sm:justify-end sm:text-right"
          >
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] font-bold uppercase tracking-widest text-ink/40">
                наступний
              </span>
              <span className="mt-0.5 block text-sm font-semibold leading-snug line-clamp-2 sm:truncate">
                {next.lesson.title}
              </span>
            </span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                 strokeLinecap="round" strokeLinejoin="round"
                 className="h-4 w-4 shrink-0 text-ink/35">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Link>
        ))}
    </nav>
  );
}

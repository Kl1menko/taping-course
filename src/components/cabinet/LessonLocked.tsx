import Link from "next/link";
import type { Lesson, ModuleWithLessons } from "@/lib/course-types";

// Урок закритий, бо не здано ДЗ попереднього. Показуємо не просто замок,
// а посилання рівно на ту роботу, яка тримає людину на місці.
export default function LessonLocked({
  lesson,
  blocker,
}: {
  lesson: Lesson;
  blocker: { module: ModuleWithLessons; lesson: Lesson } | undefined;
}) {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-5 py-12 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-ink/5">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
             strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-ink/40">
          <rect x="4" y="10" width="16" height="11" rx="2" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </svg>
      </span>

      <h1 className="mt-7 text-2xl font-extrabold tracking-tight sm:text-3xl">
        Урок ще закритий
      </h1>

      <p className="mt-4 text-[15px] leading-relaxed text-ink/60">
        «{lesson.title}» відкриється, щойно ти здаси домашню роботу
        {blocker ? " попереднього уроку" : ""}. Перевірка куратора не
        затримує — доступ дає сам факт здачі.
      </p>

      {blocker && (
        <p className="mt-3 text-sm font-semibold text-ink/70">
          Чекаємо на роботу з уроку «{blocker.lesson.title}»
        </p>
      )}

      <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        {blocker && (
          <Link
            href={`/cabinet/${blocker.module.slug}/${blocker.lesson.slug}#homework`}
            className="flex min-h-14 items-center justify-center rounded-full bg-lime px-8 text-sm font-bold uppercase tracking-wide text-ink transition active:brightness-90 sm:hover:brightness-95"
          >
            перейти до домашньої
          </Link>
        )}
        <Link
          href="/cabinet"
          className="flex min-h-14 items-center justify-center rounded-full border border-ink/15 px-8 text-sm font-bold uppercase tracking-wide transition active:bg-ink active:text-white sm:hover:bg-ink sm:hover:text-white"
        >
          до всіх модулів
        </Link>
      </div>
    </main>
  );
}

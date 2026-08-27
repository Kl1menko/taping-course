import Link from "next/link";
import {
  flatten,
  getCourse,
  getProgress,
  getQuizAnswers,
  getSubmissions,
  hasAccess,
  isLessonLocked,
} from "@/lib/course";
import NoAccess from "@/components/cabinet/NoAccess";
import ModuleCard from "@/components/cabinet/ModuleCard";
import OnboardingQuiz from "@/components/cabinet/OnboardingQuiz";

export default async function CabinetPage() {
  const access = await hasAccess();
  if (!access) return <NoAccess />;

  const [modules, progress, submissions, quiz] = await Promise.all([
    getCourse(),
    getProgress(),
    getSubmissions(),
    getQuizAnswers(),
  ]);

  // Анкету проходимо один раз, до першого уроку: далі кабінет
  // виглядає звично, і питання більше не спливають.
  if (quiz === null) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-5 sm:px-5 sm:py-12">
        <OnboardingQuiz />
      </main>
    );
  }

  const flat = flatten(modules);
  // lesson_id → чи закритий урок, поки не здано попереднє ДЗ.
  const locked = Object.fromEntries(
    flat.map((x, i) => [x.lesson.id, isLessonLocked(flat, i, submissions)])
  );

  const allLessons = modules.flatMap((m) => m.lessons);
  const done = allLessons.filter((l) => progress[l.id]).length;
  const pct = allLessons.length ? Math.round((done / allLessons.length) * 100) : 0;

  // Наступний непройдений урок — для кнопки «продовжити».
  const nextLesson =
    allLessons.find((l) => !progress[l.id] && !locked[l.id]) ??
    allLessons.find((l) => !locked[l.id]) ??
    allLessons[0];
  const nextModule = modules.find((m) =>
    m.lessons.some((l) => l.id === nextLesson?.id)
  );
  const finished = allLessons.length > 0 && done === allLessons.length;

  return (
    <main className="mx-auto max-w-6xl px-4 py-5 sm:px-5 sm:py-12">
      {/* ── шапка з прогресом ── */}
      <section className="rounded-3xl bg-ink p-5 text-white sm:rounded-4xl sm:p-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-lg font-extrabold tracking-tight xs:text-xl sm:text-4xl">
              {finished ? "Курс пройдено" : "Твій курс"}
            </h1>
            <p className="mt-1.5 text-[13px] text-white/55 sm:mt-3 sm:text-base">
              {done} з {allLessons.length} уроків
            </p>
          </div>

          {/* Відсоток великим числом — головна метрика на вузькому екрані. */}
          <span className="shrink-0 text-[28px] font-extrabold tabular-nums leading-none text-lime xs:text-3xl sm:text-5xl">
            {pct}
            <span className="text-lg sm:text-2xl">%</span>
          </span>
        </div>

        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/15 sm:mt-6 sm:h-2">
          <div
            className="h-full rounded-full bg-lime transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>

        {nextLesson && nextModule && !finished && (
          <Link
            href={`/cabinet/${nextModule.slug}/${nextLesson.slug}`}
            className="mt-5 flex min-h-14 w-full items-center justify-between gap-3 rounded-2xl bg-lime px-5 text-left text-ink transition active:brightness-90 sm:mt-7 sm:w-auto sm:rounded-full sm:px-8 sm:hover:brightness-95"
          >
            <span className="min-w-0">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-ink/50">
                {done === 0 ? "почати навчання" : "продовжити"}
              </span>
              <span className="mt-0.5 block text-sm font-bold leading-snug line-clamp-2 sm:truncate">
                {nextLesson.title}
              </span>
            </span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                 strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 shrink-0">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Link>
        )}
      </section>

      {/* ── модулі ── */}
      <div className="mt-4 space-y-2.5 sm:mt-10 sm:space-y-4">
        {modules.map((m) => (
          <ModuleCard
            key={m.id}
            module={m}
            progress={progress}
            submissions={submissions}
            locked={locked}
            // Відкриваємо лише модуль, де людина зупинилась.
            defaultOpen={m.id === nextModule?.id}
            currentLessonId={nextLesson?.id}
          />
        ))}
      </div>
    </main>
  );
}

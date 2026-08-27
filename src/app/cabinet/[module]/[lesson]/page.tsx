import Link from "next/link";
import { notFound } from "next/navigation";
import {
  flatten,
  getCourse,
  getProgress,
  getSubmissions,
  hasAccess,
  isLessonLocked,
  isSubmitted,
  signPhotos,
} from "@/lib/course";
import NoAccess from "@/components/cabinet/NoAccess";
import VideoPlayer from "@/components/cabinet/VideoPlayer";
import LessonComplete from "@/components/cabinet/LessonComplete";
import LessonNav from "@/components/cabinet/LessonNav";
import Homework from "@/components/cabinet/Homework";
import LessonLocked from "@/components/cabinet/LessonLocked";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ module: string; lesson: string }>;
}) {
  const { module: moduleSlug, lesson: lessonSlug } = await params;

  const access = await hasAccess();
  if (!access) return <NoAccess />;

  const [modules, progress, submissions] = await Promise.all([
    getCourse(),
    getProgress(),
    getSubmissions(),
  ]);

  const mIdx = modules.findIndex((m) => m.slug === moduleSlug);
  if (mIdx === -1) notFound();
  const mod = modules[mIdx];

  const lIdx = mod.lessons.findIndex((l) => l.slug === lessonSlug);
  if (lIdx === -1) notFound();
  const lesson = mod.lessons[lIdx];

  // Плаский список — щоб «далі» переходило між модулями.
  const flat = flatten(modules);
  const flatIdx = flat.findIndex((x) => x.lesson.id === lesson.id);
  const prev = flat[flatIdx - 1];
  const next = flat[flatIdx + 1];

  // Урок під замком — показуємо, яку роботу треба здати, а не відео.
  if (isLessonLocked(flat, flatIdx, submissions)) {
    const blocker = flat
      .slice(0, flatIdx)
      .reverse()
      .find(
        (x) =>
          x.lesson.assignments?.[0]?.is_required &&
          !isSubmitted(submissions[x.lesson.id])
      );
    return <LessonLocked lesson={lesson} blocker={blocker} />;
  }

  const assignment = lesson.assignments?.[0] ?? null;
  const submission = submissions[lesson.id] ?? null;
  const photos = submission ? await signPhotos(submission.photos) : [];

  const isDone = !!progress[lesson.id];
  // Наступний урок відкриється лише після здачі — не даємо натиснути «далі»,
  // щоб людина не впиралась у екран замка.
  const nextBlocked =
    !!assignment?.is_required && !isSubmitted(submission);

  return (
    // pb-28 лишає місце під липку панель дій на мобільних.
    <main className="pb-28 sm:pb-16">
      {/* ── хлібні крихти ── */}
      <div className="mx-auto max-w-5xl px-4 pt-5 sm:px-5 sm:pt-8">
        <Link
          href="/cabinet"
          className="-ml-2 inline-flex min-h-11 items-center gap-2 rounded-full px-2 text-xs font-bold uppercase tracking-widest text-ink/45 transition active:bg-ink/5 sm:hover:text-ink"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
               strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
            <path d="m15 18-6-6 6-6" />
          </svg>
          до всіх модулів
        </Link>
      </div>

      {/* ── відео: на мобільних на всю ширину, щоб кадр був більшим ── */}
      <div className="mt-3 sm:mx-auto sm:mt-6 sm:max-w-5xl sm:px-5">
        <VideoPlayer
          provider={lesson.video_provider}
          videoId={lesson.video_id}
          title={lesson.title}
        />
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-5">
        {/* ── заголовок ── */}
        <div className="mt-6 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs">
          <span className="font-extrabold text-ink/30">{mod.number}</span>
          <span className="min-w-0 truncate text-ink/45">{mod.title}</span>
          <span className="text-ink/25">·</span>
          <span className="text-ink/45">
            урок {lIdx + 1} з {mod.lessons.length}
          </span>
        </div>

        <h1 className="mt-2 text-[19px] font-extrabold leading-snug tracking-tight xs:text-xl sm:text-3xl">
          {lesson.title}
        </h1>

        {lesson.description && (
          <p className="mt-4 text-[15px] leading-relaxed text-ink/70 sm:text-base">
            {lesson.description}
          </p>
        )}

        {/* ── домашня робота ── */}
        {assignment && (
          <Homework
            assignment={assignment}
            submission={submission}
            initialPhotos={photos}
          />
        )}

        {/* На десктопі кнопка лишається в потоці сторінки. */}
        <div className="mt-8 hidden sm:block">
          <LessonComplete lessonId={lesson.id} initialDone={isDone} />
        </div>

        {/* ── навігація між уроками ── */}
        <LessonNav prev={prev} next={next} nextBlocked={nextBlocked} />
      </div>

      {/* ── липка панель дій: тільки мобільні ── */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-cream/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur sm:hidden">
        <div className="flex items-center gap-2.5">
          <LessonComplete lessonId={lesson.id} initialDone={isDone} compact />

          {next &&
            (nextBlocked ? (
              <a
                href="#homework"
                className="flex min-h-12 shrink-0 items-center rounded-full border border-ink/15 px-4 text-[13px] font-bold uppercase tracking-wide text-ink/55 xs:px-5 xs:text-sm"
              >
                здати дз
              </a>
            ) : (
              <Link
                href={`/cabinet/${next.module.slug}/${next.lesson.slug}`}
                className="flex min-h-12 shrink-0 items-center gap-1.5 rounded-full bg-ink px-4 text-[13px] font-bold uppercase tracking-wide text-white transition active:brightness-125 xs:px-5 xs:text-sm"
              >
                далі
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                     strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Link>
            ))}
        </div>
      </div>
    </main>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourse, getProgress, hasAccess } from "@/lib/course";
import NoAccess from "@/components/cabinet/NoAccess";
import VideoPlayer from "@/components/cabinet/VideoPlayer";
import LessonComplete from "@/components/cabinet/LessonComplete";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ module: string; lesson: string }>;
}) {
  const { module: moduleSlug, lesson: lessonSlug } = await params;

  const access = await hasAccess();
  if (!access) return <NoAccess />;

  const [modules, progress] = await Promise.all([getCourse(), getProgress()]);

  const mIdx = modules.findIndex((m) => m.slug === moduleSlug);
  if (mIdx === -1) notFound();
  const mod = modules[mIdx];

  const lIdx = mod.lessons.findIndex((l) => l.slug === lessonSlug);
  if (lIdx === -1) notFound();
  const lesson = mod.lessons[lIdx];

  // Плаский список — щоб «далі» переходило між модулями.
  const flat = modules.flatMap((m) =>
    m.lessons.map((l) => ({ module: m, lesson: l }))
  );
  const flatIdx = flat.findIndex((x) => x.lesson.id === lesson.id);
  const prev = flat[flatIdx - 1];
  const next = flat[flatIdx + 1];

  return (
    <main className="mx-auto max-w-5xl px-5 py-8 sm:py-12">
      <Link
        href="/cabinet"
        className="text-xs font-bold uppercase tracking-widest text-ink/40 transition hover:text-ink"
      >
        ← до всіх модулів
      </Link>

      <div className="mt-5 flex items-baseline gap-3">
        <span className="text-sm font-extrabold text-ink/30">{mod.number}</span>
        <span className="text-sm text-ink/50">{mod.title}</span>
      </div>

      <h1 className="mt-2 text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
        {lesson.title}
      </h1>

      <div className="mt-7">
        <VideoPlayer
          provider={lesson.video_provider}
          videoId={lesson.video_id}
          title={lesson.title}
        />
      </div>

      {lesson.description && (
        <p className="mt-7 text-sm leading-relaxed text-ink/70 sm:text-base">
          {lesson.description}
        </p>
      )}

      <div className="mt-8">
        <LessonComplete lessonId={lesson.id} initialDone={!!progress[lesson.id]} />
      </div>

      {/* ── навігація ── */}
      <nav className="mt-10 flex items-center justify-between gap-4 border-t border-ink/10 pt-7">
        {prev ? (
          <Link
            href={`/cabinet/${prev.module.slug}/${prev.lesson.slug}`}
            className="group min-w-0 flex-1"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-ink/40">
              ← попередній
            </span>
            <p className="mt-1 truncate text-sm font-semibold group-hover:text-pink-deep">
              {prev.lesson.title}
            </p>
          </Link>
        ) : (
          <span className="flex-1" />
        )}

        {next ? (
          <Link
            href={`/cabinet/${next.module.slug}/${next.lesson.slug}`}
            className="group min-w-0 flex-1 text-right"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-ink/40">
              наступний →
            </span>
            <p className="mt-1 truncate text-sm font-semibold group-hover:text-pink-deep">
              {next.lesson.title}
            </p>
          </Link>
        ) : (
          <span className="flex-1" />
        )}
      </nav>
    </main>
  );
}

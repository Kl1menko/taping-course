import Link from "next/link";
import { getCourse, getProgress, hasAccess } from "@/lib/course";
import { MedicalIcon, type MedicalIconName } from "@/components/icons";
import NoAccess from "@/components/cabinet/NoAccess";

export default async function CabinetPage() {
  const access = await hasAccess();
  if (!access) return <NoAccess />;

  const [modules, progress] = await Promise.all([getCourse(), getProgress()]);

  const allLessons = modules.flatMap((m) => m.lessons);
  const done = allLessons.filter((l) => progress[l.id]).length;
  const pct = allLessons.length ? Math.round((done / allLessons.length) * 100) : 0;

  // Наступний непройдений урок — для кнопки «продовжити».
  const nextLesson = allLessons.find((l) => !progress[l.id]) ?? allLessons[0];
  const nextModule = modules.find((m) => m.lessons.some((l) => l.id === nextLesson?.id));

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 sm:py-14">
      {/* ── шапка з прогресом ── */}
      <section className="rounded-4xl bg-ink p-7 text-white sm:p-10">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-4xl">
          Твій курс
        </h1>
        <p className="mt-3 text-sm text-white/60 sm:text-base">
          Пройдено {done} з {allLessons.length} уроків
        </p>

        <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/15">
          <div
            className="h-full rounded-full bg-lime transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>

        {nextLesson && nextModule && (
          <Link
            href={`/cabinet/${nextModule.slug}/${nextLesson.slug}`}
            className="mt-7 inline-flex items-center gap-3 rounded-full bg-lime px-8 py-4 text-sm font-bold uppercase tracking-wide text-ink transition hover:brightness-95"
          >
            {done === 0 ? "почати навчання" : "продовжити"}
          </Link>
        )}
      </section>

      {/* ── модулі ── */}
      <div className="mt-10 space-y-4">
        {modules.map((m) => {
          const mDone = m.lessons.filter((l) => progress[l.id]).length;
          const mPct = m.lessons.length
            ? Math.round((mDone / m.lessons.length) * 100)
            : 0;

          return (
            <section
              key={m.id}
              className="overflow-hidden rounded-4xl border border-ink/10 bg-white"
            >
              <div className="flex items-center gap-4 px-6 py-6 sm:px-8">
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                    mPct === 100 ? "bg-lime text-ink" : "bg-ink/5 text-ink/45"
                  }`}
                  aria-hidden="true"
                >
                  {m.icon && (
                    <MedicalIcon
                      name={m.icon as MedicalIconName}
                      className="h-[22px] w-[22px]"
                    />
                  )}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-3">
                    <span className="text-sm font-extrabold text-ink/30">{m.number}</span>
                    <h2 className="truncate text-lg font-bold sm:text-xl">{m.title}</h2>
                  </div>
                  <p className="mt-1 text-xs text-ink/45">
                    {mDone} / {m.lessons.length} уроків
                  </p>
                </div>

                {mPct === 100 && (
                  <span className="hidden shrink-0 rounded-full bg-lime px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-ink sm:block">
                    пройдено
                  </span>
                )}
              </div>

              <ul className="border-t border-ink/5">
                {m.lessons.map((l) => {
                  const isDone = progress[l.id];
                  return (
                    <li key={l.id} className="border-b border-ink/5 last:border-0">
                      <Link
                        href={`/cabinet/${m.slug}/${l.slug}`}
                        className="flex items-center gap-4 px-6 py-4 transition hover:bg-ink/[0.03] sm:px-8"
                      >
                        <span
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                            isDone
                              ? "border-lime bg-lime text-ink"
                              : "border-ink/20 text-transparent"
                          }`}
                          aria-hidden="true"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                               strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                               className="h-3 w-3">
                            <path d="m5 13 4 4L19 7" />
                          </svg>
                        </span>

                        <span className="min-w-0 flex-1 text-sm sm:text-base">
                          {l.title}
                        </span>

                        {l.duration_sec && (
                          <span className="shrink-0 text-xs text-ink/40">
                            {Math.round(l.duration_sec / 60)} хв
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </main>
  );
}

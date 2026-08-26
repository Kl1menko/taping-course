import Spinner from "@/components/cabinet/Spinner";

// Скелетон уроку. Місце під плеєр тримається одразу, щоб текст
// не підстрибував, коли відео стане на місце.
export default function LessonLoading() {
  return (
    <main className="pb-28 sm:pb-16">
      <div className="mx-auto max-w-5xl px-4 pt-5 sm:px-5 sm:pt-8">
        <div className="h-4 w-36 animate-pulse rounded bg-ink/5" />
      </div>

      {/* Плеєр: спінер по центру чорного кадру — головний сигнал,
          що урок вантажиться. */}
      <div className="mt-3 sm:mx-auto sm:mt-6 sm:max-w-5xl sm:px-5">
        <div className="flex aspect-video items-center justify-center bg-ink/90 sm:rounded-3xl">
          <Spinner className="h-10 w-10 text-white/70 sm:h-12 sm:w-12" label="Завантажуємо урок" />
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-5">
        <div className="mt-6 h-3.5 w-48 animate-pulse rounded bg-ink/5" />

        <div className="mt-3 space-y-2.5">
          <div className="h-6 w-full animate-pulse rounded-lg bg-ink/5 sm:h-9" />
          <div className="h-6 w-2/3 animate-pulse rounded-lg bg-ink/5 sm:h-9" />
        </div>

        <div className="mt-6 space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-ink/5" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-ink/5" />
        </div>

        <div className="mt-9 grid gap-2.5 border-t border-ink/10 pt-6 sm:mt-12 sm:grid-cols-2 sm:gap-4 sm:pt-8">
          <div className="h-16 animate-pulse rounded-2xl border border-ink/10 bg-white" />
          <div className="h-16 animate-pulse rounded-2xl border border-ink/10 bg-white" />
        </div>
      </div>
    </main>
  );
}

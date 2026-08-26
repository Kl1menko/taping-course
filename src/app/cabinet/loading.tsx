import Spinner from "@/components/cabinet/Spinner";

// Скелетон головної кабінету. Повторює реальний макет (шапка з
// прогресом + список модулів), щоб при появі даних нічого не стрибало.
export default function CabinetLoading() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-5 sm:px-5 sm:py-12">
      <section className="rounded-3xl bg-ink p-5 text-white sm:rounded-4xl sm:p-10">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="h-6 w-40 animate-pulse rounded-lg bg-white/15 sm:h-10 sm:w-64" />
            <div className="mt-2 h-3.5 w-24 animate-pulse rounded bg-white/10 sm:mt-4 sm:h-4" />
          </div>
          <Spinner className="h-8 w-8 shrink-0 text-lime sm:h-11 sm:w-11" />
        </div>

        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/15 sm:mt-6 sm:h-2" />

        <div className="mt-5 h-14 w-full animate-pulse rounded-2xl bg-white/10 sm:mt-7 sm:w-72 sm:rounded-full" />
      </section>

      <div className="mt-4 space-y-2.5 sm:mt-10 sm:space-y-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center gap-3.5 rounded-3xl border border-ink/10 bg-white px-4 py-4 sm:gap-4 sm:rounded-4xl sm:px-8 sm:py-6"
          >
            <div className="h-11 w-11 shrink-0 animate-pulse rounded-full bg-ink/5 sm:h-12 sm:w-12" />
            <div className="min-w-0 flex-1">
              <div
                className="h-4 animate-pulse rounded bg-ink/5 sm:h-5"
                style={{ width: `${70 - i * 8}%` }}
              />
              <div className="mt-2.5 h-1 w-full max-w-[160px] animate-pulse rounded-full bg-ink/5" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

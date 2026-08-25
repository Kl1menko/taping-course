import { proof } from "@/content";
import { Reveal } from "./ui";

export default function Proof() {
  // Без реальних відгуків блок не рендериться (вимога ТЗ).
  if (!proof.items.length) return null;

  return (
    <section id="proof" className="bg-pink-soft py-16 sm:py-24">
      <div className="wrap">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold uppercase leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              {proof.title}
            </h2>
          </div>
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-5xl gap-5 sm:grid-cols-2">
          {proof.items.map((t, i) => (
            <Reveal key={t.name} delay={i * 80}>
              <article className="h-full rounded-4xl border border-ink/10 bg-white p-7 sm:p-8">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-lg font-extrabold tracking-tight">{t.name}</h3>
                  <span className="shrink-0 text-xs font-semibold text-ink/45">{t.role}</span>
                </div>

                <dl className="mt-5 space-y-3 text-sm sm:text-base">
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-widest text-ink/35">
                      До навчання
                    </dt>
                    <dd className="mt-1 text-ink/70">{t.before}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-widest text-ink/35">
                      Що отримав
                    </dt>
                    <dd className="mt-1 text-ink/70">{t.got}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-widest text-pink-deep">
                      Результат
                    </dt>
                    <dd className="mt-1 font-semibold">{t.result}</dd>
                  </div>
                </dl>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

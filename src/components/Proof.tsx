import { proof } from "@/content";
import { Reveal } from "./ui";
import { BentoCard, BentoKicker, BentoText, BentoTitle } from "./BentoCard";

export default function Proof() {
  // Без реальних відгуків блок не рендериться (вимога ТЗ).
  if (!proof.items.length) return null;

  return (
    <section id="proof" className="py-16 sm:py-24">
      <div className="wrap">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold uppercase leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              {proof.title}
            </h2>
          </div>
        </Reveal>

        {/* Бенто на 6 колонок: перший відгук ширший за решту —
            кількість відгуків наперед невідома, тому правило просте
            й працює на будь-якій довжині списку. */}
        <div className="mx-auto mt-14 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {proof.items.map((t, i) => {
            const span = i === 0 ? "lg:col-span-4" : "lg:col-span-2";
            return (
              <Reveal key={t.name} delay={i * 80} className={`h-full ${span}`}>
                <BentoCard>
                  <BentoTitle className={i === 0 ? "sm:text-2xl" : ""}>{t.name}</BentoTitle>
                  <BentoKicker className="mt-1.5">{t.role}</BentoKicker>

                  <dl className="mt-6 space-y-4">
                    <div>
                      <BentoKicker>До навчання</BentoKicker>
                      <dd className="mt-1">
                        <BentoText>{t.before}</BentoText>
                      </dd>
                    </div>
                    <div>
                      <BentoKicker>Що отримав</BentoKicker>
                      <dd className="mt-1">
                        <BentoText>{t.got}</BentoText>
                      </dd>
                    </div>
                  </dl>

                  {/* Результат — кольорова пілюля: єдиний акцент картки. */}
                  <div className="mt-auto pt-6">
                    <div className="rounded-2xl bg-blue px-4 py-3 text-white shadow-lg">
                      <p className="text-[11px] font-black uppercase tracking-widest text-white/60">
                        Результат
                      </p>
                      <p className="mt-1 text-sm font-bold leading-snug">{t.result}</p>
                    </div>
                  </div>
                </BentoCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

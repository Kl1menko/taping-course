import { problem } from "@/content";
import { Reveal } from "./ui";
import { BentoCard, BentoKicker, BentoText } from "./BentoCard";

export default function Problem() {
  return (
    <section id="problem" className="py-16 sm:py-24">
      <div className="wrap">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold uppercase leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              {problem.title}
            </h2>
            <p className="mt-6 text-base leading-relaxed text-ink/65 sm:text-lg">
              {problem.lead}
            </p>
          </div>
        </Reveal>

        {/* ── Бенто-сітка ──
            На мобільному все в одну колонку; від lg — 6 колонок,
            де блоки займають різну ширину й висоту. */}
        <div className="mx-auto mt-12 grid max-w-5xl gap-3 sm:gap-4 lg:grid-cols-6">
          {/* Відео: найбільший блок сітки */}
          <Reveal delay={80} className="lg:col-span-4">
            <div className="relative h-full overflow-hidden rounded-[1.75rem] bg-ink p-6 sm:rounded-[2rem] sm:p-8">
              {/* Відео-фон: без звуку, зациклене, autoplay.
                  playsInline обов'язковий — інакше iOS відкриє його
                  на весь екран замість програвання на місці. */}
              <video
                className="absolute inset-0 h-full w-full object-cover"
                src="/video/fragments.mp4"
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                aria-hidden="true"
              />
              {/* Завіса: щільна зліва, де текст, і майже прозора справа —
                  так відео лишається видимим, а рядки не втрачають контраст. */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/30"
              />

              <div className="relative">
                <ul className="space-y-1.5">
                  {problem.fragments.map((f) => (
                    <li key={f} className="text-sm text-white/60 sm:text-base">
                      {f}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 border-t border-white/15 pt-5 text-sm font-semibold text-white sm:text-base">
                  {problem.fragmentsNote}
                </p>
              </div>
            </div>
          </Reveal>

          {/* Що насправді треба розуміти — вузький високий блок.
              Раніше problem.needToUnderstand не використовувався ніде. */}
          <Reveal delay={140} className="lg:col-span-2">
            <BentoCard>
              <BentoKicker>Насправді треба розуміти</BentoKicker>
              <ul className="mt-4 space-y-2.5">
                {problem.needToUnderstand.map((n) => (
                  <li key={n} className="flex gap-2.5">
                    <span
                      aria-hidden="true"
                      className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-blue"
                    />
                    <BentoText>{n}</BentoText>
                  </li>
                ))}
              </ul>
            </BentoCard>
          </Reveal>

          {/* Чотири проблеми — по півтори колонки кожна */}
          {problem.items.map((item, i) => (
            <Reveal key={item} delay={200 + i * 70} className="lg:col-span-3">
              <BentoCard className="flex-row items-start gap-3.5 p-5 sm:p-6">
                <span
                  className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue text-white"
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
                       strokeLinecap="round" className="h-3.5 w-3.5">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </span>
                <p className="text-sm font-black uppercase leading-[1.15] tracking-tight sm:text-base">
                  {item}
                </p>
              </BentoCard>
            </Reveal>
          ))}

          {/* Висновок — на всю ширину сітки, як фінальний акорд */}
          <Reveal delay={480} className="lg:col-span-6">
            <div className="rounded-[1.75rem] bg-lime p-7 text-center shadow-lg sm:rounded-[2rem] sm:p-9">
              <p className="text-lg font-black uppercase leading-[1.1] tracking-tight text-ink sm:text-3xl">
                {problem.key}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

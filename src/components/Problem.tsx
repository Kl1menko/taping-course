import { problem } from "@/content";
import { Reveal } from "./ui";
import { BentoKicker } from "./BentoCard";

// ── Секція «Чому просто знати техніки недостатньо?» ──
//
// Драматургія сітки повторює зміст: угорі хаос розрізнених джерел
// (косі різнокольорові плитки), поруч — упорядкований список того,
// що насправді треба розуміти, далі чотири наслідки, і фінальний
// лаймовий акорд. Раніше цю роль грало відео на фоні — воно важило
// 2 МБ і не несло сенсу, тому замінено на кольорові форми.

// Фрагменти-джерела: різні кольори й нахили, щоб рядок читався
// як звалище вкладок, а не як акуратний список.
const FRAGMENT_SKIN = [
  { bg: "bg-blue text-white", tilt: "lg:-rotate-2" },
  { bg: "bg-lime text-ink", tilt: "lg:rotate-1" },
  { bg: "bg-pink-deep text-white", tilt: "lg:rotate-2" },
  { bg: "bg-ink text-white", tilt: "lg:-rotate-1" },
];

export default function Problem() {
  return (
    <section id="problem" className="overflow-hidden py-16 sm:py-24">
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

        <div className="mx-auto mt-12 grid max-w-5xl gap-3 sm:gap-4 lg:grid-cols-6">
          {/* ── Хаос джерел: чотири косі плитки в дві колонки ── */}
          <Reveal delay={80} className="lg:col-span-4">
            <div className="flex h-full flex-col rounded-[1.75rem] bg-ink p-6 sm:rounded-[2rem] sm:p-8">
              <BentoKicker tone="dark">Як це виглядає зазвичай</BentoKicker>

              <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
                {problem.fragments.map((f, i) => {
                  const skin = FRAGMENT_SKIN[i % FRAGMENT_SKIN.length];
                  return (
                    <p
                      key={f}
                      className={`rounded-2xl px-4 py-3.5 text-sm font-black uppercase leading-[1.15] tracking-tight transition-transform duration-300 sm:text-[15px] ${skin.bg} ${skin.tilt} lg:hover:rotate-0`}
                    >
                      {f}
                    </p>
                  );
                })}
              </div>

              <p className="mt-auto pt-6 text-sm font-semibold leading-relaxed text-white/70 sm:text-base">
                {problem.fragmentsNote}
              </p>
            </div>
          </Reveal>

          {/* ── Що насправді треба розуміти: єдиний упорядкований блок ──
              Свідомо спокійний на тлі хаосу ліворуч: контраст форми
              несе ту саму думку, що й текст. */}
          <Reveal delay={140} className="lg:col-span-2">
            <div className="h-full rounded-[1.75rem] bg-lime p-6 sm:rounded-[2rem] sm:p-7">
              {/* Свій колір замість tone="lime": дефолтний ink/50 дає
                  на лаймі 3.5:1 — замало для дрібного капсу. */}
              <BentoKicker className="!text-ink/70">
                Насправді треба розуміти
              </BentoKicker>
              <ul className="mt-4 space-y-2.5">
                {problem.needToUnderstand.map((n, i) => (
                  <li key={n} className="flex gap-2.5">
                    <span
                      aria-hidden="true"
                      className="mt-0.5 shrink-0 text-[11px] font-black tabular-nums text-ink/40"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[13px] font-bold leading-snug text-ink/80">
                      {n}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* ── Чотири наслідки: великі цифри замість однакових хрестиків ── */}
          {problem.items.map((item, i) => (
            <Reveal key={item} delay={200 + i * 70} className="lg:col-span-3">
              <div className="flex h-full items-start gap-4 rounded-[1.75rem] border-2 border-ink/10 bg-cream p-5 transition-colors duration-300 sm:rounded-[2rem] sm:p-6 lg:hover:border-blue/40">
                <span
                  aria-hidden="true"
                  className="text-3xl font-black leading-none tabular-nums text-blue/25 sm:text-4xl"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="pt-1 text-sm font-black uppercase leading-[1.15] tracking-tight sm:text-base">
                  {item}
                </p>
              </div>
            </Reveal>
          ))}

          {/* ── Фінальний акорд ── */}
          <Reveal delay={480} className="lg:col-span-6">
            <div className="relative overflow-hidden rounded-[1.75rem] bg-blue p-7 text-center shadow-lg sm:rounded-[2rem] sm:p-10">
              {/* Лаймове коло за текстом — глибина без ще однієї плити. */}
              <span
                aria-hidden="true"
                className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-lime/20 blur-2xl"
              />
              <p className="relative text-lg font-black uppercase leading-[1.1] tracking-tight text-white sm:text-3xl">
                {problem.key}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

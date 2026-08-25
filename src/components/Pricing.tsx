import { pricing } from "@/content";
import { Arrow, Reveal, SectionTitle } from "./ui";
import SignupButton from "./SignupButton";
import BuyButton from "./cabinet/BuyButton";

const plan = pricing.plan;

export default function Pricing() {
  return (
    <section id="pricing" className="py-12 sm:py-16">
      <div className="wrap">
        <Reveal>
          <SectionTitle highlight="ВАРТІСТЬ" rest="КУРСУ" sub={pricing.subtitle} />
        </Reveal>

        <Reveal delay={120}>
          <div className="relative mx-auto mt-10 w-full max-w-[30rem]">
            {/* світіння під квитком */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-6 -z-10 rounded-[3rem] opacity-40 blur-3xl"
              style={{
                background:
                  "radial-gradient(60% 60% at 50% 60%, #DEFF3C, #F4A8F2, transparent 75%)",
              }}
            />

            <article className="relative overflow-hidden rounded-[2rem] bg-[#0A0A0C] ring-1 ring-white/10">
              {/* ── шапка ── */}
              <header className="px-7 pb-5 pt-7 text-center sm:px-9">
                <span
                  aria-hidden="true"
                  className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.06] ring-1 ring-white/10"
                >
                  <svg viewBox="0 0 24 24" className="h-6 w-6 text-lime" fill="none">
                    <path
                      d="M21 12a9 9 0 1 1-3.6-7.2"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                    <path
                      d="m8.5 12.2 2.6 2.6L21 5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>

                <span className="mt-4 inline-block rounded-full bg-lime/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-lime">
                  {plan.badge}
                </span>

                <h3 className="mt-3 text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                  {plan.name}
                </h3>

                <div className="mt-4 flex items-end justify-center gap-2.5">
                  <span className="text-5xl font-extrabold leading-none tracking-tight text-white sm:text-6xl">
                    {plan.currency}
                    {plan.price}
                  </span>
                  <span className="pb-1.5 text-lg font-bold text-white/30 line-through">
                    {plan.currency}
                    {plan.oldPrice}
                  </span>
                </div>
                <p className="mt-2.5 text-[11px] text-white/45">{plan.note}</p>
              </header>

              {/* ── штриховий розділювач з виїмками ── */}
              <Divider />

              {/* ── рядки чека ── */}
              <dl className="grid grid-cols-2 gap-x-4 gap-y-3.5 px-7 py-5 sm:px-9">
                {plan.rows.map((r) => (
                  <div key={r.k}>
                    <dt className="text-[11px] font-semibold uppercase tracking-widest text-white/40">
                      {r.k}
                    </dt>
                    <dd className="mt-1 text-[13px] font-bold leading-snug text-white">
                      {r.v}
                    </dd>
                  </div>
                ))}
              </dl>

              {/* ── що входить ── */}
              <div className="px-7 pb-6 sm:px-9">
                <div className="rounded-2xl bg-white/[0.04] p-5">
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-white/40">
                    Що входить
                  </span>
                  <ul className="mt-3 grid gap-x-4 gap-y-2 sm:grid-cols-2">
                    {plan.includes.map((f) => (
                      <li key={f} className="flex gap-2.5 text-[12.5px] leading-snug text-white/75">
                        <span
                          className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-lime"
                          aria-hidden="true"
                        />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <Divider />

              {/* ── підвал: CTA + штрихкод ── */}
              <footer className="px-7 pb-6 pt-5 sm:px-9">
                <BuyButton className="group flex w-full items-center justify-center gap-2.5 rounded-full bg-lime px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-ink transition hover:brightness-95">
                  {plan.cta}
                  <Arrow className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </BuyButton>

                <p className="mt-3 text-center text-[11px] text-white/45">
                  {plan.guarantee}
                </p>

                <Barcode />
              </footer>
            </article>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** штрихова лінія з круглими виїмками по краях */
function Divider() {
  return (
    <div className="relative h-px" aria-hidden="true">
      <div className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-cream" />
      <div className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-cream" />
      <div className="mx-8 border-t border-dashed border-white/20" />
    </div>
  );
}

/** декоративний штрихкод */
function Barcode() {
  // фіксований візерунок — не рандом, щоб SSR і клієнт збігались
  const bars =
    "3122132213312213221331221322133122132213312213221331221322133122";
  return (
    <div className="mt-5" aria-hidden="true">
      <div className="flex h-9 items-end justify-center gap-[2.5px]">
        {bars.split("").map((w, i) => (
          <span
            key={i}
            className="h-full bg-white/80"
            style={{ width: `${Number(w)}px` }}
          />
        ))}
      </div>
      <p className="mt-2.5 text-center text-[10px] tracking-[0.3em] text-white/35">
        KOTOVA · TAPING · 2026
      </p>
    </div>
  );
}

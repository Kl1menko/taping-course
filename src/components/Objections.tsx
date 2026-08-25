import { objections } from "@/content";
import { Reveal } from "./ui";

// акцент відповіді чергується по картках
const ACCENTS = ["#DEFF3C", "#F4A8F2", "#C8B6FF"];

export default function Objections() {
  return (
    <section id="objections" className="py-16 sm:py-24">
      <div className="wrap">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold uppercase leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              {objections.title}
            </h2>
          </div>
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-6xl gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {objections.items.map((item, i) => {
            const accent = ACCENTS[i % ACCENTS.length];
            return (
              <Reveal key={item.no} delay={i * 70} className="h-full">
                <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-white transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-ink/10">
                  {/* акцентна смуга, що росте при наведенні */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                    style={{ background: accent }}
                  />

                  {/* ── репліка клієнта ── */}
                  <div className="relative px-7 pb-6 pt-8">
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute left-5 top-2 select-none font-serif text-[5rem] leading-none text-ink/[0.07]"
                    >
                      &ldquo;
                    </span>
                    <p className="relative text-[1.0625rem] font-bold leading-snug text-ink/85 sm:text-lg">
                      {item.no}
                    </p>
                  </div>

                  {/* ── відповідь ── */}
                  <div className="relative mt-auto flex-1 border-t border-dashed border-ink/15 bg-ink/[0.03] px-7 py-6">
                    <span
                      className="mb-3 inline-block h-[3px] w-8 rounded-full transition-all duration-500 group-hover:w-14"
                      style={{ background: accent }}
                      aria-hidden="true"
                    />
                    <p className="text-sm leading-relaxed text-ink/70">{item.yes}</p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

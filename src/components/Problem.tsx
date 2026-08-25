import { problem } from "@/content";
import { Reveal } from "./ui";

export default function Problem() {
  return (
    <section id="problem" className="bg-pink-soft py-16 sm:py-24">
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

        {/* фрагментарність навчання */}
        <Reveal delay={100}>
          <div className="mx-auto mt-12 max-w-2xl rounded-4xl border border-ink/10 bg-white/70 p-7 sm:p-9">
            <ul className="space-y-1.5">
              {problem.fragments.map((f) => (
                <li key={f} className="text-sm text-ink/60 sm:text-base">
                  {f}
                </li>
              ))}
            </ul>
            <p className="mt-5 border-t border-ink/10 pt-5 text-sm font-semibold sm:text-base">
              {problem.fragmentsNote}
            </p>
          </div>
        </Reveal>

        {/* 4 проблеми */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {problem.items.map((item, i) => (
            <Reveal key={item} delay={i * 80}>
              <div className="flex h-full items-start gap-4 rounded-4xl border border-ink/10 bg-white p-6">
                <span
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink/5"
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                       strokeLinecap="round" className="h-3 w-3 text-ink/50">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </span>
                <p className="text-sm font-semibold leading-snug sm:text-base">{item}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={300}>
          <p className="mx-auto mt-12 max-w-3xl text-center text-lg font-extrabold leading-snug tracking-tight sm:text-2xl">
            {problem.key}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

import { audience } from "@/content";
import { Reveal } from "./ui";
import GradientCard from "./GradientCard";

export default function Audience() {
  return (
    <section id="audience" className="py-16 sm:py-24">
      <div className="wrap">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold uppercase leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              {audience.title}
            </h2>
          </div>
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-6xl gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {audience.items.map((item, i) => (
            <Reveal key={item.title} delay={i * 90} className="h-full">
              <GradientCard
                index={i}
                icon={item.icon}
                title={item.title}
                text={item.text}
              />
            </Reveal>
          ))}
        </div>

        {/* «Кому не підійде» — за ТЗ обовʼязковий блок, підвищує довіру */}
        <Reveal delay={200}>
          <div className="mx-auto mt-12 max-w-3xl rounded-4xl border border-ink/15 bg-white p-8 sm:p-10">
            <h3 className="text-xl font-extrabold uppercase tracking-tight sm:text-2xl">
              {audience.notForTitle}
            </h3>
            <ul className="mt-6 space-y-3">
              {audience.notFor.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-ink/70 sm:text-base">
                  <span
                    className="mt-1.5 flex h-4 w-4 shrink-0 items-center justify-center"
                    aria-hidden="true"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
                         strokeLinecap="round" className="h-3 w-3 text-ink/35">
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

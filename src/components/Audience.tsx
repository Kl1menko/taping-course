import { audience } from "@/content";
import { Reveal } from "./ui";
import GradientCard from "./GradientCard";
import { BentoCard, BentoKicker } from "./BentoCard";

// Бенто на 6 колонок під 5 карток: 2+2+2, далі 3+3.
const SPAN = [
  "lg:col-span-2",
  "lg:col-span-2",
  "lg:col-span-2",
  "lg:col-span-3",
  "lg:col-span-3",
];

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

        <div className="mx-auto mt-14 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {audience.items.map((item, i) => {
            const span = SPAN[i] ?? "lg:col-span-2";
            return (
              <Reveal key={item.title} delay={i * 90} className={`h-full ${span}`}>
                <GradientCard
                  index={i}
                  icon={item.icon}
                  title={item.title}
                  text={item.text}
                  wide={span === "lg:col-span-3"}
                />
              </Reveal>
            );
          })}

          {/* «Кому не підійде» — за ТЗ обовʼязковий блок, підвищує довіру.
              У бенто він займає всю ширину: це підсумок, а не ще один
              рівноправний пункт. */}
          <Reveal delay={200} className="lg:col-span-6">
            <BentoCard>
              <BentoKicker>{audience.notForTitle}</BentoKicker>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
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
            </BentoCard>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

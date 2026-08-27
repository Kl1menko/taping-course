import { outcome } from "@/content";
import { Reveal } from "./ui";
import OutcomeCard from "./OutcomeCard";

// Бенто на 6 колонок. Перші три картки — крупні (по 2 колонки, рядок
// із трьох), далі 4 + 2 + 6: послідовність кроків лишається читомою,
// але сітка перестає бути таблицею.
const SPAN = [
  "lg:col-span-2",
  "lg:col-span-2",
  "lg:col-span-2",
  "lg:col-span-4",
  "lg:col-span-2",
  "lg:col-span-6",
];

export default function Outcome() {
  return (
    <section id="outcome" className="py-16 sm:py-24">
      <div className="wrap">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold uppercase leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              {outcome.title}
            </h2>
            <p className="mt-5 text-base text-ink/55 sm:text-lg">{outcome.lead}</p>
          </div>
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {outcome.items.map((item, i) => {
            const span = SPAN[i] ?? "lg:col-span-2";
            return (
              <Reveal key={item.verb} delay={i * 70} className={`h-full ${span}`}>
                <OutcomeCard
                  index={i}
                  icon={item.icon}
                  verb={item.verb}
                  text={item.text}
                  wide={span !== "lg:col-span-2"}
                  // Стрілка тягнеться до сусідньої картки праворуч —
                  // тільки там, де сусід справді є в тому ж рядку.
                  withArrow={i < 2}
                />
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

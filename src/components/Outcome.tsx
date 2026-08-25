import { outcome } from "@/content";
import { Reveal } from "./ui";
import OutcomeCard from "./OutcomeCard";

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

        <div className="mx-auto mt-14 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {outcome.items.map((item, i) => (
            <Reveal key={item.verb} delay={i * 70} className="h-full">
              <OutcomeCard
                index={i}
                icon={item.icon}
                verb={item.verb}
                text={item.text}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

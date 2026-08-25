import { audience } from "@/content";
import { Reveal, SectionTitle } from "./ui";
import GradientCard from "./GradientCard";

export default function Audience() {
  return (
    <section id="audience" className="py-16 sm:py-24">
      <div className="wrap">
        <Reveal>
          <SectionTitle highlight="ДЛЯ КОГО" rest="ЦЕЙ КУРС" />
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
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
      </div>
    </section>
  );
}

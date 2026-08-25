import { outcome } from "@/content";
import { Reveal } from "./ui";
import { MedicalIcon, type MedicalIconName } from "./icons";

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

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {outcome.items.map((item, i) => (
            <Reveal key={item.verb} delay={i * 70}>
              <article className="h-full rounded-4xl border border-ink/10 bg-white p-7">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-lime text-ink"
                  aria-hidden="true"
                >
                  <MedicalIcon
                    name={item.icon as MedicalIconName}
                    className="h-[22px] w-[22px]"
                  />
                </span>
                <h3 className="mt-6 text-sm font-extrabold uppercase tracking-widest text-pink-deep">
                  {item.verb}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/70 sm:text-base">
                  {item.text}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";
import { expert } from "@/content";
import { Reveal } from "./ui";
import { BentoCard, BentoKicker, BentoTitle } from "./BentoCard";

export default function Expert() {
  // Поки немає реальних даних про викладача — блок не показуємо.
  // ТЗ прямо забороняє вигадувати досвід і сертифікації.
  if (!expert.name) return null;

  return (
    <section id="expert" className="py-16 sm:py-24">
      <div className="wrap">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold uppercase leading-tight tracking-tight sm:text-4xl">
              {expert.title}
            </h2>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <BentoCard layout="bare" className="mx-auto mt-14 grid max-w-5xl gap-8 p-7 sm:p-10 md:grid-cols-[280px_1fr] md:items-start">
            {expert.photo && (
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-ink/5">
                <Image
                  src={expert.photo}
                  alt={expert.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 280px"
                  className="object-cover"
                />
              </div>
            )}

            <div>
              <BentoTitle className="text-2xl sm:text-3xl">{expert.name}</BentoTitle>
              {expert.role && (
                <BentoKicker className="mt-2">{expert.role}</BentoKicker>
              )}

              {expert.bio.map((p) => (
                <p key={p} className="mt-4 text-sm leading-relaxed text-ink/70 sm:text-base">
                  {p}
                </p>
              ))}

              {expert.facts.length > 0 && (
                <ul className="mt-7 flex flex-wrap gap-2">
                  {expert.facts.map((f) => (
                    <li
                      key={f}
                      className="rounded-full bg-blue px-4 py-2 text-xs font-black uppercase tracking-wide text-white sm:text-sm"
                    >
                      {f}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </BentoCard>
        </Reveal>
      </div>
    </section>
  );
}

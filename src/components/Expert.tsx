import Image from "next/image";
import { expert } from "@/content";
import { Reveal } from "./ui";

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
          <div className="mx-auto mt-14 grid max-w-5xl gap-8 rounded-4xl border border-ink/10 bg-white p-7 sm:p-10 md:grid-cols-[280px_1fr] md:items-start">
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
              <h3 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                {expert.name}
              </h3>
              {expert.role && (
                <p className="mt-2 text-sm font-semibold text-pink-deep sm:text-base">
                  {expert.role}
                </p>
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
                      className="rounded-full bg-ink/5 px-4 py-2 text-xs font-semibold sm:text-sm"
                    >
                      {f}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

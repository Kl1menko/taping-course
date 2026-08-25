import { benefits } from "@/content";
import { Reveal, SectionTitle } from "./ui";
import { MedicalIcon, type MedicalIconName } from "./icons";

export default function Benefits() {
  return (
    <section className="px-[10px] py-16 sm:py-24">
      <div className="w-full bg-ink px-4 py-16 sm:px-8 sm:py-24 lg:px-12">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold uppercase leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
              <span className="rounded-full bg-lime px-4 py-1 text-ink sm:px-6">ЩО ТИ</span>
              <span className="ml-2">ОТРИМАЄШ</span>
            </h2>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.items.map((b, i) => (
            <Reveal key={b.title} delay={i * 70}>
              <article className="h-full rounded-4xl border border-white/10 bg-white/[0.04] p-7 transition duration-300 hover:border-lime/40 hover:bg-white/[0.08]">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-lime text-ink">
                  <MedicalIcon name={b.icon as MedicalIconName} className="h-[22px] w-[22px]" />
                </span>
                <h3 className="mt-6 text-lg font-bold text-white">{b.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/55">{b.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

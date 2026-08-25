import { included } from "@/content";
import { Reveal } from "./ui";
import { MedicalIcon, type MedicalIconName } from "./icons";

export default function Included() {
  return (
    <section id="included" className="px-[10px] py-16 sm:py-24">
      <div className="w-full bg-ink px-4 py-16 sm:px-8 sm:py-24 lg:px-12">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold uppercase leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
              {included.title}
            </h2>
          </div>
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {included.items.map((item, i) => (
            <Reveal key={item.name} delay={i * 70}>
              <article className="h-full rounded-4xl border border-white/10 bg-white/[0.04] p-7 transition duration-300 hover:border-lime/40 hover:bg-white/[0.08]">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-lime text-ink">
                  <MedicalIcon
                    name={item.icon as MedicalIconName}
                    className="h-[22px] w-[22px]"
                  />
                </span>
                <h3 className="mt-6 text-sm font-extrabold uppercase tracking-widest text-lime">
                  {item.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60">{item.text}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={400}>
          <p className="mx-auto mt-14 max-w-3xl text-center text-2xl font-extrabold uppercase leading-tight tracking-tight text-white sm:text-3xl">
            {included.stackTitle}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

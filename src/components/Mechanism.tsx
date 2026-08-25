import { mechanism } from "@/content";
import { Reveal } from "./ui";
import { MedicalIcon, type MedicalIconName } from "./icons";

export default function Mechanism() {
  return (
    <section id="mechanism" className="px-[10px] py-16 sm:py-24">
      <div className="w-full bg-ink px-4 py-16 sm:px-8 sm:py-24 lg:px-12">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold uppercase leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              {mechanism.title}
            </h2>
          </div>
        </Reveal>

        <ol className="mx-auto mt-14 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {mechanism.steps.map((step, i) => (
            <Reveal key={step.n} delay={i * 90}>
              <li className="h-full rounded-4xl border border-white/10 bg-white/[0.04] p-7 transition duration-300 hover:border-lime/40">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-extrabold text-lime">{step.n}</span>
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.07] ring-1 ring-white/10"
                    aria-hidden="true"
                  >
                    <MedicalIcon
                      name={step.icon as MedicalIconName}
                      className="h-[22px] w-[22px] text-lime"
                    />
                  </span>
                </div>
                <h3 className="mt-5 text-sm font-extrabold uppercase tracking-widest text-white">
                  {step.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/55">{step.text}</p>
              </li>
            </Reveal>
          ))}
        </ol>

        <Reveal delay={400}>
          <p className="mx-auto mt-12 max-w-2xl text-center text-base font-semibold text-white/80 sm:text-lg">
            {mechanism.note}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

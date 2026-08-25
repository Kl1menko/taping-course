import { offer } from "@/content";
import { Arrow, Reveal } from "./ui";
import SignupButton from "./SignupButton";

export default function Offer() {
  return (
    <section id="offer" className="px-[10px] py-16 sm:py-24">
      <div className="w-full bg-ink px-4 py-16 sm:px-8 sm:py-24 lg:px-12">
        <div className="wrap-narrow">
          <Reveal>
            <h2 className="text-3xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
              {offer.headline}
            </h2>
            <p className="mt-7 max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg">
              {offer.lead}
            </p>
          </Reveal>

          <dl className="mt-14 grid gap-px overflow-hidden rounded-4xl bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {offer.points.map((p, i) => (
              <Reveal key={p.k} delay={i * 80}>
                <div className="h-full bg-ink p-7 transition hover:bg-white/[0.04]">
                  <dt className="text-xs font-bold uppercase tracking-widest text-lime">
                    {p.k}
                  </dt>
                  <dd className="mt-4 text-sm leading-relaxed text-white/80">{p.v}</dd>
                </div>
              </Reveal>
            ))}
          </dl>

          <Reveal delay={200}>
            <div className="mt-12 flex justify-center sm:justify-start">
              <SignupButton className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-lime px-10 py-5 text-base font-bold uppercase tracking-wide transition hover:brightness-95 sm:w-auto sm:py-4 sm:text-sm">
                {offer.cta.label}
                <Arrow className="h-5 w-5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:h-4 sm:w-4" />
              </SignupButton>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

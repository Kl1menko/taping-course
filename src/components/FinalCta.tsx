import { finalCta, cta } from "@/content";
import { Reveal } from "./ui";
import ApplyButton from "./ApplyButton";

export default function FinalCta() {
  return (
    <section id="apply" className="py-16 sm:py-24">
      <div className="wrap">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold uppercase leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              {finalCta.title}
            </h2>
            <p className="mt-6 text-base text-ink/60 sm:text-lg">{finalCta.subtitle}</p>

            <ApplyButton
              source="final"
              glass="ios"
              className="mt-10 w-full px-10 sm:min-h-[64px] sm:w-auto"
            >
              {cta.primary}
            </ApplyButton>

            <p className="mt-6 text-sm font-bold uppercase tracking-widest text-ink/40">
              {finalCta.meta}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

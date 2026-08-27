import { finalCta, cta } from "@/content";
import { Reveal } from "./ui";
import BuyButton from "./BuyButton";

export default function FinalCta() {
  return (
    // Синя секція з сіткою — та сама стилістика, що й хіро.
    // Фінальний CTA має бути найгучнішим місцем сторінки, і синій
    // замикає композицію: сторінка починається й закінчується ним.
    <section id="apply" className="relative overflow-hidden bg-blue py-16 sm:py-24">
      <div
        className="pointer-events-none absolute inset-0 bg-[size:4rem_4rem] bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)]"
        aria-hidden="true"
      />
      <div className="wrap relative">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold uppercase leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              {finalCta.title}
            </h2>
            <p className="mt-6 text-base text-white/70 sm:text-lg">{finalCta.subtitle}</p>

            <BuyButton
              source="final"
              glass="iosLime"
              className="mt-10 w-full px-10 sm:min-h-[64px] sm:w-auto"
            >
              {cta.primary}
            </BuyButton>

            <p className="mt-6 text-sm font-bold uppercase tracking-widest text-white/45">
              {finalCta.meta}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

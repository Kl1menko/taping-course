"use client";

import { offer, riskReversal, cta } from "@/content";
import { Reveal } from "./ui";
import ApplyButton from "./ApplyButton";

export default function Offer() {
  const hasPrice = offer.price !== null;

  return (
    <section id="offer" className="px-[10px] py-16 sm:py-24">
      <div className="w-full bg-ink px-4 py-16 sm:px-8 sm:py-24 lg:px-12">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-lime">
              {offer.subtitle}
            </p>
            <h2 className="mt-5 text-3xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-4xl lg:text-5xl">
              {offer.title}
            </h2>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="mx-auto mt-14 max-w-2xl rounded-4xl border border-white/10 bg-white/[0.04] p-8 sm:p-10">
            {/* value stack */}
            <ul className="grid gap-2.5 sm:grid-cols-2">
              {offer.includes.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-white/80">
                  <span
                    className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-lime"
                    aria-hidden="true"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"
                         strokeLinecap="round" strokeLinejoin="round" className="h-2.5 w-2.5 text-ink">
                      <path d="m5 13 4 4L19 7" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            {/* ціна */}
            <div className="mt-9 border-t border-white/10 pt-8 text-center">
              {hasPrice ? (
                <>
                  {offer.oldPrice && (
                    <p className="text-base text-white/35 line-through">
                      {offer.oldPrice.toLocaleString("uk-UA")} {offer.currency}
                    </p>
                  )}
                  <p className="mt-1 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                    {offer.price!.toLocaleString("uk-UA")}{" "}
                    <span className="text-2xl sm:text-3xl">{offer.currency}</span>
                  </p>
                  <p className="mt-3 text-sm text-white/50">{offer.priceNote}</p>
                </>
              ) : (
                <p className="text-base leading-relaxed text-white/70 sm:text-lg">
                  {offer.priceHidden}
                </p>
              )}
            </div>

            <div className="mt-8">
              <ApplyButton
                source="offer"
                className="w-full rounded-full bg-lime px-8 py-4.5 text-sm font-bold uppercase tracking-wide text-ink transition hover:brightness-95"
              >
                {cta.primaryShort}
              </ApplyButton>
              <p className="mt-4 text-center text-xs text-white/40">{offer.underCta}</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={220}>
          <p className="mx-auto mt-10 max-w-xl text-center text-sm leading-relaxed text-white/45">
            {riskReversal.text}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

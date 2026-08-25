"use client";

import { fears } from "@/content";
import { Reveal } from "./ui";
import StackingCards, {
  StackingCardItem,
} from "@/components/fancy/blocks/stacking-cards";

// пари кольорів для карток стопки
const TONES = [
  { bg: "#0E0E10", title: "text-white", body: "text-white/60" },
  { bg: "#F4A8F2", title: "text-ink", body: "text-ink/70" },
  { bg: "#DEFF3C", title: "text-ink", body: "text-ink/70" },
  { bg: "#C8B6FF", title: "text-ink", body: "text-ink/70" },
  { bg: "#0E0E10", title: "text-white", body: "text-white/60" },
];

export default function Fears() {
  const total = fears.items.length;

  return (
    <section id="fears" className="bg-pink-soft py-16 sm:py-24">
      <div className="wrap">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold uppercase leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Що зупиняє перед стартом
            </h2>
            <p className="mt-5 text-base text-ink/60 sm:text-lg">
              {fears.subtitle}
            </p>
          </div>
        </Reveal>
      </div>

      {/* стопка карток, що підтискаються при скролі */}
      <div className="mt-16 h-[330vh] sm:h-[350vh]">
        <StackingCards
          totalCards={total}
          scaleMultiplier={0.04}
          scrollOptions={{ offset: ["start start", "end end"] }}
          className="relative h-full w-full"
        >
          {fears.items.map((item, i) => {
            const tone = TONES[i % TONES.length];
            return (
              <StackingCardItem
                key={item.fear}
                index={i}
                topPosition={`${6 + i * 3}%`}
                className="h-[62vh] sm:h-[58vh]"
              >
                <div
                  className="mx-auto grid h-full w-[92%] max-w-5xl overflow-hidden rounded-[2rem] shadow-2xl shadow-ink/15 md:grid-cols-2"
                  style={{ background: tone.bg }}
                >
                  {/* ліва половина — заперечення */}
                  <div className="flex flex-col justify-center p-8 text-center sm:p-11 md:text-left">
                    <h3
                      className={`text-xl font-extrabold leading-[1.2] tracking-tight sm:text-2xl lg:text-[1.75rem] ${tone.title}`}
                    >
                      {item.fear}
                    </h3>
                  </div>

                  {/* права половина — відповідь */}
                  <div
                    className="flex flex-col justify-center border-t p-8 text-center sm:p-11 md:border-l md:border-t-0 md:text-left"
                    style={{
                      borderColor:
                        tone.bg === "#0E0E10"
                          ? "rgba(255,255,255,.14)"
                          : "rgba(14,14,16,.14)",
                      background:
                        tone.bg === "#0E0E10"
                          ? "rgba(255,255,255,.04)"
                          : "rgba(255,255,255,.28)",
                    }}
                  >
                    <p className={`text-sm leading-relaxed sm:text-base ${tone.body}`}>
                      {item.answer}
                    </p>
                  </div>
                </div>
              </StackingCardItem>
            );
          })}
        </StackingCards>
      </div>
    </section>
  );
}

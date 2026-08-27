"use client";

import { offer, riskReversal, cta } from "@/content";
import { Reveal } from "./ui";
import BuyButton from "./BuyButton";

// ── Секція ціни в мові хіро ──
//
// Та сама палітра й ті самі прийоми, що в Hero: електричний синій
// із сіткою, масивний Arial Black із багатошаровою тінню, кислотний
// лайм і скляні картки. Раніше секція була темною (bg-ink) і ніяк
// не перегукувалась із першим екраном — а це два кінці однієї
// сторінки: там обіцянка, тут оплата.
//
// Скло (bg-white/15 + backdrop-blur) читається лише поверх темного
// насиченого фону — тому синій і скло приходять разом, як у хіро.

const BLUE = "#0038FF";
const BLUE_DEEP = "#001A99";
const ACID = "#CCFF00";

// Багатошарова тінь — той самий хелпер, що й у хіро: N копій зі
// зсувом дають ефект витягнутого 3D-блоку.
const depth = (color: string, layers: number, step = 1) =>
  Array.from({ length: layers }, (_, i) => {
    const n = +((i + 1) * step).toFixed(2);
    return `${n}px ${n}px 0 ${color}`;
  }).join(", ");

// Тут заголовок дрібніший за хіро, тому й шарів менше: 14, як там,
// перетворили б його на суцільну пляму.
const DEPTH = depth(BLUE_DEEP, 8);
const DEPTH_SM = depth(BLUE_DEEP, 8, 0.5);

/** Лаймова стрілка-карлючка — та сама деталь, що в хіро. */
const ArrowScribble = () => (
  <svg
    viewBox="0 0 100 100"
    className="h-full w-full overflow-visible stroke-current"
    style={{ color: ACID }}
    fill="none"
    strokeWidth="6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M10,90 C 10,40 40,20 60,50 C 70,65 80,75 95,70" />
    <path d="M80,55 L95,70 L85,85" />
  </svg>
);

export default function Offer() {
  const hasPrice = offer.price !== null;

  return (
    // Круглі кути згори: далі йде FinalCta, теж синій із такою самою
    // сіткою. Без цієї межі два блоки зливаються в одну довгу синю
    // смугу з випадковим швом посередині.
    <section
      id="offer"
      className="relative w-full overflow-hidden rounded-t-[2.5rem] py-20 sm:rounded-t-[3.5rem] sm:py-28"
      style={{ backgroundColor: BLUE }}
    >
      {/* Сітка на фоні — прийом хіро. */}
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[size:4rem_4rem] bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)]"
        aria-hidden="true"
      />

      <style>{`
        .offer-depth { --depth: ${DEPTH_SM}; }
        @media (min-width: 640px) { .offer-depth { --depth: ${DEPTH}; } }
      `}</style>

      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-4">
        <Reveal>
          <div className="offer-depth mx-auto max-w-4xl text-center">
            <p
              className="text-xs font-bold uppercase tracking-[0.3em] sm:text-sm"
              style={{ color: ACID }}
            >
              {offer.subtitle}
            </p>

            {/* Масивний капс із тінню — головна впізнавана деталь хіро. */}
            <h2
              className="mt-6 text-[clamp(1.9rem,6vw,64px)] font-black uppercase leading-[0.92] tracking-tighter text-white"
              style={{
                fontFamily: '"Arial Black", Impact, system-ui, sans-serif',
                textShadow: "var(--depth)",
              }}
            >
              {offer.title}
            </h2>
          </div>
        </Reveal>

        {/* ── Скляна картка оплати ── */}
        <Reveal delay={120}>
          <div className="relative mx-auto mt-14 max-w-2xl">
            {/* Стрілка вказує на картку — як у хіро на заголовок.
                Схована на вузьких екранах: там для неї немає полів. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-16 -top-10 hidden h-20 w-20 -scale-x-100 lg:block"
            >
              <ArrowScribble />
            </div>

            <div className="rounded-[1.75rem] border border-white/40 bg-white/15 p-6 shadow-2xl backdrop-blur-md sm:rounded-[2.25rem] sm:p-10">
              {/* value stack */}
              <ul className="grid gap-2.5 sm:grid-cols-2">
                {offer.includes.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm font-medium text-white"
                  >
                    <span
                      className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                      style={{ backgroundColor: ACID }}
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

              {/* ── ціна ── */}
              <div className="mt-9 border-t border-white/25 pt-8 text-center">
                {hasPrice ? (
                  <>
                    {offer.oldPrice && (
                      <p className="text-base text-white/50 line-through">
                        {offer.oldPrice.toLocaleString("uk-UA")} {offer.currency}
                      </p>
                    )}
                    {/* Ціна — лаймом і з тінню: у хіро цю роль грає
                        бейдж, тут вона найяскравіше число секції. */}
                    <p
                      className="offer-depth mt-1 text-[clamp(2.6rem,10vw,72px)] font-black leading-[0.9] tracking-tighter"
                      style={{
                        fontFamily: '"Arial Black", Impact, system-ui, sans-serif',
                        color: ACID,
                        textShadow: "var(--depth)",
                      }}
                    >
                      {offer.price!.toLocaleString("uk-UA")}
                      <span className="text-[0.55em]">{offer.currency}</span>
                    </p>
                    <p className="mt-4 text-sm text-white">{offer.priceNote}</p>
                  </>
                ) : (
                  <p className="text-base leading-relaxed text-white/85 sm:text-lg">
                    {offer.priceHidden}
                  </p>
                )}
              </div>

              <div className="mt-9">
                <BuyButton
                  source="offer"
                  glass="iosLime"
                  className="w-full px-7 text-sm leading-tight tracking-tight sm:min-h-[64px] sm:text-base"
                >
                  {cta.primaryShort}
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1 sm:h-[18px] sm:w-[18px]"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </BuyButton>
                <p className="mt-5 text-center text-xs leading-relaxed text-white/80">
                  {offer.underCta}
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={220}>
          <p className="mx-auto mt-10 max-w-xl text-center text-sm leading-relaxed text-white/60">
            {riskReversal.text}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

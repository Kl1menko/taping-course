"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { hero, cta, brand, expert } from "@/content";
import BuyButton from "./BuyButton";
import { track } from "@/lib/analytics";

// Експериментальний хіро в палітрі референсу 21st.dev: електричний
// синій фон, кислотний лайм і скляні картки.
//
// Фон тут не декор, а умова: bg-white/20 + backdrop-blur читається
// як скло лише поверх темного. На кремовому та сама картка виглядає
// брудною плямою, тому синій і скло приходять разом.
//
const BLUE = "#0038FF";
const BLUE_DEEP = "#001A99"; // тінь тексту зі зразка
const ACID = "#CCFF00";

// Багатошарова тінь дає ефект витягнутого 3D-блоку. Колір — рожевий
// із палітри: на кремовому фоні він читається як обʼєм, а не як бруд.
const depth = (color: string, layers: number, step = 1) =>
  Array.from({ length: layers }, (_, i) => {
    const n = +((i + 1) * step).toFixed(2);
    return `${n}px ${n}px 0 ${color}`;
  }).join(", ");

const DEPTH = depth(BLUE_DEEP, 14);
// Мобільний: та сама кількість шарів, але вдвічі дрібніший крок —
// глибина читається так само, а тінь не з'їдає міжрядковий інтервал.
const DEPTH_SM = depth(BLUE_DEEP, 14, 0.5);

const DEPTH_INK = DEPTH;
const DEPTH_INK_SM = DEPTH_SM;

const ArrowScribbleLeft = () => (
  <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible stroke-current"
       style={{ color: ACID }}
       fill="none" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M10,90 C 10,40 40,20 60,50 C 70,65 80,75 95,70" />
    <path d="M80,55 L95,70 L85,85" />
  </svg>
);

const ArrowScribbleRight = () => (
  <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible stroke-current"
       style={{ color: ACID }}
       fill="none" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M90,10 C 80,60 60,80 40,60 C 20,40 40,20 60,30 C 80,40 70,70 50,80" />
    <path d="M65,75 L50,80 L55,65" />
  </svg>
);

/**
 * Скляна картка викладача — накладка хіро.
 *
 * Курс купують у конкретного практика, тому картка з реальною
 * людиною й посиланням на соцмережу — найшвидший доказ, що він
 * існує і справді практикує.
 */
const InstagramGlyph = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <path d="M17.5 6.5h.01" />
  </svg>
);

const TikTokGlyph = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M16.5 2h-3v13.2a2.7 2.7 0 1 1-2.7-2.7c.3 0 .5 0 .7.1V9.5a5.9 5.9 0 0 0-.7 0 5.7 5.7 0 1 0 5.7 5.7V8.9a7 7 0 0 0 4 1.3V7.2a4 4 0 0 1-4-4Z" />
  </svg>
);

const ExpertCard = ({
  network = "instagram",
}: {
  network?: "instagram" | "tiktok";
}) => {
  const isTikTok = network === "tiktok";
  const href = isTikTok ? brand.tiktok : brand.instagram;
  const handle = isTikTok ? brand.tiktokHandle : brand.instagramHandle;
  const followers = isTikTok ? brand.tiktokFollowers : brand.instagramFollowers;
  const Glyph = isTikTok ? TikTokGlyph : InstagramGlyph;
  // У TikTok своя аватарка; поки її немає — те саме фото викладача.
  const photo = (isTikTok && brand.tiktokPhoto) || expert.photo;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("telegram_click", { source: `hero_${network}` })}
      className="group flex w-full flex-col items-center rounded-[1.75rem] border border-white/40 bg-white/20 px-4 py-6 shadow-2xl md:p-8 backdrop-blur-md transition-transform duration-500 hover:scale-[1.04] md:w-72 md:rounded-[2.25rem]"
    >
      <div className="relative h-16 w-16 overflow-hidden rounded-full border-[3px] border-white/50 shadow-inner md:h-36 md:w-36">
        <Image
          src={photo}
          alt={expert.name || brand.nameShort}
          fill
          sizes="(min-width: 768px) 144px, 64px"
          className="object-cover"
          priority
        />
      </div>

      <p className="mt-4 text-center text-sm font-bold text-white md:mt-5 md:text-xl">
        {expert.name || brand.nameShort}
      </p>

      {/* Хендл із логотипом мережі — щоб було видно, що це посилання. */}
      <span className="mt-1 inline-flex max-w-full items-center gap-1 truncate text-[11px] font-semibold text-white/85 transition group-hover:text-lime md:mt-2 md:gap-1.5 md:text-sm">
        <Glyph className="h-3 w-3 md:h-4 md:w-4" />
        {handle}
      </span>

      <p className="mt-4 w-full border-t border-white/25 pt-4 text-center text-[9px] uppercase tracking-widest text-white/70 md:mt-5 md:pt-5 md:text-xs">
        {/* Числа підписників немає — показуємо заклик, а не вигадану
            цифру: підставити її можна в brand.tiktokFollowers. */}
        {followers ? (
          <>
            <span className="font-black text-lime">{followers}</span> підписників
          </>
        ) : (
          <span className="font-black text-lime">дивитись відео</span>
        )}
      </p>
    </a>
  );
};

export default function Hero() {
  return (
    // overflow-x-clip замість hidden: картки-накладки навмисно
    // звисають за праву й ліву межі секції, і hidden обрізав би їх.
    // Горизонтальний скрол сторінки при цьому не з'являється —
    // його тримає html, body { overflow-x: clip } у globals.css.
    <section
      id="top"
      className="relative w-full overflow-x-clip pt-24 sm:pt-28"
      style={{ backgroundColor: BLUE }}
    >
      {/* Сітка на фоні — прийом із референсу. */}
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[size:4rem_4rem] bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-4 pb-28 pt-6 sm:pb-36 md:pt-10">
        <p className="animate-rise text-center text-xs font-bold uppercase tracking-[0.3em] text-white/50 sm:text-sm">
          {hero.kicker}
        </p>

        {/* ── масивна зсунута типографіка ── */}
        <style>{`
          .hero-depth { --depth: ${DEPTH_SM}; --depth-ink: ${DEPTH_INK_SM}; }
          @media (min-width: 640px) {
            .hero-depth { --depth: ${DEPTH}; --depth-ink: ${DEPTH_INK}; }
          }
        `}</style>

        <div className="hero-depth relative mx-auto mt-10 flex w-full max-w-4xl flex-col items-center px-0 sm:px-2 sm:mt-16 lg:max-w-5xl">
          {/* Заголовок один — h1 із трьох рядків, а не три h1:
              для читача з екранрідером це одне речення. */}
          <h1
            className="relative isolate z-10 w-full space-y-1 uppercase md:space-y-3"
            style={{ fontFamily: '"Arial Black", Impact, system-ui, sans-serif' }}
          >
            <span className="relative flex w-full justify-start pl-[3%] md:pl-[4%]">
              <span
                className="relative block whitespace-nowrap text-[clamp(2.2rem,9.4vw,104px)] font-black leading-[0.85] tracking-tighter"
                style={{ color: ACID, textShadow: "var(--depth-ink)" }}
              >
                Тейпування
                {/* Стрілка прив'язана до самого слова, а не до
                    контейнера на всю ширину: текст тут whitespace-nowrap
                    і його ширина залежить від шрифту, тому відсоток від
                    контейнера на різних телефонах відводив стрілку
                    в порожнечу праворуч від тексту. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-10 -top-2 h-12 w-12 sm:-right-16 sm:h-20 sm:w-20 md:-right-24 md:h-28 md:w-28"
                >
                  <ArrowScribbleRight />
                </span>
              </span>
            </span>

            <span className="relative flex w-full justify-start pl-[10%] md:pl-[16%]">
              <span
                className="block whitespace-nowrap text-[clamp(3.1rem,13.4vw,150px)] font-black leading-[0.85] tracking-tighter text-white"
                style={{ textShadow: "var(--depth)" }}
              >
                не схеми
              </span>
            </span>

            <span className="relative flex w-full justify-start pl-[18%] md:pl-[30%]">
              <span
                className="relative block whitespace-nowrap text-[clamp(2.7rem,11.5vw,138px)] font-black leading-[0.85] tracking-tighter text-white"
                style={{ textShadow: "var(--depth)" }}
              >
                {/* Так само прив'язана до слова — зліва від нього. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -left-11 -bottom-3 h-12 w-12 sm:-left-[4.5rem] sm:h-20 sm:w-20 md:-left-28 md:h-28 md:w-28"
                >
                  <ArrowScribbleLeft />
                </span>
                а система
              </span>
            </span>
          </h1>

          {/* ── картка й бейдж: на мобільному вони в стрічці нижче ── */}
          <div className="pointer-events-none absolute inset-0 hidden h-full w-full sm:block">
            <motion.div
              initial={{ rotate: -16 }}
              animate={{ y: [0, -16, 0], rotate: -16 }}
              transition={{
                y: { duration: 5.5, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 0 },
              }}
              className="pointer-events-auto absolute top-[22%] -left-[10%] z-30 lg:-left-[19%]"
            >
              <ExpertCard />
            </motion.div>

            {/* Картка TikTok праворуч-угорі — під кнопкою «Кабінет»
                у шапці. Нахил у інший бік, ніж у картки Instagram
                ліворуч: разом вони читаються як приклеєні поляроїди,
                а не як дві колонки сітки. */}
            <motion.div
              initial={{ rotate: 12 }}
              animate={{ y: [0, -14, 0], rotate: 12 }}
              transition={{
                // Період інший, ніж у лівої картки (5.5s): однакові
                // зробили б рух двох карток синхронним і механічним.
                y: { duration: 6.5, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 0 },
              }}
              className="pointer-events-auto absolute -top-[20%] -right-[8%] z-30 lg:-top-[26%] lg:-right-[26%]"
            >
              <ExpertCard network="tiktok" />
            </motion.div>
          </div>
        </div>

        {/* ── на мобільному накладки сховані: картка під заголовком.
            Бейджа ціни тут немає — вона й так стоїть у кнопці нижче. ── */}
        {/* max-w-sm обмежує пару: на flex-1 картки тягнуться на всю
            ширину екрана, і на телефоні 430px кожна виходила ~200px —
            вони з'їдали пів першого екрана й відсували CTA за згин.
            У DevTools на 375px це було непомітно. */}
        <div className="mx-auto mt-8 flex max-w-sm items-start justify-between gap-2.5 px-2 sm:hidden">
          {/* Нахил у різні боки — картки читаються як приклеєні
              поляроїди, а не як дві колонки сітки. */}
          <div className="min-w-0 flex-1 -rotate-[10deg]">
            <ExpertCard />
          </div>
          <div className="min-w-0 flex-1 -translate-y-5 rotate-[10deg]">
            <ExpertCard network="tiktok" />
          </div>
        </div>

        {/* ── підзаголовок і CTA ── */}
        <div className="relative z-10 mx-auto mt-4 max-w-3xl text-center sm:mt-32">
          <p className="mx-auto max-w-2xl animate-rise text-base leading-relaxed text-white/75 sm:text-lg">
            {hero.subtitle}
          </p>

          <div className="mx-auto mt-10 flex w-full max-w-xl animate-rise flex-col items-stretch gap-3">
            <BuyButton
              source="hero"
              glass="iosLime"
              className="px-7 text-sm leading-tight tracking-tight sm:min-h-[68px] sm:px-9 sm:text-base"
            >
              {cta.primary}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                   strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
                   className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1 sm:h-[18px] sm:w-[18px]">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </BuyButton>

            <a
              href={cta.secondaryHref}
              className="inline-flex items-center justify-center rounded-full border border-white/40 px-7 py-4 text-sm font-bold text-white backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-[#0038FF] sm:px-9 sm:py-5 sm:text-base"
            >
              {cta.secondary}
            </a>
          </div>

          <p className="mx-auto mt-8 max-w-md animate-rise text-[13px] leading-relaxed text-white/50 sm:max-w-xl sm:text-sm">
            {hero.audienceLine}
          </p>
        </div>
      </div>
    </section>
  );
}

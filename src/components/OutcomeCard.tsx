import { MedicalIcon, type MedicalIconName } from "./icons";

// Картка «Що ви отримуєте» у світлому стилі: велика візуальна зона
// вгорі (замість скриншота — велика іконка на кольоровому світінні),
// під нею заголовок і опис.

// М'які пари кольорів для світіння під іконкою.
const ACCENTS = [
  { a: "#DEFF3C", b: "#B9F73E" },
  { a: "#F4A8F2", b: "#D96FD6" },
  { a: "#A8D8F4", b: "#7FB0FF" },
  { a: "#C9B8FF", b: "#9B8CFF" },
  { a: "#9BE8D8", b: "#3FE0C8" },
  { a: "#FFD6A8", b: "#FFB865" },
];

export default function OutcomeCard({
  index,
  verb,
  text,
  icon,
}: {
  index: number;
  verb: string;
  text: string;
  icon: string;
}) {
  const accent = ACCENTS[index % ACCENTS.length];

  return (
    // На телефоні — горизонтальний рядок (іконка + текст поруч):
    // шість вертикальних карток розтягувались на кілька екранів скролу.
    // Від sm повертається вертикальна розкладка з великою зоною.
    <article className="flex h-full flex-row items-center gap-3.5 overflow-hidden rounded-[1.5rem] border border-ink/[0.07] bg-white p-3 shadow-[0_1px_2px_rgba(14,14,16,0.04),0_8px_24px_-12px_rgba(14,14,16,0.10)] transition-shadow duration-500 sm:flex-col sm:items-stretch sm:gap-0 sm:rounded-[1.75rem] sm:hover:shadow-[0_1px_2px_rgba(14,14,16,0.04),0_16px_40px_-16px_rgba(14,14,16,0.16)]">
      {/* ── візуальна зона ── */}
      <div className="relative flex h-[84px] w-[84px] shrink-0 items-center justify-center overflow-hidden rounded-[1.15rem] bg-cream sm:h-[186px] sm:w-auto sm:rounded-[1.35rem]">
        {/* кольорове світіння за іконкою */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: `
              radial-gradient(60% 60% at 50% 58%, ${accent.a}dd 0%, transparent 70%),
              radial-gradient(45% 45% at 66% 40%, ${accent.b}aa 0%, transparent 72%)
            `,
            filter: "blur(26px)",
          }}
        />

        {/* велика іконка */}
        <span
          aria-hidden="true"
          className="relative flex h-[58px] w-[58px] items-center justify-center rounded-[1rem] border border-white/70 bg-white/70 shadow-[0_8px_24px_-10px_rgba(14,14,16,0.25)] backdrop-blur-sm sm:h-24 sm:w-24 sm:rounded-[1.5rem]"
        >
          <MedicalIcon
            name={icon as MedicalIconName}
            className="h-8 w-8 text-ink sm:h-12 sm:w-12"
          />
        </span>
      </div>

      {/* ── текст ── */}
      <div className="flex min-w-0 flex-1 flex-col pr-1 sm:px-4 sm:pb-4 sm:pr-4 sm:pt-5">
        <h3 className="text-base font-extrabold leading-[1.2] tracking-tight sm:text-xl">
          {verb}
        </h3>
        <p className="mt-1.5 text-[13px] leading-relaxed text-ink/55 sm:mt-2 sm:text-sm">
          {text}
        </p>
      </div>
    </article>
  );
}

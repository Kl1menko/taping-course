import { MedicalIcon, type MedicalIconName } from "./icons";

// Картка для TrustBar у тому ж світлому стилі, що й OutcomeCard:
// візуальна зона з великою іконкою вгорі, підпис під нею.
//
// На відміну від OutcomeCard тут лише короткий label без опису,
// тому картка нижча — інакше під текстом зяяла б порожнеча.

const ACCENTS = [
  { a: "#DEFF3C", b: "#B9F73E" },
  { a: "#F4A8F2", b: "#D96FD6" },
  { a: "#A8D8F4", b: "#7FB0FF" },
  { a: "#C9B8FF", b: "#9B8CFF" },
  { a: "#9BE8D8", b: "#3FE0C8" },
  { a: "#FFD6A8", b: "#FFB865" },
];

export default function TrustCard({
  index,
  label,
  icon,
}: {
  index: number;
  label: string;
  icon: string;
}) {
  const accent = ACCENTS[index % ACCENTS.length];

  return (
    // На телефоні картка — горизонтальний рядок (іконка + текст):
    // так шість карток не розтягуються на кілька екранів скролу.
    // Від sm повертається вертикальна розкладка з великою зоною.
    <article className="flex h-full flex-row items-center gap-3.5 overflow-hidden rounded-[1.5rem] border border-ink/[0.07] bg-white p-2.5 shadow-[0_1px_2px_rgba(14,14,16,0.04),0_8px_24px_-12px_rgba(14,14,16,0.10)] transition-shadow duration-500 sm:flex-col sm:items-stretch sm:gap-0 sm:rounded-[1.75rem] sm:hover:shadow-[0_1px_2px_rgba(14,14,16,0.04),0_16px_40px_-16px_rgba(14,14,16,0.16)]">
      {/* ── візуальна зона ── */}
      <div className="relative flex h-[76px] w-[76px] shrink-0 items-center justify-center overflow-hidden rounded-[1.15rem] bg-cream sm:h-[140px] sm:w-auto sm:rounded-[1.4rem]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: `
              radial-gradient(60% 60% at 50% 58%, ${accent.a}dd 0%, transparent 70%),
              radial-gradient(45% 45% at 66% 40%, ${accent.b}aa 0%, transparent 72%)
            `,
            filter: "blur(24px)",
          }}
        />

        <span
          aria-hidden="true"
          className="relative flex h-[52px] w-[52px] items-center justify-center rounded-[0.95rem] border border-white/70 bg-white/70 shadow-[0_8px_24px_-10px_rgba(14,14,16,0.25)] backdrop-blur-sm sm:h-[74px] sm:w-[74px] sm:rounded-[1.25rem]"
        >
          <MedicalIcon
            name={icon as MedicalIconName}
            className="h-7 w-7 text-ink sm:h-10 sm:w-10"
          />
        </span>
      </div>

      {/* ── підпис ── */}
      <p className="min-w-0 flex-1 pr-1 text-[15px] font-bold leading-snug sm:flex-none sm:px-3 sm:pb-2.5 sm:pr-3 sm:pt-4">
        {label}
      </p>
    </article>
  );
}

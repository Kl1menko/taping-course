"use client";

import { Arrow } from "./ui";
import { useSignupModal } from "./SignupModal";

/**
 * Жовта CTA-кнопка з анімованим розмитим фоном:
 * під поверхнею повільно плавають кольорові плями (blur),
 * при наведенні вони прискорюються і яскравішають.
 */
export default function GlowButton({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { open } = useSignupModal();
  return (
    <button
      type="button"
      onClick={open}
      className={`group relative isolate inline-flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-full bg-lime px-9 py-4 text-sm font-bold uppercase tracking-wide text-ink shadow-lg shadow-lime/40 transition-shadow duration-500 hover:shadow-xl hover:shadow-lime/60 sm:w-auto ${className}`}
    >
      {/* рухомі розмиті плями */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-70 blur-xl transition-opacity duration-500 group-hover:opacity-100"
      >
        <span className="blob-a absolute left-[-20%] top-[-60%] h-[220%] w-[55%] rounded-full bg-[#FFF27A]" />
        <span className="blob-b absolute left-[30%] top-[-70%] h-[240%] w-[45%] rounded-full bg-[#B9F73E]" />
        <span className="blob-c absolute right-[-15%] top-[-60%] h-[220%] w-[50%] rounded-full bg-[#F4A8F2]" />
      </span>

      {/* блиск, що пробігає при наведенні */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-white/40 blur-md transition-all duration-700 ease-out group-hover:left-[130%]"
      />

      <span className="relative">{children}</span>
      <Arrow className="relative transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </button>
  );
}

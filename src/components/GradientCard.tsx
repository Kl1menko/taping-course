"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { MEDICAL_ICONS } from "./icons";


// SVG-іконки: штрих 1.5, viewBox 24 — однакова вага в усіх картках
const ICONS: Record<string, React.ReactNode> = {
  // руки / масаж — з набору Medicine & Health (hand)
  hands: <path d={MEDICAL_ICONS.hand} />,
  // свисток / тренер
  whistle: (
    <>
      <circle cx="9" cy="14" r="5.5" />
      <path d="M14.2 12.2 21 9.4" />
      <path d="M14.5 15.4 19 17" />
      <path d="M13 9V5h5" />
    </>
  ),
  // біг / спорт
  run: (
    <>
      <circle cx="15" cy="4.6" r="2" />
      <path d="M8 21l3-5.2-2.6-2.6.9-4.9 3.3-1.4 2.9 2.6 3 .9" />
      <path d="M12.4 15.8 15 19.4h3.6" />
      <path d="M9.2 8.3 5.6 9.7 4 13" />
    </>
  ),
  // студенти-медики — з набору Medicine & Health (medical_documentation)
  book: <path d={MEDICAL_ICONS.medicalDoc} />,
};

// пари кольорів для нижнього світіння
const ACCENTS = [
  { a: "#B9F73E", b: "#5FB0FF" },
  { a: "#F4A8F2", b: "#8F6BFF" },
  { a: "#DEFF3C", b: "#F4A8F2" },
  { a: "#9B8CFF", b: "#3FE0C8" },
];

export default function GradientCard({
  index,
  title,
  text,
  icon,
}: {
  index: number;
  title: string;
  text: string;
  icon: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const accent = ACCENTS[index % ACCENTS.length];

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const cfg = { stiffness: 150, damping: 20, mass: 0.6 };
  const rotateX = useSpring(useTransform(py, [0, 1], [7, -7]), cfg);
  const rotateY = useSpring(useTransform(px, [0, 1], [-7, 7]), cfg);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  }

  return (
    <motion.article
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        px.set(0.5);
        py.set(0.5);
      }}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      className="group relative flex h-full min-h-[340px] flex-col overflow-hidden rounded-[1.75rem] bg-[#0A0A0C] ring-1 ring-white/[0.08] [transform-style:preserve-3d] sm:min-h-[380px]"
    >
      {/* ── кольорова заливка знизу, як у референсі ── */}
      <motion.div
        aria-hidden="true"
        animate={{ opacity: hovered ? 1 : 0.75 }}
        transition={{ duration: 0.6 }}
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%]"
        style={{
          background: `
            radial-gradient(120% 90% at 18% 108%, ${accent.a}cc 0%, transparent 62%),
            radial-gradient(120% 95% at 88% 100%, ${accent.b}dd 0%, transparent 66%),
            radial-gradient(140% 80% at 50% 118%, ${accent.b}88 0%, transparent 70%)
          `,
          filter: "blur(34px)",
        }}
      />

      {/* розчинення заливки в чорному згори */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%]"
        style={{
          background:
            "linear-gradient(to top, transparent 55%, #0A0A0C 100%)",
        }}
      />

      {/* ── контент ── */}
      <div
        className="relative flex h-full flex-col p-6 sm:p-7"
        style={{ transform: "translateZ(40px)" }}
      >
        {/* кругла іконка */}
        <span
          aria-hidden="true"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.07] ring-1 ring-white/10 backdrop-blur-sm transition-transform duration-500 group-hover:scale-110"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-[22px] w-[22px] text-white"
          >
            {ICONS[icon]}
          </svg>
        </span>

        <h3 className="mt-6 text-lg font-extrabold leading-[1.2] tracking-tight text-white xl:text-xl">
          {title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-white/65">
          {text}
        </p>
      </div>
    </motion.article>
  );
}

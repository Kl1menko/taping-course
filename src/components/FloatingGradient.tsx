"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Плаваючий градієнт — темне полотно, по якому повільно дрейфують
 * кілька сильно розмитих кольорових плям.
 *
 * Кольори взяті з палітри сайту (blue / pink.deep / lime), а не з
 * оригіналу на 21st.dev: там малиново-бірюзова гама, і на сторінці
 * з електричним синім та лаймом вона читалась би як чужа вставка.
 * Від оригіналу лишився прийом, не пігмент.
 *
 * Насиченість навмисно низька: пляма — це фон під текстом, і будь-що
 * яскравіше починає з ним конкурувати.
 */

type Blob = {
  className: string;
  /** Зсув по X/Y у відсотках власного розміру — звідси й «дрейф». */
  x: [number, number, number];
  y: [number, number, number];
  duration: number;
};

// Три плями, кожна зі своїм періодом: некратні тривалості не дають
// циклу «схлопнутись» у помітний повтор.
const BLOBS: Blob[] = [
  {
    // Верх по центру — головна пляма, як малинова в оригіналі.
    className:
      "left-1/2 top-[-30%] h-[70vh] w-[70vh] -translate-x-1/2 bg-blue/40",
    x: [0, 6, 0],
    y: [0, 8, 0],
    duration: 19,
  },
  {
    // Ліворуч унизу — глибокий синій, тримає лівий край кадру.
    className: "left-[-15%] bottom-[-35%] h-[65vh] w-[65vh] bg-pink-deep/35",
    x: [0, 10, 0],
    y: [0, -7, 0],
    duration: 23,
  },
  {
    // Правий низ — єдина тепла нота: лайм тут майже не впізнається
    // як лайм, але не дає кадру піти в суцільну синь.
    className: "right-[-12%] bottom-[-25%] h-[55vh] w-[55vh] bg-lime/20",
    x: [0, -8, 0],
    y: [0, 6, 0],
    duration: 27,
  },
];

export default function FloatingGradient({
  className = "",
}: {
  className?: string;
}) {
  // Дрейф — суто декоративний рух: тим, хто просив менше анімації,
  // показуємо ту саму картинку статично.
  const still = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden bg-ink ${className}`}
    >
      {BLOBS.map((blob, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full blur-[100px] sm:blur-[130px] ${blob.className}`}
          animate={
            still ? undefined : { x: blob.x.map((v) => `${v}%`), y: blob.y.map((v) => `${v}%`) }
          }
          transition={{
            duration: blob.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Плями впритул до країв дають видимий шов на межі секції —
          віньєтка ховає його й заразом притемнює кути, як в оригіналі. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,#0B1030_100%)]" />
    </div>
  );
}

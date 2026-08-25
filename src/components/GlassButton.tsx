"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Кнопка «рідке скло» за макетом Figma (Liquid Glass Button).
 *
 * Техніка з макета:
 *   1. Шари лінз — вкладені кола з backdrop-blur, що спадає
 *      100 → 50 → 25 → 10 → 2 %. Саме це дає ефект товстого скла,
 *      яке заломлює фон сильніше по краях, ніж у центрі.
 *   2. Набір внутрішніх тіней: світла зверху-зліва (#FFFFFF 50%),
 *      сіра знизу-справа (#B3B3B3), обідок (#999) і загальне
 *      внутрішнє світіння (#F2F2F2 50%).
 *   3. Дзеркальний блік згори — скло ловить світло.
 *
 * Важливо: скло показує те, що ПІД ним. На нашому світлому фоні
 * повністю прозорий варіант (як у макеті поверх фото) робив головний
 * CTA блідим і невиразним, тож tint у lime/dark щільний — лишається
 * скляне світло й об'єм, але кнопка тримає вагу. Прозорий `light`
 * розрахований на темну підкладку.
 */

export type Tone = "light" | "dark" | "lime" | "ios" | "iosDark" | "iosLime";

const TONES: Record<Tone, { tint: string; text: string; edge: string }> = {
  // Прозоре скло — головний варіант із макета.
  light: {
    tint: "rgba(255,255,255,0.18)",
    text: "text-white",
    edge: "rgba(255,255,255,0.55)",
  },
  // Затемнене скло — для світлого фону, щоб текст читався.
  dark: {
    tint: "rgba(14,14,16,0.88)",
    text: "text-white",
    edge: "rgba(255,255,255,0.35)",
  },
  // Скло з відтінком бренду.
  lime: {
    tint: "rgba(222,255,60,0.92)",
    text: "text-ink",
    edge: "rgba(255,255,255,0.6)",
  },
  // Світлий варіант iOS 26: майже прозоре скло з чорним текстом.
  ios: {
    tint: "rgba(140,140,140,0.25)",
    text: "text-ink",
    edge: "rgba(166,166,166,0.9)",
  },
  // Той самий iOS-варіант для темної підкладки: чорний текст на
  // сірому склі там нечитабельний, тож скло світле, а текст білий.
  iosDark: {
    tint: "rgba(255,255,255,0.14)",
    text: "text-white",
    edge: "rgba(255,255,255,0.5)",
  },
  // Головний CTA: форма й тіні iOS 26, але заливка бренду.
  // Сіре скло на світлому фоні втрачало вагу — головна дія має
  // лишатись найпомітнішою на екрані.
  iosLime: {
    tint: "rgba(222,255,60,0.95)",
    text: "text-ink",
    edge: "rgba(163,190,40,0.8)",
  },
};

// Внутрішні тіні — значення з першого макета, перераховані під нашу
// висоту кнопки (у Figma 282px, у нас ~56px, радіуси зменшено).
const INNER_SHADOW = [
  "inset 6px 6px 1px -7px rgba(255,255,255,0.5)",
  "inset 4px 4px 2px -4px rgba(179,179,179,0.9)",
  "inset -4px -4px 2px -4px rgba(179,179,179,0.9)",
  "inset 0 0 0 1px rgba(153,153,153,0.35)",
  "inset 0 0 44px 0 rgba(242,242,242,0.35)",
].join(", ");

// Тіні варіанта iOS 26 — помітно делікатніші (1–3px замість 4–6),
// тому винесені окремо, а не масштабуються з набору вище.
const iosInnerShadow = (edge: string) =>
  [
    "inset 3px 3px 0.5px -3.5px #fff",
    "inset 2px 2px 0.5px -2px #262626",
    "inset -2px -2px 0.5px -2px #262626",
    `inset 0 0 0 1px ${edge}`,
    "inset 0 0 8px 0 rgba(242,242,242,0.6)",
  ].join(", ");

// М'які зовнішні тіні — саме вони відривають кнопку від світлого фону.
const IOS_OUTER_SHADOW =
  "0 0 2px 0 rgba(0,0,0,0.1), 0 1px 8px 0 rgba(0,0,0,0.1)";

type GlassButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: Tone;
  href?: string;
  target?: string;
  rel?: string;
};

export default function GlassButton({
  tone = "light",
  className,
  children,
  href,
  target,
  rel,
  ...props
}: GlassButtonProps) {
  const t = TONES[tone];
  // Обидва iOS-тони ділять ту саму геометрію тіней і розмиття.
  const isIos = tone === "ios" || tone === "iosDark" || tone === "iosLime";

  const content = (
    <>
      {/* Шари лінз: що ближче до краю, то сильніше розмиття —
          так скло виглядає товстим, а не просто напівпрозорим. */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-full">
        {isIos ? (
          <span className="absolute inset-0 rounded-full backdrop-blur-[6px]" />
        ) : (
          <>
            <span className="absolute inset-0 rounded-full backdrop-blur-[16px]" />
            <span className="absolute inset-[1px] rounded-full backdrop-blur-[8px]" />
            <span className="absolute inset-[2px] rounded-full backdrop-blur-[4px]" />
            <span className="absolute inset-[4px] rounded-full backdrop-blur-[2px]" />
            <span className="absolute inset-[8px] rounded-full backdrop-blur-[1px]" />
          </>
        )}
      </span>

      {/* Відтінок скла */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{ background: t.tint }}
      />

      {/* Внутрішні тіні — вони й ліплять об'єм */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{ boxShadow: isIos ? iosInnerShadow(t.edge) : INNER_SHADOW }}
      />

      {/* Дзеркальний блік згори */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-2 top-px h-1/2 rounded-full ${
          isIos ? "opacity-40" : "opacity-70"
        }`}
        style={{
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.55), rgba(255,255,255,0) 100%)",
        }}
      />

      {/* Тонкий світлий контур. У iOS обідок уже входить
          в IOS_INNER_SHADOW, тож другий тут не потрібен. */}
      {!isIos && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{ boxShadow: `inset 0 0 0 1px ${t.edge}` }}
        />
      )}

      <span className="relative z-10 flex items-center justify-center gap-2.5">
        {children}
      </span>
    </>
  );

  const cls = cn(
    "group relative isolate inline-flex min-h-14 items-center justify-center",
    "rounded-full px-8 text-sm font-extrabold uppercase tracking-wide",
    "transition-transform duration-300 will-change-transform",
    "active:scale-[.97] sm:hover:-translate-y-0.5",
    t.text,
    className
  );

  // Зовнішня тінь iOS-варіанта — на самій кнопці: внутрішні шари
  // тінь назовні не відкидають.
  const style = isIos ? { boxShadow: IOS_OUTER_SHADOW } : undefined;

  if (href) {
    return (
      <a href={href} target={target} rel={rel} className={cls} style={style}>
        {content}
      </a>
    );
  }

  return (
    <button className={cls} style={style} {...props}>
      {content}
    </button>
  );
}

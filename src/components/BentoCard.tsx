import type { ReactNode } from "react";

// ── Єдина мова карток сторінки ──
//
// Зі зразка: пласка світло-сіра плита з великим радіусом, без рамки
// й без тіні у спокої. Весь колір винесено в один насичений обʼєкт
// усередині — «пілюлю». Якщо фарбувати ще й саму плиту, сітка
// перетворюється на мозаїку і жоден акцент більше не читається.
//
// tone керує лише фоном плити: картки живуть і на кремовому, і на
// темних (bg-ink) секціях, а решта правил однакова.

export type BentoTone = "plate" | "dark" | "blue" | "lime";

const TONE: Record<BentoTone, string> = {
  // Головний варіант. bg-ink/[0.04] на кремовому — та сама сіра плита,
  // що й у зразку, але вона лишається сірою на будь-якому фоні секції.
  plate: "bg-ink/[0.04] text-ink",
  // Усередині темних секцій сіра плита неможлива — світлішаємо навпаки.
  dark: "bg-white/[0.05] text-white",
  // Заливні плитки — лише як акцент бенто-сітки, не за замовчуванням.
  blue: "bg-blue text-white",
  lime: "bg-lime text-ink",
};

export function BentoCard({
  tone = "plate",
  as: Tag = "article",
  /** Колонка за замовчуванням; grid — коли картка сама несе розкладку. */
  layout = "column",
  className = "",
  children,
}: {
  tone?: BentoTone;
  as?: "article" | "div" | "li";
  layout?: "column" | "bare";
  className?: string;
  children: ReactNode;
}) {
  // "bare" не нав'язує flex — інакше він конфліктує з grid, який
  // картка вмикає в className (як у блоці про викладача).
  const box = layout === "column" ? "flex flex-col" : "";
  return (
    <Tag
      className={`h-full rounded-[1.75rem] p-6 sm:rounded-[2rem] sm:p-8 ${box} ${TONE[tone]} ${className}`}
    >
      {children}
    </Tag>
  );
}

/**
 * Заголовок картки — чорний жирний капс, як у зразку.
 * Розмір керується ззовні: у бенто великі плитки мусять кричати
 * гучніше за дрібні, інакше сітка читається пласкою.
 */
export function BentoTitle({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={`text-lg font-black uppercase leading-[1.05] tracking-tight sm:text-xl ${className}`}
    >
      {children}
    </h3>
  );
}

/** Сірий підпис під заголовком. */
export function BentoText({
  children,
  tone = "plate",
  className = "",
}: {
  children: ReactNode;
  tone?: BentoTone;
  className?: string;
}) {
  const muted =
    tone === "plate" ? "text-ink/55" : tone === "lime" ? "text-ink/60" : "text-white/60";
  return (
    <p className={`text-[13px] font-medium leading-relaxed sm:text-sm ${muted} ${className}`}>
      {children}
    </p>
  );
}

/**
 * «Пілюля» — той самий носій кольору, що й сині/лаймові плашки зі
 * зразка. Вона й тільки вона несе акцент у картці.
 */
export function BentoPill({
  accent = "blue",
  className = "",
  children,
}: {
  accent?: "blue" | "lime" | "ink";
  className?: string;
  children: ReactNode;
}) {
  const skin =
    accent === "lime"
      ? "bg-lime text-ink"
      : accent === "ink"
        ? "bg-ink text-lime"
        : "bg-blue text-white";
  return (
    <div
      className={`inline-flex items-center gap-3 rounded-2xl px-4 py-2.5 shadow-lg ${skin} ${className}`}
    >
      {children}
    </div>
  );
}

/** Круглий носій іконки всередині пілюлі або окремо на плиті. */
export function BentoGlyph({
  accent = "blue",
  size = "md",
  className = "",
  children,
}: {
  accent?: "blue" | "lime" | "soft-light" | "soft-dark";
  size?: "sm" | "md" | "lg";
  className?: string;
  children: ReactNode;
}) {
  const skin = {
    blue: "bg-blue text-white shadow-lg",
    lime: "bg-lime text-ink shadow-lg",
    "soft-light": "bg-ink/10 text-ink",
    "soft-dark": "bg-white/20 text-white",
  }[accent];
  const box = {
    sm: "h-9 w-9",
    md: "h-12 w-12 sm:h-14 sm:w-14",
    lg: "h-16 w-16 sm:h-20 sm:w-20",
  }[size];
  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full ${skin} ${box} ${className}`}
    >
      {children}
    </span>
  );
}

/** Дрібний капс-надзаголовок — «крок 01», «до навчання» тощо. */
export function BentoKicker({
  children,
  tone = "plate",
  className = "",
}: {
  children: ReactNode;
  tone?: BentoTone;
  className?: string;
}) {
  const muted =
    tone === "plate" ? "text-ink/40" : tone === "lime" ? "text-ink/50" : "text-white/45";
  return (
    <p
      className={`text-[11px] font-black uppercase tracking-widest ${muted} ${className}`}
    >
      {children}
    </p>
  );
}

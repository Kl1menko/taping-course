"use client";

import { useEffect, useState } from "react";
import { brand, nav } from "@/content";
import { TelegramIcon } from "./ui";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled && !open ? "py-2" : "py-4"
      }`}
    >
      <div className="wrap">
        {/* Пігулки-контейнера немає — елементи лежать прямо на фоні,
            як у зразку. Після скролу під ними з'являється підкладка,
            інакше меню втрачає контраст над білими секціями.
            На мобільному підкладки немає: там у рядку лише логотип
            і бургер, обидва самі по собі контрастні, а біла смуга
            через весь екран лише важчить шапку. */}
        <div
          className={`flex items-center justify-between gap-4 px-2 py-2 transition-all duration-300 sm:px-4 ${
            open
              ? "rounded-t-[1.75rem] bg-white/95 backdrop-blur-xl"
              : scrolled
                ? "rounded-full sm:bg-white/85 sm:shadow-lg sm:shadow-ink/5 sm:backdrop-blur-xl"
                : ""
          }`}
        >
          {/* Логотип двома бульбашками: біла з хвостиком-трикутником
              і лаймова капсула — точно як у зразку. */}
          <a href="#top" className="flex shrink-0 items-center gap-1">
            <span className="relative rounded-2xl rounded-bl-sm bg-white px-3 py-1.5 text-xs font-black tracking-tight text-ink shadow-sm md:text-sm">
              KOTOVA
              <span
                aria-hidden="true"
                className="absolute -bottom-1.5 left-0 h-3 w-3 bg-white"
                style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
              />
            </span>
            <span
              className={`rounded-full border-[1.5px] bg-lime px-3 py-1.5 text-xs font-black text-ink shadow-sm md:text-sm ${
                scrolled || open ? "border-ink/10" : "border-white"
              }`}
            >
              TAPING
            </span>
          </a>

          {/* Капсули з рамкою навколо кожного пункту. Їх сім, а не
              чотири як у зразку, тому в рядок вони стають лише від xl —
              нижче меню ховається у бургер. */}
          <nav className="hidden items-center gap-2 xl:flex">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition ${
                  scrolled || open
                    ? "border-ink/15 text-ink/70 hover:bg-ink hover:text-white"
                    : "border-white/30 text-white hover:bg-white/10"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="/cabinet"
              className={`hidden items-center gap-2 rounded-full border px-6 py-2 text-xs font-semibold transition md:text-sm xl:flex ${
                scrolled || open
                  ? "border-ink/20 text-ink hover:bg-ink hover:text-white"
                  : "border-white text-white hover:bg-white hover:text-blue"
              }`}
            >
              Кабінет
            </a>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Закрити меню" : "Відкрити меню"}
              aria-expanded={open}
              className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors xl:hidden ${
                open
                  ? "bg-ink text-white"
                  : "bg-white text-blue shadow-md shadow-ink/10"
              }`}
            >
              <span className="relative block h-3.5 w-4">
                <span
                  className={`absolute left-0 h-0.5 w-full rounded bg-current transition-all ${
                    open ? "top-1.5 rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute left-0 top-1.5 h-0.5 w-full rounded bg-current transition-all ${
                    open ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`absolute left-0 h-0.5 w-full rounded bg-current transition-all ${
                    open ? "top-1.5 -rotate-45" : "top-3"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>

        {/* mobile drawer */}
        <div
          className={`overflow-hidden transition-[max-height,opacity] duration-300 xl:hidden ${
            open ? "max-h-[75vh] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="rounded-b-[1.75rem] border border-t-0 border-ink/5 bg-white/95 px-3 pb-3 shadow-xl backdrop-blur-xl">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block rounded-2xl px-4 py-3.5 text-center text-base font-semibold text-ink/80 transition hover:bg-pink-soft"
              >
                {item.label}
              </a>
            ))}
            {/* Вхід у кабінет — учні заходять переважно з телефона,
                тож у мобільному меню він потрібен обов'язково. */}
            <a
              href="/cabinet"
              onClick={() => setOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 rounded-2xl border border-ink/15 px-4 py-3.5 text-base font-bold"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                   strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <path d="m10 17 5-5-5-5" /><path d="M15 12H3" />
              </svg>
              Вхід у кабінет
            </a>
            <a
              href={brand.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-lime px-4 py-3 text-base font-bold"
            >
              <TelegramIcon className="h-4 w-4" />
              Написати в Telegram
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}

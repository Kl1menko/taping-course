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
        <div
          className={`flex items-center justify-between gap-4 border border-ink/5 px-4 py-2.5 transition-all duration-300 sm:px-6 ${
            open
              ? "rounded-t-[1.75rem] border-b-0 bg-white/95 backdrop-blur-xl"
              : scrolled
                ? "rounded-full bg-white/85 shadow-lg shadow-ink/5 backdrop-blur-xl"
                : "rounded-full bg-white/60 backdrop-blur-md"
          }`}
        >
          <a href="#top" className="text-lg font-extrabold tracking-[0.2em]">
            {brand.name}
          </a>

          <nav className="hidden items-center gap-1 lg:flex">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-full px-3 py-2 text-sm text-ink/70 transition hover:bg-ink/5 hover:text-ink"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={brand.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-2 rounded-full bg-lime px-5 py-2.5 text-sm font-bold transition hover:brightness-95 sm:flex"
            >
              <TelegramIcon className="h-4 w-4" />
              Telegram
            </a>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Закрити меню" : "Відкрити меню"}
              aria-expanded={open}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-white lg:hidden"
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
          className={`overflow-hidden transition-[max-height,opacity] duration-300 lg:hidden ${
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

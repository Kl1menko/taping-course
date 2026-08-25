"use client";

import { useEffect, useState } from "react";
import { offer, cta } from "@/content";
import ApplyButton from "./ApplyButton";

// Постійна нижня панель на мобільних (вимога ТЗ, mobile-first).
export default function StickyCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-ink/10 bg-cream/95 px-4 py-3 backdrop-blur transition-transform duration-300 lg:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-bold uppercase tracking-widest text-ink/45">
            Курс тейпування
          </p>
          <p className="truncate text-sm font-extrabold">
            {offer.price !== null
              ? `${offer.price.toLocaleString("uk-UA")} ${offer.currency}`
              : "13 уроків · практика · набір"}
          </p>
        </div>

        <ApplyButton
          source="sticky"
          className="shrink-0 rounded-full bg-lime px-6 py-3 text-xs font-bold uppercase tracking-wide text-ink"
        >
          Дізнатися
        </ApplyButton>
      </div>
    </div>
  );
}

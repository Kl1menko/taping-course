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
    // Панель темна, а не bg-cream: на кремовому фоні сторінки вона
    // зливалася з контентом і не читалась як окремий шар.
    // pb з safe-area — щоб не ховалась під домашньою смужкою iPhone.
    <div
      className={`fixed inset-x-0 bottom-0 z-50 bg-ink/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_30px_-10px_rgba(14,14,16,0.45)] backdrop-blur-xl transition-transform duration-300 lg:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[10px] font-bold uppercase tracking-widest text-white/45">
            Курс тейпування
          </p>
          <p className="truncate text-lg font-extrabold leading-tight text-white">
            {offer.price !== null
              ? `${offer.price.toLocaleString("uk-UA")} ${offer.currency}`
              : "13 уроків · практика · набір"}
          </p>
        </div>

        <ApplyButton
          source="sticky"
          glass="iosLime"
          className="!min-h-[46px] shrink-0 px-6 text-xs"
        >
          {cta.primaryShort}
        </ApplyButton>
      </div>
    </div>
  );
}

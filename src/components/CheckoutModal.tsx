"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { brand, offer } from "@/content";
import { track, getUtm } from "@/lib/analytics";

// Кольори хіро: модалка оплати — продовження тієї самої сцени,
// а не окреме сіре вікно.
const BLUE = "#0038FF";
const ACID = "#CCFF00";

type Status = "idle" | "sending" | "error";

// Той самий контракт, що був у ApplyProvider — CTA викликають open().
// Змінився крок: замість квізу-заявки одразу оформлення оплати.
// Квіз переїхав у кабінет як онбординг після покупки.
const CheckoutCtx = createContext<{ open: () => void }>({ open: () => {} });
export const useCheckout = () => useContext(CheckoutCtx);

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [failure, setFailure] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const open = useCallback(() => {
    returnFocus.current = document.activeElement as HTMLElement;
    setErrors({});
    setFailure("");
    setStatus("idle");
    setIsOpen(true);
    track("checkout_open");
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    returnFocus.current?.focus();
  }, []);

  // блокування скролу + Escape + утримання фокуса
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key !== "Tab") return;
      const nodes = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])'
      );
      if (!nodes?.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, close]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(
      new FormData(e.currentTarget)
    ) as Record<string, string>;

    const next: Record<string, string> = {};
    if (!data.name?.trim()) next.name = "Вкажіть імʼя";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email?.trim() ?? ""))
      next.email = "Вкажіть коректний email";
    if (!/^[+\d][\d\s()\-]{8,}$/.test(data.phone?.trim() ?? ""))
      next.phone = "Вкажіть коректний номер телефону";

    setErrors(next);
    if (Object.keys(next).length) return;

    setStatus("sending");
    setFailure("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, utm: getUtm() }),
      });
      const json = await res.json();
      if (!res.ok || !json.url) throw new Error(json.error ?? "error");

      track("checkout_start");
      window.location.href = json.url;
    } catch {
      setStatus("error");
      setFailure(
        "Не вдалося створити рахунок. Спробуйте ще раз або напишіть нам у Telegram."
      );
    }
  }

  // text-base на мобільному — iOS зумить сторінку, якщо шрифт < 16px.
  // Поля світлі на синьому тлі модалки: інакше введений текст
  // губиться, а скло поверх скла не читається.
  const field =
    "w-full rounded-2xl border border-white/25 bg-white/95 px-5 py-3.5 text-base text-ink outline-none transition placeholder:text-ink/30 focus:border-lime focus:ring-4 focus:ring-lime/40 sm:text-sm";

  const label =
    "mb-1.5 block text-[11px] font-black uppercase tracking-widest text-white/70";

  return (
    <CheckoutCtx.Provider value={{ open }}>
      {children}

      <div
        className={`fixed inset-0 z-[100] flex justify-center transition-opacity duration-300 sm:items-center sm:p-6 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!isOpen}
      >
        <div
          className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
          onClick={close}
          aria-hidden="true"
        />

        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Оформлення курсу"
          style={{ backgroundColor: BLUE }}
          className={`relative mt-auto flex max-h-[88dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-4xl transition-transform duration-300 sm:mt-0 sm:max-h-[90vh] sm:rounded-4xl ${
            isOpen ? "translate-y-0" : "translate-y-8"
          }`}
        >
          {/* Сітка на фоні — та сама деталь, що в хіро й у секції ціни. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[size:4rem_4rem] bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)]"
          />
          <button
            onClick={close}
            aria-label="Закрити"
            className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/15 text-white backdrop-blur transition active:bg-white/25 sm:right-5 sm:top-5 sm:h-10 sm:w-10 sm:hover:bg-white/25"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                 strokeLinecap="round" className="h-4 w-4">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>

          <div className="relative overflow-y-auto px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-7 sm:px-7 sm:pb-8 sm:pt-9">
            <h2
              className="pr-12 text-2xl font-black uppercase leading-none tracking-tighter text-white sm:text-3xl"
              style={{ fontFamily: '"Arial Black", Impact, system-ui, sans-serif' }}
            >
              Оформлення курсу
            </h2>

            {offer.price !== null && (
              <p
                className="mt-3 text-4xl font-black leading-none tracking-tighter sm:text-5xl"
                style={{
                  fontFamily: '"Arial Black", Impact, system-ui, sans-serif',
                  color: ACID,
                }}
              >
                {offer.price.toLocaleString("uk-UA")}
                <span className="text-[0.55em]">{offer.currency}</span>
              </p>
            )}

            <p className="mt-3 text-[13px] leading-relaxed text-white sm:text-sm">
              Доступ відкривається одразу після оплати. Вхід у кабінет —
              через Telegram-бот: він упізнає вас за номером телефону,
              тому вкажіть той, яким користуєтесь у Telegram.
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-white/85 sm:text-sm">
              {offer.priceNote}
            </p>

            <form onSubmit={onSubmit} noValidate className="mt-6 space-y-3">
              <div>
                <label htmlFor="co-name" className={label}>
                  Імʼя та прізвище
                </label>
                <input
                  id="co-name"
                  name="name"
                  autoComplete="name"
                  placeholder="Марія Коваленко"
                  className={field}
                />
                {errors.name && (
                  <p className="mt-1.5 text-xs font-semibold text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Телефон іде другим, одразу за імʼям: це головний ключ
                  до кабінету, бо вхід працює через Telegram-бот, який
                  шукає оплату саме за номером. */}
              <div>
                <label htmlFor="co-phone" className={label}>
                  Телефон — за ним відкриється кабінет
                </label>
                <input
                  id="co-phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="+380 67 123 45 67"
                  className={field}
                />
                <p className="mt-1.5 text-xs leading-relaxed text-white/70">
                  Той самий номер, що у вашому Telegram.
                </p>
                {errors.phone && (
                  <p className="mt-1.5 text-xs font-semibold text-red-600">{errors.phone}</p>
                )}
              </div>

              <div>
                <label htmlFor="co-email" className={label}>
                  Email — для чека
                </label>
                <input
                  id="co-email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="maria@example.com"
                  className={field}
                />
                {errors.email && (
                  <p className="mt-1.5 text-xs font-semibold text-red-600">{errors.email}</p>
                )}
              </div>

              {status === "error" && (
                <p className="rounded-2xl bg-white/95 px-4 py-3 text-sm font-semibold text-red-700">
                  {failure}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                style={{ backgroundColor: ACID }}
                className="mt-5 flex min-h-14 w-full items-center justify-center rounded-full px-8 text-sm font-black uppercase tracking-wide text-ink shadow-lg transition active:brightness-90 disabled:opacity-50 sm:hover:brightness-95"
              >
                {status === "sending" ? "створюємо рахунок…" : "перейти до оплати"}
              </button>

              <p className="pt-1 text-center text-xs text-white/70">
                Оплата карткою через monobank.{" "}
                <a
                  href={brand.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold underline underline-offset-2"
                  style={{ color: ACID }}
                >
                  Є питання?
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </CheckoutCtx.Provider>
  );
}

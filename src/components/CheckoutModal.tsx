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
  const field =
    "w-full rounded-2xl border border-ink/10 bg-white px-5 py-3.5 text-base outline-none transition placeholder:text-ink/35 focus:border-ink/30 focus:ring-4 focus:ring-lime/40 sm:text-sm";

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
          className={`relative mt-auto flex max-h-[88dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-4xl bg-cream transition-transform duration-300 sm:mt-0 sm:max-h-[90vh] sm:rounded-4xl ${
            isOpen ? "translate-y-0" : "translate-y-8"
          }`}
        >
          <button
            onClick={close}
            aria-label="Закрити"
            className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-ink/5 text-ink/70 transition active:bg-ink/15 sm:right-5 sm:top-5 sm:h-10 sm:w-10 sm:hover:bg-ink/10"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                 strokeLinecap="round" className="h-4 w-4">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>

          <div className="overflow-y-auto px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-7 sm:px-7 sm:pb-8 sm:pt-9">
            <h2 className="pr-12 text-xl font-extrabold leading-snug tracking-tight sm:text-2xl">
              Оформлення курсу
            </h2>

            {offer.price !== null && (
              <p className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold tracking-tight">
                  {offer.price.toLocaleString("uk-UA")}
                  <span className="text-xl">{offer.currency}</span>
                </span>
              </p>
            )}

            <p className="mt-2 text-[13px] leading-relaxed text-ink/55 sm:text-sm">
              Доступ до кабінету відкривається одразу після оплати — на цю
              пошту. {offer.priceNote}
            </p>

            <form onSubmit={onSubmit} noValidate className="mt-6 space-y-3">
              <div>
                <input name="name" placeholder="Імʼя та прізвище" className={field} />
                {errors.name && (
                  <p className="mt-1.5 text-xs text-red-600">{errors.name}</p>
                )}
              </div>
              <div>
                <input
                  name="email"
                  type="email"
                  placeholder="Email — сюди прийде доступ"
                  className={field}
                />
                {errors.email && (
                  <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>
                )}
              </div>
              <div>
                {/* Телефон обовʼязковий: за ним працює вхід через
                    Telegram-бот, коли людина загубила код доступу. */}
                <input
                  name="phone"
                  type="tel"
                  placeholder="Телефон — запасний спосіб входу"
                  className={field}
                />
                {errors.phone && (
                  <p className="mt-1.5 text-xs text-red-600">{errors.phone}</p>
                )}
              </div>

              {status === "error" && (
                <p className="text-sm text-red-600">{failure}</p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="flex min-h-14 w-full items-center justify-center rounded-full bg-lime px-8 text-sm font-bold uppercase tracking-wide text-ink transition active:brightness-90 disabled:opacity-50 sm:hover:brightness-95"
              >
                {status === "sending" ? "створюємо рахунок…" : "перейти до оплати"}
              </button>

              <p className="pt-1 text-center text-xs text-ink/40">
                Оплата карткою через monobank.{" "}
                <a
                  href={brand.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-pink-deep underline underline-offset-2"
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

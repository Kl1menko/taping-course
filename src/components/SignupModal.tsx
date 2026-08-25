"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { brand, finalCta, pricing } from "@/content";
import { Arrow, TelegramIcon } from "./ui";

type Status = "idle" | "sending" | "ok" | "error";

const ModalCtx = createContext<{ open: () => void }>({ open: () => {} });

export const useSignupModal = () => useContext(ModalCtx);

export function SignupModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const open = useCallback(() => {
    returnFocus.current = document.activeElement as HTMLElement;
    setStatus("idle");
    setErrors({});
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    returnFocus.current?.focus();
  }, []);

  // блокування скролу + Escape + фокус
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => firstFieldRef.current?.focus(), 80);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key !== "Tab") return;
      // утримання фокуса всередині модалки
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

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, close]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;

    const next: Record<string, string> = {};
    if (!data.name?.trim()) next.name = "Вкажи ім'я";
    if (!/^[+\d][\d\s()\-]{8,}$/.test(data.phone?.trim() ?? ""))
      next.phone = "Вкажи коректний номер телефону";
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim()))
      next.email = "Схоже, в email є помилка";
    if (!data.consent) next.consent = "Потрібна згода на обробку даних";

    setErrors(next);
    if (Object.keys(next).length) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("bad response");
      setStatus("ok");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  const field =
    "w-full rounded-2xl border border-ink/10 bg-white px-5 py-3.5 text-sm outline-none transition placeholder:text-ink/35 focus:border-ink/30 focus:ring-4 focus:ring-lime/40";

  return (
    <ModalCtx.Provider value={{ open }}>
      {children}

      {/* ── модалка ── */}
      <div
        className={`fixed inset-0 z-[100] flex justify-center transition-opacity duration-300 sm:items-center sm:p-6 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!isOpen}
      >
        {/* підкладка */}
        <button
          type="button"
          aria-label="Закрити"
          onClick={close}
          className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
          tabIndex={isOpen ? 0 : -1}
        />

        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="signup-modal-title"
          className={`relative flex h-full w-full flex-col overflow-y-auto bg-cream shadow-2xl transition-all duration-300 sm:h-auto sm:max-h-[92vh] sm:max-w-md sm:rounded-[1.75rem] ${
            isOpen
              ? "translate-y-0 scale-100"
              : "translate-y-8 sm:translate-y-6 sm:scale-95"
          }`}
        >
          {/* шапка */}
          <div className="relative shrink-0 overflow-hidden bg-ink px-7 pb-8 pt-10 sm:rounded-t-[1.75rem] sm:pb-7 sm:pt-8">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full opacity-50 blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, #DEFF3C, #F4A8F2, transparent 70%)",
              }}
            />
            <button
              type="button"
              onClick={close}
              aria-label="Закрити форму"
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              tabIndex={isOpen ? 0 : -1}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                <path
                  d="M18 6 6 18M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <h2
              id="signup-modal-title"
              className="relative max-w-[15rem] text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-2xl"
            >
              {finalCta.formTitle}
            </h2>
            <p className="relative mt-2.5 text-sm text-white/55">
              Залиш контакти — напишу особисто й відповім на питання.
            </p>
            <span className="relative mt-4 inline-block rounded-full bg-lime px-3.5 py-1.5 text-xs font-bold text-ink">
              {pricing.plan.currency}
              {pricing.plan.price} · усе включено
            </span>
          </div>

          {/* форма */}
          <form onSubmit={onSubmit} noValidate className="flex flex-1 flex-col px-7 pb-8 pt-6 sm:pb-7">
            {status === "ok" ? (
              <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-lime">
                  <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none">
                    <path
                      d="m5 13 4 4L19 7"
                      stroke="currentColor"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <p className="mt-5 text-lg font-extrabold">Заявку прийнято!</p>
                <p className="mt-2 text-sm text-ink/60">
                  Зв&apos;яжусь із тобою найближчим часом.
                </p>
                <a
                  href={brand.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2.5 rounded-full bg-ink px-6 py-3.5 text-sm font-bold text-white transition hover:bg-ink/85"
                >
                  <TelegramIcon className="h-4 w-4" />
                  написати одразу
                </a>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-3.5">
                  <div>
                    <label
                      htmlFor="m-name"
                      className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink/50"
                    >
                      Ім&apos;я *
                    </label>
                    <input
                      ref={firstFieldRef}
                      id="m-name"
                      name="name"
                      className={field}
                      placeholder="Як до тебе звертатись"
                      tabIndex={isOpen ? 0 : -1}
                    />
                    {errors.name && (
                      <p className="mt-1.5 text-xs text-red-600">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="m-phone"
                      className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink/50"
                    >
                      Телефон *
                    </label>
                    <input
                      id="m-phone"
                      name="phone"
                      type="tel"
                      className={field}
                      placeholder="+380 __ ___ __ __"
                      tabIndex={isOpen ? 0 : -1}
                    />
                    {errors.phone && (
                      <p className="mt-1.5 text-xs text-red-600">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="m-email"
                      className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink/50"
                    >
                      Email
                    </label>
                    <input
                      id="m-email"
                      name="email"
                      type="email"
                      className={field}
                      placeholder="you@example.com"
                      tabIndex={isOpen ? 0 : -1}
                    />
                    {errors.email && (
                      <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="m-note"
                      className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink/50"
                    >
                      Питання (необов&apos;язково)
                    </label>
                    <textarea
                      id="m-note"
                      name="note"
                      rows={2}
                      className={`${field} resize-none`}
                      placeholder="Що хочеш дізнатись перед стартом?"
                      tabIndex={isOpen ? 0 : -1}
                    />
                  </div>

                  <label className="flex cursor-pointer gap-3 pt-1 text-xs leading-relaxed text-ink/60">
                    <input
                      type="checkbox"
                      name="consent"
                      className="mt-0.5 h-4 w-4 shrink-0 accent-lime"
                      tabIndex={isOpen ? 0 : -1}
                    />
                    <span>Погоджуюсь на обробку персональних даних *</span>
                  </label>
                  {errors.consent && (
                    <p className="text-xs text-red-600">{errors.consent}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={status === "sending"}
                  tabIndex={isOpen ? 0 : -1}
                  className="group mt-8 inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-full bg-lime px-6 py-[18px] text-sm font-bold uppercase tracking-wide transition hover:brightness-95 disabled:opacity-60 sm:mt-6 sm:py-4"
                >
                  {status === "sending" ? "Надсилаємо…" : "Залишити заявку"}
                  {status !== "sending" && (
                    <Arrow className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  )}
                </button>

                <p aria-live="polite" className="mt-3 min-h-[1rem] text-center text-xs">
                  {status === "error" && (
                    <span className="font-semibold text-red-600">
                      Не вдалось надіслати. Напиши в Telegram.
                    </span>
                  )}
                </p>
              </>
            )}
          </form>
        </div>
      </div>
    </ModalCtx.Provider>
  );
}

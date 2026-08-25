"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { brand, qualification, thankYou } from "@/content";
import { track, getUtm } from "@/lib/analytics";
import { TelegramIcon } from "./ui";

type Status = "idle" | "sending" | "ok" | "error";

const ApplyCtx = createContext<{ open: () => void }>({ open: () => {} });
export const useApply = () => useContext(ApplyCtx);

export function ApplyProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const totalSteps = qualification.questions.length + 1; // + контакти

  const open = useCallback(() => {
    returnFocus.current = document.activeElement as HTMLElement;
    setStep(0);
    setAnswers({});
    setErrors({});
    setStatus("idle");
    setIsOpen(true);
    track("quiz_start");
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

  function pick(id: string, value: string) {
    setAnswers((a) => ({ ...a, [id]: value }));
    // невелика пауза, щоб користувач побачив вибір
    setTimeout(() => setStep((s) => Math.min(s + 1, totalSteps - 1)), 180);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;

    const next: Record<string, string> = {};
    if (!data.name?.trim()) next.name = "Вкажіть імʼя";
    if (!/^[+\d][\d\s()\-]{8,}$/.test(data.phone?.trim() ?? ""))
      next.phone = "Вкажіть коректний номер телефону";
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim()))
      next.email = "Схоже, в email є помилка";

    setErrors(next);
    if (Object.keys(next).length) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, ...answers, utm: getUtm() }),
      });
      if (!res.ok) throw new Error("bad response");
      setStatus("ok");
      track("quiz_complete");
      track("application_submit", answers);
    } catch {
      setStatus("error");
    }
  }

  // text-base на мобільному — iOS зумить сторінку, якщо шрифт < 16px.
  const field =
    "w-full rounded-2xl border border-ink/10 bg-white px-5 py-3.5 text-base outline-none transition placeholder:text-ink/35 focus:border-ink/30 focus:ring-4 focus:ring-lime/40 sm:text-sm";

  const question = qualification.questions[step];
  const isContactStep = step === qualification.questions.length;

  return (
    <ApplyCtx.Provider value={{ open }}>
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
          aria-label={qualification.title}
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

          {status === "ok" ? (
            /* ── екран подяки ── */
            <div className="overflow-y-auto px-5 py-10 text-center sm:px-7 sm:py-12">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-lime">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                     strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-ink">
                  <path d="m5 13 4 4L19 7" />
                </svg>
              </span>

              <h2 className="mt-7 text-2xl font-extrabold tracking-tight sm:text-3xl">
                {thankYou.title}
              </h2>
              <p className="mt-4 text-sm font-semibold text-ink/50">{thankYou.subtitle}</p>

              <ol className="mx-auto mt-6 max-w-sm space-y-3 text-left">
                {thankYou.steps.map((s, i) => (
                  <li key={s} className="flex gap-3 text-sm text-ink/70">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink/5 text-xs font-bold">
                      {i + 1}
                    </span>
                    {s}
                  </li>
                ))}
              </ol>

              <a
                href={brand.telegram}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("telegram_click", { source: "thank_you" })}
                className="mt-8 inline-flex min-h-14 items-center gap-2.5 rounded-full bg-ink px-8 text-sm font-bold uppercase tracking-wide text-white transition active:brightness-125 sm:hover:brightness-110"
              >
                <TelegramIcon className="h-4 w-4" />
                {thankYou.cta}
              </a>
            </div>
          ) : (
            <>
              {/* ── прогрес ── */}
              <div className="px-5 pt-6 sm:px-7 sm:pt-8">
                {/* pr-14 — щоб смужки не заповзали під кнопку закриття */}
                <div className="flex gap-1.5 pr-14">
                  {Array.from({ length: totalSteps }).map((_, i) => (
                    <span
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                        i <= step ? "bg-pink-deep" : "bg-ink/10"
                      }`}
                    />
                  ))}
                </div>

                <h2 className="mt-5 text-lg font-extrabold leading-snug tracking-tight sm:mt-6 sm:text-2xl">
                  {step === 0 ? qualification.title : question?.label ?? "Контакти"}
                </h2>
                {step === 0 && (
                  <p className="mt-2 text-[13px] leading-relaxed text-ink/55 sm:text-sm">
                    {qualification.subtitle}
                  </p>
                )}
              </div>

              <div className="overflow-y-auto px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5 sm:px-7 sm:pb-8 sm:pt-6">
                {!isContactStep && question ? (
                  <>
                    {step === 0 && (
                      <p className="mb-3.5 text-sm font-semibold">{question.label}</p>
                    )}
                    <div className="space-y-2">
                      {question.options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => pick(question.id, opt)}
                          className={`flex min-h-[52px] w-full items-center rounded-2xl border px-5 text-left text-[15px] transition sm:min-h-0 sm:py-3.5 sm:text-sm ${
                            answers[question.id] === opt
                              ? "border-ink bg-ink text-white"
                              : "border-ink/10 bg-white active:border-ink/40 active:bg-ink/[0.03] sm:hover:border-ink/30"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  /* ── контакти ── */
                  <form onSubmit={onSubmit} noValidate className="space-y-3">
                    <div>
                      <input name="name" placeholder="Імʼя" className={field} />
                      {errors.name && (
                        <p className="mt-1.5 text-xs text-red-600">{errors.name}</p>
                      )}
                    </div>
                    <div>
                      <input name="phone" placeholder="Телефон" className={field} />
                      {errors.phone && (
                        <p className="mt-1.5 text-xs text-red-600">{errors.phone}</p>
                      )}
                    </div>
                    <div>
                      <input
                        name="email"
                        type="email"
                        placeholder="Email (необовʼязково)"
                        className={field}
                      />
                      {errors.email && (
                        <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>
                      )}
                    </div>

                    {status === "error" && (
                      <p className="text-sm text-red-600">
                        Не вдалося надіслати заявку. Спробуйте ще раз або напишіть нам у Telegram.
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="flex min-h-14 w-full items-center justify-center rounded-full bg-lime px-8 text-sm font-bold uppercase tracking-wide text-ink transition active:brightness-90 disabled:opacity-50 sm:hover:brightness-95"
                    >
                      {status === "sending" ? "надсилаємо…" : qualification.submit}
                    </button>
                  </form>
                )}

                {step > 0 && (
                  <button
                    onClick={() => setStep((s) => s - 1)}
                    className="-ml-2 mt-4 inline-flex min-h-11 items-center px-2 text-xs font-bold uppercase tracking-widest text-ink/45 transition active:text-ink sm:hover:text-ink"
                  >
                    ← назад
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </ApplyCtx.Provider>
  );
}

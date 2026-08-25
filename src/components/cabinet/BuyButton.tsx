"use client";

import { useState } from "react";

export default function BuyButton({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(
      new FormData(e.currentTarget)
    ) as Record<string, string>;

    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.url) throw new Error(json.error ?? "error");
      // Переходимо на сторінку оплати monobank.
      window.location.href = json.url;
    } catch {
      setStatus("error");
      setError("Не вдалося створити рахунок. Спробуй ще раз або напиши нам.");
    }
  }

  const field =
    "w-full rounded-2xl border border-ink/10 bg-white px-5 py-3.5 text-sm outline-none transition placeholder:text-ink/35 focus:border-ink/30 focus:ring-4 focus:ring-lime/40";

  return (
    <>
      <button onClick={() => setOpen(true)} className={className}>
        {children}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-ink/50 p-5 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-4xl bg-white p-7 sm:p-9"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl">
              Оформлення курсу
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink/55">
              Доступ до кабінету відкриється одразу після оплати —
              на цю пошту.
            </p>

            <form onSubmit={onSubmit} className="mt-6 space-y-3">
              <input
                name="name"
                required
                placeholder="Ім'я та прізвище"
                className={field}
              />
              <input
                name="email"
                type="email"
                required
                placeholder="Email — сюди прийде доступ"
                className={field}
              />
              <input name="phone" placeholder="Телефон (необовʼязково)" className={field} />

              {status === "error" && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full rounded-full bg-ink px-8 py-4 text-sm font-bold uppercase tracking-wide text-white transition hover:brightness-110 disabled:opacity-50"
              >
                {status === "sending" ? "створюємо рахунок…" : "перейти до оплати"}
              </button>

              <p className="pt-1 text-center text-xs text-ink/40">
                Оплата карткою через monobank
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

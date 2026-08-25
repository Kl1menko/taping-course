"use client";

import { useState } from "react";
import { finalCta, pricing } from "@/content";
import { Arrow, Reveal } from "./ui";

type Status = "idle" | "sending" | "ok" | "error";

export default function Signup() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    "w-full rounded-2xl border border-ink/10 bg-white px-5 py-4 text-sm outline-none transition placeholder:text-ink/35 focus:border-ink/30 focus:ring-4 focus:ring-lime/40";

  return (
    <section id="signup" className="px-[10px] py-16 sm:py-24">
      <div className="w-full overflow-hidden bg-ink">
        <div className="grid gap-10 p-6 sm:p-12 lg:grid-cols-2 lg:p-16">
          <Reveal>
            <div className="flex h-full flex-col justify-center">
              <h2 className="text-3xl font-extrabold uppercase leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
                {finalCta.title}
              </h2>
              <p className="mt-5 max-w-md text-base text-white/60">{finalCta.subtitle}</p>

              <div className="mt-10 flex flex-wrap gap-2.5">
                <span className="rounded-full bg-lime px-4 py-2 text-xs font-bold text-ink">
                  {pricing.plan.currency}
                  {pricing.plan.price} — усе включено
                </span>
                {pricing.plan.rows.map((r) => (
                  <span
                    key={r.k}
                    className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-white/70"
                  >
                    {r.v}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <form
              onSubmit={onSubmit}
              noValidate
              className="rounded-5xl bg-cream p-6 sm:p-9"
            >
              <h3 className="text-xl font-extrabold">{finalCta.formTitle}</h3>

              <div className="mt-6 space-y-4">
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink/50">
                    Ім'я *
                  </label>
                  <input id="name" name="name" className={field} placeholder="Як до тебе звертатись" />
                  {errors.name && <p className="mt-1.5 text-xs text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink/50">
                    Телефон *
                  </label>
                  <input id="phone" name="phone" type="tel" className={field} placeholder="+380 __ ___ __ __" />
                  {errors.phone && <p className="mt-1.5 text-xs text-red-600">{errors.phone}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink/50">
                    Email
                  </label>
                  <input id="email" name="email" type="email" className={field} placeholder="you@example.com" />
                  {errors.email && <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="note" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink/50">
                    Питання (необов'язково)
                  </label>
                  <textarea
                    id="note"
                    name="note"
                    rows={3}
                    className={`${field} resize-none`}
                    placeholder="Що хочеш дізнатись перед стартом?"
                  />
                </div>

                <label className="flex cursor-pointer gap-3 text-xs leading-relaxed text-ink/60">
                  <input
                    type="checkbox"
                    name="consent"
                    className="mt-0.5 h-4 w-4 shrink-0 accent-lime"
                  />
                  <span>Погоджуюсь на обробку персональних даних *</span>
                </label>
                {errors.consent && <p className="text-xs text-red-600">{errors.consent}</p>}
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="group mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-lime px-6 py-4 text-sm font-bold uppercase tracking-wide transition hover:brightness-95 disabled:opacity-60"
              >
                {status === "sending" ? "Надсилаємо…" : "Залишити заявку"}
                {status !== "sending" && (
                  <Arrow className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                )}
              </button>

              <p aria-live="polite" className="mt-4 min-h-[1.25rem] text-center text-sm">
                {status === "ok" && (
                  <span className="font-semibold text-green-700">
                    Готово! Зв'яжемось з тобою найближчим часом.
                  </span>
                )}
                {status === "error" && (
                  <span className="font-semibold text-red-600">
                    Не вдалось надіслати. Спробуй ще раз або напиши в Telegram.
                  </span>
                )}
              </p>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

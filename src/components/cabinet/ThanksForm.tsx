"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { brand } from "@/content";

// Сторінка після оплати. Людина щойно заплатила, але сесії ще немає —
// тому одразу пропонуємо надіслати посилання для входу, а не кидаємо
// на порожню форму логіну.
export default function ThanksForm() {
  const params = useSearchParams();
  const [email, setEmail] = useState(params.get("email") ?? "");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/cabinet`,
      },
    });

    setStatus(error ? "error" : "sent");
  }

  return (
    <div className="w-full max-w-md rounded-4xl border border-ink/10 bg-white p-9">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-lime">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
             strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-ink">
          <path d="m5 13 4 4L19 7" />
        </svg>
      </span>

      <h1 className="mt-6 text-2xl font-extrabold tracking-tight sm:text-3xl">
        Оплату отримано
      </h1>

      {status === "sent" ? (
        <p className="mt-4 text-sm leading-relaxed text-ink/60">
          Посилання для входу надіслано на <strong>{email}</strong>.
          Перейди за ним — і кабінет відкриється. Воно діє одну годину.
        </p>
      ) : (
        <>
          <p className="mt-4 text-sm leading-relaxed text-ink/60">
            Вітаємо в курсі. Введи пошту, на яку оформлював оплату —
            надішлемо посилання для входу в кабінет. Пароль не потрібен.
          </p>

          <form onSubmit={onSubmit} className="mt-7">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-2xl border border-ink/15 bg-white px-4 py-3.5 text-base outline-none transition focus:border-ink/40"
            />

            {status === "error" && (
              <p className="mt-3 text-sm text-red-600">
                Не вдалося надіслати лист. Спробуй ще раз або напиши нам.
              </p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="mt-5 w-full rounded-full bg-ink px-8 py-4 text-sm font-bold uppercase tracking-wide text-white transition hover:brightness-110 disabled:opacity-50"
            >
              {status === "sending" ? "надсилаємо…" : "надіслати посилання"}
            </button>
          </form>
        </>
      )}

      <p className="mt-6 text-xs leading-relaxed text-ink/45">
        Доступ не відкрився?{" "}
        <a
          href={brand.telegram}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-pink-deep underline underline-offset-2"
        >
          Напиши нам
        </a>{" "}
        — розберемось. Або{" "}
        <Link href="/cabinet" className="font-semibold text-pink-deep underline underline-offset-2">
          спробуй кабінет
        </Link>
        , якщо вже входив раніше.
      </p>
    </div>
  );
}

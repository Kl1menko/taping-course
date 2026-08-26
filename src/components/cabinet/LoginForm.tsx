"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Mode = "code" | "email";

// Основний спосіб входу — код доступу з екрана оплати: він працює
// без пошти, а поки немає власного домену, magic link доходить
// лише на пошту власника акаунта Resend. Лист лишено другим варіантом —
// він увімкнеться сам, щойно домен буде підключено.
export default function LoginForm() {
  const params = useSearchParams();
  const router = useRouter();
  const next = params.get("next") ?? "/cabinet";
  const expired = params.get("error") === "expired";

  const [mode, setMode] = useState<Mode>("code");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onCodeSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    const res = await fetch("/api/code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim().toLowerCase(), code }),
    });

    if (res.ok) {
      router.replace(next);
      router.refresh();
      return;
    }

    setStatus("error");
    setMessage(
      res.status === 429
        ? "Забагато спроб. Напиши нам — відкриємо доступ вручну."
        : "Пошта або код не підійшли. Перевір ще раз."
    );
  }

  async function onEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });

    if (error) {
      setStatus("error");
      setMessage("Не вдалося надіслати лист. Спробуй увійти за кодом.");
      return;
    }
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="w-full max-w-md rounded-4xl border border-ink/10 bg-white p-9 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-lime">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
               strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-ink">
            <path d="M4 6h16v12H4z" /><path d="m4 7 8 6 8-6" />
          </svg>
        </span>
        <h1 className="mt-6 text-2xl font-extrabold tracking-tight">Перевір пошту</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink/60">
          Ми надіслали посилання для входу на <strong>{email}</strong>.
          Воно діє одну годину.
        </p>
        <button
          onClick={() => { setStatus("idle"); setMode("code"); }}
          className="mt-6 text-sm font-semibold text-pink-deep underline underline-offset-4"
        >
          Увійти за кодом
        </button>
      </div>
    );
  }

  const inputClass =
    "mt-2 w-full rounded-2xl border border-ink/15 bg-white px-4 py-3.5 text-base outline-none transition focus:border-ink/40";
  const labelClass = "text-xs font-bold uppercase tracking-widest text-ink/50";

  return (
    <div className="w-full max-w-md rounded-4xl border border-ink/10 bg-white p-9">
      <Link href="/" className="text-xs font-bold uppercase tracking-widest text-ink/40">
        ← на головну
      </Link>
      <h1 className="mt-5 text-2xl font-extrabold tracking-tight sm:text-3xl">
        Вхід у кабінет
      </h1>

      {expired && (
        <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
          Посилання застаріло. Увійди за кодом доступу.
        </p>
      )}

      {mode === "code" ? (
        <>
          <p className="mt-3 text-sm leading-relaxed text-ink/60">
            Введи пошту, на яку оформлював курс, і код доступу —
            той, що показався після оплати.
          </p>

          <form onSubmit={onCodeSubmit} className="mt-7">
            <label htmlFor="email" className={labelClass}>Email</label>
            <input
              id="email" type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com" className={inputClass}
            />

            <label htmlFor="code" className={`${labelClass} mt-5 block`}>Код доступу</label>
            <input
              id="code" inputMode="numeric" autoComplete="one-time-code"
              required maxLength={6} value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="000000"
              className={`${inputClass} font-mono tracking-[0.3em]`}
            />

            {status === "error" && (
              <p className="mt-3 text-sm text-red-600">{message}</p>
            )}

            <button
              type="submit" disabled={status === "sending"}
              className="mt-5 w-full rounded-full bg-ink px-8 py-4 text-sm font-bold uppercase tracking-wide text-white transition hover:brightness-110 disabled:opacity-50"
            >
              {status === "sending" ? "перевіряємо…" : "увійти"}
            </button>
          </form>
        </>
      ) : (
        <>
          <p className="mt-3 text-sm leading-relaxed text-ink/60">
            Надішлемо посилання для входу на пошту. Пароль не потрібен.
          </p>

          <form onSubmit={onEmailSubmit} className="mt-7">
            <label htmlFor="email-only" className={labelClass}>Email</label>
            <input
              id="email-only" type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com" className={inputClass}
            />

            {status === "error" && (
              <p className="mt-3 text-sm text-red-600">{message}</p>
            )}

            <button
              type="submit" disabled={status === "sending"}
              className="mt-5 w-full rounded-full bg-ink px-8 py-4 text-sm font-bold uppercase tracking-wide text-white transition hover:brightness-110 disabled:opacity-50"
            >
              {status === "sending" ? "надсилаємо…" : "надіслати посилання"}
            </button>
          </form>
        </>
      )}

      <button
        onClick={() => { setMode(mode === "code" ? "email" : "code"); setStatus("idle"); }}
        className="mt-6 text-sm font-semibold text-pink-deep underline underline-offset-4"
      >
        {mode === "code" ? "Немає коду? Увійти через пошту" : "Увійти за кодом доступу"}
      </button>

      <p className="mt-6 text-xs leading-relaxed text-ink/45">
        Ще не купував курс?{" "}
        <Link href="/#pricing" className="font-semibold text-pink-deep underline underline-offset-2">
          Подивитись вартість
        </Link>
      </p>
    </div>
  );
}

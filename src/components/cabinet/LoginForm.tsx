"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const params = useSearchParams();
  const next = params.get("next") ?? "/cabinet";
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
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
      setMessage("Не вдалося надіслати лист. Спробуй ще раз або напиши нам.");
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
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-semibold text-pink-deep underline underline-offset-4"
        >
          Ввести іншу пошту
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md rounded-4xl border border-ink/10 bg-white p-9">
      <Link href="/" className="text-xs font-bold uppercase tracking-widest text-ink/40">
        ← на головну
      </Link>
      <h1 className="mt-5 text-2xl font-extrabold tracking-tight sm:text-3xl">
        Вхід у кабінет
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-ink/60">
        Введи пошту, на яку оформлював курс — надішлемо посилання для входу.
        Пароль не потрібен.
      </p>

      <form onSubmit={onSubmit} className="mt-7">
        <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-ink/50">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="mt-2 w-full rounded-2xl border border-ink/15 bg-white px-4 py-3.5 text-base outline-none transition focus:border-ink/40"
        />

        {status === "error" && (
          <p className="mt-3 text-sm text-red-600">{message}</p>
        )}

        <button
          type="submit"
          disabled={status === "sending"}
          className="mt-5 w-full rounded-full bg-ink px-8 py-4 text-sm font-bold uppercase tracking-wide text-white transition hover:brightness-110 disabled:opacity-50"
        >
          {status === "sending" ? "надсилаємо…" : "надіслати посилання"}
        </button>
      </form>

      <p className="mt-6 text-xs leading-relaxed text-ink/45">
        Ще не купував курс?{" "}
        <Link href="/#pricing" className="font-semibold text-pink-deep underline underline-offset-2">
          Подивитись вартість
        </Link>
      </p>
    </div>
  );
}

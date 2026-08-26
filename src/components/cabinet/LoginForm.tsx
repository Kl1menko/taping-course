"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { brand } from "@/content";

// Вхід — лише через Telegram-бота: він упізнає людину за номером,
// який Telegram віддає верифікованим. Пошта як канал недоступна,
// поки немає власного домену під Resend, а SMS потребували б Twilio.
export default function LoginForm({ bot }: { bot: string | null }) {
  const params = useSearchParams();
  const expired = params.get("error") === "expired";
  const failed = params.get("error") === "failed";

  return (
    <div className="w-full max-w-md rounded-4xl border border-ink/10 bg-white p-9">
      <Link href="/" className="text-xs font-bold uppercase tracking-widest text-ink/40">
        ← на головну
      </Link>

      <h1 className="mt-5 text-2xl font-extrabold tracking-tight sm:text-3xl">
        Вхід у кабінет
      </h1>

      {(expired || failed) && (
        <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {expired
            ? "Посилання застаріло — воно діє 15 хвилин. Отримай нове в боті."
            : "Не вдалося увійти. Спробуй ще раз через бота."}
        </p>
      )}

      <p className="mt-3 text-sm leading-relaxed text-ink/60">
        Натисни кнопку — бот упізнає тебе за номером телефону,
        на який оформлено курс, і відкриє кабінет. Пароль не потрібен.
      </p>

      {bot ? (
        <a
          href={`https://t.me/${bot}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 flex w-full items-center justify-center gap-2.5 rounded-full bg-ink px-8 py-4 text-sm font-bold uppercase tracking-wide text-white transition hover:brightness-110"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
            <path d="M21.9 4.3 18.6 20a1.2 1.2 0 0 1-1.9.7l-4.4-3.2-2.1 2a.8.8 0 0 1-1.3-.4l-1.6-5.3-4.4-1.4c-.9-.3-.9-1.5 0-1.8l17.3-6.7c.8-.3 1.6.4 1.7 1.4Z" />
          </svg>
          увійти через telegram
        </a>
      ) : (
        <p className="mt-7 rounded-2xl bg-ink/5 px-4 py-3 text-sm text-ink/60">
          Бот тимчасово недоступний. Напиши нам — відкриємо доступ вручну.
        </p>
      )}

      <div className="mt-7 space-y-2.5 border-t border-ink/10 pt-6 text-xs leading-relaxed text-ink/50">
        <p>
          <strong className="text-ink/70">Немає Telegram або інший номер?</strong>{" "}
          <a
            href={brand.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-pink-deep underline underline-offset-2"
          >
            Напиши нам
          </a>{" "}
          — відкриємо доступ вручну, це швидко.
        </p>
        <p>
          Ще не купував курс?{" "}
          <Link href="/#pricing" className="font-semibold text-pink-deep underline underline-offset-2">
            Подивитись вартість
          </Link>
        </p>
      </div>
    </div>
  );
}

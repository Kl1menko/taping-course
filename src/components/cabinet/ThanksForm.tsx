"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { brand } from "@/content";

type State = "checking" | "ready" | "failed";

// Сторінка після оплати. Сесія ставиться одразу: /api/claim звіряє
// рахунок із monobank і кладе куки — людина вже в кабінеті.
// Кнопка Telegram поруч, щоб вона могла повернутись із будь-якого
// пристрою: бот упізнає її за номером.
export default function ThanksForm() {
  const params = useSearchParams();
  const router = useRouter();
  const ref = params.get("ref");

  const [state, setState] = useState<State>("checking");
  const [signedIn, setSignedIn] = useState(false);
  const [tgUrl, setTgUrl] = useState<string | null>(null);
  // React у dev монтує двічі — без цього claim пішов би двічі
  // і другий раз отримав би 409 «already used».
  const claimed = useRef(false);

  useEffect(() => {
    if (!ref || claimed.current) return;
    claimed.current = true;

    (async () => {
      try {
        const res = await fetch("/api/claim", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ref }),
        });
        const data = await res.json();

        if (!res.ok) {
          setState("failed");
          return;
        }
        setSignedIn(Boolean(data.ok));
        setState("ready");
        // Сесія вже в куках — оновлюємо серверні компоненти,
        // щоб шапка й /cabinet побачили залогіненого користувача.
        if (data.ok) router.refresh();
      } catch {
        setState("failed");
      }
    })();

    fetch("/api/telegram/link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ref }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d?.url && setTgUrl(d.url))
      .catch(() => {});
  }, [ref, router]);

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

      {state === "checking" && (
        <p className="mt-4 text-sm leading-relaxed text-ink/60">
          Підтверджуємо оплату й відкриваємо доступ…
        </p>
      )}

      {state === "ready" && (
        <>
          <p className="mt-4 text-sm leading-relaxed text-ink/60">
            {signedIn
              ? "Вітаємо в курсі — кабінет уже відкрито."
              : "Доступ відкрито. Увійти можна через Telegram."}
          </p>

          {signedIn && (
            <Link
              href="/cabinet"
              className="mt-7 block w-full rounded-full bg-ink px-8 py-4 text-center text-sm font-bold uppercase tracking-wide text-white transition hover:brightness-110"
            >
              перейти в кабінет
            </Link>
          )}

          {tgUrl && (
            <>
              <a
                href={tgUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex w-full items-center justify-center gap-2.5 rounded-full px-8 py-4 text-sm font-bold uppercase tracking-wide transition ${
                  signedIn
                    ? "mt-3 border border-ink/15 text-ink hover:bg-ink/5"
                    : "mt-7 bg-ink text-white hover:brightness-110"
                }`}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path d="M21.9 4.3 18.6 20a1.2 1.2 0 0 1-1.9.7l-4.4-3.2-2.1 2a.8.8 0 0 1-1.3-.4l-1.6-5.3-4.4-1.4c-.9-.3-.9-1.5 0-1.8l17.3-6.7c.8-.3 1.6.4 1.7 1.4Z" />
                </svg>
                зберегти доступ у telegram
              </a>
              <p className="mt-3 text-center text-xs leading-relaxed text-ink/45">
                Так ти зайдеш у кабінет з будь-якого пристрою —
                бот упізнає тебе за номером.
              </p>
            </>
          )}
        </>
      )}

      {state === "failed" && (
        <>
          <p className="mt-4 text-sm leading-relaxed text-ink/60">
            Не вдалося підтвердити оплату автоматично. Якщо гроші
            списались — напиши нам, відкриємо доступ вручну.
          </p>
          <a
            href={brand.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 block w-full rounded-full bg-ink px-8 py-4 text-center text-sm font-bold uppercase tracking-wide text-white transition hover:brightness-110"
          >
            написати нам
          </a>
        </>
      )}

      <p className="mt-6 border-t border-ink/10 pt-6 text-xs leading-relaxed text-ink/45">
        Щось пішло не так?{" "}
        <a
          href={brand.telegram}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-pink-deep underline underline-offset-2"
        >
          Напиши нам
        </a>{" "}
        — розберемось. Або{" "}
        <Link href="/login" className="font-semibold text-pink-deep underline underline-offset-2">
          увійди через бота
        </Link>
        .
      </p>
    </div>
  );
}

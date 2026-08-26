"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { brand } from "@/content";

type State =
  | { step: "checking" }
  | { step: "ready"; code: string; signedIn: boolean }
  | { step: "failed" };

// Сторінка після оплати. Людина щойно заплатила — сесії ще немає,
// але пошта як канал недоступна (немає домену під Resend), тому
// входимо одразу: /api/claim звіряє рахунок із monobank і ставить куки.
export default function ThanksForm() {
  const params = useSearchParams();
  const router = useRouter();
  const ref = params.get("ref");

  const [state, setState] = useState<State>({ step: "checking" });
  const [tgUrl, setTgUrl] = useState<string | null>(null);
  // React 18+ у dev монтує двічі — без цього claim пішов би двічі
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
          setState({ step: "failed" });
          return;
        }
        setState({ step: "ready", code: data.code, signedIn: data.ok });
        // Сесія вже в куках — оновлюємо серверні компоненти,
        // щоб шапка й /cabinet побачили залогіненого користувача.
        if (data.ok) router.refresh();
      } catch {
        setState({ step: "failed" });
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

      {state.step === "checking" && (
        <p className="mt-4 text-sm leading-relaxed text-ink/60">
          Підтверджуємо оплату й відкриваємо доступ…
        </p>
      )}

      {state.step === "ready" && (
        <>
          <p className="mt-4 text-sm leading-relaxed text-ink/60">
            {state.signedIn
              ? "Вітаємо в курсі — кабінет уже відкрито."
              : "Доступ відкрито. Увійти можна за кодом нижче."}
          </p>

          <div className="mt-7 rounded-2xl border border-ink/15 bg-ink/[0.03] p-5 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-ink/50">
              Код доступу
            </p>
            <p className="mt-2 font-mono text-3xl font-extrabold tracking-[0.3em] text-ink">
              {state.code}
            </p>
            <p className="mt-3 text-xs leading-relaxed text-ink/50">
              Збережи його. За ним заходиш з будь-якого пристрою
              на сторінці входу — пароль і пошта не потрібні.
            </p>
          </div>

          {state.signedIn && (
            <Link
              href="/cabinet"
              className="mt-5 block w-full rounded-full bg-ink px-8 py-4 text-center text-sm font-bold uppercase tracking-wide text-white transition hover:brightness-110"
            >
              перейти в кабінет
            </Link>
          )}

          {tgUrl && (
            <a
              href={tgUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 block w-full rounded-full border border-ink/15 px-8 py-4 text-center text-sm font-bold uppercase tracking-wide text-ink transition hover:bg-ink/5"
            >
              зберегти доступ у telegram
            </a>
          )}
        </>
      )}

      {state.step === "failed" && (
        <>
          <p className="mt-4 text-sm leading-relaxed text-ink/60">
            Не вдалося підтвердити оплату автоматично. Якщо гроші
            списались — напиши нам, відкриємо доступ вручну.
          </p>
          <a
            href={brand.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 block w-full rounded-full bg-ink px-8 py-4 text-center text-sm font-bold uppercase tracking-wide text-white transition hover:brightness-110"
          >
            написати нам
          </a>
        </>
      )}

      <p className="mt-6 text-xs leading-relaxed text-ink/45">
        Питання по доступу —{" "}
        <a
          href={brand.telegram}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-pink-deep underline underline-offset-2"
        >
          напиши нам
        </a>
        . Або{" "}
        <Link href="/login" className="font-semibold text-pink-deep underline underline-offset-2">
          увійди за кодом
        </Link>
        .
      </p>
    </div>
  );
}

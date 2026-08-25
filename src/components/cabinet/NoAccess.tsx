import Link from "next/link";
import { brand, offer } from "@/content";
import { createClient } from "@/lib/supabase/server";

// Показується тому, хто ВЖЕ увійшов, але доступу до курсу не має.
// Неавторизованих сюди не пускає middleware — він веде їх на /login.
export default async function NoAccess() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-5 py-12 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-ink/5">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
             strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-ink/40">
          <rect x="4" y="10" width="16" height="11" rx="2" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </svg>
      </span>

      <h1 className="mt-7 text-2xl font-extrabold tracking-tight sm:text-3xl">
        Доступ ще не відкрито
      </h1>

      {user?.email && (
        // Головна причина цього екрана в реальності — вхід не тією поштою,
        // на яку куплено курс. Тому показуємо, під ким людина зайшла.
        <p className="mt-4 text-sm text-ink/55">
          Ти увійшов як{" "}
          <strong className="font-semibold text-ink">{user.email}</strong>
        </p>
      )}

      <p className="mt-3 text-sm leading-relaxed text-ink/60 sm:text-base">
        На цю пошту курс ще не оплачено. Якщо ти оплачував іншою —
        увійди нею. А якщо щойно оплатив, доступ зʼявиться протягом
        кількох хвилин: онови сторінку.
      </p>

      <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <Link
          href="/#offer"
          className="flex min-h-14 items-center justify-center rounded-full bg-ink px-8 text-sm font-bold uppercase tracking-wide text-white transition active:brightness-125 sm:hover:brightness-110"
        >
          {offer.price !== null
            ? `придбати курс — ${offer.price.toLocaleString("uk-UA")} ${offer.currency}`
            : "дізнатися про курс"}
        </Link>
        <a
          href={brand.telegram}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-14 items-center justify-center rounded-full border border-ink/15 px-8 text-sm font-bold uppercase tracking-wide transition active:bg-ink active:text-white sm:hover:bg-ink sm:hover:text-white"
        >
          написати нам
        </a>
      </div>

      {/* Вийти й зайти іншою поштою — найчастіший реальний сценарій. */}
      <form action="/auth/signout" method="post" className="mt-7">
        <input type="hidden" name="next" value="/login" />
        <button className="text-sm font-semibold text-ink/50 underline underline-offset-4 transition hover:text-ink">
          Увійти іншою поштою
        </button>
      </form>
    </main>
  );
}

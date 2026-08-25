import Link from "next/link";
import { brand, offer } from "@/content";

export default function NoAccess() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-5 text-center">
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
      <p className="mt-4 text-sm leading-relaxed text-ink/60 sm:text-base">
        Схоже, курс на цю пошту ще не оплачено. Якщо ти щойно оплатив —
        доступ зʼявиться протягом кількох хвилин, онови сторінку.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/#offer"
          className="rounded-full bg-ink px-8 py-4 text-sm font-bold uppercase tracking-wide text-white transition hover:brightness-110"
        >
          {offer.price !== null
            ? `придбати курс — ${offer.price.toLocaleString("uk-UA")} ${offer.currency}`
            : "дізнатися про курс"}
        </Link>
        <a
          href={brand.telegram}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-ink/15 px-8 py-4 text-sm font-bold uppercase tracking-wide transition hover:bg-ink hover:text-white"
        >
          написати нам
        </a>
      </div>
    </main>
  );
}

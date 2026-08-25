import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { brand } from "@/content";

export const metadata: Metadata = {
  title: "Кабінет — Kotova Taping Course",
  robots: { index: false, follow: false },
};

// Кабінет відкривають переважно з телефона, часто в залі чи на практиці —
// тому інтерфейс мобільний-first: великі дотикові цілі, мінімум хрому.
export const viewport = {
  themeColor: "#F4F2F0",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
};

export default async function CabinetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-cream/90 pt-[env(safe-area-inset-top)] backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5 sm:px-5 sm:py-4">
          <Link
            href="/cabinet"
            className="flex min-h-11 min-w-0 items-center gap-2 text-base font-extrabold tracking-tight sm:text-lg"
          >
            <span className="truncate">{brand.name}</span>
            <span className="hidden text-[10px] font-bold uppercase tracking-widest text-ink/40 sm:inline">
              кабінет
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-3">
            <span className="hidden max-w-[220px] truncate text-sm text-ink/50 lg:block">
              {user?.email}
            </span>
            <form action="/auth/signout" method="post">
              <button
                aria-label="Вийти з кабінету"
                className="flex min-h-11 items-center gap-2 rounded-full border border-ink/15 px-4 text-[11px] font-bold uppercase tracking-widest transition active:bg-ink active:text-white sm:hover:bg-ink sm:hover:text-white"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                     strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 sm:hidden">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <path d="m16 17 5-5-5-5" /><path d="M21 12H9" />
                </svg>
                <span className="hidden sm:inline">вийти</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      {children}
    </div>
  );
}

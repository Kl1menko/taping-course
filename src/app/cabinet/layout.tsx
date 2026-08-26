import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { brand } from "@/content";
import SignOutButton from "@/components/cabinet/SignOutButton";

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
            <SignOutButton />
          </div>
        </div>
      </header>

      {children}
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { brand } from "@/content";

export const metadata: Metadata = {
  title: "Кабінет — Kotova Taping Course",
  robots: { index: false, follow: false },
};

export default async function CabinetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-[#F4F2F0]">
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-[#F4F2F0]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link href="/cabinet" className="text-lg font-extrabold tracking-tight">
            {brand.name}
            <span className="ml-2 text-xs font-bold uppercase tracking-widest text-ink/40">
              кабінет
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-ink/50 sm:block">{user?.email}</span>
            <form action="/auth/signout" method="post">
              <button className="rounded-full border border-ink/15 px-4 py-2 text-xs font-bold uppercase tracking-widest transition hover:bg-ink hover:text-white">
                вийти
              </button>
            </form>
          </div>
        </div>
      </header>

      {children}
    </div>
  );
}

import { Suspense } from "react";
import type { Metadata } from "next";
import LoginForm from "@/components/cabinet/LoginForm";

export const metadata: Metadata = {
  title: "Вхід у кабінет — Kotova Taping Course",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  // Юзернейм бота читаємо на сервері: NEXT_PUBLIC_ у клієнтському
  // компоненті вимагав би, щоб змінна була на місці ще під час білду.
  const bot = process.env.NEXT_PUBLIC_TELEGRAM_BOT ?? null;

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-16">
      <Suspense>
        <LoginForm bot={bot} />
      </Suspense>
    </main>
  );
}

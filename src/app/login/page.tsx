import { Suspense } from "react";
import type { Metadata } from "next";
import LoginForm from "@/components/cabinet/LoginForm";

export const metadata: Metadata = {
  title: "Вхід у кабінет — Kotova Taping Course",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-16">
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}

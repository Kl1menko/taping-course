import type { Metadata } from "next";
import { Suspense } from "react";
import ThanksForm from "@/components/cabinet/ThanksForm";

export const metadata: Metadata = {
  title: "Дякуємо за оплату — Kotova Taping Course",
  robots: { index: false, follow: false },
};

export default function ThanksPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-16">
      <Suspense>
        <ThanksForm />
      </Suspense>
    </main>
  );
}

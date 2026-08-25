import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ApplyProvider } from "@/components/ApplyModal";

export const metadata: Metadata = {
  title: "Системне навчання кінезіологічному тейпуванню | Kotova Taping Academy",
  description:
    "13 структурованих уроків, практика, стартовий набір і супровід. Не набір готових схем, а система: розуміння механізмів, вибір техніки та усвідомлене застосування. Для масажистів, тренерів і фізичних терапевтів.",
  keywords: [
    "кінезіологічне тейпування",
    "кінезіотейпування навчання",
    "курс тейпування",
    "kotova taping academy",
    "тейпування для масажистів",
  ],
  openGraph: {
    title: "Системне навчання кінезіологічному тейпуванню",
    description:
      "13 уроків · практика · стартовий набір · супровід. Kotova Taping Academy.",
    type: "website",
    locale: "uk_UA",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#F4F2F0",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning — бо браузерні розширення (LanguageTool, Grammarly)
    // дописують свої атрибути в <html> до гідрації. Діє лише на цей тег.
    <html lang="uk" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        <ApplyProvider>{children}</ApplyProvider>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SignupModalProvider } from "@/components/SignupModal";

export const metadata: Metadata = {
  title: "Kotova Taping Course — курс кінезіотейпування з нуля до практики",
  description:
    "Онлайн-курс кінезіотейпування: 6 модулів, 40+ відеоуроків, розбір домашніх завдань і практичний залік із сертифікатом. Для масажистів, тренерів і студентів.",
  keywords: [
    "кінезіотейпування",
    "курс тейпування",
    "тейпування навчання",
    "кінезіотейп",
    "реабілітація",
  ],
  openGraph: {
    title: "Kotova Taping Course — курс кінезіотейпування",
    description:
      "Навчись тейпувати впевнено: 6 модулів, практика під наглядом викладача, сертифікат.",
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
        <SignupModalProvider>{children}</SignupModalProvider>
      </body>
    </html>
  );
}

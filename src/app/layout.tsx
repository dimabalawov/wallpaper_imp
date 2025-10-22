// src/app/layout.tsx

import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { ClientProviders } from "@/context/ClientProviders";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Фотошпалери | Інтернет-магазин",
  description: "Виготовлення та продаж якісних фотошпалер на замовлення.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      {/* 1. Додаємо 3 класи сюди */}
      <body
        className={`${geistSans.variable} antialiased flex flex-col min-h-screen`}
      >
        <ClientProviders>
          <Header />
          {/* 2. Додаємо 1 клас сюди */}
          <main className="flex-grow">{children}</main>
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}

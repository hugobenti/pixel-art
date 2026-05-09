/**
 * Purpose:
 * Root layout for the PixelCraft App Router shell (fonts, global styles, full-height body).
 */
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { AppProviders } from "@/app/AppProviders";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PixelCraft",
  description: "Web-based pixel art editor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full min-h-dvh bg-mist-300 antialiased`}
    >
      <body className="flex min-h-dvh flex-col bg-mist-300 font-sans">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}

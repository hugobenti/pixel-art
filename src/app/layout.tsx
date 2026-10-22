/**
 * Purpose:
 * Root layout for the PixelCraft App Router shell (fonts, global styles, full-height body).
 */
import type { Metadata } from "next";

import { AppProviders } from "@/app/AppProviders";
import { siteMetadata } from "@/content/metadata";
import { cx } from "@/features/shared/utils/cx";
import { geistMono, geistSans } from "./fonts";
import { rootLayout } from "./layout.style";

import "./globals.css";

export const metadata: Metadata = siteMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cx(geistSans.variable, geistMono.variable, rootLayout.html)}>
      <body className={rootLayout.body}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}

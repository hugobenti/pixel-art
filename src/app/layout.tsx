/**
 * Purpose:
 * Root layout for the PixelCraft App Router shell (fonts, global styles, full-height body).
 */
import { AppProviders } from "@/app/AppProviders";
import { fontVariables } from "@/app/fonts";
import { siteMetadata } from "@/app/layout.data";
import { layout } from "@/app/layout.style";
import { cx } from "@/features/shared/utils/cx";

import "./globals.css";

export const metadata = siteMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cx(fontVariables, layout.html)}>
      <body className={layout.body}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}

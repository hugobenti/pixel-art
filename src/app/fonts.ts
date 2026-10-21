/**
 * Purpose:
 * Google fonts loaded by next/font for the root layout.
 */
import { Geist, Geist_Mono } from "next/font/google";

import { cx } from "@/features/shared/utils/cx";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** Class names that define the --font-geist-* variables used by globals.css. */
export const fontVariables = cx(geistSans.variable, geistMono.variable);

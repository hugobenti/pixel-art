/**
 * Purpose:
 * App font definitions (next/font): Geist and Geist Mono, exposed as the CSS variables the
 * `font-sans` / `font-mono` tokens in globals.css read.
 */
import { Geist, Geist_Mono } from "next/font/google";

export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

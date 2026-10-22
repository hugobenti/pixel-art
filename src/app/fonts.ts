/**
 * Purpose:
 * App font definitions (next/font): Schibsted Grotesk for the interface and JetBrains Mono for
 * numbers (sizes, zoom, hex), exposed as the CSS variables the `font-sans` / `font-mono` tokens in
 * globals.css read. Both themes share them; see DESIGN.md "Typography".
 */
import { JetBrains_Mono, Schibsted_Grotesk } from "next/font/google";

export const fontSans = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk",
  subsets: ["latin"],
});

export const fontMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

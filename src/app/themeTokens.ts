/**
 * Purpose:
 * Theme color tokens read from globals.css (the single token source) for server-rendered output that
 * can't use CSS variables: browser chrome color, web manifest, generated icons and images.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { readSelectorColors, readThemeColors } from "@/features/shared/utils/colorContrast";

const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");

export const lightTokens = readThemeColors(css);
export const darkTokens = { ...lightTokens, ...readSelectorColors(css, '[data-theme="dark"]') };

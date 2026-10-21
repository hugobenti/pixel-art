/**
 * Purpose:
 * WCAG 2.x contrast math for design tokens, plus a reader for the `--color-*` tokens declared in a
 * Tailwind `@theme` block (src/app/globals.css). Used by the token contrast test.
 */

const OPAQUE_HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
const THEME_BLOCK = /@theme\b[^{]*\{([^}]*)\}/g;
const COLOR_DECLARATION = /--color-([a-z0-9-]+)\s*:\s*([^;]+);/gi;

/** WCAG 2.x relative luminance of an opaque #rgb / #rrggbb color. */
function luminance(hex: string): number {
  const match = OPAQUE_HEX.exec(hex);
  if (!match) {
    throw new Error(`contrastRatio needs an opaque hex color, got "${hex}"`);
  }
  const digits =
    match[1].length === 3
      ? match[1].replace(/./g, (d) => d + d)
      : match[1];
  const [r, g, b] = [0, 2, 4].map((i) => {
    const channel = Number.parseInt(digits.slice(i, i + 2), 16) / 255;
    return channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio between two opaque colors, from 1 (none) to 21 (black on white). */
export function contrastRatio(foreground: string, background: string): number {
  const [lighter, darker] = [luminance(foreground), luminance(background)].sort(
    (a, b) => b - a
  );
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Color tokens declared in `@theme` blocks, keyed by name without the `--color-` prefix.
 * Wildcard resets (`--color-*: initial`) are skipped.
 */
export function readThemeColors(css: string): Record<string, string> {
  const colors: Record<string, string> = {};
  for (const block of css.matchAll(THEME_BLOCK)) {
    for (const declaration of block[1].matchAll(COLOR_DECLARATION)) {
      colors[declaration[1]] = declaration[2].trim();
    }
  }
  return colors;
}

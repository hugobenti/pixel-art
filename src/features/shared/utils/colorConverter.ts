/**
 * Purpose:
 * Normalize palette color strings for canvas fill operations (hex shorthand expansion).
 */

const HEX6 = /^#?([0-9a-f]{6})$/i;
const HEX3 = /^#?([0-9a-f]{3})$/i;

/**
 * Expands #RGB to #RRGGBB when valid; returns the original string when parsing fails.
 */
export function normalizeHexColor(input: string): string {
  const trimmed = input.trim();
  const m6 = trimmed.match(HEX6);
  if (m6) {
    return `#${m6[1].toUpperCase()}`;
  }
  const m3 = trimmed.match(HEX3);
  if (m3) {
    const [r, g, b] = m3[1].split("");
    return `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
  }
  return trimmed;
}

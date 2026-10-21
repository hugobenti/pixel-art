/**
 * Purpose:
 * Picks which selection ring a palette swatch shows (keys of `colorSwatch.ring`).
 */

export type ColorSwatchRing = "idle" | "selected" | "primary" | "secondary" | "primaryAndSecondary";

type ColorSwatchSelection =
  | { density: "compact"; selected: boolean }
  | { density: "comfortable"; isPrimary: boolean; isSecondary: boolean };

export function colorSwatchRing(swatch: ColorSwatchSelection): ColorSwatchRing {
  if (swatch.density === "compact") {
    return swatch.selected ? "selected" : "idle";
  }
  if (swatch.isPrimary && swatch.isSecondary) {
    return "primaryAndSecondary";
  }
  if (swatch.isPrimary) {
    return "primary";
  }
  if (swatch.isSecondary) {
    return "secondary";
  }
  return "idle";
}

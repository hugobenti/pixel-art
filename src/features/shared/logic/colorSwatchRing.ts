/**
 * Purpose:
 * Picks the ring a palette swatch shows: selection (compact grid) or primary/secondary pick (comfortable row).
 */

import type {
  TColorSwatchRing,
  TColorSwatchRingInput,
} from "@/features/shared/components/ColorSwatch.type";

export function colorSwatchRing(swatch: TColorSwatchRingInput): TColorSwatchRing {
  if (swatch.density === "compact") {
    return swatch.selected ? "selected" : "idle";
  }
  if (swatch.isPrimary && swatch.isSecondary) {
    return "both";
  }
  if (swatch.isPrimary) {
    return "primary";
  }
  if (swatch.isSecondary) {
    return "secondary";
  }
  return "idle";
}

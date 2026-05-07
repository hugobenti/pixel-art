/**
 * Purpose:
 * Pure helpers to add, update, or remove palette entries while keeping pixel indices consistent.
 */

import { normalizeHexColor } from "@/features/shared/utils/colorConverter";

import { MAX_PALETTE_ENTRIES } from "@/features/gallery/services/galleryService";

export type ColorSlot = "primary" | "secondary";

export function setPaletteColorAt(
  palette: string[],
  index: number,
  hex: string
): string[] {
  const next = [...palette];
  if (index < 0 || index >= next.length) {
    return next;
  }
  next[index] = normalizeHexColor(hex);
  return next;
}

export function appendPaletteColor(
  palette: string[],
  hex: string
): string[] | null {
  if (palette.length >= MAX_PALETTE_ENTRIES) {
    return null;
  }
  return [...palette, normalizeHexColor(hex)];
}

export interface RemovePaletteResult {
  palette: string[];
  primaryIndex: number;
  secondaryIndex: number;
}

/**
 * Removes one palette entry; remaps pixel indices and clamps primary/secondary selection.
 */
export function removePaletteAt(
  pixelData: Uint8Array,
  palette: string[],
  removeIndex: number,
  primaryIndex: number,
  secondaryIndex: number
): RemovePaletteResult | null {
  if (palette.length <= 1 || removeIndex < 0 || removeIndex >= palette.length) {
    return null;
  }

  for (let i = 0; i < pixelData.length; i++) {
    let v = pixelData[i];
    if (v === removeIndex) {
      v = 0;
    } else if (v > removeIndex) {
      v -= 1;
    }
    pixelData[i] = v;
  }

  const nextPalette = palette.filter((_, i) => i !== removeIndex);

  let p = primaryIndex;
  let s = secondaryIndex;
  if (p === removeIndex) {
    p = 0;
  } else if (p > removeIndex) {
    p -= 1;
  }
  if (s === removeIndex) {
    s = 0;
  } else if (s > removeIndex) {
    s -= 1;
  }

  const maxI = nextPalette.length - 1;
  p = Math.min(Math.max(0, p), maxI);
  s = Math.min(Math.max(0, s), maxI);

  return { palette: nextPalette, primaryIndex: p, secondaryIndex: s };
}

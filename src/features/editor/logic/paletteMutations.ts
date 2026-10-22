/**
 * Purpose:
 * Pure helpers to add, update, or remove palette entries while keeping pixel indices consistent;
 * a removal is recorded so undo can restore the color and its pixels.
 */

import { normalizeHexColor } from "@/features/shared/utils/colorConverter";

import { MAX_PALETTE_ENTRIES } from "@/features/shared/artwork/artworkService";
import type { IPaletteRemoval } from "@/features/editor/types/editor.type";
import type {
  IColorSlots,
  IPaletteLayerBuffer,
  IPaletteRemovalResult,
} from "./paletteMutations.type";

/**
 * Clamps a palette slot index to valid palette bounds (0 … length − 1).
 */
export function clampPaletteIndex(index: number, paletteLength: number): number {
  if (paletteLength <= 0) {
    return 0;
  }
  const max = paletteLength - 1;
  return Math.min(Math.max(0, index), max);
}

export function setPaletteColorAt(palette: string[], index: number, hex: string): string[] {
  const next = [...palette];
  if (index < 0 || index >= next.length) {
    return next;
  }
  next[index] = normalizeHexColor(hex);
  return next;
}

export function appendPaletteColor(palette: string[], hex: string): string[] | null {
  if (palette.length >= MAX_PALETTE_ENTRIES) {
    return null;
  }
  return [...palette, normalizeHexColor(hex)];
}

function slotAfterRemoval(index: number, removeIndex: number, nextLength: number): number {
  const shifted = index > removeIndex ? index - 1 : index === removeIndex ? 0 : index;
  return clampPaletteIndex(shifted, nextLength);
}

/**
 * Forward remap of one buffer: the removed index becomes 0, higher palette indices move down by
 * one. Values outside the palette (`>= paletteLength`, e.g. the 255 transparent fill) are left alone.
 */
function remapForRemoval(pixelData: Uint8Array, removeIndex: number, paletteLength: number): void {
  for (let i = 0; i < pixelData.length; i++) {
    const v = pixelData[i];
    if (v === removeIndex) {
      pixelData[i] = 0;
    } else if (v > removeIndex && v < paletteLength) {
      pixelData[i] = v - 1;
    }
  }
}

/**
 * Removes one palette entry: remaps every layer buffer in place, records the pixels that used the
 * color (so undo can restore them) and clamps the primary/secondary selection.
 */
export function removePaletteColor(
  layers: readonly IPaletteLayerBuffer[],
  palette: string[],
  removeIndex: number,
  slots: IColorSlots,
): IPaletteRemovalResult | null {
  if (palette.length <= 1 || removeIndex < 0 || removeIndex >= palette.length) {
    return null;
  }
  const removedPixels = layers.map(({ id, pixelData }) => {
    let count = 0;
    for (let i = 0; i < pixelData.length; i++) {
      if (pixelData[i] === removeIndex) {
        count++;
      }
    }
    const indices = new Uint32Array(count);
    let next = 0;
    for (let i = 0; i < pixelData.length; i++) {
      if (pixelData[i] === removeIndex) {
        indices[next++] = i;
      }
    }
    remapForRemoval(pixelData, removeIndex, palette.length);
    return { layerId: id, indices };
  });
  const nextPalette = palette.filter((_, i) => i !== removeIndex);
  return {
    palette: nextPalette,
    slots: {
      primaryIndex: slotAfterRemoval(slots.primaryIndex, removeIndex, nextPalette.length),
      secondaryIndex: slotAfterRemoval(slots.secondaryIndex, removeIndex, nextPalette.length),
    },
    removal: { index: removeIndex, color: palette[removeIndex], removedPixels },
  };
}

/**
 * Redo of a palette removal: remaps every current layer again. `paletteLength` is the current
 * palette length, which still includes the color being removed.
 */
export function reapplyPaletteRemoval(
  removal: IPaletteRemoval,
  layers: readonly IPaletteLayerBuffer[],
  paletteLength: number,
): void {
  for (const layer of layers) {
    remapForRemoval(layer.pixelData, removal.index, paletteLength);
  }
}

/**
 * Undo of a palette removal: palette indices at or above the removed slot move back up by one on
 * every current layer, then the recorded pixels get the restored color again. `paletteLength` is the
 * current palette length (without the removed color); values at or above it are transparent and
 * stay unchanged, so they can't wrap past 255 into a real color.
 */
export function revertPaletteRemoval(
  removal: IPaletteRemoval,
  layers: readonly IPaletteLayerBuffer[],
  paletteLength: number,
): void {
  for (const { pixelData } of layers) {
    for (let i = 0; i < pixelData.length; i++) {
      const v = pixelData[i];
      if (v >= removal.index && v < paletteLength) {
        pixelData[i] = v + 1;
      }
    }
  }
  for (const { layerId, indices } of removal.removedPixels) {
    const pixelData = layers.find((layer) => layer.id === layerId)?.pixelData;
    if (!pixelData) {
      continue;
    }
    for (const index of indices) {
      pixelData[index] = removal.index;
    }
  }
}

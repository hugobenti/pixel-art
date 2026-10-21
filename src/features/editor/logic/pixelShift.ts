/**
 * Purpose:
 * Circular row/column shifts for indexed pixel buffers (wrap: last becomes first).
 *
 * Notes:
 * Pixel indices follow row-major order: index = x + y * width.
 */

import type { IHistoryCommand, IPixelDelta } from "@/features/editor/types/editor.type";
import type { TShiftDirection } from "./pixelShift.type";

/**
 * Mutates `pixelData` to the shifted grid and returns an undo command, or null if nothing changed.
 */
export function computeShiftCommand(
  layerId: string,
  pixelData: Uint8Array,
  width: number,
  height: number,
  direction: TShiftDirection
): IHistoryCommand | null {
  const len = width * height;
  if (len === 0 || pixelData.length !== len) {
    return null;
  }

  const old = pixelData;
  const next = new Uint8Array(len);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sx = x;
      let sy = y;
      switch (direction) {
        case "up":
          sy = (y + 1) % height;
          break;
        case "down":
          sy = (y - 1 + height) % height;
          break;
        case "left":
          sx = (x + 1) % width;
          break;
        case "right":
          sx = (x - 1 + width) % width;
          break;
      }
      const src = sx + sy * width;
      const dst = x + y * width;
      next[dst] = old[src];
    }
  }

  const deltas: IPixelDelta[] = [];
  for (let i = 0; i < len; i++) {
    if (old[i] !== next[i]) {
      deltas.push({
        layerId,
        index: i,
        previousPaletteIndex: old[i],
        newPaletteIndex: next[i],
      });
    }
  }

  if (deltas.length === 0) {
    return null;
  }

  pixelData.set(next);
  return { deltas };
}

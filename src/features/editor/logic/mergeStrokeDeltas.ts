/**
 * Purpose:
 * Collapse multiple raw pixel touched events into one undo entry per cell per stroke.
 */

import type { PixelDelta } from "@/features/editor/types/editor.types";

export function mergeStrokeDeltas(raw: PixelDelta[]): PixelDelta[] {
  const map = new Map<
    number,
    { previousPaletteIndex: number; newPaletteIndex: number }
  >();

  for (const d of raw) {
    const existing = map.get(d.index);
    if (!existing) {
      map.set(d.index, {
        previousPaletteIndex: d.previousPaletteIndex,
        newPaletteIndex: d.newPaletteIndex,
      });
    } else {
      existing.newPaletteIndex = d.newPaletteIndex;
    }
  }

  return [...map.entries()].map(([index, v]) => ({
    index,
    previousPaletteIndex: v.previousPaletteIndex,
    newPaletteIndex: v.newPaletteIndex,
  }));
}

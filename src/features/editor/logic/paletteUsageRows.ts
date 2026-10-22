/**
 * Purpose:
 * Image detail rows: composite palette usage sorted by count, with each entry's share of the opaque pixels.
 */

import type { IPaletteUsageRow } from "./paletteUsageRows.type";

/** Most used first (ties by palette index); `percent` is rounded to one decimal, 0 when nothing is opaque. */
export function paletteUsageRows(
  countsByPaletteIndex: Map<number, number>,
  totalOpaque: number,
  palette: string[],
): IPaletteUsageRow[] {
  return [...countsByPaletteIndex.entries()]
    .map(([paletteIndex, count]) => ({
      paletteIndex,
      count,
      color: palette[paletteIndex] ?? "transparent",
      percent: totalOpaque > 0 ? Math.round((count / totalOpaque) * 1000) / 10 : 0,
    }))
    .sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count;
      }
      return a.paletteIndex - b.paletteIndex;
    });
}

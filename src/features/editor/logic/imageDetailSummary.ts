/**
 * Purpose:
 * Summary copy and per-palette share math for the editor settings image detail panel.
 */

/** One-line summary above the image detail histogram. */
export function formatImageDetailSummary(
  totalCompositeOpaque: number,
  totalViewportCells: number
): string {
  if (totalViewportCells === 0) {
    return "No artwork pixels intersect the visible viewport.";
  }
  return `${totalCompositeOpaque} composited pixel${totalCompositeOpaque === 1 ? "" : "s"} across ${totalViewportCells} visible cell${totalViewportCells === 1 ? "" : "s"} (layers stacked; no double counting).`;
}

/** Share of opaque composite pixels, in percent with one decimal (0 when there are none). */
export function paletteSharePercent(count: number, totalCompositeOpaque: number): number {
  if (totalCompositeOpaque <= 0) {
    return 0;
  }
  return Math.round((count / totalCompositeOpaque) * 1000) / 10;
}

/**
 * Purpose:
 * Turns a logo pixel grid into horizontal color runs and positioned blocks at a whole-number scale.
 *
 * Notes:
 * Runs keep generated images small and leave no seams between neighbouring pixels of one color.
 */

import type { IBrandImageBlock } from "./BrandImage.type";
import type { TBrandGrid } from "./brandArt.type";
import type { IBrandLockup, IBrandLockupPart, IBrandRun } from "./brandPixels.type";

const TRANSPARENT = ".";

export function gridRuns(grid: TBrandGrid): IBrandRun[] {
  const runs: IBrandRun[] = [];
  grid.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const key = row[x];
      let end = x + 1;
      while (end < row.length && row[end] === key) {
        end++;
      }
      if (key !== TRANSPARENT) {
        runs.push({ x, y, length: end - x, key });
      }
      x = end;
    }
  });
  return runs;
}

/** Blocks for a grid drawn at `scale` px per pixel with its top-left corner at (`left`, `top`). */
export function gridBlocks(
  grid: TBrandGrid,
  colors: Readonly<Record<string, string>>,
  scale: number,
  left: number,
  top: number,
): IBrandImageBlock[] {
  return gridRuns(grid).map((run) => ({
    left: left + run.x * scale,
    top: top + run.y * scale,
    width: run.length * scale,
    height: scale,
    color: colors[run.key],
  }));
}

/** Grids placed side by side (or stacked) as one drawing, with its size in logo pixels. */
export function lockup(parts: readonly IBrandLockupPart[]): IBrandLockup {
  return {
    width: Math.max(...parts.map((part) => part.x + part.grid[0].length)),
    height: Math.max(...parts.map((part) => part.y + part.grid.length)),
    runs: parts.flatMap((part) =>
      gridRuns(part.grid).map((run) => ({ ...run, x: run.x + part.x, y: run.y + part.y })),
    ),
  };
}

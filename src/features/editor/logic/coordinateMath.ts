/**
 * Purpose:
 * Viewport math: screen/world mapping and visible world bounds for grid culling.
 */

import type { IViewportState } from "@/features/editor/types/editor.type";
import type { IVisibleWorldBounds } from "./coordinateMath.type";

/**
 * Maps pointer coordinates in CSS pixels into world (grid) space.
 */
export function screenToWorldCoordinates(
  mouseX: number,
  mouseY: number,
  viewport: IViewportState
): { x: number; y: number } {
  const worldX = Math.floor((mouseX - viewport.viewOffset.x) / viewport.scale);
  const worldY = Math.floor((mouseY - viewport.viewOffset.y) / viewport.scale);
  return { x: worldX, y: worldY };
}

/**
 * Approximate axis-aligned world rectangle visible inside the canvas element for line culling.
 */
export function getVisibleWorldBounds(
  viewport: IViewportState,
  canvasWidthCss: number,
  canvasHeightCss: number,
  worldWidth: number,
  worldHeight: number
): IVisibleWorldBounds {
  const inv = 1 / viewport.scale;
  const left = (0 - viewport.viewOffset.x) * inv;
  const right = (canvasWidthCss - viewport.viewOffset.x) * inv;
  const top = (0 - viewport.viewOffset.y) * inv;
  const bottom = (canvasHeightCss - viewport.viewOffset.y) * inv;

  const minX = clamp(Math.floor(Math.min(left, right)) - 1, 0, worldWidth);
  const maxX = clamp(Math.ceil(Math.max(left, right)) + 1, 0, worldWidth);
  const minY = clamp(Math.floor(Math.min(top, bottom)) - 1, 0, worldHeight);
  const maxY = clamp(Math.ceil(Math.max(top, bottom)) + 1, 0, worldHeight);

  return { minX, maxX, minY, maxY };
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

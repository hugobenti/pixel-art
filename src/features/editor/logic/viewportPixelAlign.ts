/**
 * Purpose:
 * Snap viewport scale and translation to integer CSS pixels so artwork fillRects align to the device grid
 * and checkerboard seams do not show between same-color neighbors.
 */

import type { ViewportState } from "@/features/editor/types/editor.types";

/** Maximum zoom scale (matches editor navigation clamp). */
export const MAX_VIEWPORT_SCALE = 64;

export interface NormalizeViewportOptions {
  /** Lower zoom bound from contain fit ratio (may be fractional). */
  minScale: number;
  maxScale: number;
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

/**
 * Rounds scale to an integer and clamps to [ceil(minScale), maxScale], rounds view offsets to integers.
 */
export function normalizeViewportToPixelGrid(
  viewport: ViewportState,
  { minScale, maxScale }: NormalizeViewportOptions
): ViewportState {
  const minScaleInt = Math.max(1, Math.ceil(minScale));
  const scaleRounded = Math.round(viewport.scale);
  const scale = clamp(scaleRounded, minScaleInt, maxScale);
  return {
    scale,
    viewOffset: {
      x: Math.round(viewport.viewOffset.x),
      y: Math.round(viewport.viewOffset.y),
    },
  };
}

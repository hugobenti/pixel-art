/**
 * Purpose:
 * Fit document pixels into the canvas CSS box (contain + center) for default and max zoom-out.
 */

import type { ViewportState } from "@/features/editor/types/editor.types";

/**
 * Scale and offset so the full world rectangle [0,w)×[0,h) is visible and as large as possible
 * inside the container (standard “contain”), centered with letterboxing only when aspect ratios differ.
 */
export function computeContainFit(
  containerW: number,
  containerH: number,
  worldW: number,
  worldH: number
): ViewportState {
  const cw = Math.max(1, Math.floor(containerW));
  const ch = Math.max(1, Math.floor(containerH));
  const ww = Math.max(1, worldW);
  const wh = Math.max(1, worldH);

  const scale = Math.min(cw / ww, ch / wh);
  const viewOffset = {
    x: (cw - ww * scale) / 2,
    y: (ch - wh * scale) / 2,
  };

  return { scale, viewOffset };
}

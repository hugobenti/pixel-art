/**
 * Purpose:
 * Fit document pixels into the canvas CSS box (contain + center) for default and max zoom-out.
 */

import type { IViewportState } from "@/features/editor/types/editor.type";
import {
  MAX_VIEWPORT_SCALE,
  normalizeViewportToPixelGrid,
} from "@/features/editor/logic/viewportPixelAlign";

/** Zoom-out limit as a share of the contain-fit scale: the artwork may shrink a bit past "fit". */
const MIN_ZOOM_RATIO_OF_CONTAIN = 0.75;

/**
 * Scale and offset so the full world rectangle [0,w)×[0,h) is visible and as large as possible
 * inside the container (standard “contain”), centered with letterboxing only when aspect ratios differ.
 */
export function computeContainFit(
  containerW: number,
  containerH: number,
  worldW: number,
  worldH: number
): IViewportState {
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

/**
 * Default viewport for a container: the contain fit snapped to the integer pixel grid, and the
 * minimum zoom scale (fractional; normalizeViewportToPixelGrid rounds it up) derived from it.
 */
export function containFitViewport(
  containerW: number,
  containerH: number,
  worldW: number,
  worldH: number
) {
  const fit = computeContainFit(containerW, containerH, worldW, worldH);
  const minScale = fit.scale * MIN_ZOOM_RATIO_OF_CONTAIN;
  return {
    minScale,
    viewport: normalizeViewportToPixelGrid(fit, {
      minScale,
      maxScale: MAX_VIEWPORT_SCALE,
    }),
  };
}

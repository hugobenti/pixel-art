/**
 * Purpose:
 * Pure viewport zoom math: screen-anchored scale changes with optional pixel-grid snapping.
 */

import type { IViewportState } from "@/features/editor/types/editor.type";
import type { INormalizeViewportOptions } from "@/features/editor/logic/viewportPixelAlign.type";
import { normalizeViewportToPixelGrid } from "@/features/editor/logic/viewportPixelAlign";

/**
 * Applies a new scale while keeping the given screen-space point aligned with the same world pixel.
 */
export function zoomViewportTowardScreenPoint(
  v: IViewportState,
  newScale: number,
  mx: number,
  my: number
): IViewportState {
  const worldX = (mx - v.viewOffset.x) / v.scale;
  const worldY = (my - v.viewOffset.y) / v.scale;
  return {
    scale: newScale,
    viewOffset: {
      x: mx - worldX * newScale,
      y: my - worldY * newScale,
    },
  };
}

/**
 * Zoom toward (mx, my) after snapping candidate scale to the integer grid. If the snapped scale equals
 * the current scale, returns v unchanged — otherwise fractional candidate scales shift viewOffset even
 * when rounding yields no zoom change (visible as pan drift on touch / button zoom).
 */
export function zoomViewportTowardScreenPointSnapped(
  v: IViewportState,
  candidateScale: number,
  mx: number,
  my: number,
  normalizeOpts: INormalizeViewportOptions
): IViewportState {
  const snappedPreview = normalizeViewportToPixelGrid(
    { ...v, scale: candidateScale },
    normalizeOpts
  );
  if (snappedPreview.scale === v.scale) {
    return v;
  }
  const raw = zoomViewportTowardScreenPoint(v, snappedPreview.scale, mx, my);
  return normalizeViewportToPixelGrid(raw, normalizeOpts);
}

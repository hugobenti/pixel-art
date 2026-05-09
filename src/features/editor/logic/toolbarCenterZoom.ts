/**
 * Purpose:
 * Pure helpers for toolbar zoom toward the canvas center (multiplicative step + integer fallback).
 *
 * Notes:
 * Used by useToolbarCenterZoom; logs optional debug when DEBUG_EDITOR_ZOOM=1 or in development.
 */

import type { ViewportState } from "@/features/editor/types/editor.types";

import type { NormalizeViewportOptions } from "@/features/editor/logic/viewportPixelAlign";
import {
  MAX_VIEWPORT_SCALE,
  normalizeViewportToPixelGrid,
} from "@/features/editor/logic/viewportPixelAlign";
import { zoomViewportTowardScreenPointSnapped } from "@/features/editor/logic/viewportZoomMath";

/** Initial multiplicative step; integer bump applied when rounding yields no change (typical at low scales). */
export const VIEWPORT_ZOOM_FACTOR_IN = 1.08;
export const VIEWPORT_ZOOM_FACTOR_OUT = 0.92;

/** Logs [editor-zoom] in development, or when localStorage DEBUG_EDITOR_ZOOM=1 is set (e.g. mobile prod builds). */
export function editorZoomDebug(payload: Record<string, unknown>) {
  if (typeof window === "undefined") {
    return;
  }
  const force = window.localStorage?.getItem("DEBUG_EDITOR_ZOOM") === "1";
  if (process.env.NODE_ENV === "development" || force) {
    console.log("[editor-zoom]", payload);
  }
}

export interface ToolbarCenterZoomContext {
  wrapEl: HTMLElement;
  minScale: number;
  normalizeOpts: NormalizeViewportOptions;
}

/**
 * Computes next viewport state when zooming from toolbar toward the wrap element center.
 */
export function computeToolbarZoomAroundCenter(
  v: ViewportState,
  direction: "in" | "out",
  ctx: ToolbarCenterZoomContext
): ViewportState {
  const rect = ctx.wrapEl.getBoundingClientRect();
  const mx = rect.width / 2;
  const my = rect.height / 2;
  const minScale = ctx.minScale;
  const minScaleFloor = Math.max(1, Math.ceil(minScale));
  const factor =
    direction === "in" ? VIEWPORT_ZOOM_FACTOR_IN : VIEWPORT_ZOOM_FACTOR_OUT;

  const multiplicative = Math.min(
    MAX_VIEWPORT_SCALE,
    Math.max(minScale, v.scale * factor)
  );
  let candidateScale = multiplicative;

  const snappedMultiplicative = normalizeViewportToPixelGrid(
    { ...v, scale: multiplicative },
    ctx.normalizeOpts
  ).scale;

  let usedIntegerBump = false;
  if (snappedMultiplicative === v.scale) {
    usedIntegerBump = true;
    if (direction === "in") {
      candidateScale = Math.min(MAX_VIEWPORT_SCALE, v.scale + 1);
    } else {
      candidateScale = Math.max(minScaleFloor, v.scale - 1);
    }
  }

  const next = zoomViewportTowardScreenPointSnapped(
    v,
    candidateScale,
    mx,
    my,
    ctx.normalizeOpts
  );

  editorZoomDebug({
    phase: "apply",
    direction,
    prevScale: v.scale,
    multiplicativeCandidate: multiplicative,
    snappedMultiplicative,
    usedIntegerBump,
    finalCandidate: candidateScale,
    nextScale: next.scale,
    unchanged: next === v,
    anchor: { mx, my },
    wrapSize: { w: rect.width, h: rect.height },
    minScale,
    minScaleFloor,
  });

  return next;
}

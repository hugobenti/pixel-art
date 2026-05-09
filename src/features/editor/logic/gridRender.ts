/**
 * Purpose:
 * Draw the editorial pixel grid overlay in world space with viewport-aligned transforms and culling.
 *
 * Notes (optional):
 * Symmetry guides use the artwork mid-lines in world space (half-width / half-height), drawn after the base grid.
 */

import { EDITOR_GRID_LINE_STROKE_FALLBACK } from "@/features/editor/constants/editorCanvasFallbacks";
import type { ViewportState } from "@/features/editor/types/editor.types";

import { getVisibleWorldBounds } from "@/features/editor/logic/coordinateMath";

export interface PixelGridRenderOptions {
  color?: string;
  /** Stroke color for the horizontal mid-line (symmetry guide). */
  centerHorizontalColor?: string;
  /** Stroke color for the vertical mid-line (symmetry guide). */
  centerVerticalColor?: string;
  lineWidthWorld?: number;
  /** Optional extra thickness multiplier for center guides (defaults to 1.45). */
  centerLineWidthFactor?: number;
}

/**
 * Strokes grid lines on pixel boundaries; skips work outside the visible world slice when bounds are provided.
 */
export function renderPixelGrid(
  ctx: CanvasRenderingContext2D,
  worldWidth: number,
  worldHeight: number,
  viewport: ViewportState,
  options: PixelGridRenderOptions,
  canvasWidthCss: number,
  canvasHeightCss: number
): void {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.translate(viewport.viewOffset.x, viewport.viewOffset.y);
  ctx.scale(viewport.scale, viewport.scale);

  const bounds = getVisibleWorldBounds(
    viewport,
    canvasWidthCss,
    canvasHeightCss,
    worldWidth,
    worldHeight
  );

  const baseLineWidth =
    options.lineWidthWorld ?? Math.max(1.2 / viewport.scale, 1e-6);

  ctx.strokeStyle = options.color ?? EDITOR_GRID_LINE_STROKE_FALLBACK;
  ctx.lineWidth = baseLineWidth;

  const startX = Math.max(0, bounds.minX);
  const endX = Math.min(worldWidth, bounds.maxX + 1);
  const startY = Math.max(0, bounds.minY);
  const endY = Math.min(worldHeight, bounds.maxY + 1);

  ctx.beginPath();
  for (let x = startX; x <= endX; x++) {
    ctx.moveTo(x, startY);
    ctx.lineTo(x, endY);
  }
  for (let y = startY; y <= endY; y++) {
    ctx.moveTo(startX, y);
    ctx.lineTo(endX, y);
  }
  ctx.stroke();

  const centerFactor = options.centerLineWidthFactor ?? 1.45;
  const centerLineWidth = Math.max(baseLineWidth * centerFactor, 1e-6);
  const cx = worldWidth / 2;
  const cy = worldHeight / 2;

  if (
    options.centerVerticalColor &&
    worldWidth > 0 &&
    cx >= startX &&
    cx <= endX
  ) {
    ctx.beginPath();
    ctx.strokeStyle = options.centerVerticalColor;
    ctx.lineWidth = centerLineWidth;
    ctx.moveTo(cx, startY);
    ctx.lineTo(cx, endY);
    ctx.stroke();
  }

  if (
    options.centerHorizontalColor &&
    worldHeight > 0 &&
    cy >= startY &&
    cy <= endY
  ) {
    ctx.beginPath();
    ctx.strokeStyle = options.centerHorizontalColor;
    ctx.lineWidth = centerLineWidth;
    ctx.moveTo(startX, cy);
    ctx.lineTo(endX, cy);
    ctx.stroke();
  }

  ctx.restore();
}

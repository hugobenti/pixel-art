/**
 * Purpose:
 * Draw the editorial pixel grid overlay in world space with viewport-aligned transforms and culling.
 */

import type { ViewportState } from "@/features/editor/types/editor.types";

import { getVisibleWorldBounds } from "@/features/editor/logic/coordinateMath";

export interface PixelGridRenderOptions {
  color?: string;
  lineWidthWorld?: number;
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

  const lineWidth =
    options.lineWidthWorld ?? Math.max(1 / viewport.scale, 1e-6);

  ctx.strokeStyle = options.color ?? "rgba(0, 0, 0, 0.22)";
  ctx.lineWidth = lineWidth;

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

  ctx.restore();
}

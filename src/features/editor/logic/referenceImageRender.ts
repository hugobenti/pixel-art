/**
 * Purpose:
 * Draw the guide image overlay with viewport transform, stretching it to artwork bounds.
 */

import type { ViewportState } from "@/features/editor/types/editor.types";

export function renderReferenceImage(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  artworkWidth: number,
  artworkHeight: number,
  viewport: ViewportState,
  alpha: number
): void {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.globalAlpha = alpha;
  ctx.translate(viewport.viewOffset.x, viewport.viewOffset.y);
  ctx.scale(viewport.scale, viewport.scale);
  ctx.drawImage(image, 0, 0, artworkWidth, artworkHeight);
  ctx.restore();
}

/**
 * Purpose:
 * Draw the guide image overlay with the same viewport transform as the artwork, scaled to fit inside
 * the artwork bounds without distortion (contain) and centered in world space.
 */

import type { ViewportState } from "@/features/editor/types/editor.types";

function computeContainedDestRect(
  imageWidth: number,
  imageHeight: number,
  artworkWidth: number,
  artworkHeight: number
): { dx: number; dy: number; dw: number; dh: number } {
  const iw = Math.max(1, imageWidth);
  const ih = Math.max(1, imageHeight);
  const aw = Math.max(1, artworkWidth);
  const ah = Math.max(1, artworkHeight);
  const scale = Math.min(aw / iw, ah / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  const dx = (aw - dw) / 2;
  const dy = (ah - dh) / 2;
  return { dx, dy, dw, dh };
}

export function renderReferenceImage(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  artworkWidth: number,
  artworkHeight: number,
  viewport: ViewportState,
  alpha: number
): void {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const iw = image.naturalWidth;
  const ih = image.naturalHeight;
  if (iw <= 0 || ih <= 0) {
    return;
  }

  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.globalAlpha = alpha;
  ctx.translate(viewport.viewOffset.x, viewport.viewOffset.y);
  ctx.scale(viewport.scale, viewport.scale);

  const { dx, dy, dw, dh } = computeContainedDestRect(
    iw,
    ih,
    artworkWidth,
    artworkHeight
  );
  ctx.drawImage(image, 0, 0, iw, ih, dx, dy, dw, dh);
  ctx.restore();
}

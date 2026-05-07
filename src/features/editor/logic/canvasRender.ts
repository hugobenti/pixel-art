/**
 * Purpose:
 * Rasterize indexed pixel data into a 2D canvas context using the artwork palette.
 */

import type { Artwork, ViewportState } from "@/features/editor/types/editor.types";

export function renderCanvas(
  ctx: CanvasRenderingContext2D,
  artwork: Pick<Artwork, "width" | "height" | "pixelData" | "palette">,
  viewport: ViewportState
): void {
  const { width, height, pixelData, palette } = artwork;

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.save();
  ctx.imageSmoothingEnabled = false;

  ctx.translate(viewport.viewOffset.x, viewport.viewOffset.y);
  ctx.scale(viewport.scale, viewport.scale);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pixelIndex = x + y * width;
      const paletteIndex = pixelData[pixelIndex];
      const color = palette[paletteIndex] ?? "transparent";

      ctx.fillStyle = color;
      ctx.fillRect(x, y, 1, 1);
    }
  }

  ctx.restore();
}

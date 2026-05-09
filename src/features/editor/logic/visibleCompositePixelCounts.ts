/**
 * Purpose:
 * Count composite (layer-stacked) palette pixels inside the editor viewport rect without double-counting overlaps.
 *
 * Notes:
 * Layer order matches canvasRender / layers list: index 0 is topmost; lower indices in the array are composited first.
 * Palette entries resolved to "transparent" do not occlude layers below (same rule as LayerPreview).
 */

import type { Artwork, ViewportState } from "@/features/editor/types/editor.types";

export function isArtworkPixelVisibleInViewport(
  ax: number,
  ay: number,
  viewport: ViewportState,
  cssW: number,
  cssH: number
): boolean {
  const { scale, viewOffset } = viewport;
  const left = viewOffset.x + scale * ax;
  const right = viewOffset.x + scale * (ax + 1);
  const top = viewOffset.y + scale * ay;
  const bottom = viewOffset.y + scale * (ay + 1);
  return right > 0 && left < cssW && bottom > 0 && top < cssH;
}

export function compositeOpaquePaletteIndexAt(
  artwork: Pick<Artwork, "width" | "height" | "layers" | "palette">,
  x: number,
  y: number
): number | null {
  const { width, height, layers, palette } = artwork;
  if (x < 0 || y < 0 || x >= width || y >= height) {
    return null;
  }
  const pixelOffset = x + y * width;
  for (let i = 0; i < layers.length; i++) {
    const layer = layers[i];
    if (!layer.visible) {
      continue;
    }
    const paletteIndex = layer.pixelData[pixelOffset];
    const color = palette[paletteIndex] ?? "transparent";
    if (color !== "transparent") {
      return paletteIndex;
    }
  }
  return null;
}

export interface VisibleCompositeCountResult {
  /** Palette index -> number of visible artwork pixels showing that index after compositing. */
  countsByPaletteIndex: Map<number, number>;
  /** Sum of counted composite pixels (opaque in the visible viewport region). */
  totalCompositeOpaque: number;
  /** Canvas pixels (artwork cells) intersecting the viewport, including fully transparent composite. */
  totalViewportCells: number;
}

export function countVisibleCompositePixelsByPaletteIndex(
  artwork: Pick<Artwork, "width" | "height" | "layers" | "palette">,
  viewport: ViewportState,
  cssW: number,
  cssH: number
): VisibleCompositeCountResult {
  const { width, height } = artwork;
  const countsByPaletteIndex = new Map<number, number>();
  let totalCompositeOpaque = 0;
  let totalViewportCells = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (!isArtworkPixelVisibleInViewport(x, y, viewport, cssW, cssH)) {
        continue;
      }
      totalViewportCells += 1;
      const idx = compositeOpaquePaletteIndexAt(artwork, x, y);
      if (idx === null) {
        continue;
      }
      totalCompositeOpaque += 1;
      countsByPaletteIndex.set(idx, (countsByPaletteIndex.get(idx) ?? 0) + 1);
    }
  }

  return { countsByPaletteIndex, totalCompositeOpaque, totalViewportCells };
}

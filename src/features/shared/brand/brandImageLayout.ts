/**
 * Purpose:
 * Layouts of the generated brand images: the pencil-end icon at every size and the 1200 × 630
 * social image, always at whole-number scales so every logo pixel stays square and sharp.
 */

import type { IBrandImageProps, IOgImageColors } from "./BrandImage.type";
import {
  BRAND_FIXED_COLORS,
  BRAND_PENCIL_GRID,
  BRAND_STATIC_THEME_COLORS,
  PENCIL_END_GRID,
} from "./brandArt";
import { gridBlocks } from "./brandPixels";

/** Icon sizes served as `/icon/{size}`: favicons, then the PWA tiles. */
export const ICON_SIZES = [16, 32, 48, 192, 512] as const;
/** Sizes up to this are favicons: transparent and edge to edge. Larger ones are tiles. */
const FAVICON_MAX = 48;
/** Share of a tile the pencil end may cover (before rounding the scale down). */
const TILE_COVERAGE = 0.7;
/** `next/og` fails on an undefined style value, so favicons get an explicit transparent fill. */
export const TRANSPARENT_BACKGROUND = "transparent";

export const OG_SIZE = { width: 1200, height: 630 } as const;
const OG_CELL = 20;
const OG_PENCIL_TOP = 200;
const OG_CAPTION_GAP = 40;
const OG_CAPTION_SIZE = 40;

const COLORS = { ...BRAND_FIXED_COLORS, ...BRAND_STATIC_THEME_COLORS };

/** The pencil end at `size` px: edge to edge for favicons, centered on a `tile` square above that. */
export function iconImage(size: number, tile: string): IBrandImageProps {
  const grid = PENCIL_END_GRID.length;
  if (size <= FAVICON_MAX) {
    return {
      width: size,
      height: size,
      background: TRANSPARENT_BACKGROUND,
      blocks: gridBlocks(PENCIL_END_GRID, COLORS, size / grid, 0, 0),
    };
  }
  const scale = Math.floor((size * TILE_COVERAGE) / grid);
  const offset = (size - grid * scale) / 2;
  return {
    width: size,
    height: size,
    background: tile,
    blocks: gridBlocks(PENCIL_END_GRID, COLORS, scale, offset, offset),
  };
}

/** The brand pencil on a faint paper grid, aligned to the grid cells, with the caption under it. */
export function ogImage({ paper, gridLine, captionColor, caption, fontFamily }: IOgImageColors): IBrandImageProps {
  const { width, height } = OG_SIZE;
  const lines = [
    ...Array.from({ length: Math.floor(width / OG_CELL) }, (_, i) => ({
      left: (i + 1) * OG_CELL,
      top: 0,
      width: 1,
      height,
      color: gridLine,
    })),
    ...Array.from({ length: Math.floor(height / OG_CELL) }, (_, i) => ({
      left: 0,
      top: (i + 1) * OG_CELL,
      width,
      height: 1,
      color: gridLine,
    })),
  ];
  const pencilWidth = BRAND_PENCIL_GRID[0].length * OG_CELL;
  const pencilLeft = (width - pencilWidth) / 2;
  const pencil = gridBlocks(BRAND_PENCIL_GRID, COLORS, OG_CELL, pencilLeft, OG_PENCIL_TOP);
  return {
    width,
    height,
    background: paper,
    blocks: [...lines, ...pencil],
    caption: {
      text: caption,
      top: OG_PENCIL_TOP + BRAND_PENCIL_GRID.length * OG_CELL + OG_CAPTION_GAP,
      fontSize: OG_CAPTION_SIZE,
      color: captionColor,
      fontFamily,
    },
  };
}

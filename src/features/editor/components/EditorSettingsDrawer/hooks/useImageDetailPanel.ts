/**
 * Purpose:
 * Derives composite color histogram rows (and the panel's summary / empty states) for the artwork region
 * currently visible in the editor viewport.
 *
 * Notes:
 * Depends on paintRevision because layer pixel buffers may be mutated in place without changing artwork identity.
 */
"use client";

import { useMemo, type CSSProperties } from "react";

import {
  formatImageDetailSummary,
  paletteSharePercent,
} from "@/features/editor/logic/imageDetailSummary";
import { countVisibleCompositePixelsByPaletteIndex } from "@/features/editor/logic/visibleCompositePixelCounts";
import type { Artwork } from "@/features/shared/artwork/artwork.types";
import type { ViewportState } from "@/features/editor/types/editor.types";

export interface ImageDetailRow {
  paletteIndex: number;
  count: number;
  color: string;
}

export interface ImageDetailRowView extends ImageDetailRow {
  /** Share of opaque composite pixels, in percent with one decimal. */
  pct: number;
  opaqueSwatch: boolean;
  swatchStyle: CSSProperties | undefined;
}

interface UseImageDetailPanelParams {
  artwork: Artwork;
  viewport: ViewportState;
  viewportCssWidth: number;
  viewportCssHeight: number;
  paintRevision: number;
}

export function useImageDetailPanel({
  artwork,
  viewport,
  viewportCssWidth,
  viewportCssHeight,
  paintRevision,
}: UseImageDetailPanelParams) {
  return useMemo(() => {
    const summary = countVisibleCompositePixelsByPaletteIndex(
      artwork,
      viewport,
      viewportCssWidth,
      viewportCssHeight
    );

    const rows: ImageDetailRow[] = [...summary.countsByPaletteIndex.entries()]
      .map(([paletteIndex, count]) => ({
        paletteIndex,
        count,
        color: artwork.palette[paletteIndex] ?? "transparent",
      }))
      .sort((a, b) => {
        if (b.count !== a.count) {
          return b.count - a.count;
        }
        return a.paletteIndex - b.paletteIndex;
      });

    const { totalCompositeOpaque, totalViewportCells } = summary;

    const rowViews: ImageDetailRowView[] = rows.map((row) => {
      const opaqueSwatch = row.color !== "transparent";
      return {
        ...row,
        pct: paletteSharePercent(row.count, totalCompositeOpaque),
        opaqueSwatch,
        swatchStyle: opaqueSwatch ? { backgroundColor: row.color } : undefined,
      };
    });

    return {
      rows: rowViews,
      summaryText: formatImageDetailSummary(totalCompositeOpaque, totalViewportCells),
      showViewportEmpty: totalViewportCells === 0,
      showTransparentEmpty: totalViewportCells !== 0 && totalCompositeOpaque === 0,
      showRows: totalViewportCells !== 0 && totalCompositeOpaque !== 0,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- paintRevision bumps when pixel buffers change in place
  }, [
    artwork,
    viewport,
    viewportCssWidth,
    viewportCssHeight,
    paintRevision,
  ]);
}

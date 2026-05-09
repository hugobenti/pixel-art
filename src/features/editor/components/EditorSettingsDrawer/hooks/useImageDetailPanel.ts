/**
 * Purpose:
 * Derives composite color histogram rows for the artwork region currently visible in the editor viewport.
 *
 * Notes:
 * Depends on paintRevision because layer pixel buffers may be mutated in place without changing artwork identity.
 */
"use client";

import { useMemo } from "react";

import { countVisibleCompositePixelsByPaletteIndex } from "@/features/editor/logic/visibleCompositePixelCounts";
import type { Artwork, ViewportState } from "@/features/editor/types/editor.types";

export interface ImageDetailRow {
  paletteIndex: number;
  count: number;
  color: string;
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

    return {
      rows,
      totalCompositeOpaque: summary.totalCompositeOpaque,
      totalViewportCells: summary.totalViewportCells,
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

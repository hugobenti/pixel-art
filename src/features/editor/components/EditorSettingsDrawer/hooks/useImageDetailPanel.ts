/**
 * Purpose:
 * Image detail view model: composite palette usage rows for the artwork region currently visible in the
 * editor viewport, their labels and swatch fill, the summary line and the empty-state message.
 *
 * Notes:
 * Depends on paintRevision because layer pixel buffers may be mutated in place without changing artwork identity.
 */
"use client";

import { useMemo } from "react";

import { editor } from "@/content/editor";
import { paletteUsageRows } from "@/features/editor/logic/paletteUsageRows";
import { countVisibleCompositePixelsByPaletteIndex } from "@/features/editor/logic/visibleCompositePixelCounts";
import type { IImageDetailRow, IUseImageDetailPanelParams } from "./useImageDetailPanel.type";

export function useImageDetailPanel({
  artwork,
  viewport,
  viewportCssWidth,
  viewportCssHeight,
  paintRevision,
}: IUseImageDetailPanelParams) {
  return useMemo(() => {
    const copy = editor.settings.imageDetail;
    const { countsByPaletteIndex, totalCompositeOpaque, totalViewportCells } =
      countVisibleCompositePixelsByPaletteIndex(
        artwork,
        viewport,
        viewportCssWidth,
        viewportCssHeight,
      );

    const rows: IImageDetailRow[] = paletteUsageRows(
      countsByPaletteIndex,
      totalCompositeOpaque,
      artwork.palette,
    ).map((row) => {
      const transparent = row.color === "transparent";
      return {
        ...row,
        transparent,
        swatchStyle: transparent ? undefined : { backgroundColor: row.color },
        entryLabel: copy.paletteEntry(row.paletteIndex),
        percentLabel: copy.percent(row.percent),
      };
    });

    let emptyMessage: string | null = null;
    if (totalViewportCells === 0) {
      emptyMessage = copy.emptyViewport;
    } else if (totalCompositeOpaque === 0) {
      emptyMessage = copy.allTransparent;
    }

    return {
      rows,
      summary:
        totalViewportCells === 0
          ? copy.noIntersection
          : copy.summary(totalCompositeOpaque, totalViewportCells),
      emptyMessage,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- paintRevision bumps when pixel buffers change in place
  }, [artwork, viewport, viewportCssWidth, viewportCssHeight, paintRevision]);
}

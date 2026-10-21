/**
 * Purpose:
 * Settings drill-in view that lists palette color usage for composited pixels in the current viewport.
 */
"use client";

import type { Artwork } from "@/features/shared/artwork/artwork.types";
import type { ViewportState } from "@/features/editor/types/editor.types";

import { editorSettingsImageDetailPanel } from "@/features/editor/components/EditorSettingsDrawer/EditorSettingsImageDetailPanel.style";
import { useImageDetailPanel } from "@/features/editor/components/EditorSettingsDrawer/hooks/useImageDetailPanel";
import { cx } from "@/features/shared/utils/cx";

interface EditorSettingsImageDetailPanelProps {
  artwork: Artwork;
  viewport: ViewportState;
  viewportCssWidth: number;
  viewportCssHeight: number;
  paintRevision: number;
}

export function EditorSettingsImageDetailPanel({
  artwork,
  viewport,
  viewportCssWidth,
  viewportCssHeight,
  paintRevision,
}: EditorSettingsImageDetailPanelProps) {
  const { rows, summaryText, showViewportEmpty, showTransparentEmpty, showRows } =
    useImageDetailPanel({
      artwork,
      viewport,
      viewportCssWidth,
      viewportCssHeight,
      paintRevision,
    });

  return (
    <div className={editorSettingsImageDetailPanel.root}>
      <p className={editorSettingsImageDetailPanel.hint}>{summaryText}</p>
      {showViewportEmpty && (
        <div className={editorSettingsImageDetailPanel.empty}>
          Pan or zoom so the canvas viewport overlaps your artwork.
        </div>
      )}
      {showTransparentEmpty && (
        <div className={editorSettingsImageDetailPanel.empty}>
          Every visible cell is fully transparent in the composite stack.
        </div>
      )}
      {showRows && (
        <ul className={editorSettingsImageDetailPanel.list}>
          {rows.map((row) => (
            <li key={row.paletteIndex} className={editorSettingsImageDetailPanel.row}>
              <span
                className={cx(
                  editorSettingsImageDetailPanel.swatch,
                  !row.opaqueSwatch && editorSettingsImageDetailPanel.swatchTransparent
                )}
                style={row.swatchStyle}
                aria-hidden
              />
              <div className={editorSettingsImageDetailPanel.rowMeta}>
                <span className={editorSettingsImageDetailPanel.rowTitle}>
                  Palette #{row.paletteIndex}
                </span>
                <span className={editorSettingsImageDetailPanel.rowSub}>{row.color}</span>
              </div>
              <span className={editorSettingsImageDetailPanel.count}>{row.count}</span>
              <span className={editorSettingsImageDetailPanel.pct}>{row.pct}%</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

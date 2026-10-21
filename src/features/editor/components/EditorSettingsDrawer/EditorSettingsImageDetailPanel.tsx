/**
 * Purpose:
 * Settings drill-in view that lists palette color usage for composited pixels in the current viewport.
 */
"use client";

import { editor } from "@/content/editor";
import { useImageDetailPanel } from "@/features/editor/components/EditorSettingsDrawer/hooks/useImageDetailPanel";
import type { IEditorSettingsImageDetailPanelProps } from "./EditorSettingsImageDetailPanel.type";

const rootClass = "flex min-h-0 flex-1 flex-col gap-4 px-4 pb-4 pt-0 sm:px-4";

const hintClass = "text-xs font-normal leading-relaxed text-subtle";

const listClass =
  "max-h-[min(55vh,28rem)] min-h-0 divide-y divide-line overflow-y-auto rounded-lg border border-line bg-surface-subtle";

const rowClass = "flex items-center gap-3 px-3 py-2.5 text-sm text-fg";

const rowMetaClass = "flex min-w-0 flex-1 flex-col gap-0.5";

const rowTitleClass = "truncate font-medium tabular-nums";

const rowSubClass = "truncate text-xs font-normal text-subtle";

const swatchBaseClass =
  "h-9 w-9 shrink-0 rounded border border-line-strong shadow-inner";

const swatchTransparentClass = `${swatchBaseClass} bg-surface-strong`;

const countClass = "shrink-0 tabular-nums text-fg-secondary";

const pctClass = "w-12 shrink-0 text-right text-xs tabular-nums text-subtle";

const emptyClass =
  "rounded-lg border border-dashed border-line-strong bg-surface px-3 py-6 text-center text-sm text-muted";

export function EditorSettingsImageDetailPanel({
  artwork,
  viewport,
  viewportCssWidth,
  viewportCssHeight,
  paintRevision,
}: IEditorSettingsImageDetailPanelProps) {
  const { rows, totalCompositeOpaque, totalViewportCells } = useImageDetailPanel({
    artwork,
    viewport,
    viewportCssWidth,
    viewportCssHeight,
    paintRevision,
  });

  const copy = editor.settings.imageDetail;
  const summaryPrefix =
    totalViewportCells === 0
      ? copy.noIntersection
      : copy.summary(totalCompositeOpaque, totalViewportCells);

  return (
    <div className={rootClass}>
      <p className={hintClass}>{summaryPrefix}</p>
      {totalViewportCells === 0 ? (
        <div className={emptyClass}>{copy.emptyViewport}</div>
      ) : totalCompositeOpaque === 0 ? (
        <div className={emptyClass}>
          {copy.allTransparent}
        </div>
      ) : (
        <ul className={listClass}>
          {rows.map((row) => {
            const pct =
              totalCompositeOpaque > 0
                ? Math.round((row.count / totalCompositeOpaque) * 1000) / 10
                : 0;
            const opaqueSwatch = row.color !== "transparent";

            return (
              <li key={row.paletteIndex} className={rowClass}>
                <span
                  className={opaqueSwatch ? swatchBaseClass : swatchTransparentClass}
                  style={opaqueSwatch ? { backgroundColor: row.color } : undefined}
                  aria-hidden
                />
                <div className={rowMetaClass}>
                  <span className={rowTitleClass}>{copy.paletteEntry(row.paletteIndex)}</span>
                  <span className={rowSubClass}>{row.color}</span>
                </div>
                <span className={countClass}>{row.count}</span>
                <span className={pctClass}>{copy.percent(pct)}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/**
 * Purpose:
 * Settings drill-in view that lists palette color usage for composited pixels in the current viewport.
 */
"use client";

import type { Artwork, ViewportState } from "@/features/editor/types/editor.types";

import { useImageDetailPanel } from "@/features/editor/components/EditorSettingsDrawer/hooks/useImageDetailPanel";

interface EditorSettingsImageDetailPanelProps {
  artwork: Artwork;
  viewport: ViewportState;
  viewportCssWidth: number;
  viewportCssHeight: number;
  paintRevision: number;
}

const rootClass = "flex min-h-0 flex-1 flex-col gap-4 px-4 pb-4 pt-0 sm:px-4";

const hintClass = "text-xs font-normal leading-relaxed text-zinc-500";

const listClass =
  "max-h-[min(55vh,28rem)] min-h-0 divide-y divide-zinc-200 overflow-y-auto rounded-lg border border-zinc-200 bg-zinc-50";

const rowClass = "flex items-center gap-3 px-3 py-2.5 text-sm text-zinc-900";

const rowMetaClass = "flex min-w-0 flex-1 flex-col gap-0.5";

const rowTitleClass = "truncate font-medium tabular-nums";

const rowSubClass = "truncate text-xs font-normal text-zinc-500";

const swatchBaseClass =
  "h-9 w-9 shrink-0 rounded border border-zinc-300 shadow-inner";

const swatchTransparentClass = `${swatchBaseClass} bg-zinc-200`;

const countClass = "shrink-0 tabular-nums text-zinc-700";

const pctClass = "w-12 shrink-0 text-right text-xs tabular-nums text-zinc-500";

const emptyClass =
  "rounded-lg border border-dashed border-zinc-300 bg-white px-3 py-6 text-center text-sm text-zinc-600";

export function EditorSettingsImageDetailPanel({
  artwork,
  viewport,
  viewportCssWidth,
  viewportCssHeight,
  paintRevision,
}: EditorSettingsImageDetailPanelProps) {
  const { rows, totalCompositeOpaque, totalViewportCells } = useImageDetailPanel({
    artwork,
    viewport,
    viewportCssWidth,
    viewportCssHeight,
    paintRevision,
  });

  const summaryPrefix =
    totalViewportCells === 0
      ? "No artwork pixels intersect the visible viewport."
      : `${totalCompositeOpaque} composited pixel${totalCompositeOpaque === 1 ? "" : "s"} across ${totalViewportCells} visible cell${totalViewportCells === 1 ? "" : "s"} (layers stacked; no double counting).`;

  return (
    <div className={rootClass}>
      <p className={hintClass}>{summaryPrefix}</p>
      {totalViewportCells === 0 ? (
        <div className={emptyClass}>Pan or zoom so the canvas viewport overlaps your artwork.</div>
      ) : totalCompositeOpaque === 0 ? (
        <div className={emptyClass}>
          Every visible cell is fully transparent in the composite stack.
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
                  <span className={rowTitleClass}>Palette #{row.paletteIndex}</span>
                  <span className={rowSubClass}>{row.color}</span>
                </div>
                <span className={countClass}>{row.count}</span>
                <span className={pctClass}>{pct}%</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/**
 * Purpose:
 * Settings drill-in view that lists palette color usage for composited pixels in the current viewport.
 */
"use client";

import { cx } from "@/features/shared/utils/cx";

import { useImageDetailPanel } from "@/features/editor/components/EditorSettingsDrawer/hooks/useImageDetailPanel";
import { editorSettingsImageDetailPanel } from "./EditorSettingsImageDetailPanel.style";
import type { IEditorSettingsImageDetailPanelProps } from "./EditorSettingsImageDetailPanel.type";

export function EditorSettingsImageDetailPanel(props: IEditorSettingsImageDetailPanelProps) {
  const { rows, summary, emptyMessage } = useImageDetailPanel(props);

  return (
    <div className={editorSettingsImageDetailPanel.root}>
      <p className={editorSettingsImageDetailPanel.hint}>{summary}</p>
      {emptyMessage !== null ? (
        <div className={editorSettingsImageDetailPanel.empty}>{emptyMessage}</div>
      ) : (
        <ul className={editorSettingsImageDetailPanel.list}>
          {rows.map((row) => (
            <li key={row.paletteIndex} className={editorSettingsImageDetailPanel.row}>
              <span
                className={cx(
                  editorSettingsImageDetailPanel.swatch,
                  row.transparent && editorSettingsImageDetailPanel.swatchTransparent,
                )}
                style={row.swatchStyle}
                aria-hidden
              />
              <div className={editorSettingsImageDetailPanel.meta}>
                <span className={editorSettingsImageDetailPanel.entry}>{row.entryLabel}</span>
                <span className={editorSettingsImageDetailPanel.sub}>{row.color}</span>
              </div>
              <span className={editorSettingsImageDetailPanel.count}>{row.count}</span>
              <span className={editorSettingsImageDetailPanel.percent}>{row.percentLabel}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * Purpose:
 * Classes for the EditorSettingsImageDetailPanel: palette usage list rows, swatches and the empty state.
 */

import { settingsPanel } from "./settingsPanel.style";

export const editorSettingsImageDetailPanel = {
  root: settingsPanel.root,
  hint: settingsPanel.hint,
  list: "max-h-[min(55vh,28rem)] min-h-0 divide-y divide-line overflow-y-auto rounded-lg border border-line bg-surface-subtle",
  row: "flex items-center gap-3 px-3 py-2.5 text-sm text-fg",
  swatch: "h-9 w-9 shrink-0 rounded border border-line-strong shadow-inner",
  /** Added to the swatch of an index with no palette color (shown as "transparent"). */
  swatchTransparent: "bg-surface-strong",
  meta: "flex min-w-0 flex-1 flex-col gap-0.5",
  entry: "truncate font-medium tabular-nums",
  sub: "truncate text-xs font-normal text-subtle",
  count: "shrink-0 text-fg-secondary tabular-nums",
  percent: "w-12 shrink-0 text-right text-xs text-subtle tabular-nums",
  empty:
    "rounded-lg border border-dashed border-line-strong bg-surface px-3 py-6 text-center text-sm text-muted",
};

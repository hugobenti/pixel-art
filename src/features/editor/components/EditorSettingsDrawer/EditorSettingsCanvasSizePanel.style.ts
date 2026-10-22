/**
 * Purpose:
 * Classes for the EditorSettingsCanvasSizePanel: width/height grid and cancel/apply row.
 */

import { settingsPanel } from "./settingsPanel.style";

export const editorSettingsCanvasSizePanel = {
  root: settingsPanel.root,
  hint: settingsPanel.hint,
  grid: "grid grid-cols-2 gap-3",
  actions: "flex flex-wrap items-center justify-end gap-2 pt-1",
  button: settingsPanel.actionButton,
};

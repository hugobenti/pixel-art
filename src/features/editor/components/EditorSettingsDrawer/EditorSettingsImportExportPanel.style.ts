/**
 * Purpose:
 * Classes for the EditorSettingsImportExportPanel: export section card and its buttons.
 */

import { settingsPanel } from "./settingsPanel.style";

export const editorSettingsImportExportPanel = {
  root: settingsPanel.root,
  hint: settingsPanel.hint,
  section: "rounded-lg border border-line bg-surface-subtle p-3",
  sectionTitle: "text-sm font-semibold text-fg",
  actions: "mt-3 flex flex-wrap gap-2",
  button: settingsPanel.actionButton,
};

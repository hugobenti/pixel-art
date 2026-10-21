/**
 * Purpose:
 * Drawer header title per editor settings view.
 */

import type { EditorSettingsView } from "@/features/editor/components/EditorSettingsDrawer/hooks/useCanvasSizePanel";

export const EDITOR_SETTINGS_TITLES: Record<EditorSettingsView, string> = {
  menu: "Settings",
  canvasSize: "Canvas size",
  imageDetail: "Image detail",
  importExport: "Export",
};

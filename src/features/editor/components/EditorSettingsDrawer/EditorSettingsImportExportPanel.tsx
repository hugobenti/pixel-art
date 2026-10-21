/**
 * Purpose:
 * Settings drill-in view that provides artwork export controls.
 */
"use client";

import { Button } from "@/features/shared/components/Button";

import { editorSettingsImportExportPanel } from "@/features/editor/components/EditorSettingsDrawer/EditorSettingsImportExportPanel.style";

interface EditorSettingsImportExportPanelProps {
  onExportPng: () => void;
  onExportJson: () => void;
}

export function EditorSettingsImportExportPanel({
  onExportPng,
  onExportJson,
}: EditorSettingsImportExportPanelProps) {
  return (
    <div className={editorSettingsImportExportPanel.root}>
      <p className={editorSettingsImportExportPanel.hint}>
        Export a snapshot of the current artwork as PNG or export the full editable document as
        JSON.
      </p>

      <section className={editorSettingsImportExportPanel.section} aria-label="Export document">
        <h3 className={editorSettingsImportExportPanel.sectionTitle}>Export</h3>
        <div className={editorSettingsImportExportPanel.actions}>
          <Button
            type="button"
            variant="outline"
            className={editorSettingsImportExportPanel.button}
            onClick={onExportPng}
          >
            Export PNG
          </Button>
          <Button
            type="button"
            variant="outline"
            className={editorSettingsImportExportPanel.button}
            onClick={onExportJson}
          >
            Export JSON
          </Button>
        </div>
      </section>
    </div>
  );
}

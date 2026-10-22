/**
 * Purpose:
 * Settings drill-in view that provides artwork export controls.
 */
"use client";

import { editor } from "@/content/editor";
import { Button } from "@/features/shared/components/Button";
import { editorSettingsImportExportPanel } from "./EditorSettingsImportExportPanel.style";
import type { IEditorSettingsImportExportPanelProps } from "./EditorSettingsImportExportPanel.type";

export function EditorSettingsImportExportPanel({
  onExportPng,
  onExportJson,
}: IEditorSettingsImportExportPanelProps) {
  return (
    <div className={editorSettingsImportExportPanel.root}>
      <p className={editorSettingsImportExportPanel.hint}>{editor.settings.export.hint}</p>

      <section
        className={editorSettingsImportExportPanel.section}
        aria-label={editor.settings.export.sectionLabel}
      >
        <h3 className={editorSettingsImportExportPanel.sectionTitle}>
          {editor.settings.export.title}
        </h3>
        <div className={editorSettingsImportExportPanel.actions}>
          <Button
            type="button"
            variant="outline"
            className={editorSettingsImportExportPanel.button}
            onClick={onExportPng}
          >
            {editor.settings.export.png}
          </Button>
          <Button
            type="button"
            variant="outline"
            className={editorSettingsImportExportPanel.button}
            onClick={onExportJson}
          >
            {editor.settings.export.json}
          </Button>
        </div>
      </section>
    </div>
  );
}

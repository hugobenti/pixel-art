/**
 * Purpose:
 * Settings drill-in view that provides artwork export controls.
 */
"use client";

import { Button } from "@/features/shared/components/Button";

interface EditorSettingsImportExportPanelProps {
  onExportPng: () => void;
  onExportJson: () => void;
}

const rootClass = "flex min-h-0 flex-1 flex-col gap-4 px-4 pb-4 pt-0 sm:px-4";
const hintClass = "text-xs font-normal leading-relaxed text-zinc-500";
const sectionClass = "rounded-lg border border-zinc-200 bg-zinc-50 p-3";
const sectionTitleClass = "text-sm font-semibold text-zinc-900";
const actionsClass = "mt-3 flex flex-wrap gap-2";
const buttonClass = "min-h-10 touch-manipulation px-4 sm:min-h-9";

export function EditorSettingsImportExportPanel({
  onExportPng,
  onExportJson,
}: EditorSettingsImportExportPanelProps) {
  return (
    <div className={rootClass}>
      <p className={hintClass}>
        Export a snapshot of the current artwork as PNG or export the full editable document as
        JSON.
      </p>

      <section className={sectionClass} aria-label="Export document">
        <h3 className={sectionTitleClass}>Export</h3>
        <div className={actionsClass}>
          <Button type="button" variant="outline" className={buttonClass} onClick={onExportPng}>
            Export PNG
          </Button>
          <Button type="button" variant="outline" className={buttonClass} onClick={onExportJson}>
            Export JSON
          </Button>
        </div>
      </section>
    </div>
  );
}

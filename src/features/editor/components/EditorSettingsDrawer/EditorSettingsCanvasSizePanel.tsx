/**
 * Purpose:
 * Form layout for editing canvas width and height inside the settings drawer drill-in view.
 */
"use client";

import { editor } from "@/content/editor";
import { shared } from "@/content/shared";
import { Button } from "@/features/shared/components/Button";
import { FormField } from "@/features/shared/components/FormField";
import { Input } from "@/features/shared/components/Input";

import { MAX_CANVAS_DIMENSION } from "@/features/shared/artwork/artworkService";

interface EditorSettingsCanvasSizePanelProps {
  widthStr: string;
  heightStr: string;
  onWidthChange: (value: string) => void;
  onHeightChange: (value: string) => void;
  onCancel: () => void;
  onApply: () => void;
}

const rootClass = "flex min-h-0 flex-1 flex-col gap-4 px-4 pb-4 pt-0 sm:px-4";

const gridClass = "grid grid-cols-2 gap-3";

const hintClass = "text-xs font-normal leading-relaxed text-subtle";

const actionsClass = "flex flex-wrap items-center justify-end gap-2 pt-1";

const cancelButtonClass =
  "min-h-10 touch-manipulation px-4 sm:min-h-9";

const applyButtonClass =
  "min-h-10 touch-manipulation px-4 sm:min-h-9";

export function EditorSettingsCanvasSizePanel({
  widthStr,
  heightStr,
  onWidthChange,
  onHeightChange,
  onCancel,
  onApply,
}: EditorSettingsCanvasSizePanelProps) {
  return (
    <div className={rootClass}>
      <p className={hintClass}>{editor.settings.canvasSize.hint}</p>
      <div className={gridClass}>
        <FormField label={shared.fields.width} htmlFor="settings-canvas-width">
          <Input
            id="settings-canvas-width"
            inputMode="numeric"
            min={1}
            max={MAX_CANVAS_DIMENSION}
            value={widthStr}
            onChange={(ev) => {
              onWidthChange(ev.target.value);
            }}
            required
          />
        </FormField>
        <FormField label={shared.fields.height} htmlFor="settings-canvas-height">
          <Input
            id="settings-canvas-height"
            inputMode="numeric"
            min={1}
            max={MAX_CANVAS_DIMENSION}
            value={heightStr}
            onChange={(ev) => {
              onHeightChange(ev.target.value);
            }}
            required
          />
        </FormField>
      </div>
      <div className={actionsClass}>
        <Button
          type="button"
          variant="outline"
          className={cancelButtonClass}
          onClick={onCancel}
        >
          {shared.actions.cancel}
        </Button>
        <Button
          type="button"
          variant="primary"
          className={applyButtonClass}
          onClick={onApply}
        >
          {shared.actions.apply}
        </Button>
      </div>
    </div>
  );
}

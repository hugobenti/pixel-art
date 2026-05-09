/**
 * Purpose:
 * Form layout for editing canvas width and height inside the settings drawer drill-in view.
 */
"use client";

import { Button } from "@/features/shared/components/Button";
import { FormField } from "@/features/shared/components/FormField";
import { Input } from "@/features/shared/components/Input";

import { MAX_CANVAS_DIMENSION } from "@/features/gallery/services/galleryService";

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

const hintClass = "text-xs font-normal leading-relaxed text-zinc-500";

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
      <p className={hintClass}>
        Pixels stay anchored to the top-left. New cells use white from the palette when present,
        otherwise the first swatch. Undo history for this artwork is cleared after the size
        changes.
      </p>
      <div className={gridClass}>
        <FormField label="Width (px)" htmlFor="settings-canvas-width">
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
        <FormField label="Height (px)" htmlFor="settings-canvas-height">
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
          Cancel
        </Button>
        <Button
          type="button"
          variant="primary"
          className={applyButtonClass}
          onClick={onApply}
        >
          Apply
        </Button>
      </div>
    </div>
  );
}

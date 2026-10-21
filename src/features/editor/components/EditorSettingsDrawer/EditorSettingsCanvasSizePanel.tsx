/**
 * Purpose:
 * Form layout for editing canvas width and height inside the settings drawer drill-in view.
 */
"use client";

import { Button } from "@/features/shared/components/Button";
import { FormField } from "@/features/shared/components/FormField";
import { Input } from "@/features/shared/components/Input";

import { editorSettingsCanvasSizePanel } from "@/features/editor/components/EditorSettingsDrawer/EditorSettingsCanvasSizePanel.style";
import { MAX_CANVAS_DIMENSION } from "@/features/shared/artwork/artworkService";

interface EditorSettingsCanvasSizePanelProps {
  widthStr: string;
  heightStr: string;
  onWidthChange: (value: string) => void;
  onHeightChange: (value: string) => void;
  onCancel: () => void;
  onApply: () => void;
}

export function EditorSettingsCanvasSizePanel({
  widthStr,
  heightStr,
  onWidthChange,
  onHeightChange,
  onCancel,
  onApply,
}: EditorSettingsCanvasSizePanelProps) {
  return (
    <div className={editorSettingsCanvasSizePanel.root}>
      <p className={editorSettingsCanvasSizePanel.hint}>
        Pixels stay anchored to the top-left. New cells use white from the palette when present,
        otherwise the first swatch. Undo history for this artwork is cleared after the size
        changes.
      </p>
      <div className={editorSettingsCanvasSizePanel.grid}>
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
      <div className={editorSettingsCanvasSizePanel.actions}>
        <Button
          type="button"
          variant="outline"
          className={editorSettingsCanvasSizePanel.cancelButton}
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="primary"
          className={editorSettingsCanvasSizePanel.applyButton}
          onClick={onApply}
        >
          Apply
        </Button>
      </div>
    </div>
  );
}

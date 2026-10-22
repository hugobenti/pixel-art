/**
 * Purpose:
 * Canvas width and height form inside the settings drawer drill-in view; Enter or Apply submits,
 * invalid sizes show inline under their field.
 */
"use client";

import { editor } from "@/content/editor";
import { shared } from "@/content/shared";
import { Button } from "@/features/shared/components/Button";
import { NumberField } from "@/features/shared/components/NumberField";
import { editorSettingsCanvasSizePanel } from "./EditorSettingsCanvasSizePanel.style";
import type { IEditorSettingsCanvasSizePanelProps } from "./EditorSettingsCanvasSizePanel.type";
import { useEditorSettingsCanvasSizePanel } from "./useEditorSettingsCanvasSizePanel";

export function EditorSettingsCanvasSizePanel(props: IEditorSettingsCanvasSizePanelProps) {
  const { widthStr, heightStr, onCancel } = props;
  const { errors, widthRef, heightRef, maxDimension, changeWidth, changeHeight, submit } =
    useEditorSettingsCanvasSizePanel(props);

  return (
    <form className={editorSettingsCanvasSizePanel.root} onSubmit={submit}>
      <p className={editorSettingsCanvasSizePanel.hint}>{editor.settings.canvasSize.hint}</p>
      <div className={editorSettingsCanvasSizePanel.grid}>
        <NumberField
          ref={widthRef}
          label={shared.fields.width}
          name="width"
          min={1}
          max={maxDimension}
          value={widthStr}
          onChange={changeWidth}
          error={errors.width}
        />
        <NumberField
          ref={heightRef}
          label={shared.fields.height}
          name="height"
          min={1}
          max={maxDimension}
          value={heightStr}
          onChange={changeHeight}
          error={errors.height}
        />
      </div>
      <div className={editorSettingsCanvasSizePanel.actions}>
        <Button
          type="button"
          variant="outline"
          className={editorSettingsCanvasSizePanel.button}
          onClick={onCancel}
        >
          {shared.actions.cancel}
        </Button>
        <Button type="submit" variant="primary" className={editorSettingsCanvasSizePanel.button}>
          {shared.actions.apply}
        </Button>
      </div>
    </form>
  );
}

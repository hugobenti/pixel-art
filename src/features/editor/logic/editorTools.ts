/**
 * Purpose:
 * Switching between the editor's tools: pan, bucket and the color picker are exclusive (brush is none of
 * them), and the picker gives back the paint tool it was armed from: bucket, or the brush (never pan).
 */

import type { IEditorToolState, TEditorToolAction } from "./editorTools.type";

const BRUSH: IEditorToolState = {
  panMode: false,
  bucketMode: false,
  pickerArmed: false,
  pickerReturnsToBucket: false,
};

/** Disarms the picker and restores the paint tool it remembered. */
function disarmPicker(state: IEditorToolState): IEditorToolState {
  return { ...BRUSH, bucketMode: state.pickerReturnsToBucket };
}

export function applyToolAction(state: IEditorToolState, action: TEditorToolAction): IEditorToolState {
  switch (action) {
    case "togglePan":
      return state.panMode ? BRUSH : { ...BRUSH, panMode: true };
    case "toggleBucket":
      return state.bucketMode ? BRUSH : { ...BRUSH, bucketMode: true };
    case "togglePicker":
      return state.pickerArmed
        ? disarmPicker(state)
        : { ...BRUSH, pickerArmed: true, pickerReturnsToBucket: state.bucketMode };
    case "pickApplied":
      return state.pickerArmed ? disarmPicker(state) : state;
  }
}

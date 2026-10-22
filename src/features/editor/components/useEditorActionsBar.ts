/**
 * Purpose:
 * EditorActionsBar view model: the active painting slot's name and the slot toggle's accessible name.
 */
"use client";

import { editor } from "@/content/editor";
import type { IEditorActionsBarProps } from "./EditorActionsBar.type";

export function useEditorActionsBar({ activeSlot }: IEditorActionsBarProps) {
  const slotLabel = editor.toolbar.slot[activeSlot];

  return { slotLabel, slotAriaLabel: editor.toolbar.slot.label(slotLabel) };
}

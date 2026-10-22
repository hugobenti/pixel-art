/**
 * Purpose:
 * PaletteEditModal behavior: the swatch being edited (kept inside the palette) and its color, and the
 * add-color picker, which starts from a neutral gray each time the modal opens.
 */
"use client";

import { useId, useState, type ChangeEvent } from "react";

import { clampPaletteIndex } from "@/features/editor/logic/paletteMutations";
import type { IPaletteEditModalProps } from "./PaletteEditModal.type";

/** Shown for the edited swatch when the palette is empty. */
const EMPTY_PALETTE_COLOR = "#000000";
/** Starting value of the add-color picker. */
const NEW_COLOR_DEFAULT = "#808080";

export function usePaletteEditModal({
  open,
  palette,
  focusedSwatchIndex,
  onApplyHex,
  onAddColor,
  onRemoveSwatch,
}: IPaletteEditModalProps) {
  const titleId = useId();
  const focusedIndex = clampPaletteIndex(focusedSwatchIndex, palette.length);

  const [newHex, setNewHex] = useState(NEW_COLOR_DEFAULT);
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setNewHex(NEW_COLOR_DEFAULT);
    }
  }

  return {
    titleId,
    focusedIndex,
    editHex: palette[focusedIndex] ?? EMPTY_PALETTE_COLOR,
    applyEditHex: (event: ChangeEvent<HTMLInputElement>) => {
      onApplyHex(focusedIndex, event.target.value);
    },
    removeFocused: () => {
      onRemoveSwatch(focusedIndex);
    },
    newHex,
    changeNewHex: (event: ChangeEvent<HTMLInputElement>) => {
      setNewHex(event.target.value);
    },
    addNewColor: () => {
      onAddColor(newHex);
    },
  };
}

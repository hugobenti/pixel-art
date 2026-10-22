/**
 * Purpose:
 * PaletteEditModal behavior: the swatch being edited (kept inside the palette) and its color, and the
 * add-color field, which starts from a neutral gray each time the modal opens.
 */
"use client";

import { useState } from "react";

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
  const focusedIndex = clampPaletteIndex(focusedSwatchIndex, palette.length);
  const [newHex, setNewHex] = useState(NEW_COLOR_DEFAULT);
  const [newColorValid, setNewColorValid] = useState(true);
  const [wasOpen, setWasOpen] = useState(open);
  /** Bumped on every open; keys the add-color field so it remounts even if reopened mid exit-fade. */
  const [openCount, setOpenCount] = useState(0);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setNewHex(NEW_COLOR_DEFAULT);
      setNewColorValid(true);
      setOpenCount((count) => count + 1);
    }
  }

  return {
    focusedIndex,
    editHex: palette[focusedIndex] ?? EMPTY_PALETTE_COLOR,
    applyEditHex: (hex: string) => {
      onApplyHex(focusedIndex, hex);
    },
    removeFocused: () => {
      onRemoveSwatch(focusedIndex);
    },
    newHex,
    setNewHex,
    newColorValid,
    setNewColorValid,
    newColorFieldKey: openCount,
    addNewColor: () => {
      if (newColorValid) onAddColor(newHex);
    },
  };
}

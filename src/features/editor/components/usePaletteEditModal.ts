/**
 * Purpose:
 * PaletteEditModal behavior: the swatch being edited (kept inside the palette) and its color, its
 * removal (with a replacement step when pixels use it), and the add-color field, which starts from a
 * neutral gray each time the modal opens and refuses a color the palette already holds.
 *
 * Notes:
 * The duplicate check runs on Add, not while typing: the field applies `#RGB` shorthand only on blur,
 * so `newHex` can lag the text. Clicking Add blurs the field first, so the check sees what was typed.
 */
"use client";

import { useState } from "react";

import { editor } from "@/content/editor";
import { clampPaletteIndex, paletteHasColor } from "@/features/editor/logic/paletteMutations";
import type { IPaletteEditModalProps } from "./PaletteEditModal.type";
import { usePaletteRemoval } from "./usePaletteRemoval";

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
  getColorUsage,
  maxPaletteReached,
}: IPaletteEditModalProps) {
  const focusedIndex = clampPaletteIndex(focusedSwatchIndex, palette.length);
  const removal = usePaletteRemoval({ palette, getColorUsage, onRemoveSwatch });
  const [newHex, setNewHex] = useState(NEW_COLOR_DEFAULT);
  const [newColorValid, setNewColorValid] = useState(true);
  /** Set when Add refuses a duplicate; any edit to the field clears it. */
  const [duplicateRejected, setDuplicateRejected] = useState(false);
  /** A full palette outranks a refused duplicate. */
  const addNote = maxPaletteReached
    ? editor.paletteModal.paletteFull
    : duplicateRejected
      ? editor.paletteModal.colorExists
      : null;
  const [wasOpen, setWasOpen] = useState(open);
  /** Bumped on every open; keys the add-color field so it remounts even if reopened mid exit-fade. */
  const [openCount, setOpenCount] = useState(0);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setNewHex(NEW_COLOR_DEFAULT);
      setNewColorValid(true);
      setDuplicateRejected(false);
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
      removal.requestRemove(focusedIndex);
    },
    removal,
    newHex,
    setNewHex,
    /** The field reports validity on every picker change and keystroke, so it doubles as "edited". */
    changeNewColorValidity: (valid: boolean) => {
      setNewColorValid(valid);
      setDuplicateRejected(false);
    },
    newColorFieldKey: openCount,
    addNote,
    addDisabled: maxPaletteReached || !newColorValid,
    addNewColor: () => {
      if (!newColorValid) return;
      if (paletteHasColor(palette, newHex)) {
        setDuplicateRejected(true);
        return;
      }
      onAddColor(newHex);
    },
  };
}

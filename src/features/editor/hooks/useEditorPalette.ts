/**
 * Purpose:
 * Editor palette UI state: active paint/swatch slot, focused swatch for the color picker, and palette mutations.
 *
 * Notes:
 * Removing a color pushes a history command (Undo restores the color, its pixels and the color slots)
 * and shows a toast with an Undo action.
 */
"use client";

import { useCallback, useState } from "react";

import { editor } from "@/content/editor";
import { paletteAfterHistory } from "@/features/editor/logic/historyCommands";
import {
  appendPaletteColor,
  clampPaletteIndex,
  removePaletteColor,
  setPaletteColorAt,
} from "@/features/editor/logic/paletteMutations";
import type { IColorSlots, TColorSlot } from "@/features/editor/logic/paletteMutations.type";
import type { IHistoryCommand } from "@/features/editor/types/editor.type";
import { useToast } from "@/features/shared/components/Toast/hooks/useToast";
import type { IUseEditorPaletteParams } from "./useEditorPalette.type";

export function useEditorPalette({
  artwork,
  setArtwork,
  onPaletteOrPixelsDirty,
  pushCommand,
  discardRedo,
  undoCommand,
}: IUseEditorPaletteParams) {
  const { showToast } = useToast();
  const [activeSlot, setActiveSlot] = useState<TColorSlot>("primary");
  const [primaryIndex, setPrimaryIndex] = useState(0);
  const [secondaryIndex, setSecondaryIndex] = useState(1);

  const [focusedSwatchIndex, setFocusedSwatchIndex] = useState(0);

  const selectSwatchForEditing = useCallback(
    (index: number) => {
      setFocusedSwatchIndex(clampPaletteIndex(index, artwork.palette.length));
    },
    [artwork.palette.length],
  );

  const toggleActiveSlot = useCallback(() => {
    setActiveSlot((s) => (s === "primary" ? "secondary" : "primary"));
  }, []);

  const assignSwatchToActiveSlot = useCallback(
    (index: number) => {
      setFocusedSwatchIndex(index);
      if (activeSlot === "primary") {
        setPrimaryIndex(index);
      } else {
        setSecondaryIndex(index);
      }
    },
    [activeSlot],
  );

  const applyHexAtIndex = useCallback(
    (index: number, hex: string) => {
      const i = Math.min(Math.max(0, index), artwork.palette.length - 1);
      const next = setPaletteColorAt(artwork.palette, i, hex);
      if (next[i] !== artwork.palette[i]) discardRedo();
      setArtwork((a) => ({ ...a, palette: next }));
      onPaletteOrPixelsDirty();
    },
    [artwork.palette, setArtwork, discardRedo, onPaletteOrPixelsDirty],
  );

  const addColor = useCallback(
    (hex: string) => {
      const next = appendPaletteColor(artwork.palette, hex);
      if (!next) {
        return;
      }
      discardRedo();
      setArtwork((a) => ({ ...a, palette: next }));
      onPaletteOrPixelsDirty();
    },
    [artwork.palette, setArtwork, discardRedo, onPaletteOrPixelsDirty],
  );

  const removeSwatchAtIndex = useCallback(
    (idx: number) => {
      const index = clampPaletteIndex(idx, artwork.palette.length);
      const slotsBefore: IColorSlots = { primaryIndex, secondaryIndex };
      const result = removePaletteColor(artwork.layers, artwork.palette, index, slotsBefore);
      if (!result) {
        return;
      }
      const applySlots = (slots: IColorSlots, focused: number) => {
        setPrimaryIndex(slots.primaryIndex);
        setSecondaryIndex(slots.secondaryIndex);
        setFocusedSwatchIndex(focused);
      };
      const cmd: IHistoryCommand = {
        deltas: [],
        paletteRemoval: result.removal,
        onApplied: (direction) => {
          setArtwork((a) => ({ ...a, palette: paletteAfterHistory(a.palette, cmd, direction) }));
          if (direction === "undo") {
            applySlots(slotsBefore, index);
          } else {
            applySlots(result.slots, Math.min(index, result.palette.length - 1));
          }
          onPaletteOrPixelsDirty();
        },
      };
      applySlots(result.slots, Math.min(focusedSwatchIndex, result.palette.length - 1));
      setArtwork((a) => ({ ...a, palette: result.palette }));
      onPaletteOrPixelsDirty();
      pushCommand(cmd);
      showToast({
        message: editor.paletteRemoval.removed(result.removal.color),
        action: { label: editor.toolbar.undo.label, onAction: () => undoCommand(cmd) },
      });
    },
    [
      artwork.palette,
      artwork.layers,
      primaryIndex,
      secondaryIndex,
      focusedSwatchIndex,
      setArtwork,
      onPaletteOrPixelsDirty,
      pushCommand,
      undoCommand,
      showToast,
    ],
  );

  const removeFocusedSwatch = useCallback(() => {
    removeSwatchAtIndex(focusedSwatchIndex);
  }, [focusedSwatchIndex, removeSwatchAtIndex]);

  return {
    activeSlot,
    setActiveSlot,
    toggleActiveSlot,
    primaryIndex,
    secondaryIndex,
    assignSwatchToActiveSlot,
    focusedSwatchIndex,
    selectSwatchForEditing,
    applyHexAtIndex,
    addColor,
    removeFocusedSwatch,
    removeSwatchAtIndex,
  };
}

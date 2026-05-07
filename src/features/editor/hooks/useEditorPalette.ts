/**
 * Purpose:
 * Editor palette UI state: active paint/swatch slot, focused swatch for the color picker, and palette mutations.
 */
"use client";

import { useCallback, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

import type { Artwork } from "@/features/editor/types/editor.types";
import {
  appendPaletteColor,
  type ColorSlot,
  removePaletteAt,
  setPaletteColorAt,
} from "@/features/editor/logic/paletteMutations";

interface UseEditorPaletteParams {
  artwork: Artwork;
  setArtwork: Dispatch<SetStateAction<Artwork>>;
  onPaletteOrPixelsDirty: () => void;
}

export function useEditorPalette({
  artwork,
  setArtwork,
  onPaletteOrPixelsDirty,
}: UseEditorPaletteParams) {
  const [activeSlot, setActiveSlot] = useState<ColorSlot>("primary");
  const [primaryIndex, setPrimaryIndex] = useState(0);
  const [secondaryIndex, setSecondaryIndex] = useState(1);

  const [focusedSwatchIndex, setFocusedSwatchIndex] = useState(0);

  const selectSwatchForEditing = useCallback((index: number) => {
    const max = Math.max(0, artwork.palette.length - 1);
    setFocusedSwatchIndex(Math.min(Math.max(0, index), max));
  }, [artwork.palette.length]);

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
    [activeSlot]
  );

  const applyHexAtIndex = useCallback(
    (index: number, hex: string) => {
      const i = Math.min(
        Math.max(0, index),
        artwork.palette.length - 1
      );
      const next = setPaletteColorAt(artwork.palette, i, hex);
      setArtwork((a) => ({ ...a, palette: next }));
      onPaletteOrPixelsDirty();
    },
    [artwork.palette, setArtwork, onPaletteOrPixelsDirty]
  );

  const addColor = useCallback(
    (hex: string) => {
      const next = appendPaletteColor(artwork.palette, hex);
      if (!next) {
        return;
      }
      setArtwork((a) => ({ ...a, palette: next }));
      setFocusedSwatchIndex(next.length - 1);
      onPaletteOrPixelsDirty();
    },
    [artwork.palette, setArtwork, onPaletteOrPixelsDirty]
  );

  const removeSwatchAtIndex = useCallback(
    (idx: number) => {
      const index = Math.min(
        Math.max(0, idx),
        artwork.palette.length - 1
      );
      const result = removePaletteAt(
        artwork.pixelData,
        artwork.palette,
        index,
        primaryIndex,
        secondaryIndex
      );
      if (!result) {
        return;
      }
      setPrimaryIndex(result.primaryIndex);
      setSecondaryIndex(result.secondaryIndex);
      setFocusedSwatchIndex((f) => Math.min(f, result.palette.length - 1));
      setArtwork((a) => ({
        ...a,
        palette: result.palette,
        pixelData: a.pixelData,
      }));
      onPaletteOrPixelsDirty();
    },
    [
      artwork.palette,
      artwork.pixelData,
      primaryIndex,
      secondaryIndex,
      setArtwork,
      onPaletteOrPixelsDirty,
    ]
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


/**
 * Purpose:
 * Shift overlay state and applies circular row/column shifts with undo integration.
 */
"use client";

import { useCallback, useEffect, useState } from "react";

import {
  computeShiftCommand
} from "@/features/editor/logic/pixelShift";
import type { TShiftDirection } from "@/features/editor/logic/pixelShift.type";
import type { IUsePixelShiftParams } from "./usePixelShift.type";

export function usePixelShift({
  pixelData,
  layerId,
  width,
  height,
  pushCommand,
  schedulePaintBump,
}: IUsePixelShiftParams) {
  const [shiftOverlayOpen, setShiftOverlayOpen] = useState(false);

  const toggleShiftOverlay = useCallback(() => {
    setShiftOverlayOpen((v) => !v);
  }, []);

  const closeShiftOverlay = useCallback(() => {
    setShiftOverlayOpen(false);
  }, []);

  useEffect(() => {
    if (!shiftOverlayOpen) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShiftOverlayOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [shiftOverlayOpen]);

  const applyShift = useCallback(
    (direction: TShiftDirection) => {
      if (!pixelData || !layerId) {
        return;
      }
      const cmd = computeShiftCommand(
        layerId,
        pixelData,
        width,
        height,
        direction
      );
      if (!cmd) {
        return;
      }
      pushCommand(cmd);
      schedulePaintBump();
    },
    [pixelData, layerId, width, height, pushCommand, schedulePaintBump]
  );

  return {
    shiftOverlayOpen,
    toggleShiftOverlay,
    closeShiftOverlay,
    applyShift,
  };
}

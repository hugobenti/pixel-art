/**
 * Purpose:
 * Shift overlay state and applies circular row/column shifts with undo integration.
 */
"use client";

import { useCallback, useState } from "react";

import {
  computeShiftCommand,
  type ShiftDirection,
} from "@/features/editor/logic/pixelShift";

import type { HistoryCommand } from "@/features/editor/types/editor.types";

interface UsePixelShiftParams {
  pixelData: Uint8Array;
  width: number;
  height: number;
  pushCommand: (cmd: HistoryCommand) => void;
  schedulePaintBump: () => void;
}

export function usePixelShift({
  pixelData,
  width,
  height,
  pushCommand,
  schedulePaintBump,
}: UsePixelShiftParams) {
  const [shiftOverlayOpen, setShiftOverlayOpen] = useState(false);

  const toggleShiftOverlay = useCallback(() => {
    setShiftOverlayOpen((v) => !v);
  }, []);

  const closeShiftOverlay = useCallback(() => {
    setShiftOverlayOpen(false);
  }, []);

  const applyShift = useCallback(
    (direction: ShiftDirection) => {
      const cmd = computeShiftCommand(
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
    [pixelData, width, height, pushCommand, schedulePaintBump]
  );

  return {
    shiftOverlayOpen,
    toggleShiftOverlay,
    closeShiftOverlay,
    applyShift,
  };
}

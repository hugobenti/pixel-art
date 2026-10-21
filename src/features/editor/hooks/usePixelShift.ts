/**
 * Purpose:
 * Shift overlay state and applies circular row/column shifts with undo integration.
 */
"use client";

import { useCallback, useEffect, useState } from "react";

import {
  computeShiftCommand,
  type ShiftDirection,
} from "@/features/editor/logic/pixelShift";

import type { HistoryCommand } from "@/features/editor/types/editor.types";

interface UsePixelShiftParams {
  pixelData: Uint8Array | null;
  layerId: string | null;
  width: number;
  height: number;
  pushCommand: (cmd: HistoryCommand) => void;
  schedulePaintBump: () => void;
}

export function usePixelShift({
  pixelData,
  layerId,
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
    (direction: ShiftDirection) => {
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

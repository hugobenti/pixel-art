/**
 * Purpose:
 * Undo/redo stacks over atomic pixel delta commands (no full-buffer snapshots).
 *
 * Notes:
 * Deltas target layer IDs so undo/redo can mutate the correct per-layer pixel buffer.
 */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { HistoryCommand } from "@/features/editor/types/editor.types";

interface UseHistoryParams {
  documentKey: string;
  getLayerPixelData: (layerId: string) => Uint8Array | null;
}

export function useHistory({ documentKey, getLayerPixelData }: UseHistoryParams) {
  const getLayerPixelsRef = useRef(getLayerPixelData);
  useEffect(() => {
    getLayerPixelsRef.current = getLayerPixelData;
  }, [getLayerPixelData]);

  const undoStack = useRef<HistoryCommand[]>([]);
  const redoStack = useRef<HistoryCommand[]>([]);
  const [historyRevision, setHistoryRevision] = useState(0);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const syncFlags = useCallback(() => {
    setCanUndo(undoStack.current.length > 0);
    setCanRedo(redoStack.current.length > 0);
    setHistoryRevision((r) => r + 1);
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      undoStack.current = [];
      redoStack.current = [];
      setCanUndo(false);
      setCanRedo(false);
      setHistoryRevision((r) => r + 1);
    });
  }, [documentKey]);

  const pushCommand = useCallback(
    (cmd: HistoryCommand) => {
      if (cmd.deltas.length === 0) {
        return;
      }
      undoStack.current.push(cmd);
      redoStack.current = [];
      syncFlags();
    },
    [syncFlags]
  );

  const undo = useCallback(() => {
    const cmd = undoStack.current.pop();
    if (!cmd) {
      return;
    }
    for (let i = cmd.deltas.length - 1; i >= 0; i--) {
      const d = cmd.deltas[i];
      const buf = getLayerPixelsRef.current(d.layerId);
      if (!buf) {
        continue;
      }
      buf[d.index] = d.previousPaletteIndex;
    }
    redoStack.current.push(cmd);
    syncFlags();
  }, [syncFlags]);

  const redo = useCallback(() => {
    const cmd = redoStack.current.pop();
    if (!cmd) {
      return;
    }
    for (const d of cmd.deltas) {
      const buf = getLayerPixelsRef.current(d.layerId);
      if (!buf) {
        continue;
      }
      buf[d.index] = d.newPaletteIndex;
    }
    undoStack.current.push(cmd);
    syncFlags();
  }, [syncFlags]);

  return {
    pushCommand,
    undo,
    redo,
    canUndo,
    canRedo,
    historyRevision,
  };
}

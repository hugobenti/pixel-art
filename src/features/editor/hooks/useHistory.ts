/**
 * Purpose:
 * Undo/redo stacks over atomic pixel delta commands (no full-buffer snapshots).
 *
 * Notes:
 * Pixel indices mutate a shared Uint8Array for performance; callers keep one buffer per artwork.
 */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { HistoryCommand } from "@/features/editor/types/editor.types";

export function useHistory(pixelData: Uint8Array, documentKey: string) {
  const pixelRef = useRef(pixelData);
  useEffect(() => {
    pixelRef.current = pixelData;
  }, [pixelData]);

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
    const buf = pixelRef.current;
    for (let i = cmd.deltas.length - 1; i >= 0; i--) {
      const d = cmd.deltas[i];
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
    const buf = pixelRef.current;
    for (const d of cmd.deltas) {
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

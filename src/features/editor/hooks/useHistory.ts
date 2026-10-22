/**
 * Purpose:
 * Undo/redo stacks over atomic commands: pixel deltas and palette-color removals (no full-buffer snapshots).
 *
 * Notes:
 * Deltas target layer IDs so undo/redo can mutate the correct per-layer pixel buffer. A command's
 * `onApplied` callback updates React state (palette, color slots) after its buffers change.
 */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  applyHistoryCommand,
  isEmptyHistoryCommand,
} from "@/features/editor/logic/historyCommands";
import { discardRedoStack } from "@/features/editor/logic/historyStacks";
import type { IHistoryCommand } from "@/features/editor/types/editor.type";
import type { IUseHistoryParams } from "./useHistory.type";

export function useHistory({ documentKey, getLayers }: IUseHistoryParams) {
  const getLayersRef = useRef(getLayers);
  useEffect(() => {
    getLayersRef.current = getLayers;
  }, [getLayers]);

  const undoStack = useRef<IHistoryCommand[]>([]);
  const redoStack = useRef<IHistoryCommand[]>([]);
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
    (cmd: IHistoryCommand) => {
      if (isEmptyHistoryCommand(cmd)) {
        return;
      }
      undoStack.current.push(cmd);
      redoStack.current = [];
      syncFlags();
    },
    [syncFlags],
  );
  const discardRedo = useCallback(() => {
    if (redoStack.current.length === 0) return;
    discardRedoStack(redoStack.current);
    syncFlags();
  }, [syncFlags]);

  const undo = useCallback(() => {
    const cmd = undoStack.current.pop();
    if (!cmd) {
      return;
    }
    applyHistoryCommand(cmd, "undo", getLayersRef.current());
    cmd.onApplied?.("undo");
    redoStack.current.push(cmd);
    syncFlags();
  }, [syncFlags]);

  /** Undoes `cmd` only while it is still the latest change (e.g. an Undo toast after later edits). */
  const undoCommand = useCallback(
    (cmd: IHistoryCommand) => {
      if (undoStack.current[undoStack.current.length - 1] === cmd) {
        undo();
      }
    },
    [undo],
  );

  const redo = useCallback(() => {
    const cmd = redoStack.current.pop();
    if (!cmd) {
      return;
    }
    applyHistoryCommand(cmd, "redo", getLayersRef.current());
    cmd.onApplied?.("redo");
    undoStack.current.push(cmd);
    syncFlags();
  }, [syncFlags]);

  return {
    pushCommand,
    discardRedo,
    undo,
    undoCommand,
    redo,
    canUndo,
    canRedo,
    historyRevision,
  };
}

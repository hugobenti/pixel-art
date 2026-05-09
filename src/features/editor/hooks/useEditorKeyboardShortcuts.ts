/**
 * Purpose:
 * Global key bindings for the pixel editor (toggle grid, undo/redo).
 */
"use client";

import { useEffect } from "react";

export interface UseEditorKeyboardShortcutsParams {
  onTogglePixelGrid: () => void;
  undo: () => void;
  redo: () => void;
}

export function useEditorKeyboardShortcuts({
  onTogglePixelGrid,
  undo,
  redo,
}: UseEditorKeyboardShortcutsParams) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const lower = e.key.toLowerCase();
      if (lower === "g" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
        if (tag === "input" || tag === "textarea") {
          return;
        }
        e.preventDefault();
        onTogglePixelGrid();
      }
      if ((e.ctrlKey || e.metaKey) && lower === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onTogglePixelGrid, undo, redo]);
}

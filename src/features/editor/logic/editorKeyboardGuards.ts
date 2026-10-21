/**
 * Purpose:
 * Pure guards deciding which key presses the editor may claim (preventDefault) — no scroll-jacking.
 *
 * Notes:
 * Shortcuts never swallow keys while focus is in a text field; Space is only claimed for
 * Space+drag panning while the canvas viewport is hovered or focused, so page scrolling keys keep working elsewhere.
 * DOM-free (duck-typed targets) so it runs under Vitest's node environment.
 */

/** Minimal shape of a keyboard event target needed to detect text entry. */
export interface KeyboardTargetLike {
  tagName?: string;
  isContentEditable?: boolean;
}

const TEXT_ENTRY_TAGS: Record<string, true> = {
  INPUT: true,
  TEXTAREA: true,
  SELECT: true,
};

/** True when the target is an input, textarea, select or contenteditable element. */
export function isTextEntryTarget(
  target: KeyboardTargetLike | null | undefined
): boolean {
  if (!target) {
    return false;
  }
  if (target.isContentEditable) {
    return true;
  }
  return TEXT_ENTRY_TAGS[target.tagName?.toUpperCase() ?? ""] === true;
}

export type EditorShortcut = "toggleGrid" | "undo" | "redo";

export interface ShortcutKeyLike {
  key: string;
  ctrlKey: boolean;
  metaKey: boolean;
  altKey: boolean;
  shiftKey: boolean;
}

/** Editor shortcut for a key press, or null when the key must be left to the browser. */
export function editorShortcutForKey(
  e: ShortcutKeyLike,
  targetIsTextEntry: boolean
): EditorShortcut | null {
  if (targetIsTextEntry) {
    return null;
  }
  const lower = e.key.toLowerCase();
  if (lower === "g" && !e.ctrlKey && !e.metaKey && !e.altKey) {
    return "toggleGrid";
  }
  if ((e.ctrlKey || e.metaKey) && lower === "z") {
    return e.shiftKey ? "redo" : "undo";
  }
  return null;
}

export interface SpacePanClaimInput {
  code: string;
  /** Keyboard event target (the focused element, or body when nothing is focused). */
  target: KeyboardTargetLike | null | undefined;
  /** The canvas viewport element, if mounted. */
  canvas: KeyboardTargetLike | null | undefined;
  pointerOverCanvas: boolean;
}

/**
 * Space may be claimed for Space+drag panning only inside the canvas context: when the viewport itself has focus,
 * or nothing is focused (body/html) while the pointer is over it. Focused controls and text fields keep Space.
 */
export function shouldClaimSpaceForCanvasPan({
  code,
  target,
  canvas,
  pointerOverCanvas,
}: SpacePanClaimInput): boolean {
  if (code !== "Space" || !target) {
    return false;
  }
  if (canvas && target === canvas) {
    return true;
  }
  const tag = target.tagName?.toUpperCase();
  return pointerOverCanvas && (tag === "BODY" || tag === "HTML");
}

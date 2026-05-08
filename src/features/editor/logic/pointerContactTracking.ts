/**
 * Purpose:
 * Pure helpers and types for the editor's shared touch-pointer registry (see useEditorPointerContacts).
 *
 * Notes:
 * Only `pointerType === "touch"` identifiers are tracked; mouse and pen are ignored at the registry layer.
 */

/** Number of simultaneous touch contacts currently on the surface (via shared Set). */
export function activeTouchCount(touchPointerIds: ReadonlySet<number>): number {
  return touchPointerIds.size;
}

/** Single-finger contact — required to start or continue single-pointer paint / touch-pan gestures. */
export function isExactlyOneTouch(touchPointerIds: ReadonlySet<number>): boolean {
  return touchPointerIds.size === 1;
}

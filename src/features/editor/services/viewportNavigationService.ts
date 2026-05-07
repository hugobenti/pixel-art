/**
 * Purpose:
 * Pure viewport navigation rules: wheel intent (zoom vs pan), offset translation, and pan gestures.
 *
 * Notes:
 * Used by useViewportNavigation; keeps DOM-free logic testable and separate from React.
 */

export type WheelNavigationIntent = "zoom" | "pan";

/**
 * Shift+wheel or dominant horizontal delta → pan; otherwise zoom (vertical wheel).
 */
export function classifyWheelIntent(e: WheelEvent): WheelNavigationIntent {
  if (e.shiftKey) {
    return "pan";
  }
  if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
    return "pan";
  }
  return "zoom";
}

/**
 * Screen-space pixels to add to `viewOffset` for a pan wheel gesture.
 */
export function panPixelsFromWheel(e: WheelEvent): { dx: number; dy: number } {
  if (e.shiftKey) {
    return { dx: -e.deltaY, dy: 0 };
  }
  return { dx: -e.deltaX, dy: -e.deltaY };
}

export function translateViewOffset(
  offset: { x: number; y: number },
  dx: number,
  dy: number
): { x: number; y: number } {
  return { x: offset.x + dx, y: offset.y + dy };
}

export interface PanGestureInput {
  pointerButton: number;
  /** Space key held (desktop pan shortcut). */
  spaceHeld: boolean;
  /** Explicit pan-only mode (e.g. mobile toolbar). */
  panMode: boolean;
}

/**
 * Middle mouse always pans; primary button pans when Space is held or pan mode is on.
 */
export function shouldStartPanGesture(input: PanGestureInput): boolean {
  if (input.pointerButton === 1) {
    return true;
  }
  if (input.pointerButton === 0 && (input.spaceHeld || input.panMode)) {
    return true;
  }
  return false;
}

/**
 * Primary-button painting should be deferred when Space or pan mode would grab the gesture for pan.
 */
export function shouldDeferPrimaryPaint(input: {
  spaceHeld: boolean;
  panMode: boolean;
}): boolean {
  return input.spaceHeld || input.panMode;
}

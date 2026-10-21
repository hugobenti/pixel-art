/**
 * Purpose:
 * Arrow-key panning rule for the focused canvas viewport (keyboard alternative to drag panning).
 */

/** Screen pixels the artwork moves per arrow press. */
export const KEYBOARD_PAN_STEP_PX = 32;

/** Screen pixels per arrow press while Shift is held. */
export const KEYBOARD_PAN_FAST_STEP_PX = 128;

/** View-offset delta for an arrow key, or null when the key does not pan. */
export function keyboardPanDelta(
  key: string,
  shiftKey: boolean,
): { dx: number; dy: number } | null {
  const step = shiftKey ? KEYBOARD_PAN_FAST_STEP_PX : KEYBOARD_PAN_STEP_PX;
  switch (key) {
    case "ArrowLeft":
      return { dx: -step, dy: 0 };
    case "ArrowRight":
      return { dx: step, dy: 0 };
    case "ArrowUp":
      return { dx: 0, dy: -step };
    case "ArrowDown":
      return { dx: 0, dy: step };
    default:
      return null;
  }
}

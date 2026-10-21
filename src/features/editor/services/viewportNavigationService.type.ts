export type TWheelNavigationIntent = "zoom" | "pan";

export interface IPanGestureInput {
  pointerButton: number;
  /** Space key held (desktop pan shortcut). */
  spaceHeld: boolean;
  /** Explicit pan-only mode (e.g. mobile toolbar). */
  panMode: boolean;
}

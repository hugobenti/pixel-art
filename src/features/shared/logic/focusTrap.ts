/**
 * Purpose:
 * Pure Tab-wrapping rule for dialog focus traps (no DOM access).
 */

/** CSS selector for the Tab stops inside a dialog (elements removed from the tab order excluded). */
export const FOCUSABLE_SELECTOR = [
  "a[href]:not([tabindex='-1'])",
  "button:not([disabled]):not([tabindex='-1'])",
  "input:not([disabled]):not([type='hidden']):not([tabindex='-1'])",
  "select:not([disabled]):not([tabindex='-1'])",
  "textarea:not([disabled]):not([tabindex='-1'])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

/**
 * Index of the element to focus for a Tab (or Shift+Tab) press, or null when the browser's default
 * move stays inside the trap. `currentIndex` is -1 when focus is outside the container.
 */
export function focusTrapTargetIndex(
  currentIndex: number,
  count: number,
  backwards: boolean,
): number | null {
  if (count === 0) {
    return null;
  }
  const last = count - 1;
  if (currentIndex === -1) {
    return backwards ? last : 0;
  }
  if (backwards && currentIndex === 0) {
    return last;
  }
  if (!backwards && currentIndex === last) {
    return 0;
  }
  return null;
}

/**
 * Purpose:
 * Pure rule choosing whether a dropdown menu opens below or above its trigger so it stays on screen.
 */

import type { IMenuPlacementInput, TMenuPlacement } from "./menuPlacement.type";

/** Below when it fits, else above when it fits, else whichever side has more room. */
export function menuPlacement(input: IMenuPlacementInput): TMenuPlacement {
  const { triggerTop, triggerBottom, menuHeight, viewportHeight, gap } = input;
  if (triggerBottom + gap + menuHeight <= viewportHeight - gap) return "below";
  if (triggerTop - gap - menuHeight >= gap) return "above";
  const roomBelow = viewportHeight - triggerBottom;
  return triggerTop > roomBelow ? "above" : "below";
}

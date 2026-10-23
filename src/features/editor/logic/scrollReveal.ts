/**
 * Purpose:
 * The smallest horizontal scroll that brings an item fully into view, so the palette row can follow the
 * color picker without `scrollIntoView` (which may also scroll the page).
 */

import type { IScrollRevealInput } from "./scrollReveal.type";

/** New `scrollLeft`, or null when the item is already in view (or the row can't scroll any further). */
export function scrollLeftToReveal({
  itemStart,
  itemEnd,
  scrollLeft,
  viewWidth,
  padding,
}: IScrollRevealInput): number | null {
  let next = scrollLeft;
  if (itemStart - padding < scrollLeft) {
    next = itemStart - padding;
  } else if (itemEnd + padding > scrollLeft + viewWidth) {
    next = itemEnd + padding - viewWidth;
  }
  next = Math.max(0, next);
  return next === scrollLeft ? null : next;
}

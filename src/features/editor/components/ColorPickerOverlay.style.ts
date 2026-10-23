/**
 * Purpose:
 * Classes for the ColorPickerOverlay: the full-window layer, the outline on the picked pixel, the round
 * loupe (split ring, 5 × 5 lens, center mark) and the "Release to cancel" pill.
 *
 * Notes:
 * Edges use the theme-independent loupe-edge tokens (black and white) so they read on any artwork color.
 * Sizes follow logic/colorPicker.ts: 12px ring (inset-3), 18px cells, center cell at 36px (left-9 top-9).
 */

import { cx } from "@/features/shared/utils/cx";

const edgePair = "shadow-[0_0_0_2px_var(--color-loupe-edge-light),0_0_0_4px_var(--color-loupe-edge-dark)]";

export const colorPickerOverlay = {
  layer: "pointer-events-none fixed inset-0 z-50",
  outline: cx("absolute", edgePair),
  loupe: cx(
    "absolute overflow-hidden rounded-full drop-shadow-lg",
    "shadow-[0_0_0_1.5px_var(--color-loupe-edge-dark),0_0_0_3px_var(--color-loupe-edge-light)]",
  ),
  ringTop: "absolute inset-x-0 top-0 h-1/2",
  ringBottom: "absolute inset-x-0 bottom-0 h-1/2",
  ringEmpty: "pixel-checkerboard",
  lens: cx(
    "pixel-checkerboard absolute inset-3 grid grid-cols-[repeat(5,18px)] auto-rows-[18px] overflow-hidden rounded-full",
    "shadow-[0_0_0_1.5px_var(--color-loupe-edge-dark)]",
  ),
  centerMark: cx("absolute top-9 left-9 h-[18px] w-[18px]", edgePair),
  pill: "absolute rounded-full border border-line-strong bg-surface px-2.5 py-1 text-xs whitespace-nowrap text-fg shadow-lg",
};

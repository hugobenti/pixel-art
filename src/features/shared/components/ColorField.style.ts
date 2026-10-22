/**
 * Purpose:
 * Classes for the ColorField: swatch and hex input on one row; the native color input drawn as a
 * plain swatch (no browser frame inside our ring) and the hex value in mono.
 */

import { focusRing } from "@/features/shared/components/focus.style";
import { cx } from "@/features/shared/utils/cx";

export const colorField = {
  row: "flex items-center gap-2",
  swatch: cx(
    "h-10 w-10 shrink-0 cursor-pointer appearance-none rounded-md border-0 bg-transparent p-0 ring-1 ring-control-border",
    "[&::-webkit-color-swatch]:rounded-md [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch-wrapper]:p-0",
    "[&::-moz-color-swatch]:rounded-md [&::-moz-color-swatch]:border-0",
    "disabled:cursor-not-allowed disabled:opacity-50",
    focusRing,
  ),
  hexWrap: "w-32",
  hex: "font-mono uppercase tabular-nums disabled:opacity-50",
};

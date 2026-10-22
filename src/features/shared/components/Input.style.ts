/**
 * Purpose:
 * Classes for the Input text field.
 */

import { cx } from "@/features/shared/utils/cx";

export const input = {
  base: cx(
    "w-full rounded-lg border border-line-strong bg-surface px-3 py-2 text-sm text-fg shadow-sm placeholder:text-subtle",
    "focus-visible:border-focus focus-visible:ring-2 focus-visible:ring-focus focus-visible:outline-none",
  ),
};

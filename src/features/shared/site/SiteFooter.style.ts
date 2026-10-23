/**
 * Purpose:
 * Classes for SiteFooter: the three-line block, wrapping links with 44px coarse-pointer targets.
 */

import { focusRing } from "@/features/shared/components/focus.style";
import { cx } from "@/features/shared/utils/cx";

export const siteFooter = {
  bar: "border-t border-line bg-bg text-sm text-muted",
  inner: "mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-6",
  brand: "flex items-center gap-3",
  pencil: "shrink-0",
  credit: "flex flex-wrap gap-x-2",
  /** The "·" between credit and copyright is drawn, not typed. */
  copyright: "before:mr-2 before:content-['·']",
  links: "flex flex-wrap gap-x-4 gap-y-1",
  link: cx(
    "inline-flex min-h-8 items-center rounded-sm underline-offset-4 hover:text-fg hover:underline pointer-coarse:min-h-11",
    focusRing,
  ),
};

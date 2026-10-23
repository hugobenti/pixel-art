/**
 * Purpose:
 * Shared type styles for the site pages (home, about, help, contact, 404).
 */

import { focusRing } from "@/features/shared/components/focus.style";
import { cx } from "@/features/shared/utils/cx";

export const siteType = {
  display: "text-4xl font-bold tracking-tight text-fg md:text-5xl md:leading-[3.25rem]",
  lead: "text-lg text-muted",
  section: "text-xl font-semibold text-fg",
  pageTitle: "text-2xl font-semibold text-fg",
  prose: "max-w-prose text-base text-fg-secondary",
  link: cx("rounded-sm text-fg underline underline-offset-4 hover:text-fg-soft", focusRing),
};

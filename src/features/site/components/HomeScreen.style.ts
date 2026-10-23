/**
 * Purpose:
 * Classes for HomeScreen: hero, promise cards, feature chips, steps, storage band and closing call.
 */

import { button } from "@/features/shared/components/Button.style";
import { siteType } from "@/features/shared/site/siteType.style";
import { cx } from "@/features/shared/utils/cx";

export const homeScreen = {
  page: "flex flex-col gap-12 sm:gap-16",
  hero: "grid items-center gap-10 lg:grid-cols-2",
  heroText: "flex flex-col items-start gap-6",
  title: cx(siteType.display, "text-balance"),
  lead: siteType.lead,
  actions: "flex flex-wrap gap-3",
  primary: cx(button.base, button.size.default, button.variant.primary),
  secondary: cx(button.base, button.size.default, button.variant.outline),
  art: "pixel-grid-panel order-first flex items-center justify-center overflow-hidden rounded-lg border border-line bg-surface py-12 lg:order-none",
  /** 250px (5×) under 360px, where the 300px banner would overflow the panel. */
  banner: "max-[359px]:w-[250px]",
  promises: "grid gap-4 sm:grid-cols-3",
  promise: "flex flex-col gap-2 rounded-lg border border-line p-5",
  promiseIcon: "size-6 text-fg-soft",
  cardTitle: "text-base font-semibold text-fg",
  cardText: "text-sm text-muted",
  section: "flex flex-col gap-4",
  sectionTitle: siteType.section,
  chips: "flex flex-wrap gap-x-2 gap-y-1 text-sm text-fg-secondary",
  chip: "after:ml-2 after:text-muted after:content-['·'] last:after:hidden",
  steps: "grid gap-6 sm:grid-cols-3",
  step: "flex flex-col gap-1",
  stepNumber: "font-mono text-sm text-muted",
  note: "flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg bg-surface px-5 py-4 text-sm text-muted",
  noteLink: siteType.link,
  closing: "flex flex-col items-start gap-4",
};

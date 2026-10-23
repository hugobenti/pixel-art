/**
 * Purpose:
 * Classes for HomeScreen: hero, promise cards, feature cards, steps, storage band and closing call.
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
  sectionIntro: "text-sm text-muted sm:text-base",
  features: "grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4",
  feature: "flex flex-col gap-2 rounded-lg border border-line bg-surface p-3 min-[360px]:p-4",
  featureIcon: "size-6 text-fg-soft",
  featureTitle: "text-sm font-semibold text-fg sm:text-base",
  featureText: "text-xs text-muted sm:text-sm",
  steps: "flex flex-col gap-6 sm:grid sm:grid-cols-3 sm:gap-0",
  step: "relative flex items-start gap-4 after:absolute after:top-11 after:-bottom-6 after:left-[22px] after:border-l after:border-dashed after:border-line-strong last:after:hidden sm:flex-col sm:items-center sm:gap-3 sm:px-3 sm:text-center sm:after:top-[22px] sm:after:bottom-auto sm:after:left-1/2 sm:after:h-0 sm:after:w-full sm:after:border-t sm:after:border-l-0",
  stepNumber:
    "relative z-10 flex size-11 shrink-0 items-center justify-center rounded-lg border border-line bg-surface font-mono text-lg font-semibold text-accent",
  stepBody: "flex flex-col gap-1",
  note: "flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg bg-surface px-5 py-4 text-sm text-muted",
  noteLink: siteType.linkStandalone,
  closing:
    "pixel-grid-panel flex flex-col items-center gap-4 rounded-xl border border-line bg-surface px-6 py-12 text-center",
  closingTitle: cx(siteType.section, "sm:text-2xl"),
  closingText: "text-sm text-muted sm:text-base",
};

/**
 * Purpose:
 * Classes for ContactScreen: reading layout with two option cards.
 */

import { button } from "@/features/shared/components/Button.style";
import { siteType } from "@/features/shared/site/siteType.style";
import { cx } from "@/features/shared/utils/cx";

export const contactScreen = {
  page: "flex flex-col gap-8",
  header: "flex flex-col gap-3",
  title: siteType.pageTitle,
  intro: siteType.lead,
  cards: "grid gap-4 sm:grid-cols-2",
  card: "flex flex-col items-start gap-3 p-5",
  icon: "size-6 text-fg-soft",
  cardTitle: siteType.section,
  cardText: "text-base text-fg-secondary",
  address: "break-all font-mono text-base text-fg",
  action: cx(button.base, button.size.default, button.variant.outline, "mt-auto"),
  tip: siteType.prose,
};

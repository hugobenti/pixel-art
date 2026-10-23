/**
 * Purpose:
 * Classes for StatusScreen: the 404 and error layout.
 */

import { button } from "@/features/shared/components/Button.style";
import { siteType } from "@/features/shared/site/siteType.style";
import { cx } from "@/features/shared/utils/cx";

export const statusScreen = {
  page: "flex flex-col items-start gap-6 py-8",
  title: siteType.pageTitle,
  text: siteType.lead,
  actions: "flex flex-wrap items-center gap-3",
  primary: cx(button.base, button.size.default, button.variant.primary),
  home: siteType.linkStandalone,
};

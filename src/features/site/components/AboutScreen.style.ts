/**
 * Purpose:
 * Classes for AboutScreen: the reading layout.
 */

import { siteType } from "@/features/shared/site/siteType.style";

export const aboutScreen = {
  page: "flex flex-col gap-10",
  header: "flex flex-col gap-3",
  title: siteType.pageTitle,
  intro: siteType.lead,
  section: "flex scroll-mt-24 flex-col gap-4",
  sectionTitle: siteType.section,
  prose: siteType.prose,
  link: siteType.linkStandalone,
  signature: "text-base font-semibold text-fg",
};

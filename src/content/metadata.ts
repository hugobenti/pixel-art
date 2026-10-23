import type { Metadata } from "next";
import { site } from "./site";

/** Page metadata for the whole app, derived from the site content. */
export const siteMetadata: Metadata = {
  title: { default: site.name, template: `%s · ${site.name}` },
  description: site.metaDescription,
};

import type { Metadata } from "next";
import { about } from "./about";
import { contact } from "./contact";
import { gallery } from "./gallery";
import { help } from "./help";
import { home } from "./home";
import { site } from "./site";
import { statusPages } from "./statusPages";

/** Page metadata for the whole app, derived from the site content. */
export const siteMetadata: Metadata = {
  title: { default: site.name, template: `%s · ${site.name}` },
  description: site.metaDescription,
};

/** The gallery tab reads "Your artworks · PixelHB". */
export const galleryMetadata: Metadata = { title: gallery.screen.heading };

/** The home tab reads "PixelHB · Pixel art, right in your browser" (no template suffix). */
export const homeMetadata: Metadata = { title: home.metaTitle };

export const aboutMetadata: Metadata = {
  title: about.metaTitle,
  description: about.metaDescription,
};

export const contactMetadata: Metadata = {
  title: contact.metaTitle,
  description: contact.metaDescription,
};

export const helpMetadata: Metadata = {
  title: help.metaTitle,
  description: help.metaDescription,
};

export const notFoundMetadata: Metadata = { title: statusPages.metaTitle };

/**
 * Purpose:
 * Pure helpers for gallery artwork links and thumbnail sources.
 */

/** 1×1 transparent GIF shown when an artwork has no thumbnail yet. */
export const EMPTY_THUMBNAIL_SRC =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

/** Editor route for an artwork; shared by gallery links and post-create/import navigation. */
export function getEditorHref(artworkId: string): string {
  return `/editor/${artworkId}`;
}

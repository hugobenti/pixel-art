/**
 * Purpose:
 * Where a gallery artwork links to and which image its card shows.
 */

/** Transparent 1×1 GIF shown until an artwork has a thumbnail. */
export const BLANK_THUMBNAIL =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

/** Editor route for an artwork. */
export function editorPath(id: string): string {
  return `/editor/${id}`;
}

/** Thumbnail source for a card; data URLs bypass the Next image optimizer. */
export function artworkThumbnail(thumbnail: string) {
  const src = thumbnail || BLANK_THUMBNAIL;
  return { src, unoptimized: src.startsWith("data:") };
}

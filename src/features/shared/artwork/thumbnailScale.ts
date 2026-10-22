/**
 * Purpose:
 * Integer upscale factor for gallery thumbnails, so every art pixel maps to whole device pixels.
 */

/** Longest thumbnail side the scale aims for, in pixels. */
export const THUMBNAIL_TARGET_PX = 256;

/**
 * Largest integer scale at which the artwork's longer side fits `target`; never below 1 (native size).
 */
export function thumbnailScale(
  width: number,
  height: number,
  target = THUMBNAIL_TARGET_PX,
): number {
  return Math.max(1, Math.floor(target / Math.max(width, height)));
}

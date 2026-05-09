/**
 * Purpose:
 * Root-relative URLs for SVG assets under public/icons (neutral names, shared across features).
 *
 * Notes:
 * `pan` is the hand-style viewport pan icon; `panArrows` is the legacy four-arrow glyph used for pixel shift.
 */

export const PUBLIC_ICONS = {
  chevronLeft: "/icons/chevron-left.svg",
  xMark: "/icons/x-mark.svg",
  eye: "/icons/eye.svg",
  eyeOff: "/icons/eye-off.svg",
  grip: "/icons/grip.svg",
  pencil: "/icons/pencil.svg",
  bucket: "/icons/bucket.svg",
  copy: "/icons/copy.svg",
  undo: "/icons/undo.svg",
  redo: "/icons/redo.svg",
  pan: "/icons/pan.svg",
  panArrows: "/icons/pan-arrows.svg",
  zoomOut: "/icons/zoom-out.svg",
  zoomIn: "/icons/zoom-in.svg",
  cog: "/icons/cog.svg",
  grid: "/icons/grid.svg",
  upload: "/icons/upload.svg",
  dashboard: "/icons/dashboard.svg",
  layers: "/icons/layers.svg",
} as const;

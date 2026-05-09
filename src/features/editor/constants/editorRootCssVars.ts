/**
 * Purpose:
 * Names of :root CSS custom properties for editor canvas strokes (grid + symmetry guides).
 */

export const EDITOR_ROOT_CSS_VARS = {
  gridLine: "--color-editor-grid-line",
  gridLineFallback: "--editor-canvas-fallback-grid-line",
  centerHorizontal: "--color-editor-grid-center-horizontal",
  centerHorizontalFallback: "--editor-canvas-fallback-center-horizontal",
  centerVertical: "--color-editor-grid-center-vertical",
  centerVerticalFallback: "--editor-canvas-fallback-center-vertical",
} as const;

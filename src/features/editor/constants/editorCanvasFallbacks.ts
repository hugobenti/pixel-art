/**
 * Purpose:
 * Stroke fallbacks for canvas/grid logic when CSS variables are not available (tests, guards).
 *
 * Notes:
 * Values must match :root --editor-canvas-fallback-* in src/app/globals.css.
 */

/** Mirrors --editor-canvas-fallback-grid-line */
export const EDITOR_GRID_LINE_STROKE_FALLBACK = "rgba(0, 0, 0, 0.35)";

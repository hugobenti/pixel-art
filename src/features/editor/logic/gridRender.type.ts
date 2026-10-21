export interface IPixelGridRenderOptions {
  /** Grid stroke color, read from the `--color-grid-line` token. */
  color: string;
  /** Stroke color for the horizontal mid-line (symmetry guide). */
  centerHorizontalColor?: string;
  /** Stroke color for the vertical mid-line (symmetry guide). */
  centerVerticalColor?: string;
  lineWidthWorld?: number;
  /** Optional extra thickness multiplier for center guides (defaults to 1.45). */
  centerLineWidthFactor?: number;
}

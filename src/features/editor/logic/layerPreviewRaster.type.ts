/** The part of a 2D canvas context the layer painter uses. */
export type TPixelPaintTarget = Pick<CanvasRenderingContext2D, "fillStyle" | "fillRect">;

export interface ILayerPreviewThumbSize {
  width: number;
  height: number;
}

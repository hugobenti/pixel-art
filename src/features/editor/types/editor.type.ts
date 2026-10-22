/**
 * Purpose:
 * Core TypeScript contracts for the PixelCraft canvas engine and undo history.
 * The artwork document model lives in `@/features/shared/artwork/artwork.types`.
 */

export interface IViewportState {
  scale: number;
  viewOffset: { x: number; y: number };
}

export interface IPixelDelta {
  layerId: string;
  index: number;
  previousPaletteIndex: number;
  newPaletteIndex: number;
}

export type THistoryDirection = "undo" | "redo";

/** Pixels of one layer that used a removed palette color (they were repainted with the replacement). */
export interface ILayerRemovedPixels {
  layerId: string;
  indices: Uint32Array;
}

/** A removed palette entry, enough to restore the color and every pixel that used it. */
export interface IPaletteRemoval {
  index: number;
  color: string;
  /** Value written to the removed color's pixels, in the palette without it (or the transparent index). */
  replacement: number;
  removedPixels: ILayerRemovedPixels[];
}

/** A color appended to the end of the palette; undo drops it again. */
export interface IPaletteAppend {
  index: number;
  color: string;
}

export interface IHistoryCommand {
  deltas: IPixelDelta[];
  paletteRemoval?: IPaletteRemoval;
  paletteAppend?: IPaletteAppend;
  /** React-state side of the command (palette, color slots); runs after the buffers change. */
  onApplied?: (direction: THistoryDirection) => void;
}

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

/** Pixels of one layer that used a removed palette color (they were remapped to index 0). */
export interface ILayerRemovedPixels {
  layerId: string;
  indices: Uint32Array;
}

/** A removed palette entry, enough to restore the color and every pixel that used it. */
export interface IPaletteRemoval {
  index: number;
  color: string;
  removedPixels: ILayerRemovedPixels[];
}

export interface IHistoryCommand {
  deltas: IPixelDelta[];
  paletteRemoval?: IPaletteRemoval;
  /** React-state side of the command (palette, color slots); runs after the buffers change. */
  onApplied?: (direction: THistoryDirection) => void;
}

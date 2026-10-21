/**
 * Purpose:
 * Core TypeScript contracts for the PixelCraft canvas engine and undo history.
 * The artwork document model lives in `@/features/shared/artwork/artwork.types`.
 */

export interface ViewportState {
  scale: number;
  viewOffset: { x: number; y: number };
}

export interface PixelDelta {
  layerId: string;
  index: number;
  previousPaletteIndex: number;
  newPaletteIndex: number;
}

export interface HistoryCommand {
  deltas: PixelDelta[];
}

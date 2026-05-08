/**
 * Purpose:
 * Core TypeScript contracts for the PixelCraft canvas engine, artwork persistence, and undo history.
 */

export interface Artwork {
  id: string;
  title: string;
  width: number;
  height: number;
  createdAt: number;
  updatedAt: number;
  thumbnail: string;
  palette: string[];
  layers: ArtworkLayer[];
  activeLayerId: string;
  /** Legacy mono-layer payload kept for backward compatibility during hydration. */
  pixelData?: Uint8Array;
  /** Optional reduced-size base64 guide image shown as an editor overlay. */
  referenceImageDataUrl?: string;
}

export interface ArtworkLayer {
  id: string;
  name: string;
  visible: boolean;
  pixelData: Uint8Array;
}

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

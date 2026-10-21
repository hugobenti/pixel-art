/**
 * Purpose:
 * Core TypeScript contracts for PixelCraft artwork documents, shared by persistence, the editor and the gallery.
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

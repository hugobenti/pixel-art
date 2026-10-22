import type { IPaletteRemoval } from "@/features/editor/types/editor.type";

export type TColorSlot = "primary" | "secondary";

export interface IColorSlots {
  primaryIndex: number;
  secondaryIndex: number;
}

/** The part of a layer a palette mutation touches. */
export interface IPaletteLayerBuffer {
  id: string;
  pixelData: Uint8Array;
}

export interface IPaletteRemovalResult {
  palette: string[];
  slots: IColorSlots;
  removal: IPaletteRemoval;
}

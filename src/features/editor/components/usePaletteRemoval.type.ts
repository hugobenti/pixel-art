import type { IPaletteEditModalProps } from "./PaletteEditModal.type";

export type TUsePaletteRemovalParams = Pick<
  IPaletteEditModalProps,
  "palette" | "getColorUsage" | "onRemoveSwatch"
>;

/** A removal waiting for the user to pick what the color's pixels become. */
export interface IPaletteRemovalRequest {
  index: number;
  color: string;
  pixelCount: number;
  /** The palette the request was made against; any palette change drops the request. */
  palette: readonly string[];
  /** Palette entry the pixels take, or null for transparent. */
  replacementIndex: number | null;
}

/** A palette entry offered as a replacement, with its index in the current palette. */
export interface IPaletteReplacementChoice {
  index: number;
  color: string;
}

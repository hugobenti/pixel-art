export interface IPaletteUsageRow {
  paletteIndex: number;
  count: number;
  /** Palette color, or "transparent" when the index is outside the palette. */
  color: string;
  /** Share of the opaque composite pixels, 0–100 with one decimal. */
  percent: number;
}

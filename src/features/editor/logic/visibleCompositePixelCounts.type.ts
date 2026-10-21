export interface IVisibleCompositeCountResult {
  /** Palette index -> number of visible artwork pixels showing that index after compositing. */
  countsByPaletteIndex: Map<number, number>;
  /** Sum of counted composite pixels (opaque in the visible viewport region). */
  totalCompositeOpaque: number;
  /** Canvas pixels (artwork cells) intersecting the viewport, including fully transparent composite. */
  totalViewportCells: number;
}

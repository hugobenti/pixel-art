/** Positions along a horizontal scroller, in the scroller's content coordinates (px). */
export interface IScrollRevealInput {
  itemStart: number;
  itemEnd: number;
  scrollLeft: number;
  viewWidth: number;
  /** Space kept between the item and the scroller's edge (room for the swatch ring). */
  padding: number;
}

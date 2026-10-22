/** Where and how large renderCanvas draws: device pixels per art pixel and the top-left offset. */
export interface IRenderViewport {
  scale: number;
  viewOffset: { x: number; y: number };
}

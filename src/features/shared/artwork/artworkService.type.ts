export interface ICreateArtworkInput {
  title: string;
  width: number;
  height: number;
  /** CSS hex for the initial canvas fill (e.g. `#RRGGBB`). Added to the palette if missing. */
  backgroundColor: string;
}

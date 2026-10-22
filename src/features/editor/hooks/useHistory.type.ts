import type { IPaletteLayerBuffer } from "@/features/editor/logic/paletteMutations.type";

export interface IHistoryDocument {
  layers: readonly IPaletteLayerBuffer[];
  /** Current palette; pixel values at or above its length are transparent. */
  palette: readonly string[];
}

export interface IUseHistoryParams {
  documentKey: string;
  getDocument: () => IHistoryDocument;
}

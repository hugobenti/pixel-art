import type { IPaletteLayerBuffer } from "@/features/editor/logic/paletteMutations.type";

export interface IUseHistoryParams {
  documentKey: string;
  getLayers: () => readonly IPaletteLayerBuffer[];
}

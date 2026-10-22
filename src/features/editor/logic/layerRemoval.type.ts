import type { IArtworkLayer } from "@/features/shared/artwork/artwork.type";

export interface ILayerRemovalResult {
  layers: IArtworkLayer[];
  activeLayerId: string;
}

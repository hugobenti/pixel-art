import type { IArtworkLayer } from "@/features/shared/artwork/artwork.type";

export interface ILayerPreviewProps {
  layer: IArtworkLayer;
  palette: string[];
  width: number;
  height: number;
}

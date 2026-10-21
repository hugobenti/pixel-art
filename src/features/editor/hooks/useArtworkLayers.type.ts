import type { Dispatch, SetStateAction } from "react";
import type { IArtwork } from "@/features/shared/artwork/artwork.type";

export interface IUseArtworkLayersParams {
  artwork: IArtwork;
  setArtwork: Dispatch<SetStateAction<IArtwork>>;
  onLayersChanged: () => void;
}

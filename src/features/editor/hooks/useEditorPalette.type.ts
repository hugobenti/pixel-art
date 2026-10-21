import type { Dispatch, SetStateAction } from "react";
import type { IArtwork } from "@/features/shared/artwork/artwork.type";

export interface IUseEditorPaletteParams {
  artwork: IArtwork;
  setArtwork: Dispatch<SetStateAction<IArtwork>>;
  onPaletteOrPixelsDirty: () => void;
}

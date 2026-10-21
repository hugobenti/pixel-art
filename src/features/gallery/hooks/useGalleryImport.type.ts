import type { IArtwork } from "@/features/shared/artwork/artwork.type";
import type { IImportedArtworkData } from "@/features/shared/artwork/artworkFileService.type";

export interface IUseGalleryImportParams {
  importArtwork: (input: IImportedArtworkData) => Promise<IArtwork | null>;
  onImported: (artwork: IArtwork) => void;
}

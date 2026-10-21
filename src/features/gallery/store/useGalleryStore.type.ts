import type { IArtwork } from "@/features/shared/artwork/artwork.type";
import type { IImportedArtworkData } from "@/features/shared/artwork/artworkFileService.type";
import type { ICreateArtworkInput } from "@/features/shared/artwork/artworkService.type";

export interface IGalleryState {
  artworks: IArtwork[];
  loading: boolean;
  error: string | null;
  loadArtworks: () => Promise<void>;
  createArtwork: (input: ICreateArtworkInput) => Promise<IArtwork | null>;
  importArtwork: (input: IImportedArtworkData) => Promise<IArtwork | null>;
  renameArtwork: (id: string, title: string) => Promise<void>;
  cloneArtwork: (id: string) => Promise<IArtwork | undefined>;
  deleteArtwork: (id: string) => Promise<void>;
}

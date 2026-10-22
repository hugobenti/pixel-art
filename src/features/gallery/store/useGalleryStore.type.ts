import type { IArtwork } from "@/features/shared/artwork/artwork.type";
import type { IImportedArtworkData } from "@/features/shared/artwork/artworkFileService.type";
import type { ICreateArtworkInput } from "@/features/shared/artwork/artworkService.type";

/** A created artwork, or the reason it could not be created (shown inside the create dialog). */
export type TCreateArtworkResult =
  { artwork: IArtwork; error: null } | { artwork: null; error: string };

export interface IGalleryState {
  artworks: IArtwork[];
  loading: boolean;
  error: string | null;
  loadArtworks: () => Promise<void>;
  createArtwork: (input: ICreateArtworkInput) => Promise<TCreateArtworkResult>;
  importArtwork: (input: IImportedArtworkData) => Promise<IArtwork | null>;
  renameArtwork: (id: string, title: string) => Promise<void>;
  cloneArtwork: (id: string) => Promise<IArtwork | undefined>;
  deleteArtwork: (id: string) => Promise<void>;
}

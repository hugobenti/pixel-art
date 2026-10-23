import type { IArtwork } from "@/features/shared/artwork/artwork.type";

export interface IGalleryGridProps {
  artworks: IArtwork[];
  now: number;
  onRename: (id: string, title: string) => Promise<void>;
  onClone: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  /** Empty-state actions. */
  onCreate: () => void;
  onImport: () => void;
}

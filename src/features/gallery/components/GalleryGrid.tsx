/**
 * Purpose:
 * Responsive grid layout for artwork cards on the gallery route.
 */
"use client";

import type { Artwork } from "@/features/shared/artwork/artwork.types";

import { ArtworkCard } from "@/features/gallery/components/ArtworkCard";
import { galleryGrid } from "@/features/gallery/components/GalleryGrid.style";

interface GalleryGridProps {
  artworks: Artwork[];
  onRename: (id: string, title: string) => Promise<void>;
  onClone: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function GalleryGrid({
  artworks,
  onRename,
  onClone,
  onDelete,
}: GalleryGridProps) {
  if (artworks.length === 0) {
    return (
      <p className={galleryGrid.empty}>
        No artworks yet. Create one to get started.
      </p>
    );
  }

  return (
    <div className={galleryGrid.grid}>
      {artworks.map((a) => (
        <ArtworkCard
          key={a.id}
          artwork={a}
          onRename={onRename}
          onClone={onClone}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

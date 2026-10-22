/**
 * Purpose:
 * Responsive grid layout for artwork cards on the gallery route.
 */
"use client";

import { gallery } from "@/content/gallery";
import { ArtworkCard } from "@/features/gallery/components/ArtworkCard";
import { galleryGrid } from "./GalleryGrid.style";
import type { IGalleryGridProps } from "./GalleryGrid.type";

export function GalleryGrid({ artworks, onRename, onClone, onDelete }: IGalleryGridProps) {
  if (artworks.length === 0) {
    return <p className={galleryGrid.empty}>{gallery.grid.empty}</p>;
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

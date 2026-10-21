/**
 * Purpose:
 * Responsive grid layout for artwork cards on the gallery route.
 */
"use client";

import { gallery } from "@/content/gallery";
import { ArtworkCard } from "@/features/gallery/components/ArtworkCard";
import type { IGalleryGridProps } from "./GalleryGrid.type";

const gridClass =
  "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

export function GalleryGrid({
  artworks,
  onRename,
  onClone,
  onDelete,
}: IGalleryGridProps) {
  if (artworks.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-line-strong p-12 text-center text-muted">
        {gallery.grid.empty}
      </p>
    );
  }

  return (
    <div className={gridClass}>
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

/**
 * Purpose:
 * Responsive grid layout for artwork cards on the gallery route.
 */
"use client";

import { gallery } from "@/content/gallery";
import { ArtworkCard } from "@/features/gallery/components/ArtworkCard";
import { Button } from "@/features/shared/components/Button";
import { PublicMaskIcon } from "@/features/shared/components/PublicMaskIcon";
import { PUBLIC_ICONS } from "@/features/shared/constants/publicIcons";
import { galleryGrid } from "./GalleryGrid.style";
import type { IGalleryGridProps } from "./GalleryGrid.type";

export function GalleryGrid({
  artworks,
  now,
  onRename,
  onClone,
  onDelete,
  onCreate,
  onImport,
}: IGalleryGridProps) {
  if (artworks.length === 0) {
    return (
      <div className={galleryGrid.empty}>
        <PublicMaskIcon src={PUBLIC_ICONS.pencil} className={galleryGrid.emptyIcon} />
        <h2 className={galleryGrid.emptyTitle}>{gallery.grid.emptyTitle}</h2>
        <p className={galleryGrid.emptyText}>{gallery.grid.emptyText}</p>
        <div className={galleryGrid.emptyActions}>
          <Button type="button" variant="primary" onClick={onCreate}>
            {gallery.screen.newArtwork}
          </Button>
          <Button type="button" variant="outline" onClick={onImport}>
            {gallery.screen.importFile}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={galleryGrid.grid}>
      {artworks.map((a) => (
        <ArtworkCard
          key={a.id}
          artwork={a}
          now={now}
          onRename={onRename}
          onClone={onClone}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

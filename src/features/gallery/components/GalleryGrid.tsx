/**
 * Purpose:
 * Responsive grid layout for artwork cards on the gallery route.
 */
"use client";

import type { Artwork } from "@/features/editor/types/editor.types";

import { ArtworkCard } from "@/features/gallery/components/ArtworkCard";

const gridClass =
  "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

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
      <p className="rounded-xl border border-dashed border-zinc-300 p-12 text-center text-zinc-500">
        No artworks yet. Create one to get started.
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

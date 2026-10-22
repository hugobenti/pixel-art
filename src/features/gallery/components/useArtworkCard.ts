/**
 * Purpose:
 * ArtworkCard behavior and view model: editor link, thumbnail, inline rename and confirmed delete.
 */
"use client";

import { useState, type FormEvent } from "react";

import { gallery } from "@/content/gallery";
import { artworkThumbnail, editorPath } from "@/features/gallery/logic/artworkLinks";
import type { IArtworkCardProps } from "./ArtworkCard.type";

export function useArtworkCard({ artwork, onRename, onDelete }: IArtworkCardProps) {
  const [renaming, setRenaming] = useState(false);
  const [title, setTitle] = useState(artwork.title);

  const cancelRename = () => {
    setTitle(artwork.title);
    setRenaming(false);
  };

  const submitRename = async (event: FormEvent) => {
    event.preventDefault();
    await onRename(artwork.id, title);
    setRenaming(false);
  };

  const confirmDelete = () => {
    if (typeof window !== "undefined" && window.confirm(gallery.card.confirmDelete)) {
      void onDelete(artwork.id);
    }
  };

  return {
    href: editorPath(artwork.id),
    thumbnail: artworkThumbnail(artwork.thumbnail),
    renaming,
    setRenaming,
    title,
    setTitle,
    cancelRename,
    submitRename,
    confirmDelete,
  };
}

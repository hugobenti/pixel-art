/**
 * Purpose:
 * View model for a gallery artwork card: links, thumbnail, rename form, and delete confirmation.
 */
"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";

import { EMPTY_THUMBNAIL_SRC, getEditorHref } from "@/features/gallery/logic/artworkLinks";

import type { Artwork } from "@/features/shared/artwork/artwork.types";

interface UseArtworkCardParams {
  artwork: Artwork;
  onRename: (id: string, title: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function useArtworkCard({ artwork, onRename, onDelete }: UseArtworkCardParams) {
  const [renaming, setRenaming] = useState(false);
  const [title, setTitle] = useState(artwork.title);

  const thumb = artwork.thumbnail || EMPTY_THUMBNAIL_SRC;

  const handleRenameSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onRename(artwork.id, title);
    setRenaming(false);
  };

  const handleTitleChange = (ev: ChangeEvent<HTMLInputElement>) => {
    setTitle(ev.target.value);
  };

  const startRename = () => {
    setRenaming(true);
  };

  const cancelRename = () => {
    setTitle(artwork.title);
    setRenaming(false);
  };

  const handleDelete = () => {
    if (typeof window !== "undefined" && window.confirm("Delete this artwork permanently?")) {
      void onDelete(artwork.id);
    }
  };

  return {
    editorHref: getEditorHref(artwork.id),
    thumb,
    thumbUnoptimized: thumb.startsWith("data:"),
    renaming,
    title,
    handleTitleChange,
    handleRenameSubmit,
    startRename,
    cancelRename,
    handleDelete,
  };
}

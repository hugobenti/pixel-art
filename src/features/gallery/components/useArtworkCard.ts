/**
 * Purpose:
 * ArtworkCard behavior and view model: editor link, thumbnail, inline rename and action menu.
 */
"use client";

import { useState, type FormEvent } from "react";

import { gallery } from "@/content/gallery";
import { shared } from "@/content/shared";
import { artworkThumbnail, editorPath } from "@/features/gallery/logic/artworkLinks";
import type { IMenuItem } from "@/features/shared/components/Menu.type";
import type { IArtworkCardProps } from "./ArtworkCard.type";

export function useArtworkCard({ artwork, onRename, onClone, onDelete }: IArtworkCardProps) {
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

  const menuItems: IMenuItem[] = [
    { key: "rename", label: shared.actions.rename, onSelect: () => setRenaming(true) },
    { key: "clone", label: gallery.card.clone, onSelect: () => void onClone(artwork.id) },
    { key: "delete", label: gallery.card.delete, onSelect: () => void onDelete(artwork.id) },
  ];

  return {
    href: editorPath(artwork.id),
    thumbnail: artworkThumbnail(artwork.thumbnail),
    renaming,
    setRenaming,
    title,
    setTitle,
    cancelRename,
    submitRename,
    menuItems,
  };
}

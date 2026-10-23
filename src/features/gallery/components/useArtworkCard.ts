/**
 * Purpose:
 * ArtworkCard behavior and view model: editor link, thumbnail, inline rename, action menu and confirmed delete.
 */
"use client";

import { useState, type FormEvent } from "react";

import { gallery } from "@/content/gallery";
import { shared } from "@/content/shared";
import { artworkThumbnail, editorPath } from "@/features/gallery/logic/artworkLinks";
import type { IMenuItem } from "@/features/shared/components/Menu.type";
import { useConfirm } from "@/features/shared/components/useConfirm";
import type { IArtworkCardProps } from "./ArtworkCard.type";

export function useArtworkCard({ artwork, onRename, onClone, onDelete }: IArtworkCardProps) {
  const [renaming, setRenaming] = useState(false);
  const [title, setTitle] = useState(artwork.title);
  const { confirm, dialog: deleteDialog } = useConfirm();

  const cancelRename = () => {
    setTitle(artwork.title);
    setRenaming(false);
  };

  const submitRename = async (event: FormEvent) => {
    event.preventDefault();
    await onRename(artwork.id, title);
    setRenaming(false);
  };

  const confirmDelete = async () => {
    const confirmed = await confirm({
      title: gallery.deleteDialog.title(artwork.title),
      description: gallery.deleteDialog.description,
      confirmLabel: gallery.deleteDialog.confirm,
    });
    if (confirmed) await onDelete(artwork.id);
  };

  const menuItems: IMenuItem[] = [
    { key: "rename", label: shared.actions.rename, onSelect: () => setRenaming(true) },
    { key: "clone", label: gallery.card.clone, onSelect: () => void onClone(artwork.id) },
    {
      key: "delete",
      label: gallery.card.delete,
      tone: "danger",
      onSelect: () => void confirmDelete(),
    },
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
    deleteDialog,
  };
}

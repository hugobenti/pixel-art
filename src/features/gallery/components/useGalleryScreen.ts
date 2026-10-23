/**
 * Purpose:
 * GalleryScreen behavior: loads the gallery, owns the create dialog, and opens the editor after a
 * create or import.
 */
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type ChangeEvent } from "react";

import { useGalleryImport } from "@/features/gallery/hooks/useGalleryImport";
import { useStaleThumbnailRefresh } from "@/features/gallery/hooks/useStaleThumbnailRefresh";
import { editorPath } from "@/features/gallery/logic/artworkLinks";
import { useGalleryStore } from "@/features/gallery/store/useGalleryStore";
import { gallery } from "@/content/gallery";
import type { ICreateArtworkInput } from "@/features/shared/artwork/artworkService.type";

export function useGalleryScreen() {
  const router = useRouter();
  const {
    artworks,
    loading,
    error,
    loadArtworks,
    createArtwork,
    importArtwork,
    renameArtwork,
    cloneArtwork,
    deleteArtwork,
    updateThumbnail,
  } = useGalleryStore();

  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    void loadArtworks();
  }, [loadArtworks]);

  useStaleThumbnailRefresh(artworks, updateThumbnail);

  const { importInputRef, openImportPicker, onImportFile } = useGalleryImport({
    importArtwork,
    onImported: (created) => {
      router.push(editorPath(created.id));
    },
  });

  const onImportChange = (event: ChangeEvent<HTMLInputElement>) => {
    void onImportFile(event.target.files?.[0] ?? null);
    event.currentTarget.value = "";
  };

  /** Resolves to an error message for the dialog, or null once the editor opens. */
  const createAndOpen = async (input: ICreateArtworkInput): Promise<string | null> => {
    const { artwork, error: createError } = await createArtwork(input);
    if (!artwork) {
      return createError;
    }
    setModalOpen(false);
    router.push(editorPath(artwork.id));
    return null;
  };

  return {
    artworks,
    loading,
    error,
    renameArtwork,
    /** The grid only awaits the clone; the store reloads the list itself. */
    cloneArtwork: async (id: string) => {
      await cloneArtwork(id);
    },
    deleteArtwork,
    modalOpen,
    setModalOpen,
    primaryAction: {
      kind: "button" as const,
      label: gallery.screen.newArtwork,
      compactLabel: gallery.screen.newCompact,
      onClick: () => setModalOpen(true),
    },
    createArtwork: createAndOpen,
    importInputRef,
    openImportPicker,
    onImportChange,
  };
}

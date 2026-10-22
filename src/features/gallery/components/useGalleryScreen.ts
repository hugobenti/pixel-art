/**
 * Purpose:
 * GalleryScreen behavior: loads the gallery, owns the create dialog, and opens the editor after a
 * create or import.
 */
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type ChangeEvent } from "react";

import { useGalleryImport } from "@/features/gallery/hooks/useGalleryImport";
import { editorPath } from "@/features/gallery/logic/artworkLinks";
import { useGalleryStore } from "@/features/gallery/store/useGalleryStore";
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
  } = useGalleryStore();

  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    void loadArtworks();
  }, [loadArtworks]);

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

  const createAndOpen = async (input: ICreateArtworkInput) => {
    const created = await createArtwork(input);
    if (created) {
      setModalOpen(false);
      router.push(editorPath(created.id));
    }
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
    createArtwork: createAndOpen,
    importInputRef,
    openImportPicker,
    onImportChange,
  };
}

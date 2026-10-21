/**
 * Purpose:
 * View model for the gallery route shell: loads artworks, wires JSON import, and drives the create modal.
 *
 * Notes:
 * After creating or importing an artwork, the app navigates to the editor for that id.
 */
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type ChangeEvent } from "react";

import { useGalleryImport } from "@/features/gallery/hooks/useGalleryImport";
import { getEditorHref } from "@/features/gallery/logic/artworkLinks";
import { useGalleryStore } from "@/features/gallery/store/useGalleryStore";

import type { CreateArtworkInput } from "@/features/shared/artwork/artworkService";

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
      router.push(getEditorHref(created.id));
    },
  });

  const handleImportChange = (event: ChangeEvent<HTMLInputElement>) => {
    void onImportFile(event.target.files?.[0] ?? null);
    event.currentTarget.value = "";
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleClone = async (id: string) => {
    await cloneArtwork(id);
  };

  const handleCreate = async (input: CreateArtworkInput) => {
    const created = await createArtwork(input);
    if (created) {
      setModalOpen(false);
      router.push(getEditorHref(created.id));
    }
  };

  return {
    artworks,
    loading,
    error,
    renameArtwork,
    deleteArtwork,
    modalOpen,
    importInputRef,
    openImportPicker,
    handleImportChange,
    openModal,
    closeModal,
    handleClone,
    handleCreate,
  };
}

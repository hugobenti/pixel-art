/**
 * Purpose:
 * Client shell for the gallery route: loads IndexedDB entries and hosts creation modal.
 *
 * Notes:
 * After creating or importing an artwork, the app navigates to the editor for that id.
 */
"use client";

import { Button } from "@/features/shared/components/Button";

import { CreateArtworkModal } from "@/features/gallery/components/CreateArtworkModal";
import { GalleryGrid } from "@/features/gallery/components/GalleryGrid";
import { galleryScreen } from "@/features/gallery/components/GalleryScreen.style";
import { useGalleryScreen } from "@/features/gallery/hooks/useGalleryScreen";

export function GalleryScreen() {
  const {
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
  } = useGalleryScreen();

  return (
    <div className={galleryScreen.shell}>
      <header className={galleryScreen.header}>
        <div>
          <h1 className={galleryScreen.title}>Gallery</h1>
          <p className={galleryScreen.subtitle}>
            Local artworks stored in your browser (IndexedDB).
          </p>
        </div>
        <div className={galleryScreen.headerActions}>
          <input
            ref={importInputRef}
            type="file"
            accept=".json,application/json"
            className={galleryScreen.fileInput}
            onChange={handleImportChange}
          />
          <Button type="button" variant="outline" onClick={openImportPicker}>
            Import JSON
          </Button>
          <Button type="button" onClick={openModal}>
            New artwork
          </Button>
        </div>
      </header>

      {error ? <p className={galleryScreen.error}>{error}</p> : null}

      {loading ? (
        <p className={galleryScreen.loading}>Loading…</p>
      ) : (
        <GalleryGrid
          artworks={artworks}
          onRename={renameArtwork}
          onClone={handleClone}
          onDelete={deleteArtwork}
        />
      )}

      <CreateArtworkModal
        open={modalOpen}
        onClose={closeModal}
        onCreate={handleCreate}
      />
    </div>
  );
}

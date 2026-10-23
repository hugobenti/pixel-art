/**
 * Purpose:
 * Client shell for the gallery route: loads IndexedDB entries and hosts creation modal.
 *
 * Notes:
 * After creating or importing an artwork, the app navigates to the editor for that id.
 */
"use client";

import { gallery } from "@/content/gallery";
import { shared } from "@/content/shared";
import { Button } from "@/features/shared/components/Button";
import { SiteShell } from "@/features/shared/site/SiteShell";

import { CreateArtworkModal } from "@/features/gallery/components/CreateArtworkModal";
import { GalleryGrid } from "@/features/gallery/components/GalleryGrid";
import { galleryScreen } from "./GalleryScreen.style";
import { useGalleryScreen } from "./useGalleryScreen";

export function GalleryScreen() {
  const {
    artworks,
    loading,
    error,
    renameArtwork,
    cloneArtwork,
    deleteArtwork,
    modalOpen,
    setModalOpen,
    primaryAction,
    createArtwork,
    importInputRef,
    openImportPicker,
    onImportChange,
  } = useGalleryScreen();

  return (
    <SiteShell primaryAction={primaryAction}>
      <div className={galleryScreen.content}>
        <div className={galleryScreen.actions}>
          <input
            ref={importInputRef}
            type="file"
            accept=".json,application/json"
            className={galleryScreen.importInput}
            onChange={onImportChange}
          />
          <Button type="button" variant="outline" onClick={openImportPicker}>
            {gallery.screen.importJson}
          </Button>
        </div>

        {error ? (
          <p role="alert" className={galleryScreen.error}>
            {error}
          </p>
        ) : null}

        {loading ? (
          <p role="status" className={galleryScreen.loading}>
            {shared.loading}
          </p>
        ) : (
          <GalleryGrid
            artworks={artworks}
            onRename={renameArtwork}
            onClone={cloneArtwork}
            onDelete={deleteArtwork}
          />
        )}

        <CreateArtworkModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onCreate={createArtwork}
        />
      </div>
    </SiteShell>
  );
}

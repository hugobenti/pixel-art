/**
 * Purpose:
 * Client shell for the gallery route: loads IndexedDB entries and hosts creation modal.
 *
 * Notes:
 * After creating or importing an artwork, the app navigates to the editor for that id.
 */
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { gallery } from "@/content/gallery";
import { shared } from "@/content/shared";
import { Button } from "@/features/shared/components/Button";

import { CreateArtworkModal } from "@/features/gallery/components/CreateArtworkModal";
import { GalleryGrid } from "@/features/gallery/components/GalleryGrid";
import { useGalleryImport } from "@/features/gallery/hooks/useGalleryImport";
import { useGalleryStore } from "@/features/gallery/store/useGalleryStore";

const headerClass =
  "flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-center sm:justify-between";

const titleClass = "text-2xl font-semibold text-fg";

const shellClass = "mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-10";
const headerActionsClass = "flex flex-wrap items-center gap-2";

export function GalleryScreen() {
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
      router.push(`/editor/${created.id}`);
    },
  });

  return (
    <main className={shellClass}>
      <header className={headerClass}>
        <div>
          <h1 className={titleClass}>{gallery.screen.title}</h1>
          <p className="mt-1 text-sm text-muted">
            {gallery.screen.intro}
          </p>
        </div>
        <div className={headerActionsClass}>
          <input
            ref={importInputRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={(event) => {
              void onImportFile(event.target.files?.[0] ?? null);
              event.currentTarget.value = "";
            }}
          />
          <Button type="button" variant="outline" onClick={openImportPicker}>
            {gallery.screen.importJson}
          </Button>
          <Button type="button" onClick={() => setModalOpen(true)}>
            {gallery.screen.newArtwork}
          </Button>
        </div>
      </header>

      {error ? (
        <p role="alert" className="rounded-lg bg-danger-surface px-4 py-3 text-sm text-danger-fg">
          {error}
        </p>
      ) : null}

      {loading ? (
        <p role="status" className="text-muted">{shared.loading}</p>
      ) : (
        <GalleryGrid
          artworks={artworks}
          onRename={renameArtwork}
          onClone={async (id) => {
            await cloneArtwork(id);
          }}
          onDelete={deleteArtwork}
        />
      )}

      <CreateArtworkModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={async (input) => {
          const created = await createArtwork(input);
          if (created) {
            setModalOpen(false);
            router.push(`/editor/${created.id}`);
          }
        }}
      />
    </main>
  );
}

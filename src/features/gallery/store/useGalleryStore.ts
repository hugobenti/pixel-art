/**
 * Purpose:
 * Zustand store for gallery listing, loading state, and artwork mutations wired to Dexie.
 */
import { create } from "zustand";

import type { Artwork } from "@/features/editor/types/editor.types";
import * as galleryService from "@/features/gallery/services/galleryService";

interface GalleryState {
  artworks: Artwork[];
  loading: boolean;
  error: string | null;
  loadArtworks: () => Promise<void>;
  createArtwork: (input: galleryService.CreateArtworkInput) => Promise<Artwork | null>;
  renameArtwork: (id: string, title: string) => Promise<void>;
  cloneArtwork: (id: string) => Promise<Artwork | undefined>;
  deleteArtwork: (id: string) => Promise<void>;
}

export const useGalleryStore = create<GalleryState>((set, get) => ({
  artworks: [],
  loading: false,
  error: null,

  loadArtworks: async () => {
    set({ loading: true, error: null });
    try {
      const artworks = await galleryService.listArtworks();
      set({ artworks, loading: false });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to load gallery.";
      set({ error: message, loading: false });
    }
  },

  createArtwork: async (input) => {
    set({ error: null });
    try {
      const created = await galleryService.createArtwork(input);
      await get().loadArtworks();
      return created;
    } catch (e) {
      const message = e instanceof Error ? e.message : "Could not create artwork.";
      set({ error: message });
      return null;
    }
  },

  renameArtwork: async (id, title) => {
    set({ error: null });
    try {
      await galleryService.renameArtwork(id, title);
      await get().loadArtworks();
    } catch (e) {
      const message = e instanceof Error ? e.message : "Rename failed.";
      set({ error: message });
    }
  },

  cloneArtwork: async (id) => {
    set({ error: null });
    try {
      const clone = await galleryService.cloneArtwork(id);
      await get().loadArtworks();
      return clone;
    } catch (e) {
      const message = e instanceof Error ? e.message : "Clone failed.";
      set({ error: message });
      return undefined;
    }
  },

  deleteArtwork: async (id) => {
    set({ error: null });
    try {
      await galleryService.deleteArtwork(id);
      await get().loadArtworks();
    } catch (e) {
      const message = e instanceof Error ? e.message : "Delete failed.";
      set({ error: message });
    }
  },
}));

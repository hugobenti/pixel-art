/**
 * Purpose:
 * Zustand store for gallery listing, loading state, and artwork mutations wired to Dexie.
 */
import { create } from "zustand";

import { gallery } from "@/content/gallery";
import * as artworkService from "@/features/shared/artwork/artworkService";
import type { IGalleryState } from "./useGalleryStore.type";

export const useGalleryStore = create<IGalleryState>((set, get) => ({
  artworks: [],
  loading: false,
  error: null,

  loadArtworks: async () => {
    set({ loading: true, error: null });
    try {
      const artworks = await artworkService.listArtworks();
      set({ artworks, loading: false });
    } catch (e) {
      const message = e instanceof Error ? e.message : gallery.errors.load;
      set({ error: message, loading: false });
    }
  },

  createArtwork: async (input) => {
    try {
      const artwork = await artworkService.createArtwork(input);
      await get().loadArtworks();
      return { artwork, error: null };
    } catch (e) {
      return { artwork: null, error: e instanceof Error ? e.message : gallery.errors.create };
    }
  },

  importArtwork: async (input) => {
    set({ error: null });
    try {
      const created = await artworkService.createArtworkFromImport(input);
      await get().loadArtworks();
      return created;
    } catch (e) {
      const message = e instanceof Error ? e.message : gallery.errors.import;
      set({ error: message });
      return null;
    }
  },

  renameArtwork: async (id, title) => {
    set({ error: null });
    try {
      await artworkService.renameArtwork(id, title);
      await get().loadArtworks();
    } catch (e) {
      const message = e instanceof Error ? e.message : gallery.errors.rename;
      set({ error: message });
    }
  },

  cloneArtwork: async (id) => {
    set({ error: null });
    try {
      const clone = await artworkService.cloneArtwork(id);
      await get().loadArtworks();
      return clone;
    } catch (e) {
      const message = e instanceof Error ? e.message : gallery.errors.clone;
      set({ error: message });
      return undefined;
    }
  },

  deleteArtwork: async (id) => {
    set({ error: null });
    try {
      await artworkService.deleteArtwork(id);
      await get().loadArtworks();
    } catch (e) {
      const message = e instanceof Error ? e.message : gallery.errors.delete;
      set({ error: message });
    }
  },
}));

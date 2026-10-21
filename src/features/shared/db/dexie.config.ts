/**
 * Purpose:
 * IndexedDB bootstrap for PixelCraft using Dexie.js (artworks table + schema versioning).
 */
import Dexie, { type Table } from "dexie";

import type { IArtwork } from "@/features/shared/artwork/artwork.type";

export class PixelCraftDB extends Dexie {
  artworks!: Table<IArtwork, string>;

  constructor() {
    super("PixelCraftDB");
    this.version(1).stores({
      artworks: "id, updatedAt, title",
    });
    this.version(2)
      .stores({
        artworks: "id, updatedAt, title",
      })
      .upgrade((tx) =>
        tx
          .table("artworks")
          .toCollection()
          .modify((record: Partial<IArtwork>) => {
            if (typeof record.referenceImageDataUrl !== "string") {
              record.referenceImageDataUrl = undefined;
            }
          })
      );
    this.version(3)
      .stores({
        artworks: "id, updatedAt, title",
      })
      .upgrade((tx) =>
        tx
          .table("artworks")
          .toCollection()
          .modify((record: Partial<IArtwork>) => {
            if (!Array.isArray(record.layers)) {
              record.layers = [];
            }
            if (typeof record.activeLayerId !== "string") {
              record.activeLayerId = "";
            }
          })
      );
  }
}

export const db = new PixelCraftDB();

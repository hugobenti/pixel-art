/**
 * Purpose:
 * IndexedDB bootstrap for PixelCraft using Dexie.js (artworks table + schema versioning).
 */
import Dexie, { type Table } from "dexie";

import type { Artwork } from "@/features/editor/types/editor.types";

export class PixelCraftDB extends Dexie {
  artworks!: Table<Artwork, string>;

  constructor() {
    super("PixelCraftDB");
    this.version(1).stores({
      artworks: "id, updatedAt, title",
    });
  }
}

export const db = new PixelCraftDB();

/**
 * Purpose:
 * Gallery persistence layer: IndexedDB access for artworks (CRUD, clone, thumbnail updates).
 *
 * Notes:
 * New artworks honor `backgroundColor`: pixels are filled with that palette index, appending the
 * color to the palette when it is not already present (up to MAX_PALETTE_ENTRIES).
 */
import { db } from "@/features/shared/db/dexie.config";
import type { Artwork } from "@/features/editor/types/editor.types";
import { normalizeHexColor } from "@/features/shared/utils/colorConverter";
import { clonePixelBuffer, ensureUint8PixelData } from "@/features/shared/utils/binaryHelpers";

const CANON_HEX6 = /^#[0-9A-F]{6}$/;

export const MAX_CANVAS_DIMENSION = 1000;
export const MAX_PALETTE_ENTRIES = 256;

export const DEFAULT_PALETTE: string[] = [
  "#000000",
  "#FFFFFF",
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#FF00FF",
  "#00FFFF",
  "#808080",
  "#404040",
  "#C0C0C0",
  "#800000",
  "#008000",
  "#000080",
  "#FFA500",
  "#800080",
];

function newId(): string {
  return crypto.randomUUID();
}

function validateDimensions(width: number, height: number): void {
  if (
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    width < 1 ||
    height < 1 ||
    width > MAX_CANVAS_DIMENSION ||
    height > MAX_CANVAS_DIMENSION
  ) {
    throw new Error(
      `Dimensions must be between 1 and ${MAX_CANVAS_DIMENSION}.`
    );
  }
}

export async function listArtworks(): Promise<Artwork[]> {
  const rows = await db.artworks.orderBy("updatedAt").reverse().toArray();
  return rows.map(hydrateArtwork);
}

export async function getArtwork(id: string): Promise<Artwork | undefined> {
  const row = await db.artworks.get(id);
  return row ? hydrateArtwork(row) : undefined;
}

function hydrateArtwork(row: Artwork): Artwork {
  const n = row.width * row.height;
  const referenceImageDataUrl =
    typeof row.referenceImageDataUrl === "string" &&
    row.referenceImageDataUrl.length > 0
      ? row.referenceImageDataUrl
      : undefined;
  return {
    ...row,
    pixelData: ensureUint8PixelData(row.pixelData, n),
    palette: [...row.palette],
    referenceImageDataUrl,
  };
}

export interface CreateArtworkInput {
  title: string;
  width: number;
  height: number;
  /** CSS hex for the initial canvas fill (e.g. `#RRGGBB`). Added to the palette if missing. */
  backgroundColor: string;
}

export async function createArtwork(input: CreateArtworkInput): Promise<Artwork> {
  validateDimensions(input.width, input.height);
  const bgHex = normalizeHexColor(input.backgroundColor.trim());
  if (!CANON_HEX6.test(bgHex)) {
    throw new Error("Invalid background color.");
  }

  let palette = DEFAULT_PALETTE.slice(0, MAX_PALETTE_ENTRIES);
  let bgIndex = palette.findIndex(
    (entry) => normalizeHexColor(entry) === bgHex
  );
  if (bgIndex === -1) {
    if (palette.length >= MAX_PALETTE_ENTRIES) {
      throw new Error("Cannot add background color: palette is full.");
    }
    palette = [...palette, bgHex];
    bgIndex = palette.length - 1;
  }

  const now = Date.now();
  const pixelData = new Uint8Array(input.width * input.height);
  pixelData.fill(bgIndex);

  const artwork: Artwork = {
    id: newId(),
    title: input.title.trim() || "Untitled",
    width: input.width,
    height: input.height,
    createdAt: now,
    updatedAt: now,
    thumbnail: "",
    palette,
    pixelData,
    referenceImageDataUrl: undefined,
  };

  await db.artworks.put(artwork);
  return hydrateArtwork(artwork);
}

export async function saveArtwork(artwork: Artwork): Promise<void> {
  validateDimensions(artwork.width, artwork.height);
  if (artwork.palette.length > MAX_PALETTE_ENTRIES) {
    throw new Error(`Palette cannot exceed ${MAX_PALETTE_ENTRIES} colors.`);
  }
  const toStore: Artwork = {
    ...artwork,
    updatedAt: Date.now(),
    pixelData: clonePixelBuffer(artwork.pixelData),
    palette: [...artwork.palette],
    referenceImageDataUrl: artwork.referenceImageDataUrl,
  };
  await db.artworks.put(toStore);
}

export async function deleteArtwork(id: string): Promise<void> {
  await db.artworks.delete(id);
}

export async function renameArtwork(id: string, title: string): Promise<void> {
  await db.artworks.update(id, {
    title: title.trim() || "Untitled",
    updatedAt: Date.now(),
  });
}

export async function cloneArtwork(id: string): Promise<Artwork | undefined> {
  const source = await getArtwork(id);
  if (!source) return undefined;

  const now = Date.now();
  const clone: Artwork = {
    ...source,
    id: newId(),
    title: `${source.title} (copy)`,
    createdAt: now,
    updatedAt: now,
    thumbnail: source.thumbnail,
    pixelData: clonePixelBuffer(source.pixelData),
    palette: [...source.palette],
    referenceImageDataUrl: source.referenceImageDataUrl,
  };

  await db.artworks.put(clone);
  return hydrateArtwork(clone);
}

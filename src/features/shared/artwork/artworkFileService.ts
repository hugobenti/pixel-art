/**
 * Purpose:
 * Serialize artwork documents for JSON import/export and render PNG snapshots for download.
 *
 * Notes:
 * Exported JSON uses a versioned schema with Base64-encoded layer buffers for compact files.
 */
"use client";

import { shared } from "@/content/shared";
import type { Artwork, ArtworkLayer } from "@/features/shared/artwork/artwork.types";
import { MAX_PALETTE_ENTRIES, validateDimensions } from "@/features/shared/artwork/artworkService";

const errors = shared.artworkFile.errors;

const FILE_SCHEMA_VERSION = 2;
const JSON_MIME = "application/json";
const PNG_MIME = "image/png";
const HEX_COLOR = /^#[0-9A-Fa-f]{6}$/;
const BASE64_CHUNK_BYTES = 0x8000;

interface ArtworkFileV1 {
  version: 1;
  title: string;
  width: number;
  height: number;
  palette: string[];
  layers: Array<{
    id: string;
    name: string;
    visible: boolean;
    pixelData: number[];
  }>;
  activeLayerId: string;
  referenceImageDataUrl?: string;
}

interface ArtworkFileV2 {
  version: 2;
  title: string;
  width: number;
  height: number;
  palette: string[];
  layers: Array<{
    id: string;
    name: string;
    visible: boolean;
    pixelDataBase64: string;
  }>;
  activeLayerId: string;
  referenceImageDataUrl?: string;
}

export interface ImportedArtworkData {
  title: string;
  width: number;
  height: number;
  palette: string[];
  layers: ArtworkLayer[];
  activeLayerId: string;
  referenceImageDataUrl?: string;
}

function sanitizeFileNameSegment(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return "artwork";
  }
  return trimmed.toLowerCase().replace(/[^a-z0-9-_]+/g, "-").replace(/-+/g, "-");
}

function triggerFileDownload(blob: Blob, fileName: string): void {
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = fileName;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(objectUrl);
}

function uint8ArrayToBase64(buffer: Uint8Array): string {
  let binary = "";
  for (let index = 0; index < buffer.length; index += BASE64_CHUNK_BYTES) {
    const chunk = buffer.subarray(index, index + BASE64_CHUNK_BYTES);
    binary += String.fromCharCode(...chunk);
  }
  return btoa(binary);
}

function base64ToUint8Array(base64: string): Uint8Array {
  let binary: string;
  try {
    binary = atob(base64);
  } catch {
    throw new Error(errors.invalidBase64);
  }
  const buffer = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    buffer[i] = binary.charCodeAt(i);
  }
  return buffer;
}

function toArtworkFile(artwork: Artwork): ArtworkFileV2 {
  return {
    version: FILE_SCHEMA_VERSION,
    title: artwork.title,
    width: artwork.width,
    height: artwork.height,
    palette: [...artwork.palette],
    layers: artwork.layers.map((layer) => ({
      id: layer.id,
      name: layer.name,
      visible: layer.visible !== false,
      pixelDataBase64: uint8ArrayToBase64(layer.pixelData),
    })),
    activeLayerId: artwork.activeLayerId,
    referenceImageDataUrl: artwork.referenceImageDataUrl,
  };
}

function validateParsedArtwork(value: unknown): ImportedArtworkData {
  if (!value || typeof value !== "object") {
    throw new Error(errors.invalidFormat);
  }
  const file = value as Partial<ArtworkFileV1 | ArtworkFileV2>;
  if (file.version !== 1 && file.version !== 2) {
    throw new Error(errors.unsupportedVersion);
  }
  if (typeof file.title !== "string") {
    throw new Error(errors.invalidTitle);
  }
  if (
    typeof file.width !== "number" ||
    typeof file.height !== "number" ||
    !Number.isInteger(file.width) ||
    !Number.isInteger(file.height)
  ) {
    throw new Error(errors.invalidDimensions);
  }
  const { width, height } = file;
  validateDimensions(width, height);

  if (!Array.isArray(file.palette) || file.palette.length === 0) {
    throw new Error(errors.paletteMissing);
  }
  if (file.palette.length > MAX_PALETTE_ENTRIES) {
    throw new Error(shared.artwork.errors.paletteTooLarge(MAX_PALETTE_ENTRIES));
  }
  for (const color of file.palette) {
    if (typeof color !== "string" || !HEX_COLOR.test(color)) {
      throw new Error(errors.invalidPaletteEntry);
    }
  }

  const pixelCount = width * height;
  if (!Array.isArray(file.layers) || file.layers.length === 0) {
    throw new Error(errors.layersMissing);
  }

  const layers: ArtworkLayer[] = file.layers.map((layer, layerIndex) => {
    if (!layer || typeof layer !== "object") {
      throw new Error(errors.layerInvalid(layerIndex + 1));
    }
    if (typeof layer.id !== "string" || layer.id.length === 0) {
      throw new Error(errors.layerInvalidId(layerIndex + 1));
    }
    if (typeof layer.name !== "string" || layer.name.length === 0) {
      throw new Error(errors.layerInvalidName(layerIndex + 1));
    }
    const buffer = new Uint8Array(pixelCount);
    if (file.version === 2) {
      if (
        !("pixelDataBase64" in layer) ||
        typeof layer.pixelDataBase64 !== "string"
      ) {
        throw new Error(errors.layerMissingCompactData(layer.name));
      }
      const decoded = base64ToUint8Array(layer.pixelDataBase64);
      if (decoded.length !== pixelCount) {
        throw new Error(errors.layerInvalidLength(layer.name));
      }
      buffer.set(decoded);
    } else {
      if (!("pixelData" in layer) || !Array.isArray(layer.pixelData)) {
        throw new Error(errors.layerMissingPixelData(layer.name));
      }
      if (layer.pixelData.length !== pixelCount) {
        throw new Error(errors.layerInvalidLength(layer.name));
      }
      for (let i = 0; i < pixelCount; i += 1) {
        const paletteIndex = layer.pixelData[i];
        if (
          !Number.isInteger(paletteIndex) ||
          paletteIndex < 0 ||
          paletteIndex >= file.palette!.length
        ) {
          throw new Error(errors.layerPaletteOutOfRange(layer.name));
        }
        buffer[i] = paletteIndex;
      }
    }

    for (let i = 0; i < pixelCount; i += 1) {
      if (buffer[i] >= file.palette!.length) {
        throw new Error(errors.layerPaletteOutOfRange(layer.name));
      }
    }
    return {
      id: layer.id,
      name: layer.name,
      visible: layer.visible !== false,
      pixelData: buffer,
    };
  });

  const activeLayerId =
    typeof file.activeLayerId === "string" &&
    layers.some((layer) => layer.id === file.activeLayerId)
      ? file.activeLayerId
      : layers[0].id;

  if (
    file.referenceImageDataUrl != null &&
    typeof file.referenceImageDataUrl !== "string"
  ) {
    throw new Error(errors.invalidReferenceImage);
  }

  return {
    title: file.title.trim() || shared.artwork.untitled,
    width,
    height,
    palette: [...file.palette],
    layers,
    activeLayerId,
    referenceImageDataUrl: file.referenceImageDataUrl,
  };
}

export function exportArtworkAsJson(artwork: Artwork): void {
  const payload = JSON.stringify(toArtworkFile(artwork), null, 2);
  const blob = new Blob([payload], { type: JSON_MIME });
  const fileName = `${sanitizeFileNameSegment(artwork.title)}.json`;
  triggerFileDownload(blob, fileName);
}

function drawArtworkToCanvas(artwork: Artwork): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = artwork.width;
  canvas.height = artwork.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error(errors.canvasUnavailable);
  }

  ctx.clearRect(0, 0, artwork.width, artwork.height);
  for (let layerIndex = artwork.layers.length - 1; layerIndex >= 0; layerIndex -= 1) {
    const layer = artwork.layers[layerIndex];
    if (!layer.visible) {
      continue;
    }
    for (let y = 0; y < artwork.height; y += 1) {
      for (let x = 0; x < artwork.width; x += 1) {
        const pixelIndex = x + y * artwork.width;
        const color = artwork.palette[layer.pixelData[pixelIndex]] ?? "transparent";
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }
  return canvas;
}

export async function exportArtworkAsPng(artwork: Artwork): Promise<void> {
  const canvas = drawArtworkToCanvas(artwork);
  const fileName = `${sanitizeFileNameSegment(artwork.title)}.png`;
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, PNG_MIME);
  });
  if (blob) {
    triggerFileDownload(blob, fileName);
    return;
  }

  const fallbackUrl = canvas.toDataURL(PNG_MIME);
  const anchor = document.createElement("a");
  anchor.href = fallbackUrl;
  anchor.download = fileName;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
}

export async function importArtworkFromJsonFile(file: File): Promise<ImportedArtworkData> {
  const text = await file.text();
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error(errors.invalidJson);
  }
  return validateParsedArtwork(parsed);
}

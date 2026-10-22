/**
 * Purpose:
 * Tell whether a stored gallery thumbnail was rendered by the current renderer: a PNG at the artwork's
 * integer thumbnail scale. Older thumbnails (WebP, or PNG at a fractional ~150px scale) show seams
 * between art pixels and are regenerated from the pixel data.
 *
 * Notes:
 * Reads only the PNG signature and IHDR chunk (first 24 bytes) from the data URL, so it stays cheap and
 * DOM-free.
 */
import { thumbnailScale } from "./thumbnailScale";

const PNG_DATA_URL_PREFIX = "data:image/png;base64,";
/** Base64 characters covering the first 24 bytes: 8-byte signature, chunk length, "IHDR", width, height. */
const HEADER_BASE64_LENGTH = 32;
const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

function pngSize(dataUrl: string): { width: number; height: number } | null {
  if (!dataUrl.startsWith(PNG_DATA_URL_PREFIX)) {
    return null;
  }
  let header: string;
  try {
    header = atob(dataUrl.slice(PNG_DATA_URL_PREFIX.length, PNG_DATA_URL_PREFIX.length + HEADER_BASE64_LENGTH));
  } catch {
    return null;
  }
  if (header.length < 24 || PNG_SIGNATURE.some((byte, i) => header.charCodeAt(i) !== byte)) {
    return null;
  }
  const uint32At = (offset: number) =>
    ((header.charCodeAt(offset) << 24) >>> 0) +
    (header.charCodeAt(offset + 1) << 16) +
    (header.charCodeAt(offset + 2) << 8) +
    header.charCodeAt(offset + 3);
  return { width: uint32At(16), height: uint32At(20) };
}

export function isThumbnailCurrent(thumbnail: string, width: number, height: number): boolean {
  const size = pngSize(thumbnail);
  if (!size) {
    return false;
  }
  const scale = thumbnailScale(width, height);
  return size.width === width * scale && size.height === height * scale;
}

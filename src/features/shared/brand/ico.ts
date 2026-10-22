/**
 * Purpose:
 * Packs square PNG images into one .ico file (PNG-compressed entries, supported by every current
 * browser), for the `/favicon.ico` route.
 */

import type { IIcoImage } from "./ico.type";

const HEADER_BYTES = 6;
const ENTRY_BYTES = 16;
const ICO_TYPE_ICON = 1;
const BITS_PER_PIXEL = 32;
/** The one-byte size fields store 256 as 0. */
const MAX_ICO_SIZE = 256;

export function buildIco(images: readonly IIcoImage[]): Uint8Array<ArrayBuffer> {
  const dataStart = HEADER_BYTES + ENTRY_BYTES * images.length;
  const total = images.reduce((sum, image) => sum + image.png.length, dataStart);
  const ico = new Uint8Array(total);
  const view = new DataView(ico.buffer);

  view.setUint16(0, 0, true);
  view.setUint16(2, ICO_TYPE_ICON, true);
  view.setUint16(4, images.length, true);

  let offset = dataStart;
  images.forEach((image, i) => {
    const at = HEADER_BYTES + i * ENTRY_BYTES;
    const sizeByte = image.size >= MAX_ICO_SIZE ? 0 : image.size;
    ico[at] = sizeByte;
    ico[at + 1] = sizeByte;
    view.setUint16(at + 4, 1, true);
    view.setUint16(at + 6, BITS_PER_PIXEL, true);
    view.setUint32(at + 8, image.png.length, true);
    view.setUint32(at + 12, offset, true);
    ico.set(image.png, offset);
    offset += image.png.length;
  });
  return ico;
}

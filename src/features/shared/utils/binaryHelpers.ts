/**
 * Purpose:
 * Utilities for cloning and transferring indexed pixel buffers without accidental shared references.
 */

/**
 * Returns a detached copy of the pixel buffer suitable for mutation or persistence snapshots.
 */
export function clonePixelBuffer(buffer: Uint8Array): Uint8Array {
  const copy = new Uint8Array(buffer.length);
  copy.set(buffer);
  return copy;
}

/**
 * Ensures `Uint8Array` after IndexedDB hydration (Dexie may return ArrayBuffer-backed views).
 */
export function ensureUint8PixelData(
  data: Uint8Array | ArrayBuffer | undefined,
  byteLength: number
): Uint8Array {
  if (!data) {
    return new Uint8Array(byteLength);
  }
  if (data instanceof Uint8Array) {
    return clonePixelBuffer(data);
  }
  return new Uint8Array(data);
}

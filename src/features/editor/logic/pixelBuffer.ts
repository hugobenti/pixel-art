/**
 * Purpose:
 * Resize indexed pixel buffers while preserving the overlapping region (top-left aligned).
 */

export function resizePixelBuffer(
  oldBuffer: Uint8Array,
  oldW: number,
  oldH: number,
  newW: number,
  newH: number,
  backgroundPaletteIndex: number
): Uint8Array {
  const newBuffer = new Uint8Array(newW * newH);
  newBuffer.fill(backgroundPaletteIndex);

  const minW = Math.min(oldW, newW);
  const minH = Math.min(oldH, newH);

  for (let y = 0; y < minH; y++) {
    for (let x = 0; x < minW; x++) {
      const oldIdx = x + y * oldW;
      const newIdx = x + y * newW;
      newBuffer[newIdx] = oldBuffer[oldIdx];
    }
  }

  return newBuffer;
}

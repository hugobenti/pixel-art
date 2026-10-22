/**
 * Purpose:
 * Unit tests for packing PNG images into a .ico file.
 */

import { describe, expect, it } from "vitest";

import { buildIco } from "@/features/shared/brand/ico";

describe("buildIco", () => {
  it("writes the header, one directory entry per image and the PNG data at the recorded offsets", () => {
    const a = Uint8Array.from([1, 2, 3]);
    const b = Uint8Array.from([4, 5]);
    const ico = buildIco([
      { size: 16, png: a },
      { size: 256, png: b },
    ]);
    const view = new DataView(ico.buffer, ico.byteOffset, ico.byteLength);

    expect([view.getUint16(0, true), view.getUint16(2, true), view.getUint16(4, true)]).toEqual([0, 1, 2]);

    const entry = (i: number) => {
      const at = 6 + i * 16;
      return {
        width: ico[at],
        height: ico[at + 1],
        planes: view.getUint16(at + 4, true),
        bits: view.getUint16(at + 6, true),
        length: view.getUint32(at + 8, true),
        offset: view.getUint32(at + 12, true),
      };
    };
    expect(entry(0)).toEqual({ width: 16, height: 16, planes: 1, bits: 32, length: 3, offset: 38 });
    // 256 px is stored as 0 in the one-byte size fields.
    expect(entry(1)).toEqual({ width: 0, height: 0, planes: 1, bits: 32, length: 2, offset: 41 });
    expect(Array.from(ico.slice(38))).toEqual([1, 2, 3, 4, 5]);
  });
});

import { describe, expect, test } from "vitest";

import { isThumbnailCurrent } from "./thumbnailFreshness";

/** A data URL holding only a PNG signature and IHDR chunk, which is all the check reads. */
function pngHeader(width: number, height: number): string {
  const bytes = Buffer.alloc(33);
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).copy(bytes, 0);
  bytes.writeUInt32BE(13, 8);
  bytes.write("IHDR", 12, "ascii");
  bytes.writeUInt32BE(width, 16);
  bytes.writeUInt32BE(height, 20);
  return `data:image/png;base64,${bytes.toString("base64")}`;
}

describe("isThumbnailCurrent", () => {
  test("accepts a PNG rendered at the artwork's integer thumbnail scale", () => {
    expect(isThumbnailCurrent(pngHeader(256, 256), 16, 16)).toBe(true);
    expect(isThumbnailCurrent(pngHeader(256, 128), 64, 32)).toBe(true);
  });

  test("rejects legacy thumbnails drawn at a fractional scale (they show seams between pixels)", () => {
    expect(isThumbnailCurrent(pngHeader(150, 150), 16, 16)).toBe(false);
    expect(isThumbnailCurrent("data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=", 16, 16)).toBe(false);
  });

  test("rejects a missing or unreadable thumbnail", () => {
    expect(isThumbnailCurrent("", 16, 16)).toBe(false);
    expect(isThumbnailCurrent("data:image/png;base64,!!", 16, 16)).toBe(false);
  });
});

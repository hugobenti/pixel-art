/**
 * Purpose:
 * Unit tests for detaching a loaded artwork from its stored buffers before editing.
 */

import { describe, expect, it } from "vitest";

import type { Artwork } from "@/features/shared/artwork/artwork.types";

import { cloneArtworkForEditing } from "@/features/editor/logic/cloneArtworkForEditing";

describe("cloneArtworkForEditing", () => {
  it("copies palette and layer pixel buffers without sharing references", () => {
    const source = {
      id: "a",
      palette: ["#000000", "#ffffff"],
      layers: [{ id: "l1", pixelData: new Uint8Array([1, 2, 3]) }],
    } as unknown as Artwork;

    const clone = cloneArtworkForEditing(source);

    expect(clone).toEqual(source);
    expect(clone).not.toBe(source);
    expect(clone.palette).not.toBe(source.palette);
    expect(clone.layers).not.toBe(source.layers);
    expect(clone.layers[0]).not.toBe(source.layers[0]);
    expect(clone.layers[0].pixelData).not.toBe(source.layers[0].pixelData);
  });
});

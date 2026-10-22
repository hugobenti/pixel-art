/**
 * Purpose:
 * Unit tests for the detached artwork copy the editor mutates.
 */

import { describe, expect, it } from "vitest";

import type { IArtwork } from "@/features/shared/artwork/artwork.type";
import { toEditableArtwork } from "./editableArtwork";

function storedArtwork(): IArtwork {
  return {
    id: "a1",
    title: "Stored",
    width: 2,
    height: 1,
    createdAt: 1,
    updatedAt: 2,
    thumbnail: "",
    palette: ["#000000", "#FFFFFF"],
    layers: [
      { id: "l1", name: "Layer 1", visible: true, pixelData: new Uint8Array([0, 1]) },
      { id: "l2", name: "Layer 2", visible: false, pixelData: new Uint8Array([1, 0]) },
    ],
    activeLayerId: "l1",
  };
}

describe("toEditableArtwork", () => {
  it("keeps every field and value of the stored artwork", () => {
    const stored = storedArtwork();
    expect(toEditableArtwork(stored)).toEqual(stored);
  });

  it("copies the palette and every layer's pixel buffer", () => {
    const stored = storedArtwork();
    const editable = toEditableArtwork(stored);

    expect(editable.palette).not.toBe(stored.palette);
    editable.layers.forEach((layer, index) => {
      expect(layer).not.toBe(stored.layers[index]);
      expect(layer.pixelData).not.toBe(stored.layers[index].pixelData);
    });
  });

  it("leaves the stored artwork untouched when the copy is edited", () => {
    const stored = storedArtwork();
    const editable = toEditableArtwork(stored);

    editable.palette[0] = "#FF0000";
    editable.layers[0].pixelData[0] = 1;

    expect(stored.palette[0]).toBe("#000000");
    expect(stored.layers[0].pixelData[0]).toBe(0);
  });
});

/**
 * Purpose:
 * Unit tests for loading the editor's artwork: ready, missing and failed reads.
 */

import { describe, expect, it } from "vitest";

import type { IArtwork } from "@/features/shared/artwork/artwork.type";
import { loadEditorArtwork } from "./editorLoad";

const stored = {
  id: "a",
  title: "Sprite",
  width: 1,
  height: 1,
  palette: ["#000000"],
  layers: [{ id: "l", name: "Layer 1", visible: true, pixelData: new Uint8Array([1]) }],
} as unknown as IArtwork;

describe("loadEditorArtwork", () => {
  it("returns a detached editable copy when the artwork exists", async () => {
    const result = await loadEditorArtwork("a", async () => stored);
    expect(result.status).toBe("ready");
    if (result.status === "ready") {
      expect(result.artwork).toEqual(stored);
      expect(result.artwork.layers[0].pixelData).not.toBe(stored.layers[0].pixelData);
    }
  });

  it("reports not found when the read resolves empty", async () => {
    expect(await loadEditorArtwork("x", async () => undefined)).toEqual({ status: "notFound" });
  });

  it("reports failure instead of hanging when the read rejects", async () => {
    const result = await loadEditorArtwork("a", async () => {
      throw new Error("blocked");
    });
    expect(result).toEqual({ status: "failed" });
  });
});

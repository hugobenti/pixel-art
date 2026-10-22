import { describe, expect, test } from "vitest";

import { removeLayer } from "./layerRemoval";

function layer(id: string) {
  return { id, name: id, visible: true, pixelData: new Uint8Array(1) };
}

const LAYERS = [layer("top"), layer("middle"), layer("bottom")];

describe("removeLayer", () => {
  test("drops the layer and keeps the active layer when another one is deleted", () => {
    const result = removeLayer(LAYERS, "top", "middle");

    expect(result?.layers.map((l) => l.id)).toEqual(["top", "bottom"]);
    expect(result?.activeLayerId).toBe("top");
  });

  test("activates the layer that takes the deleted active layer's place", () => {
    expect(removeLayer(LAYERS, "middle", "middle")?.activeLayerId).toBe("bottom");
  });

  test("activates the layer above when the deleted active layer was the last row", () => {
    expect(removeLayer(LAYERS, "bottom", "bottom")?.activeLayerId).toBe("middle");
  });

  test("refuses to delete the only layer or an unknown id", () => {
    expect(removeLayer([layer("only")], "only", "only")).toBeNull();
    expect(removeLayer(LAYERS, "top", "missing")).toBeNull();
  });
});

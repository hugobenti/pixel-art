/**
 * Purpose:
 * Tests for the color picker's pure rules: what the pointer targets, the loupe's cells and placement,
 * which slot a button picks into, and when a press starts a pick hold.
 */

import { describe, expect, it } from "vitest";

import {
  loupeCells,
  loupePlacement,
  pickSlotForButton,
  pickTargetAt,
  shouldStartPickHold,
} from "@/features/editor/logic/colorPicker";
import type { IViewportState } from "@/features/editor/types/editor.type";
import type { IArtwork } from "@/features/shared/artwork/artwork.type";
import { TRANSPARENT_PIXEL_INDEX } from "@/features/shared/artwork/artworkService";

const T = TRANSPARENT_PIXEL_INDEX;
const VIEWPORT: IViewportState = { scale: 10, viewOffset: { x: 0, y: 0 } };

/** 4 × 4; top layer is transparent at (0,0) and red at (1,0); bottom layer is all white. */
function artwork(bottomVisible = true): Pick<IArtwork, "width" | "height" | "layers" | "palette"> {
  const top = new Array(16).fill(T);
  top[1] = 2;
  return {
    width: 4,
    height: 4,
    palette: ["#000000", "#FFFFFF", "#FF0000"],
    layers: [
      { id: "top", name: "top", visible: true, pixelData: new Uint8Array(top) },
      { id: "bottom", name: "bottom", visible: bottomVisible, pixelData: new Uint8Array(16).fill(1) },
    ],
  };
}

describe("pickTargetAt", () => {
  it("is off the canvas when there is no canvas point", () => {
    expect(pickTargetAt(artwork(), VIEWPORT, null)).toEqual({ kind: "offCanvas" });
  });

  it("picks the topmost visible color under the pointer", () => {
    expect(pickTargetAt(artwork(), VIEWPORT, { x: 15, y: 5 })).toEqual({
      kind: "color",
      x: 1,
      y: 0,
      paletteIndex: 2,
    });
  });

  it("sees through a transparent top layer to the color below", () => {
    expect(pickTargetAt(artwork(), VIEWPORT, { x: 5, y: 5 })).toEqual({
      kind: "color",
      x: 0,
      y: 0,
      paletteIndex: 1,
    });
  });

  it("is an empty spot inside the artwork when every visible layer is transparent", () => {
    expect(pickTargetAt(artwork(false), VIEWPORT, { x: 5, y: 5 })).toEqual({
      kind: "empty",
      x: 0,
      y: 0,
      inArtwork: true,
    });
  });

  it("is an empty spot outside the artwork bounds", () => {
    expect(pickTargetAt(artwork(), VIEWPORT, { x: 45, y: 5 })).toEqual({
      kind: "empty",
      x: 4,
      y: 0,
      inArtwork: false,
    });
  });
});

describe("loupeCells", () => {
  it("returns the 5 × 5 block around the target, row by row, empty cells as null", () => {
    const cells = loupeCells(artwork(), 0, 0);
    expect(cells).toHaveLength(25);
    expect(cells[0]).toBeNull();
    expect(cells[12]).toBe("#FFFFFF");
    expect(cells[13]).toBe("#FF0000");
  });

  it("shows transparent-everywhere pixels as empty", () => {
    expect(loupeCells(artwork(false), 0, 0)[12]).toBeNull();
  });
});

describe("pickSlotForButton", () => {
  it("picks into the active slot with the main button", () => {
    expect(pickSlotForButton(0, "primary")).toBe("primary");
    expect(pickSlotForButton(0, "secondary")).toBe("secondary");
  });

  it("picks into the other slot with the right button", () => {
    expect(pickSlotForButton(2, "primary")).toBe("secondary");
    expect(pickSlotForButton(2, "secondary")).toBe("primary");
  });
});

describe("shouldStartPickHold", () => {
  const base = {
    armed: false,
    altKey: false,
    button: 0,
    pointerType: "mouse",
    touchCount: 0,
    panDeferred: false,
  };

  it("starts when the picker is armed", () => {
    expect(shouldStartPickHold({ ...base, armed: true })).toBe(true);
    expect(shouldStartPickHold({ ...base, armed: true, button: 2 })).toBe(true);
  });

  it("starts a quick pick with Alt held when not armed", () => {
    expect(shouldStartPickHold({ ...base, altKey: true })).toBe(true);
  });

  it("does not start without the picker or Alt", () => {
    expect(shouldStartPickHold(base)).toBe(false);
  });

  it("lets pan win over the main button", () => {
    expect(shouldStartPickHold({ ...base, armed: true, panDeferred: true })).toBe(false);
    expect(shouldStartPickHold({ ...base, altKey: true, panDeferred: true })).toBe(false);
  });

  it("ignores the middle button", () => {
    expect(shouldStartPickHold({ ...base, armed: true, button: 1 })).toBe(false);
  });

  it("needs exactly one touch", () => {
    expect(shouldStartPickHold({ ...base, armed: true, pointerType: "touch", touchCount: 1 })).toBe(true);
    expect(shouldStartPickHold({ ...base, armed: true, pointerType: "touch", touchCount: 2 })).toBe(false);
  });
});

describe("loupePlacement", () => {
  const base = { size: 114, gap: 16, viewportWidth: 1440, viewportHeight: 900 };

  it("sits above and to the right of the pointer", () => {
    expect(loupePlacement({ ...base, pointerX: 500, pointerY: 500 })).toEqual({ left: 516, top: 370 });
  });

  it("flips to the left near the right edge", () => {
    expect(loupePlacement({ ...base, pointerX: 1400, pointerY: 500 }).left).toBe(1270);
  });

  it("flips below near the top edge", () => {
    expect(loupePlacement({ ...base, pointerX: 500, pointerY: 50 }).top).toBe(66);
  });
});

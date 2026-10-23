/**
 * Purpose:
 * Tests for switching between the editor's tools: pan, bucket and the color picker are exclusive, and
 * the picker hands back the paint tool it was armed from.
 */

import { describe, expect, it } from "vitest";

import { applyToolAction } from "@/features/editor/logic/editorTools";
import type { IEditorToolState } from "@/features/editor/logic/editorTools.type";

const BRUSH: IEditorToolState = {
  panMode: false,
  bucketMode: false,
  pickerArmed: false,
  pickerReturnsToBucket: false,
};

describe("applyToolAction", () => {
  it("arms the picker from the brush", () => {
    expect(applyToolAction(BRUSH, "togglePicker")).toEqual({
      panMode: false,
      bucketMode: false,
      pickerArmed: true,
      pickerReturnsToBucket: false,
    });
  });

  it("turns bucket off while the picker is armed and back on when it is disarmed", () => {
    const armed = applyToolAction({ ...BRUSH, bucketMode: true }, "togglePicker");
    expect(armed).toMatchObject({ pickerArmed: true, bucketMode: false, pickerReturnsToBucket: true });
    expect(applyToolAction(armed, "togglePicker")).toMatchObject({ pickerArmed: false, bucketMode: true });
  });

  it("returns to the bucket after a pick when armed from bucket", () => {
    const armed = applyToolAction({ ...BRUSH, bucketMode: true }, "togglePicker");
    expect(applyToolAction(armed, "pickApplied")).toMatchObject({ pickerArmed: false, bucketMode: true });
  });

  it("returns to the brush, not pan, when armed from pan", () => {
    const armed = applyToolAction({ ...BRUSH, panMode: true }, "togglePicker");
    expect(armed).toMatchObject({ pickerArmed: true, panMode: false });
    expect(applyToolAction(armed, "pickApplied")).toEqual(BRUSH);
  });

  it("leaves the tools alone after a quick pick (picker not armed)", () => {
    const bucket = { ...BRUSH, bucketMode: true };
    expect(applyToolAction(bucket, "pickApplied")).toEqual(bucket);
  });

  it("disarms the picker without restoring when pan or bucket is chosen", () => {
    const armedFromBucket = applyToolAction({ ...BRUSH, bucketMode: true }, "togglePicker");
    expect(applyToolAction(armedFromBucket, "togglePan")).toEqual({ ...BRUSH, panMode: true });
    expect(applyToolAction(applyToolAction(BRUSH, "togglePicker"), "toggleBucket")).toEqual({
      ...BRUSH,
      bucketMode: true,
    });
  });

  it("keeps pan and bucket exclusive", () => {
    expect(applyToolAction({ ...BRUSH, bucketMode: true }, "togglePan")).toEqual({ ...BRUSH, panMode: true });
    expect(applyToolAction({ ...BRUSH, panMode: true }, "toggleBucket")).toEqual({ ...BRUSH, bucketMode: true });
    expect(applyToolAction({ ...BRUSH, panMode: true }, "togglePan")).toEqual(BRUSH);
  });
});

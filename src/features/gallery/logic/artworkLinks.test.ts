/**
 * Purpose:
 * Unit tests for gallery artwork link helpers.
 */

import { describe, expect, it } from "vitest";

import { EMPTY_THUMBNAIL_SRC, getEditorHref } from "@/features/gallery/logic/artworkLinks";

describe("getEditorHref", () => {
  it("builds the editor route for an artwork id", () => {
    expect(getEditorHref("abc-123")).toBe("/editor/abc-123");
  });
});

describe("EMPTY_THUMBNAIL_SRC", () => {
  it("is the transparent 1×1 GIF data URL", () => {
    expect(EMPTY_THUMBNAIL_SRC).toBe(
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",
    );
  });
});

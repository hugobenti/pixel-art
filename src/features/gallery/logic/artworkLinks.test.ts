import { describe, expect, it } from "vitest";

import { BLANK_THUMBNAIL, artworkThumbnail, editorPath } from "./artworkLinks";

describe("editorPath", () => {
  it("points to the editor route for the artwork id", () => {
    expect(editorPath("abc-123")).toBe("/editor/abc-123");
  });
});

describe("artworkThumbnail", () => {
  it("serves a stored data URL as is, without the image optimizer", () => {
    expect(artworkThumbnail("data:image/png;base64,AAAA")).toEqual({
      src: "data:image/png;base64,AAAA",
      unoptimized: true,
    });
  });

  it("lets the image optimizer handle a regular URL", () => {
    expect(artworkThumbnail("/thumbs/a.png")).toEqual({
      src: "/thumbs/a.png",
      unoptimized: false,
    });
  });

  it("falls back to a transparent 1×1 GIF when there is no thumbnail yet", () => {
    expect(artworkThumbnail("")).toEqual({ src: BLANK_THUMBNAIL, unoptimized: true });
    expect(BLANK_THUMBNAIL).toBe(
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",
    );
  });
});

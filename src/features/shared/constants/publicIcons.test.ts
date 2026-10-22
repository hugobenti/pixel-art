import { readdirSync, readFileSync } from "node:fs";

import { describe, expect, test } from "vitest";

import { PUBLIC_ICONS } from "./publicIcons";

const iconsDir = new URL("../../../../public/icons/", import.meta.url);
const files = readdirSync(iconsDir).filter((name) => name.endsWith(".svg"));
const sources = Object.values(PUBLIC_ICONS);

describe("public icons", () => {
  test("every PUBLIC_ICONS entry points at a file and every file is registered", () => {
    expect(sources.map((src) => src.replace("/icons/", "")).sort()).toEqual([...files].sort());
  });

  test("one glyph per meaning: no two keys share a file", () => {
    expect(new Set(sources).size).toBe(sources.length);
  });

  test.each(files)("%s is a 24-grid, 1.5-stroke currentColor outline", (name) => {
    const svg = readFileSync(new URL(name, iconsDir), "utf8");
    const root = svg.match(/<svg\b[^>]*>/)?.[0] ?? "";

    expect(root).toContain('viewBox="0 0 24 24"');
    expect(root).toContain('fill="none"');
    expect(root).toContain('stroke="currentColor"');
    expect(root).toContain('stroke-width="1.5"');
    expect(svg).not.toMatch(/#[0-9a-f]{3,8}\b/i);
    expect(svg).not.toMatch(/\bfill="(?!none")/);
    expect(svg).not.toMatch(/stroke-width="(?!1\.5")/);
    expect(svg).not.toMatch(/style=/);
  });
});

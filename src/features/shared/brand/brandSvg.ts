/**
 * Purpose:
 * Standalone SVG markup for a logo lockup, for files outside the app (README banner, docs).
 *
 * Notes:
 * One `<rect>` per color run on a 1-unit grid, sized at a whole-number `scale`, with crisp edges.
 */

import type { IBrandLockup } from "./brandPixels.type";

export function brandSvg(
  drawing: IBrandLockup,
  colors: Readonly<Record<string, string>>,
  scale: number,
  label: string,
): string {
  const rects = drawing.runs
    .map((run) => `  <rect x="${run.x}" y="${run.y}" width="${run.length}" height="1" fill="${colors[run.key]}"/>`)
    .join("\n");
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${drawing.width * scale}" height="${drawing.height * scale}" viewBox="0 0 ${drawing.width} ${drawing.height}" shape-rendering="crispEdges" role="img" aria-label="${label}">`,
    rects,
    "</svg>",
    "",
  ].join("\n");
}

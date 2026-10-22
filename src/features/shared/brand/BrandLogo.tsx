/**
 * Purpose:
 * The PixelHB horizontal logo (stamped pencil + pixel wordmark) as an inline SVG named "PixelHB".
 *
 * Notes:
 * Pencil colors are fixed; the wordmark and the drawn pixel use theme tokens, so the logo follows the
 * light and dark themes without re-rendering.
 */

import { site } from "@/content/site";
import { cx } from "@/features/shared/utils/cx";
import { brandLogo } from "./BrandLogo.style";
import type { IBrandLogoProps } from "./BrandLogo.type";
import { HORIZONTAL_LOGO } from "./logoDrawing";

export function BrandLogo({ className }: IBrandLogoProps) {
  return (
    <svg
      viewBox={HORIZONTAL_LOGO.viewBox}
      role="img"
      aria-label={site.name}
      shapeRendering="crispEdges"
      className={cx(brandLogo.svg, className)}
    >
      {HORIZONTAL_LOGO.rects.map((rect) => (
        <rect key={rect.id} x={rect.x} y={rect.y} width={rect.width} height={1} fill={rect.fill} />
      ))}
    </svg>
  );
}

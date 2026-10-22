/**
 * Purpose:
 * Renders a /public SVG using CSS mask so the glyph follows the current text color (inherit/cascade).
 *
 * Notes:
 * SVG files should use opaque strokes/fills (e.g. black) so masking picks up shape reliably.
 * Without a className the icon is 20px square; a className replaces that size.
 */
"use client";

import { cx } from "@/features/shared/utils/cx";
import { publicMaskIcon } from "./PublicMaskIcon.style";
import type { IPublicMaskIconProps } from "./PublicMaskIcon.type";
import { usePublicMaskIcon } from "./usePublicMaskIcon";

export function PublicMaskIcon({ src, className }: IPublicMaskIconProps) {
  const maskStyle = usePublicMaskIcon(src);
  return (
    <span
      aria-hidden
      className={cx(publicMaskIcon.base, className ?? publicMaskIcon.defaultSize)}
      style={maskStyle}
    />
  );
}

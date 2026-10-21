/**
 * Purpose:
 * Renders a /public SVG using CSS mask so the glyph follows the current text color (inherit/cascade).
 *
 * Notes:
 * SVG files should use opaque strokes/fills (e.g. black) so masking picks up shape reliably.
 */
"use client";

import { publicMaskIcon } from "@/features/shared/components/PublicMaskIcon.style";
import { usePublicMaskIcon } from "@/features/shared/components/usePublicMaskIcon";
import { cx } from "@/features/shared/utils/cx";

interface PublicMaskIconProps {
  src: string;
  /** Replaces the default `h-5 w-5` size when given. */
  className?: string;
}

export function PublicMaskIcon({ src, className }: PublicMaskIconProps) {
  const maskStyle = usePublicMaskIcon(src);
  return (
    <span
      aria-hidden
      className={cx(publicMaskIcon.base, className ?? publicMaskIcon.defaultSize)}
      style={maskStyle}
    />
  );
}

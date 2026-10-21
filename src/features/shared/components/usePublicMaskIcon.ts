/**
 * Purpose:
 * Inline mask style for PublicMaskIcon (standard and WebKit-prefixed) from a /public SVG path.
 */

import type { CSSProperties } from "react";

export function usePublicMaskIcon(src: string): CSSProperties {
  const maskUrl = `url("${src}")`;
  return {
    maskImage: maskUrl,
    WebkitMaskImage: maskUrl,
  };
}

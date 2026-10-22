/**
 * Purpose:
 * Mask style for PublicMaskIcon: points the CSS mask (standard and WebKit) at the /public SVG.
 */
"use client";

import { useMemo } from "react";

export function usePublicMaskIcon(src: string) {
  return useMemo(() => {
    const maskUrl = `url("${src}")`;
    return { maskImage: maskUrl, WebkitMaskImage: maskUrl };
  }, [src]);
}

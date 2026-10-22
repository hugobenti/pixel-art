/**
 * Purpose:
 * Renders a brand image layout to a PNG response with `next/og`, for the icon, Apple icon, favicon
 * and social image routes.
 */

import { ImageResponse } from "next/og";
import { createElement } from "react";

import { BrandImage } from "./BrandImage";
import type { IBrandImageProps, TBrandImageOptions } from "./BrandImage.type";

export function renderBrandImage(image: IBrandImageProps, options?: TBrandImageOptions): ImageResponse {
  return new ImageResponse(createElement(BrandImage, image), {
    ...options,
    width: image.width,
    height: image.height,
  });
}

/**
 * Purpose:
 * The drawing each BrandLogo variant renders.
 */

import type { TBrandLogoDrawings } from "./BrandLogo.type";
import { BANNER_LOGO, HORIZONTAL_LOGO, PENCIL_LOGO } from "./logoDrawing";

export const BRAND_LOGO_DRAWINGS: TBrandLogoDrawings = {
  horizontal: HORIZONTAL_LOGO,
  banner: BANNER_LOGO,
  pencil: PENCIL_LOGO,
};

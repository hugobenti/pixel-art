import type { brandLogo } from "./BrandLogo.style";

export interface IBrandLogoRect {
  id: string;
  x: number;
  y: number;
  width: number;
  fill: string;
}

export interface IBrandLogoDrawing {
  viewBox: string;
  rects: IBrandLogoRect[];
}

export type TBrandLogoVariant = keyof typeof brandLogo.variant;

export type TBrandLogoDrawings = Readonly<Record<TBrandLogoVariant, IBrandLogoDrawing>>;

export interface IBrandLogoProps {
  variant?: TBrandLogoVariant;
  decorative?: boolean;
  className?: string;
}

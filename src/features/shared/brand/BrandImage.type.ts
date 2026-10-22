import type { ImageResponse } from "next/og";

/** A solid rectangle of a generated image, in px. */
export interface IBrandImageBlock {
  left: number;
  top: number;
  width: number;
  height: number;
  color: string;
}

export interface IBrandImageCaption {
  text: string;
  top: number;
  fontSize: number;
  color: string;
  fontFamily: string;
}

export interface IBrandImageProps {
  width: number;
  height: number;
  /** Fill behind the blocks (a color or "transparent"). */
  background: string;
  blocks: IBrandImageBlock[];
  /** One centered line of text. */
  caption?: IBrandImageCaption;
}

export interface IOgImageColors {
  paper: string;
  gridLine: string;
  captionColor: string;
  caption: string;
  fontFamily: string;
}

/** Extra `next/og` options (e.g. fonts); width and height come from the image. */
export type TBrandImageOptions = Omit<NonNullable<ConstructorParameters<typeof ImageResponse>[1]>, "width" | "height">;

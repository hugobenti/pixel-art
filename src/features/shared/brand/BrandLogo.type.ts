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

export interface IBrandLogoProps {
  className?: string;
}

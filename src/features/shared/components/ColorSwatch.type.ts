export type TColorSwatchDensity = "comfortable" | "compact";

export interface IColorSwatchRowProps {
  density: "comfortable";
  color: string;
  index: number;
  isPrimary: boolean;
  isSecondary: boolean;
  isFocused: boolean;
  onClick: () => void;
}

export interface IColorSwatchGridProps {
  density: "compact";
  color: string;
  index: number;
  selected: boolean;
  onClick: () => void;
}

export type TColorSwatchProps = IColorSwatchRowProps | IColorSwatchGridProps;

export interface IColorSelectionRowProps {
  palette: string[];
  primaryIndex: number;
  secondaryIndex: number;
  focusedSwatchIndex: number;
  onSwatchPick: (index: number) => void;
  onOpenPaletteModal: () => void;
}

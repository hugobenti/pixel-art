export interface IPaletteEditModalProps {
  open: boolean;
  onClose: () => void;
  palette: string[];
  focusedSwatchIndex: number;
  onSelectSwatch: (index: number) => void;
  onApplyHex: (index: number, hex: string) => void;
  onAddColor: (hex: string) => void;
  onRemoveSwatch: (index: number) => void;
  canRemoveSwatch: boolean;
  maxPaletteReached: boolean;
}

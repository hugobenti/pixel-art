export interface IPaletteEditModalProps {
  open: boolean;
  onClose: () => void;
  palette: string[];
  focusedSwatchIndex: number;
  onSelectSwatch: (index: number) => void;
  onApplyHex: (index: number, hex: string) => void;
  onAddColor: (hex: string) => void;
  /** `replacementIndex`: palette entry the color's pixels take, or null for transparent. */
  onRemoveSwatch: (index: number, replacementIndex: number | null) => void;
  /** Pixels (all layers) using a palette entry; removing a used color asks for a replacement first. */
  getColorUsage: (index: number) => number;
  canRemoveSwatch: boolean;
  maxPaletteReached: boolean;
}

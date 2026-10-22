import type { IPaletteReplacementChoice } from "./usePaletteRemoval.type";

export interface IPaletteReplacementPickerProps {
  choices: IPaletteReplacementChoice[];
  /** Picked palette index, or null for transparent. */
  replacementIndex: number | null;
  onChoose: (replacementIndex: number | null) => void;
}

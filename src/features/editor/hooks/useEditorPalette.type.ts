import type { Dispatch, SetStateAction } from "react";
import type { IHistoryCommand } from "@/features/editor/types/editor.type";
import type { IArtwork } from "@/features/shared/artwork/artwork.type";

export interface IUseEditorPaletteParams {
  artwork: IArtwork;
  setArtwork: Dispatch<SetStateAction<IArtwork>>;
  onPaletteOrPixelsDirty: () => void;
  pushCommand: (cmd: IHistoryCommand) => void;
  /** Undoes `cmd` only while it is still the latest history entry. */
  undoCommand: (cmd: IHistoryCommand) => void;
}

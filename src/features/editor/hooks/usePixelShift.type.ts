import type { IHistoryCommand } from "@/features/editor/types/editor.type";

export interface IUsePixelShiftParams {
  pixelData: Uint8Array | null;
  layerId: string | null;
  width: number;
  height: number;
  pushCommand: (cmd: IHistoryCommand) => void;
  schedulePaintBump: () => void;
}

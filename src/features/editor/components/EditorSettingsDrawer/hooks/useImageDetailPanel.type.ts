import type { IArtwork } from "@/features/shared/artwork/artwork.type";
import type { IViewportState } from "@/features/editor/types/editor.type";

export interface IImageDetailRow {
  paletteIndex: number;
  count: number;
  color: string;
}

export interface IUseImageDetailPanelParams {
  artwork: IArtwork;
  viewport: IViewportState;
  viewportCssWidth: number;
  viewportCssHeight: number;
  paintRevision: number;
}

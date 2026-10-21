import type { IArtwork } from "@/features/shared/artwork/artwork.type";
import type { IViewportState } from "@/features/editor/types/editor.type";

export interface IEditorSettingsImageDetailPanelProps {
  artwork: IArtwork;
  viewport: IViewportState;
  viewportCssWidth: number;
  viewportCssHeight: number;
  paintRevision: number;
}

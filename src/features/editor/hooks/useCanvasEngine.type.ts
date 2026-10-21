import type { IArtwork } from "@/features/shared/artwork/artwork.type";
import type { IViewportState } from "@/features/editor/types/editor.type";

export interface IUseCanvasEngineParams {
  artwork: IArtwork | null;
  viewport: IViewportState;
  showPixelGrid: boolean;
  showReferenceImage: boolean;
  referenceImage: HTMLImageElement | null;
  referenceImageAlpha: number;
  /** Bumps when pixel buffer or history mutates without artwork reference changes. */
  paintRevision: number;
  historyRevision: number;
}

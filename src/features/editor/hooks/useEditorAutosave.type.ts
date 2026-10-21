import type { RefObject } from "react";
import type { IArtwork } from "@/features/shared/artwork/artwork.type";

export interface IUseEditorAutosaveParams {
  artworkRef: RefObject<IArtwork>;
  artworkId: string;
  paintRevision: number;
  historyRevision: number;
}

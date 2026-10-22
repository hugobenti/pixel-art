import type { CSSProperties } from "react";

import type { IArtwork } from "@/features/shared/artwork/artwork.type";
import type { IPaletteUsageRow } from "@/features/editor/logic/paletteUsageRows.type";
import type { IViewportState } from "@/features/editor/types/editor.type";

export interface IImageDetailRow extends IPaletteUsageRow {
  /** The index has no palette color, so the swatch gets a neutral fill instead of `swatchStyle`. */
  transparent: boolean;
  swatchStyle: CSSProperties | undefined;
  entryLabel: string;
  percentLabel: string;
}

export interface IUseImageDetailPanelParams {
  artwork: IArtwork;
  viewport: IViewportState;
  viewportCssWidth: number;
  viewportCssHeight: number;
  paintRevision: number;
}

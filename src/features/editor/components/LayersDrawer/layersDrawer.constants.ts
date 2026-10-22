/**
 * Purpose:
 * Drawer motion timing, thumbnail size and public asset paths for the layers drawer UI.
 */

import { PUBLIC_ICONS } from "@/features/shared/constants/publicIcons";

export const ANIMATION_MS = 180;

/** Long edge cap when rasterizing a layer into the list thumbnail (pixel-perfect downscale). */
export const LAYER_PREVIEW_MAX_EDGE_PX = 48;

/** Grip / pencil / copy assets for layer rows (rendered through `PublicMaskIcon`). */
export const LAYER_ICON_SRC = {
  grip: PUBLIC_ICONS.grip,
  pencil: PUBLIC_ICONS.pencil,
  copy: PUBLIC_ICONS.copy,
} as const;

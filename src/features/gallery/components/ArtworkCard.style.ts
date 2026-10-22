/**
 * Purpose:
 * Classes for the gallery ArtworkCard: card body, thumbnail link, title row, rename form and actions.
 */

import { focusRing } from "@/features/shared/components/focus.style";
import { cx } from "@/features/shared/utils/cx";

export const artworkCard = {
  body: "flex flex-col gap-3 p-4",
  thumbnailLink: "relative block aspect-square w-full overflow-hidden rounded-lg bg-surface-muted",
  thumbnail: "object-contain [image-rendering:pixelated]",
  renameForm: "flex gap-2",
  titleRow: "flex flex-wrap items-center gap-2",
  titleLink: cx("min-w-0 flex-1 truncate rounded-sm font-medium text-fg", focusRing),
  actions: "flex flex-wrap gap-2",
};

/**
 * Purpose:
 * Classes for the gallery loading skeleton: card-shaped placeholders that pulse.
 */

import { card } from "@/features/shared/components/Card.style";
import { cx } from "@/features/shared/utils/cx";

export const gallerySkeleton = {
  status: "sr-only",
  grid: "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  card: cx(card.base, "animate-pulse overflow-hidden motion-reduce:animate-none"),
  thumbnail: "aspect-square w-full bg-surface-muted",
  body: "flex flex-col gap-2 p-3",
  titleBar: "h-4 w-2/3 rounded bg-surface-muted",
  metaBar: "h-3 w-1/2 rounded bg-surface-muted",
};

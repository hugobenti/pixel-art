/**
 * Purpose:
 * Classes for the EditorActionsBar: toolbar row, back link and title cluster, tool cluster and slot toggle.
 */

import { focusRing } from "@/features/shared/components/focus.style";
import { cx } from "@/features/shared/utils/cx";

export const editorActionsBar = {
  bar: "flex flex-wrap items-center gap-2 border-b border-line py-2",
  leftCluster: "flex min-w-0 flex-1 items-center gap-3",
  actions: "flex flex-wrap items-center justify-end gap-2",
  backLink: cx(
    "shrink-0 rounded-sm text-sm font-medium text-muted underline-offset-4 hover:text-fg hover:underline",
    focusRing,
  ),
  heading: "min-w-0 truncate text-base font-semibold text-fg",
  /** Extends the Button: wide enough for either slot name so the toolbar does not jump. */
  slotToggle: "min-h-10 min-w-[12ch] shrink-0 touch-manipulation px-3",
};

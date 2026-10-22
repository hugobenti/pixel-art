/**
 * Purpose:
 * Classes for ConfirmDialog: content column, heading, description, warning note and button row.
 */

export const confirmDialog = {
  content: "flex flex-col gap-4",
  text: "flex flex-col gap-2",
  heading: "text-base font-semibold text-fg",
  body: "text-sm leading-relaxed text-muted",
  /** The irreversible consequence: danger tint so it can't be skimmed past. */
  warning:
    "rounded-lg border border-danger-line bg-danger-surface px-3 py-2 text-sm leading-snug font-medium text-danger-fg",
  actions: "flex flex-wrap justify-end gap-2",
};

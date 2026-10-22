/**
 * Purpose:
 * Classes for the GalleryScreen route shell: page frame, header with actions, error and loading lines.
 */

export const galleryScreen = {
  shell: "mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-10",
  header:
    "flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-center sm:justify-between",
  heading: "text-2xl font-semibold text-fg",
  intro: "mt-1 text-sm text-muted",
  actions: "flex flex-wrap items-center gap-2",
  importInput: "hidden",
  error: "rounded-lg bg-danger-surface px-4 py-3 text-sm text-danger-fg",
  loading: "text-muted",
};

/**
 * Purpose:
 * IconButton tooltip: the label, with the keyboard shortcut appended when there is one.
 */
"use client";

import { shared } from "@/content/shared";

export function useIconButton(label: string, shortcut: string | undefined) {
  return shortcut ? shared.iconButton.titleWithShortcut(label, shortcut) : label;
}

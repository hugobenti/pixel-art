/**
 * Purpose:
 * Table of contents of the Help page: one anchor per section, then the shortcuts.
 */

import { help } from "@/content/help";

export const SHORTCUTS_ID = "shortcuts";

export const HELP_TOC = [
  ...help.sections.map(({ id, title }) => ({ href: `#${id}`, title })),
  { href: `#${SHORTCUTS_ID}`, title: help.shortcutsTitle },
];

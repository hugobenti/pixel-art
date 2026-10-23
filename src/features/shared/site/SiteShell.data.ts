import { shell } from "@/content/shell";
import type { TSitePrimaryAction } from "./SiteShell.type";

export const DEFAULT_PRIMARY_ACTION: TSitePrimaryAction = {
  kind: "link",
  label: shell.primary.start,
  compactLabel: shell.primary.startCompact,
  href: "/gallery",
};

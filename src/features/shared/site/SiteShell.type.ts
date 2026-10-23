import type { ReactNode } from "react";

export type TSitePrimaryAction =
  | { kind: "link"; label: string; compactLabel: string; href: string }
  | { kind: "button"; label: string; compactLabel: string; onClick: () => void };

export interface ISiteShellProps {
  children: ReactNode;
  /** The page's one accent action; defaults to "Start drawing" linking to the gallery. */
  primaryAction?: TSitePrimaryAction;
}

export interface ISiteHeaderProps {
  primaryAction: TSitePrimaryAction;
}

export interface ISiteLink {
  href: string;
  label: string;
  /** Leaves the site: rendered as a plain anchor. */
  external?: boolean;
}

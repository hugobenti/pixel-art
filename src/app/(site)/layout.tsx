/**
 * Purpose:
 * Layout for the content pages (home, help, about, contact): wraps them in the site shell.
 */
import type { ReactNode } from "react";

import { SiteShell } from "@/features/shared/site/SiteShell";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return <SiteShell>{children}</SiteShell>;
}

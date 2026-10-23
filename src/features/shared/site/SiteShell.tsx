/**
 * Purpose:
 * Frame for every page except the editor: skip link, site header, the `<main id="main">` column and
 * the footer.
 */

import { shell } from "@/content/shell";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import { DEFAULT_PRIMARY_ACTION } from "./SiteShell.data";
import { siteShell } from "./SiteShell.style";
import type { ISiteShellProps } from "./SiteShell.type";

export function SiteShell({ children, primaryAction = DEFAULT_PRIMARY_ACTION }: ISiteShellProps) {
  return (
    <div className={siteShell.frame}>
      <a href="#main" className={siteShell.skipLink}>
        {shell.skipToContent}
      </a>
      <SiteHeader primaryAction={primaryAction} />
      <main id="main" className={siteShell.main}>
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}

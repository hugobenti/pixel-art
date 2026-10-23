/**
 * Purpose:
 * Site footer: pencil mark and tagline, the site links, then credit and copyright.
 */

import Link from "next/link";

import { shell } from "@/content/shell";
import { BrandLogo } from "@/features/shared/brand/BrandLogo";
import { siteFooter } from "./SiteFooter.style";
import { SITE_FOOTER_LINKS } from "./siteNav.data";

export function SiteFooter() {
  return (
    <footer className={siteFooter.bar}>
      <div className={siteFooter.inner}>
        <p className={siteFooter.brand}>
          <BrandLogo variant="pencil" decorative className={siteFooter.pencil} />
          {shell.footer.tagline}
        </p>
        <nav aria-label={shell.footer.linksLabel} className={siteFooter.links}>
          {SITE_FOOTER_LINKS.map((item) =>
            item.external ? (
              <a key={item.href} href={item.href} className={siteFooter.link}>
                {item.label}
              </a>
            ) : (
              <Link key={item.href} href={item.href} className={siteFooter.link}>
                {item.label}
              </Link>
            ),
          )}
        </nav>
        <p className={siteFooter.credit}>
          <span>{shell.footer.credit}</span>
          <span className={siteFooter.copyright}>{shell.footer.copyright}</span>
        </p>
      </div>
    </footer>
  );
}

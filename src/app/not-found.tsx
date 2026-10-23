/**
 * Purpose:
 * Branded 404 for unknown URLs, inside the site shell.
 */
import { statusPages } from "@/content/statusPages";
import { notFoundMetadata } from "@/content/metadata";
import { SiteShell } from "@/features/shared/site/SiteShell";
import { StatusScreen } from "@/features/site/components/StatusScreen";

export const metadata = notFoundMetadata;

export default function NotFound() {
  return (
    <SiteShell>
      <StatusScreen title={statusPages.notFound.title} text={statusPages.notFound.text} />
    </SiteShell>
  );
}

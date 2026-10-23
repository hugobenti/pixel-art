/**
 * Purpose:
 * Branded error boundary for the site, inside the site shell, with a Try again action.
 */
"use client";

import { statusPages } from "@/content/statusPages";
import { SiteShell } from "@/features/shared/site/SiteShell";
import { StatusScreen } from "@/features/site/components/StatusScreen";

export default function ErrorPage({ unstable_retry }: { unstable_retry: () => void }) {
  return (
    <SiteShell>
      <StatusScreen
        title={statusPages.error.title}
        text={statusPages.error.text}
        onRetry={unstable_retry}
      />
    </SiteShell>
  );
}

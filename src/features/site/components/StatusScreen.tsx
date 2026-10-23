/**
 * Purpose:
 * Body of the 404 and error pages: a short heading, one sentence and the way out.
 */
import Link from "next/link";

import { statusPages } from "@/content/statusPages";
import { Button } from "@/features/shared/components/Button";
import { statusScreen } from "./StatusScreen.style";
import type { IStatusScreenProps } from "./StatusScreen.type";

export function StatusScreen({ title, text, onRetry }: IStatusScreenProps) {
  return (
    <div className={statusScreen.page}>
      <h1 className={statusScreen.title}>{title}</h1>
      <p className={statusScreen.text}>{text}</p>
      <div className={statusScreen.actions}>
        <Link href="/gallery" className={statusScreen.primary}>
          {statusPages.gallery}
        </Link>
        {onRetry && (
          <Button variant="outline" onClick={onRetry}>
            {statusPages.error.retry}
          </Button>
        )}
        <Link href="/" className={statusScreen.home}>
          {statusPages.home}
        </Link>
      </div>
    </div>
  );
}

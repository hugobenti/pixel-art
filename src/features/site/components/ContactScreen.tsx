/**
 * Purpose:
 * Feedback & contact page: open a GitHub issue or write an email, plus a tip for bug reports.
 */

import { contact } from "@/content/contact";
import { site } from "@/content/site";
import { Card } from "@/features/shared/components/Card";
import { PublicMaskIcon } from "@/features/shared/components/PublicMaskIcon";
import { PUBLIC_ICONS } from "@/features/shared/constants/publicIcons";
import { CONTACT_MAILTO } from "./ContactScreen.data";
import { contactScreen } from "./ContactScreen.style";

export function ContactScreen() {
  return (
    <div className={contactScreen.page}>
      <header className={contactScreen.header}>
        <h1 className={contactScreen.title}>{contact.h1}</h1>
        <p className={contactScreen.intro}>{contact.intro}</p>
      </header>

      <div className={contactScreen.cards}>
        <Card className={contactScreen.card}>
          <PublicMaskIcon src={PUBLIC_ICONS.chat} className={contactScreen.icon} />
          <h2 className={contactScreen.cardTitle}>{contact.issue.title}</h2>
          <p className={contactScreen.cardText}>{contact.issue.text}</p>
          <a href={site.issuesUrl} className={contactScreen.action}>
            {contact.issue.cta}
          </a>
        </Card>
        <Card className={contactScreen.card}>
          <PublicMaskIcon src={PUBLIC_ICONS.mail} className={contactScreen.icon} />
          <h2 className={contactScreen.cardTitle}>{contact.email.title}</h2>
          <p className={contactScreen.address}>{site.email}</p>
          <a href={CONTACT_MAILTO} className={contactScreen.action}>
            {contact.email.cta}
          </a>
        </Card>
      </div>

      <p className={contactScreen.tip}>{contact.tip}</p>
    </div>
  );
}

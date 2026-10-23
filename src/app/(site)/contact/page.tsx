/**
 * Purpose:
 * Feedback & contact route: report a bug or write to the maker.
 */
import { contactMetadata } from "@/content/metadata";
import { ContactScreen } from "@/features/site/components/ContactScreen";

export const metadata = contactMetadata;

export default function ContactPage() {
  return <ContactScreen />;
}

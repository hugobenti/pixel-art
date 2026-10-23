/**
 * Purpose:
 * Help route: how to draw, save and export, plus the keyboard shortcuts.
 */
import { helpMetadata } from "@/content/metadata";
import { HelpScreen } from "@/features/site/components/HelpScreen";

export const metadata = helpMetadata;

export default function HelpPage() {
  return <HelpScreen />;
}

/**
 * Purpose:
 * About route: what PixelHB is, who makes it and why.
 */
import { aboutMetadata } from "@/content/metadata";
import { AboutScreen } from "@/features/site/components/AboutScreen";

export const metadata = aboutMetadata;

export default function AboutPage() {
  return <AboutScreen />;
}

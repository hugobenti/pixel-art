/**
 * Purpose:
 * Home route: what PixelHB is, and the way into the gallery.
 */
import { homeMetadata } from "@/content/metadata";
import { HomeScreen } from "@/features/site/components/HomeScreen";

export const metadata = homeMetadata;

export default function HomePage() {
  return <HomeScreen />;
}

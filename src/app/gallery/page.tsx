/**
 * Purpose:
 * Gallery route — lists saved artworks and entry points to the editor.
 */
import { galleryMetadata } from "@/content/metadata";
import { GalleryScreen } from "@/features/gallery/components/GalleryScreen";

export const metadata = galleryMetadata;

export default function GalleryPage() {
  return <GalleryScreen />;
}

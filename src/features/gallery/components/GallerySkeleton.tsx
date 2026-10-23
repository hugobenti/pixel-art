/**
 * Purpose:
 * Card-shaped placeholders shown while the gallery loads for the first time.
 */
import { shared } from "@/content/shared";
import { GALLERY_SKELETON_KEYS } from "./GallerySkeleton.data";
import { gallerySkeleton } from "./GallerySkeleton.style";

export function GallerySkeleton() {
  return (
    <>
      <p role="status" className={gallerySkeleton.status}>
        {shared.loading}
      </p>
      <div aria-hidden className={gallerySkeleton.grid}>
        {GALLERY_SKELETON_KEYS.map((key) => (
          <div key={key} className={gallerySkeleton.card}>
            <div className={gallerySkeleton.thumbnail} />
            <div className={gallerySkeleton.body}>
              <div className={gallerySkeleton.titleBar} />
              <div className={gallerySkeleton.metaBar} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

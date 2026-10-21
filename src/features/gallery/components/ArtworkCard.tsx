/**
 * Purpose:
 * Gallery card showing artwork thumbnail and actions (open, rename, clone, delete).
 */
"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/features/shared/components/Button";
import { Card } from "@/features/shared/components/Card";
import { Input } from "@/features/shared/components/Input";
import { artworkCard } from "@/features/gallery/components/ArtworkCard.style";
import { useArtworkCard } from "@/features/gallery/hooks/useArtworkCard";

import type { Artwork } from "@/features/shared/artwork/artwork.types";

interface ArtworkCardProps {
  artwork: Artwork;
  onRename: (id: string, title: string) => Promise<void>;
  onClone: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function ArtworkCard({
  artwork,
  onRename,
  onClone,
  onDelete,
}: ArtworkCardProps) {
  const {
    editorHref,
    thumb,
    thumbUnoptimized,
    renaming,
    title,
    handleTitleChange,
    handleRenameSubmit,
    startRename,
    cancelRename,
    handleDelete,
  } = useArtworkCard({ artwork, onRename, onDelete });

  return (
    <article>
      <Card className={artworkCard.inner}>
        <Link href={editorHref} className={artworkCard.thumbLink}>
          <Image
            src={thumb}
            alt=""
            fill
            className={artworkCard.thumbImage}
            sizes="200px"
            unoptimized={thumbUnoptimized}
          />
        </Link>

        {renaming ? (
          <form onSubmit={handleRenameSubmit} className={artworkCard.renameForm}>
            <Input autoFocus value={title} onChange={handleTitleChange} />
            <Button type="submit" variant="primary">
              Save
            </Button>
            <Button type="button" variant="ghost" onClick={cancelRename}>
              Cancel
            </Button>
          </form>
        ) : (
          <div className={artworkCard.metaRow}>
            <Link href={editorHref} className={artworkCard.titleLink}>
              {artwork.title}
            </Link>
          </div>
        )}

        <div className={artworkCard.actions}>
          <Button variant="ghost" type="button" onClick={startRename}>
            Rename
          </Button>
          <Button variant="ghost" type="button" onClick={() => onClone(artwork.id)}>
            Clone
          </Button>
          <Button variant="danger" type="button" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Card>
    </article>
  );
}

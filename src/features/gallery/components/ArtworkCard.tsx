/**
 * Purpose:
 * Gallery card showing artwork thumbnail and actions (open, rename, clone, delete).
 */
"use client";

import Image from "next/image";
import Link from "next/link";

import { gallery } from "@/content/gallery";
import { shared } from "@/content/shared";
import { Button } from "@/features/shared/components/Button";
import { Card } from "@/features/shared/components/Card";
import { Input } from "@/features/shared/components/Input";
import { artworkCard } from "./ArtworkCard.style";
import type { IArtworkCardProps } from "./ArtworkCard.type";
import { useArtworkCard } from "./useArtworkCard";

export function ArtworkCard(props: IArtworkCardProps) {
  const { artwork, onClone } = props;
  const {
    href,
    thumbnail,
    renaming,
    setRenaming,
    title,
    setTitle,
    cancelRename,
    submitRename,
    confirmDelete,
  } = useArtworkCard(props);

  return (
    <article>
      <Card className={artworkCard.body}>
        <Link href={href} aria-hidden tabIndex={-1} className={artworkCard.thumbnailLink}>
          <Image
            src={thumbnail.src}
            alt=""
            fill
            className={artworkCard.thumbnail}
            sizes="(min-width: 1280px) 270px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            unoptimized={thumbnail.unoptimized}
          />
        </Link>

        {renaming ? (
          <form onSubmit={submitRename} className={artworkCard.renameForm}>
            <Input
              // eslint-disable-next-line jsx-a11y/no-autofocus -- moves focus to the field that replaces the Rename button the user just pressed
              autoFocus
              aria-label={gallery.card.titleLabel}
              value={title}
              onChange={(ev) => setTitle(ev.target.value)}
            />
            <Button type="submit" variant="primary">
              {shared.actions.save}
            </Button>
            <Button type="button" variant="ghost" onClick={cancelRename}>
              {shared.actions.cancel}
            </Button>
          </form>
        ) : (
          <div className={artworkCard.titleRow}>
            <Link href={href} className={artworkCard.titleLink}>
              {artwork.title}
            </Link>
          </div>
        )}

        <div className={artworkCard.actions}>
          <Button variant="ghost" type="button" onClick={() => setRenaming(true)}>
            {shared.actions.rename}
          </Button>
          <Button variant="ghost" type="button" onClick={() => onClone(artwork.id)}>
            {gallery.card.clone}
          </Button>
          <Button variant="danger" type="button" onClick={confirmDelete}>
            {gallery.card.delete}
          </Button>
        </div>
      </Card>
    </article>
  );
}

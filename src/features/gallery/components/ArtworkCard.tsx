/**
 * Purpose:
 * Gallery card showing artwork thumbnail and actions (open, rename, clone, delete).
 */
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { gallery } from "@/content/gallery";
import { shared } from "@/content/shared";
import { Button } from "@/features/shared/components/Button";
import { Card } from "@/features/shared/components/Card";
import { Input } from "@/features/shared/components/Input";
import type { IArtworkCardProps } from "./ArtworkCard.type";

const cardInnerClass = "flex flex-col gap-3 p-4";

const metaRowClass = "flex flex-wrap items-center gap-2";

export function ArtworkCard({
  artwork,
  onRename,
  onClone,
  onDelete,
}: IArtworkCardProps) {
  const [renaming, setRenaming] = useState(false);
  const [title, setTitle] = useState(artwork.title);

  const thumb =
    artwork.thumbnail ||
    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

  const handleRenameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onRename(artwork.id, title);
    setRenaming(false);
  };

  return (
    <article>
      <Card className={cardInnerClass}>
        <Link
          href={`/editor/${artwork.id}`}
          aria-hidden
          tabIndex={-1}
          className="relative block aspect-square w-full overflow-hidden rounded-lg bg-surface-muted"
        >
          <Image
            src={thumb}
            alt=""
            fill
            className="object-cover"
            sizes="200px"
            unoptimized={thumb.startsWith("data:")}
          />
        </Link>

        {renaming ? (
          <form onSubmit={handleRenameSubmit} className="flex gap-2">
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
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setTitle(artwork.title);
                setRenaming(false);
              }}
            >
              {shared.actions.cancel}
            </Button>
          </form>
        ) : (
          <div className={metaRowClass}>
            <Link
              href={`/editor/${artwork.id}`}
              className="min-w-0 flex-1 truncate rounded-sm font-medium text-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {artwork.title}
            </Link>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" type="button" onClick={() => setRenaming(true)}>
            {shared.actions.rename}
          </Button>
          <Button variant="ghost" type="button" onClick={() => onClone(artwork.id)}>
            {gallery.card.clone}
          </Button>
          <Button
            variant="danger"
            type="button"
            onClick={() => {
              if (
                typeof window !== "undefined" &&
                window.confirm(gallery.card.confirmDelete)
              ) {
                void onDelete(artwork.id);
              }
            }}
          >
            {gallery.card.delete}
          </Button>
        </div>
      </Card>
    </article>
  );
}

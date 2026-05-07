/**
 * Purpose:
 * Gallery card showing artwork thumbnail and actions (open, rename, clone, delete).
 */
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/features/shared/components/Button";
import { Input } from "@/features/shared/components/Input";

import type { Artwork } from "@/features/editor/types/editor.types";

const cardClass =
  "flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm";

const metaRowClass = "flex flex-wrap items-center gap-2";

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
    <article className={cardClass}>
      <Link
        href={`/editor/${artwork.id}`}
        className="relative block aspect-square w-full overflow-hidden rounded-lg bg-zinc-100"
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
            autoFocus
            value={title}
            onChange={(ev) => setTitle(ev.target.value)}
          />
          <Button type="submit" variant="primary">
            Save
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setTitle(artwork.title);
              setRenaming(false);
            }}
          >
            Cancel
          </Button>
        </form>
      ) : (
        <div className={metaRowClass}>
          <Link
            href={`/editor/${artwork.id}`}
            className="min-w-0 flex-1 truncate font-medium text-zinc-900"
          >
            {artwork.title}
          </Link>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Button variant="ghost" type="button" onClick={() => setRenaming(true)}>
          Rename
        </Button>
        <Button variant="ghost" type="button" onClick={() => onClone(artwork.id)}>
          Clone
        </Button>
        <Button
          variant="danger"
          type="button"
          onClick={() => {
            if (
              typeof window !== "undefined" &&
              window.confirm("Delete this artwork permanently?")
            ) {
              void onDelete(artwork.id);
            }
          }}
        >
          Delete
        </Button>
      </div>
    </article>
  );
}

import type { IArtwork } from "@/features/shared/artwork/artwork.type";

export type TEditorLoadResult =
  { status: "ready"; artwork: IArtwork } | { status: "notFound" } | { status: "failed" };

export type TReadArtwork = (id: string) => Promise<IArtwork | undefined>;

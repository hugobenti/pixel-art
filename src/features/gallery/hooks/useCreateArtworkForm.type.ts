import type { ICreateArtworkInput } from "@/features/shared/artwork/artworkService.type";

export type TUseCreateArtworkFormOptions = {
  /** Dialog visibility; the ColorField remounts on open, so its validity is reset then. */
  open: boolean;
  onCreate: (input: ICreateArtworkInput) => Promise<string | null>;
};

export type TCreateArtworkFormErrors = {
  width?: string;
  height?: string;
  /** Failure from creating the artwork itself (storage, palette limits). */
  form?: string;
};

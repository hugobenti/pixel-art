import type { ICreateArtworkInput } from "@/features/shared/artwork/artworkService.type";

export type TUseCreateArtworkFormOptions = {
  onCreate: (input: ICreateArtworkInput) => Promise<unknown>;
};

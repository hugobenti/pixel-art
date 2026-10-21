import type { ICreateArtworkInput } from "@/features/shared/artwork/artworkService.type";

export interface ICreateArtworkModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (input: ICreateArtworkInput) => Promise<unknown>;
}

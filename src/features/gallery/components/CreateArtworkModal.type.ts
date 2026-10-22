import type { ICreateArtworkInput } from "@/features/shared/artwork/artworkService.type";

export interface ICreateArtworkModalProps {
  open: boolean;
  onClose: () => void;
  /** Resolves to an error message to show in the dialog, or null on success. */
  onCreate: (input: ICreateArtworkInput) => Promise<string | null>;
}

import type { IArtwork } from "@/features/shared/artwork/artwork.type";

/** The artwork fields a pick reads. */
export type TPickArtwork = Pick<IArtwork, "width" | "height" | "layers" | "palette">;

/** What the color picker's pointer is over: a palette color, an empty spot, or nothing (off the canvas). */
export type TPickTarget =
  | { kind: "color"; x: number; y: number; paletteIndex: number }
  | { kind: "empty"; x: number; y: number; inArtwork: boolean }
  | { kind: "offCanvas" };

export interface IPickHoldStartInput {
  /** The picker tool is on. */
  armed: boolean;
  /** Alt (Option) is held: a quick pick without arming. */
  altKey: boolean;
  /** `PointerEvent.button` of the press. */
  button: number;
  pointerType: string;
  /** Active touch contacts, from useEditorPointerContacts. */
  touchCount: number;
  /** Space is held or pan mode is on: the main button pans instead. */
  panDeferred: boolean;
}

export interface ILoupePlacementInput {
  pointerX: number;
  pointerY: number;
  /** Loupe diameter, ring included. */
  size: number;
  /** Space between the pointer and the loupe. */
  gap: number;
  viewportWidth: number;
  viewportHeight: number;
}

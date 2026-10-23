import type { RefObject } from "react";

import type { TPickArtwork, TPickTarget } from "@/features/editor/logic/colorPicker.type";
import type { TColorSlot } from "@/features/editor/logic/paletteMutations.type";
import type { IViewportState } from "@/features/editor/types/editor.type";

/** A press-and-hold pick in progress. */
export interface IPickHold {
  pointerId: number;
  pointerType: string;
  /** The slot a release over a color fills. */
  slot: TColorSlot;
  clientX: number;
  clientY: number;
  /** Artwork canvas top-left in viewport pixels, measured with the target. */
  canvasLeft: number;
  canvasTop: number;
  target: TPickTarget;
}

export interface IUseColorPickerHoldParams {
  artwork: TPickArtwork;
  viewport: IViewportState;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  /** Shared touch Set from useEditorPointerContacts. */
  touchPointersRef: RefObject<Set<number>>;
  /** True while Space is held or pan mode is on: the main button pans. */
  deferPrimaryPaint: () => boolean;
  /** The picker tool is on. */
  armed: boolean;
  activeSlot: TColorSlot;
  /** A hold ended over a color. */
  onPick: (slot: TColorSlot, paletteIndex: number) => void;
  /** Escape while armed and not holding, unless a panel is open to take it. */
  onDisarm: () => void;
  /** A drawer, modal or the shift pad is open: Escape closes it and leaves the picker on. */
  panelOpen: boolean;
}

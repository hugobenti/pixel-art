import type { CSSProperties } from "react";

import type { TPickArtwork } from "@/features/editor/logic/colorPicker.type";
import type { IPickHold } from "@/features/editor/hooks/useColorPickerHold.type";
import type { IViewportState } from "@/features/editor/types/editor.type";

export interface IColorPickerOverlayProps {
  hold: IPickHold | null;
  artwork: TPickArtwork;
  viewport: IViewportState;
  /** Current colors of the two paint slots: the ring's bottom half shows the one the pick replaces. */
  primaryColor: string;
  secondaryColor: string;
}

export interface ILoupeCell {
  key: number;
  /** Background color; absent for an empty cell, which shows the lens checkerboard. */
  style?: CSSProperties;
}

export interface ILoupeView {
  style: CSSProperties;
  cells: ILoupeCell[];
  /** Ring top half: the color under the pointer, or checkerboard when there is nothing to pick. */
  ringTopStyle?: CSSProperties;
  ringTopEmpty: boolean;
  /** Ring bottom half: the paint slot's current color. */
  ringBottomStyle: CSSProperties;
}

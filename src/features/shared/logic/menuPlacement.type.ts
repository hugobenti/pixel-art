export type TMenuPlacement = "below" | "above";

export interface IMenuPlacementInput {
  /** Trigger's top edge, in viewport pixels. */
  triggerTop: number;
  /** Trigger's bottom edge, in viewport pixels. */
  triggerBottom: number;
  menuHeight: number;
  viewportHeight: number;
  /** Space between trigger and menu, and the margin kept from the viewport edge. */
  gap: number;
}

import type { TShiftDirection } from "@/features/editor/logic/pixelShift.type";

export interface IShiftDirectionOverlayProps {
  open: boolean;
  onClose: () => void;
  onShift: (direction: TShiftDirection) => void;
}

import type { ILayerRenameSession } from "@/features/editor/components/LayersDrawer/hooks/useLayerRenameDialog.type";

export interface ILayerRenameModalProps {
  session: ILayerRenameSession | null;
  onDismiss: () => void;
  onConfirm: (nextName: string) => void;
}

export interface ILayerRenameModalFormProps {
  session: ILayerRenameSession;
  onDismiss: () => void;
  onConfirm: (nextName: string) => void;
}

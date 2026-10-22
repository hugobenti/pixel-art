import type { ReactNode } from "react";

export interface IConfirmOptions {
  /** Names the target, e.g. Delete “Slime”? */
  title: string;
  description: string;
  /** Irreversible consequence, shown as a highlighted note above the buttons. */
  warning?: string;
  confirmLabel: string;
}

export interface IConfirmDialogProps {
  /** The open request, or null while the dialog is closed. */
  options: IConfirmOptions | null;
  onConfirm: () => void;
  onCancel: () => void;
  /** Extra controls between the description and the buttons (e.g. a choice the confirm applies). */
  children?: ReactNode;
}

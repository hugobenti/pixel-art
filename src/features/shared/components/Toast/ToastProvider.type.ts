import type { ReactNode } from "react";
import type { toast } from "./ToastProvider.style";

export type TToastTone = keyof typeof toast.tone;

export interface IToastRecord {
  id: string;
  message: string;
  tone: TToastTone;
}

/** A toast as the stack renders it: the record plus its DOM id. */
export interface IToastItem extends IToastRecord {
  elementId: string;
}

export interface IShowToastInput {
  message: string;
  tone?: TToastTone;
  durationMs?: number;
  /** When true, skips enqueue if an identical message and tone is already visible. */
  skipDuplicateActiveToast?: boolean;
}

export interface IToastContextValue {
  showToast: (input: IShowToastInput | string) => void;
  dismissToast: (id: string) => void;
}

export interface IToastStackProps {
  toasts: IToastItem[];
  onDismiss: (id: string) => void;
}

export interface IToastProviderProps {
  children: ReactNode;
}

import type {
  ReactNode,
} from "react";
export type TToastTone = "neutral" | "success" | "error";

export interface IToastRecord {
  id: string;
  message: string;
  tone: TToastTone;
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
  toasts: IToastRecord[];
  onDismiss: (id: string) => void;
}

export interface IToastProviderProps {
  children: ReactNode;
}

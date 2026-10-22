import type { ReactNode } from "react";

import type { TIconButtonProps } from "@/features/shared/components/IconButton.type";

export interface ISideDrawerProps {
  entered: boolean;
  onBackdropClick: () => void;
  title: string;
  /** Renders before the title (e.g. back control for drill-in navigation). */
  headerLeft?: ReactNode;
  headerRight?: ReactNode;
  belowHeader?: ReactNode;
  footer?: ReactNode;
  motionDurationMs: number;
  children: ReactNode;
  backdropAriaLabel?: string;
}

export type THeaderIconButtonProps = Omit<TIconButtonProps, "icon" | "label"> & {
  "aria-label": string;
};

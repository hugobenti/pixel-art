/**
 * Purpose:
 * Right-edge drawer shell: dimmed backdrop, sliding panel, title row with optional back control, optional footer.
 *
 * Notes:
 * Use SideDrawerBackButton and SideDrawerCloseButton for consistent icon-only header actions.
 */
"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

import { Button } from "@/features/shared/components/Button";
import { PublicMaskIcon } from "@/features/shared/components/PublicMaskIcon";
import { PUBLIC_ICONS } from "@/features/shared/constants/publicIcons";

import {
  drawerBackdropBaseClass,
  drawerBackdropClosedClass,
  drawerBackdropOpenClass,
  drawerHeaderClass,
  drawerPanelBaseClass,
  drawerPanelClosedClass,
  drawerPanelOpenClass,
  drawerShellRootClass,
  drawerTitleClass,
} from "@/features/shared/components/drawer.styles";

const headerIconMaskClass = "h-5 w-5 text-zinc-800";

const headerIconButtonClass = "shrink-0 touch-manipulation";

interface SideDrawerProps {
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

export function SideDrawer({
  entered,
  onBackdropClick,
  title,
  headerLeft,
  headerRight,
  belowHeader,
  footer,
  motionDurationMs,
  children,
  backdropAriaLabel = "Close panel",
}: SideDrawerProps) {
  const motionStyle = {
    transitionDuration: `${motionDurationMs}ms`,
  } as const;

  const backdropClass = `${drawerBackdropBaseClass} ${
    entered ? drawerBackdropOpenClass : drawerBackdropClosedClass
  }`;
  const panelClass = `${drawerPanelBaseClass} ${
    entered ? drawerPanelOpenClass : drawerPanelClosedClass
  }`;

  return (
    <div
      className={`${drawerShellRootClass} pointer-events-auto`}
      aria-hidden={false}
      aria-modal="true"
      role="dialog"
    >
      <button
        type="button"
        className={backdropClass}
        style={motionStyle}
        onClick={onBackdropClick}
        aria-label={backdropAriaLabel}
      />
      <aside className={panelClass} style={motionStyle}>
        <header className={drawerHeaderClass}>
          <div className="flex min-w-0 flex-1 items-center gap-2">
            {headerLeft}
            <h2 className={`${drawerTitleClass} min-w-0 truncate`}>{title}</h2>
          </div>
          {headerRight}
        </header>
        {belowHeader}
        {children}
        {footer}
      </aside>
    </div>
  );
}

type HeaderIconButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "type" | "children"
> & {
  "aria-label": string;
};

/**
 * Ghost icon button for the leading header slot (drill-in back).
 */
export function SideDrawerBackButton({
  className = "",
  ...rest
}: HeaderIconButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={`${headerIconButtonClass} ${className}`.trim()}
      {...rest}
    >
      <PublicMaskIcon src={PUBLIC_ICONS.chevronLeft} className={headerIconMaskClass} />
    </Button>
  );
}

/**
 * Ghost icon button for dismissing the drawer (header trailing slot).
 */
export function SideDrawerCloseButton({
  className = "",
  ...rest
}: HeaderIconButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={`${headerIconButtonClass} ${className}`.trim()}
      {...rest}
    >
      <PublicMaskIcon src={PUBLIC_ICONS.xMark} className={headerIconMaskClass} />
    </Button>
  );
}

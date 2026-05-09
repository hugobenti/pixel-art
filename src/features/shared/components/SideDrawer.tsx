/**
 * Purpose:
 * Right-edge drawer shell: dimmed backdrop, sliding panel, header slot, optional footer.
 */
"use client";

import type { ReactNode } from "react";

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

interface SideDrawerProps {
  entered: boolean;
  onBackdropClick: () => void;
  title: string;
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
          <h2 className={drawerTitleClass}>{title}</h2>
          {headerRight}
        </header>
        {belowHeader}
        {children}
        {footer}
      </aside>
    </div>
  );
}

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
import { sideDrawer } from "@/features/shared/components/SideDrawer.style";
import { useSideDrawer } from "@/features/shared/components/useSideDrawer";
import { PUBLIC_ICONS } from "@/features/shared/constants/publicIcons";
import { cx } from "@/features/shared/utils/cx";

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
  const { motionStyle } = useSideDrawer(motionDurationMs);

  return (
    <div
      className={sideDrawer.root}
      aria-hidden={false}
      aria-modal="true"
      role="dialog"
    >
      <button
        type="button"
        className={cx(
          sideDrawer.backdrop,
          entered ? sideDrawer.backdropOpen : sideDrawer.backdropClosed
        )}
        style={motionStyle}
        onClick={onBackdropClick}
        aria-label={backdropAriaLabel}
      />
      <aside
        className={cx(
          sideDrawer.panel,
          entered ? sideDrawer.panelOpen : sideDrawer.panelClosed
        )}
        style={motionStyle}
      >
        <header className={sideDrawer.header}>
          <div className={sideDrawer.headerStart}>
            {headerLeft}
            <h2 className={sideDrawer.title}>{title}</h2>
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
  className,
  ...rest
}: HeaderIconButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cx(sideDrawer.headerIconButton, className)}
      {...rest}
    >
      <PublicMaskIcon
        src={PUBLIC_ICONS.chevronLeft}
        className={sideDrawer.headerIcon}
      />
    </Button>
  );
}

/**
 * Ghost icon button for dismissing the drawer (header trailing slot).
 */
export function SideDrawerCloseButton({
  className,
  ...rest
}: HeaderIconButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cx(sideDrawer.headerIconButton, className)}
      {...rest}
    >
      <PublicMaskIcon src={PUBLIC_ICONS.xMark} className={sideDrawer.headerIcon} />
    </Button>
  );
}

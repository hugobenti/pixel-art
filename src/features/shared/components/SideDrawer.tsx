/**
 * Purpose:
 * Right-edge drawer shell: dimmed backdrop, sliding panel, title row with optional back control, optional footer.
 *
 * Notes:
 * Use SideDrawerBackButton and SideDrawerCloseButton for consistent icon-only header actions.
 */
"use client";

import { shared } from "@/content/shared";
import { IconButton } from "@/features/shared/components/IconButton";
import { PUBLIC_ICONS } from "@/features/shared/constants/publicIcons";
import { cx } from "@/features/shared/utils/cx";

import { sideDrawer } from "./SideDrawer.style";
import type { ISideDrawerProps, THeaderIconButtonProps } from "./SideDrawer.type";
import { useSideDrawer } from "./useSideDrawer";

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
  backdropAriaLabel = shared.sideDrawer.closeLabel,
}: ISideDrawerProps) {
  const { titleId, rootRef, motionStyle } = useSideDrawer(motionDurationMs);

  return (
    <div
      ref={rootRef}
      className={sideDrawer.root}
      aria-modal="true"
      aria-labelledby={titleId}
      role="dialog"
    >
      <button
        type="button"
        tabIndex={-1}
        className={cx(
          sideDrawer.backdrop,
          entered ? sideDrawer.backdropState.open : sideDrawer.backdropState.closed,
        )}
        style={motionStyle}
        onClick={onBackdropClick}
        aria-label={backdropAriaLabel}
      />
      <aside
        className={cx(
          sideDrawer.panel,
          entered ? sideDrawer.panelState.open : sideDrawer.panelState.closed,
        )}
        style={motionStyle}
      >
        <header className={sideDrawer.header}>
          <div className={sideDrawer.titleRow}>
            {headerLeft}
            <h2 id={titleId} className={sideDrawer.heading}>
              {title}
            </h2>
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

/**
 * Ghost icon button for the leading header slot (drill-in back).
 */
export function SideDrawerBackButton({ "aria-label": label, ...rest }: THeaderIconButtonProps) {
  return <IconButton icon={PUBLIC_ICONS.chevronLeft} label={label} {...rest} />;
}

/**
 * Ghost icon button for dismissing the drawer (header trailing slot).
 */
export function SideDrawerCloseButton({ "aria-label": label, ...rest }: THeaderIconButtonProps) {
  return <IconButton icon={PUBLIC_ICONS.xMark} label={label} {...rest} />;
}

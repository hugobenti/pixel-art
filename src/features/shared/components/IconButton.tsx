/**
 * Purpose:
 * Icon-only button primitive: ghost by default, `pressed` for toggles, an accessible name required,
 * and a tooltip that can carry the keyboard shortcut.
 *
 * Notes:
 * 40px square, 44px on coarse pointers. The icon is 20px and follows the button's text color.
 */
"use client";

import { PublicMaskIcon } from "@/features/shared/components/PublicMaskIcon";
import { cx } from "@/features/shared/utils/cx";
import { iconButton } from "./IconButton.style";
import type { TIconButtonProps } from "./IconButton.type";
import { useIconButton } from "./useIconButton";

export function IconButton({
  icon,
  label,
  shortcut,
  pressed,
  className,
  ...rest
}: TIconButtonProps) {
  const title = useIconButton(label, shortcut);

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      title={title}
      className={cx(iconButton.base, iconButton.pressed, className)}
      {...rest}
    >
      <PublicMaskIcon src={icon} />
    </button>
  );
}

"use client";

import { IconButton } from "@/features/shared/components/IconButton";
import { PUBLIC_ICONS } from "@/features/shared/constants/publicIcons";
import { menu as menuStyle } from "./Menu.style";
import type { IMenuProps } from "./Menu.type";
import { useMenu } from "./useMenu";

export function Menu(props: IMenuProps) {
  const { label, items } = props;
  const {
    open,
    triggerId,
    menuId,
    rootRef,
    menuRef,
    toggle,
    onTriggerKeyDown,
    onMenuKeyDown,
    selectItem,
  } = useMenu(props);

  return (
    <div ref={rootRef} className={menuStyle.root}>
      <IconButton
        id={triggerId}
        icon={PUBLIC_ICONS.moreHorizontal}
        label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={toggle}
        onKeyDown={onTriggerKeyDown}
      />
      {open ? (
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-labelledby={triggerId}
          className={menuStyle.items}
          onKeyDown={onMenuKeyDown}
        >
          {items.map((item, index) => (
            <button
              key={item.key}
              type="button"
              role="menuitem"
              data-menu-index={index}
              disabled={item.disabled}
              className={menuStyle.item}
              onClick={() => selectItem(index)}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

"use client";

import { IconButton } from "@/features/shared/components/IconButton";
import { PUBLIC_ICONS } from "@/features/shared/constants/publicIcons";
import { Modal } from "@/features/shared/components/Modal";
import { cx } from "@/features/shared/utils/cx";
import { menu as menuStyle } from "./Menu.style";
import type { IMenuProps } from "./Menu.type";
import { useMenu } from "./useMenu";

export function Menu(props: IMenuProps) {
  const { label, sheetTitle, items } = props;
  const {
    open,
    sheet,
    triggerPopup,
    triggerControls,
    dropdownClass,
    toneClass,
    close,
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
        aria-haspopup={triggerPopup}
        aria-expanded={open}
        aria-controls={triggerControls}
        onClick={toggle}
        onKeyDown={onTriggerKeyDown}
      />
      {sheet ? (
        <Modal open={open} onClose={close} title={sheetTitle} size="sm">
          <div className={menuStyle.sheetList}>
            {items.map((item, index) => (
              <button
                key={item.key}
                type="button"
                disabled={item.disabled}
                className={cx(menuStyle.sheetItem, toneClass(item))}
                onClick={() => selectItem(index)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </Modal>
      ) : null}
      {!sheet && open ? (
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          tabIndex={-1}
          aria-labelledby={triggerId}
          className={dropdownClass}
          onKeyDown={onMenuKeyDown}
        >
          {items.map((item, index) => (
            <button
              key={item.key}
              type="button"
              role="menuitem"
              data-menu-index={index}
              disabled={item.disabled}
              className={cx(menuStyle.item, toneClass(item))}
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

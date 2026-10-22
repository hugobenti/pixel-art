export interface IMenuItem {
  /** Stable key for the action. */
  key: string;
  label: string;
  onSelect: () => void;
  disabled?: boolean;
}

export interface IMenuProps {
  /** Accessible name of the menu trigger. */
  label: string;
  items: readonly IMenuItem[];
}

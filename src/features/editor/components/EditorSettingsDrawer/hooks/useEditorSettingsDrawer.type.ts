export interface IUseEditorSettingsDrawerParams {
  onClose: () => void;
  /** When true is returned, Escape does not close the drawer (e.g. drill-in navigates back first). */
  interceptEscape?: () => boolean;
}

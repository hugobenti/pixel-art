export interface IEditorSettingsCanvasSizePanelProps {
  widthStr: string;
  heightStr: string;
  onWidthChange: (value: string) => void;
  onHeightChange: (value: string) => void;
  onCancel: () => void;
  onApply: () => void;
}

export interface IEditorSettingsCanvasSizePanelProps {
  widthStr: string;
  heightStr: string;
  onWidthChange: (value: string) => void;
  onHeightChange: (value: string) => void;
  onCancel: () => void;
  /** Called with a validated size (whole numbers from 1 to the canvas maximum). */
  onApply: (size: { width: number; height: number }) => void;
}

export interface ICanvasSizeFieldErrors {
  width?: string;
  height?: string;
}

export interface ICanvasSizeFieldsResult {
  /** The parsed size, or null when any field is invalid. */
  size: { width: number; height: number } | null;
  errors: ICanvasSizeFieldErrors;
}

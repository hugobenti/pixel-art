export interface IUseReferenceImageParams {
  initialReferenceImageDataUrl?: string;
  onReferenceImageChange: (dataUrl?: string) => void;
}

export interface IUseReferenceImageResult {
  showReferenceImage: boolean;
  hasReferenceImage: boolean;
  referenceImageElement: HTMLImageElement | null;
  referenceAlpha: number;
  onToggleReferenceImage: () => void;
  onLoadReferenceImage: () => void;
}

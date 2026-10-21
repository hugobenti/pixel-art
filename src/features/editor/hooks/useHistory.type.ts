export interface IUseHistoryParams {
  documentKey: string;
  getLayerPixelData: (layerId: string) => Uint8Array | null;
}

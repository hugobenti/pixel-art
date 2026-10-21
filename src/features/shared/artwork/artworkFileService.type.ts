import type { IArtworkLayer } from "@/features/shared/artwork/artwork.type";

export interface IArtworkFileV1 {
  version: 1;
  title: string;
  width: number;
  height: number;
  palette: string[];
  layers: Array<{
    id: string;
    name: string;
    visible: boolean;
    pixelData: number[];
  }>;
  activeLayerId: string;
  referenceImageDataUrl?: string;
}

export interface IArtworkFileV2 {
  version: 2;
  title: string;
  width: number;
  height: number;
  palette: string[];
  layers: Array<{
    id: string;
    name: string;
    visible: boolean;
    pixelDataBase64: string;
  }>;
  activeLayerId: string;
  referenceImageDataUrl?: string;
}

export interface IImportedArtworkData {
  title: string;
  width: number;
  height: number;
  palette: string[];
  layers: IArtworkLayer[];
  activeLayerId: string;
  referenceImageDataUrl?: string;
}

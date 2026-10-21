import type { IArtworkLayer } from "@/features/shared/artwork/artwork.type";

export interface ILayersDrawerProps {
  layers: IArtworkLayer[];
  activeLayerId: string;
  palette: string[];
  width: number;
  height: number;
  onClose: () => void;
  onSelectLayer: (layerId: string) => void;
  onToggleVisibility: (layerId: string) => void;
  onAddLayer: () => void;
  onCopyLayer: (layerId: string) => void;
  onRenameLayer: (layerId: string, nextName: string) => void;
  onReorderLayers: (activeId: string, overId: string | null) => void;
}

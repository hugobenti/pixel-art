import type { RefObject } from "react";

export interface ICanvasContainerProps {
  wrapRef: RefObject<HTMLDivElement | null>;
  artworkCanvasRef: RefObject<HTMLCanvasElement | null>;
  referenceImageCanvasRef: RefObject<HTMLCanvasElement | null>;
  gridCanvasRef: RefObject<HTMLCanvasElement | null>;
  viewportHandlers: {
    onPointerDown: React.PointerEventHandler<HTMLDivElement>;
    onPointerMove: React.PointerEventHandler<HTMLDivElement>;
    onPointerUp: React.PointerEventHandler<HTMLDivElement>;
    onPointerCancel: React.PointerEventHandler<HTMLDivElement>;
    onPointerEnter: React.PointerEventHandler<HTMLDivElement>;
    onPointerLeave: React.PointerEventHandler<HTMLDivElement>;
    onFocus: React.FocusEventHandler<HTMLDivElement>;
    onBlur: React.FocusEventHandler<HTMLDivElement>;
  };
  onArtworkPointerDown: React.PointerEventHandler<HTMLCanvasElement>;
}

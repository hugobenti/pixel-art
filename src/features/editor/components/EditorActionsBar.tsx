/**
 * Purpose:
 * Single toolbar row: navigation, document title, icon toolbar (undo/redo/pan/zoom/… ), and settings (drawer).
 */
"use client";

import Link from "next/link";

import { editorActionsBar } from "@/features/editor/components/EditorActionsBar.style";
import { useEditorActionsBar } from "@/features/editor/components/useEditorActionsBar";
import { Button } from "@/features/shared/components/Button";
import { PublicMaskIcon } from "@/features/shared/components/PublicMaskIcon";
import { PUBLIC_ICONS } from "@/features/shared/constants/publicIcons";

import type { ColorSlot } from "@/features/editor/logic/paletteMutations";

interface EditorActionsBarProps {
  title: string;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  activeSlot: ColorSlot;
  onToggleActiveSlot: () => void;
  panMode: boolean;
  onTogglePanMode: () => void;
  bucketMode: boolean;
  onToggleBucketMode: () => void;
  canZoomOut: boolean;
  canZoomIn: boolean;
  onZoomOut: () => void;
  onZoomIn: () => void;
  shiftOverlayOpen: boolean;
  onToggleShiftOverlay: () => void;
  layersDrawerOpen: boolean;
  onToggleLayersDrawer: () => void;
  settingsDrawerOpen: boolean;
  onToggleSettingsDrawer: () => void;
}

export function EditorActionsBar({
  title,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  activeSlot,
  onToggleActiveSlot,
  panMode,
  onTogglePanMode,
  bucketMode,
  onToggleBucketMode,
  canZoomOut,
  canZoomIn,
  onZoomOut,
  onZoomIn,
  shiftOverlayOpen,
  onToggleShiftOverlay,
  layersDrawerOpen,
  onToggleLayersDrawer,
  settingsDrawerOpen,
  onToggleSettingsDrawer,
}: EditorActionsBarProps) {
  const { slotLabel, slotAriaLabel, slotVariant } =
    useEditorActionsBar(activeSlot);

  return (
    <div className={editorActionsBar.base}>
      <div className={editorActionsBar.leftCluster}>
        <Link href="/gallery" className={editorActionsBar.backLink}>
          ← Gallery
        </Link>
        <h1 className={editorActionsBar.title}>{title}</h1>
      </div>
      <div className={editorActionsBar.actionCluster}>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={!canUndo}
          onClick={onUndo}
          aria-label="Undo"
          title="Undo (Ctrl+Z)"
        >
          <PublicMaskIcon src={PUBLIC_ICONS.undo} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={!canRedo}
          onClick={onRedo}
          aria-label="Redo"
          title="Redo (Ctrl+Shift+Z)"
        >
          <PublicMaskIcon src={PUBLIC_ICONS.redo} />
        </Button>
        <Button
          type="button"
          variant={panMode ? "primary" : "ghost"}
          size="icon"
          onClick={onTogglePanMode}
          aria-pressed={panMode}
          aria-label="Pan mode"
          title="Pan mode: drag to move the canvas (or hold Space)"
        >
          <PublicMaskIcon src={PUBLIC_ICONS.pan} />
        </Button>
        <Button
          type="button"
          variant={bucketMode ? "primary" : "ghost"}
          size="icon"
          onClick={onToggleBucketMode}
          aria-pressed={bucketMode}
          aria-label="Paint bucket mode"
          title="Paint bucket mode"
        >
          <PublicMaskIcon src={PUBLIC_ICONS.bucket} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={!canZoomOut}
          onClick={onZoomOut}
          aria-label="Zoom out"
          title="Zoom out"
        >
          <PublicMaskIcon src={PUBLIC_ICONS.zoomOut} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={!canZoomIn}
          onClick={onZoomIn}
          aria-label="Zoom in"
          title="Zoom in"
        >
          <PublicMaskIcon src={PUBLIC_ICONS.zoomIn} />
        </Button>
        <Button
          type="button"
          variant={shiftOverlayOpen ? "primary" : "ghost"}
          size="icon"
          onClick={onToggleShiftOverlay}
          aria-pressed={shiftOverlayOpen}
          aria-label="Shift pixels"
          title="Shift rows/columns (wrap)"
        >
          <PublicMaskIcon src={PUBLIC_ICONS.panArrows} />
        </Button>
        <Button
          type="button"
          variant={layersDrawerOpen ? "primary" : "ghost"}
          size="icon"
          onClick={onToggleLayersDrawer}
          aria-pressed={layersDrawerOpen}
          aria-label="Layers"
          title="Open layers panel"
        >
          <PublicMaskIcon src={PUBLIC_ICONS.layers} />
        </Button>
        <Button
          type="button"
          variant={slotVariant}
          className={editorActionsBar.slotToggleButton}
          onClick={onToggleActiveSlot}
          aria-label={slotAriaLabel}
          title="Switch primary / secondary painting slot"
        >
          {slotLabel}
        </Button>
        <Button
          type="button"
          variant={settingsDrawerOpen ? "primary" : "outline"}
          size="icon"
          onClick={onToggleSettingsDrawer}
          aria-pressed={settingsDrawerOpen}
          aria-label="Editor settings"
          title="Editor settings"
        >
          <PublicMaskIcon src={PUBLIC_ICONS.cog} />
        </Button>
      </div>
    </div>
  );
}

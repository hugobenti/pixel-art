/**
 * Purpose:
 * Single toolbar row: navigation, document title, icon toolbar (undo/redo/pan/zoom/… ), and settings (drawer).
 */
"use client";

import Link from "next/link";

import { Button } from "@/features/shared/components/Button";
import { PublicMaskIcon } from "@/features/shared/components/PublicMaskIcon";
import { PUBLIC_ICONS } from "@/features/shared/constants/publicIcons";

import type { ColorSlot } from "@/features/editor/logic/paletteMutations";

const barClass =
  "flex flex-wrap items-center gap-2 border-b border-zinc-200 py-2";

const leftClusterClass = "flex min-w-0 flex-1 items-center gap-3";

const actionClusterClass = "flex flex-wrap items-center justify-end gap-2";

const backLinkClass =
  "shrink-0 text-sm font-medium text-zinc-600 underline-offset-4 hover:text-zinc-900 hover:underline";

const titleClass =
  "min-w-0 truncate text-base font-semibold text-zinc-900";

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
  const slotLabel = activeSlot === "primary" ? "Primary" : "Secondary";

  const slotToggleButtonClass =
    "min-h-10 min-w-[12ch] shrink-0 touch-manipulation px-3";

  return (
    <div className={barClass}>
      <div className={leftClusterClass}>
        <Link href="/gallery" className={backLinkClass}>
          ← Gallery
        </Link>
        <h1 className={titleClass}>{title}</h1>
      </div>
      <div className={actionClusterClass}>
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
          variant={activeSlot === "primary" ? "primary" : "outline"}
          className={slotToggleButtonClass}
          onClick={onToggleActiveSlot}
          aria-label={`Painting slot: ${slotLabel}. Click to switch.`}
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

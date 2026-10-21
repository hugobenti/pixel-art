/**
 * Purpose:
 * Single toolbar row: navigation, document title, icon toolbar (undo/redo/pan/zoom/… ), and settings (drawer).
 */
"use client";

import Link from "next/link";

import { editor } from "@/content/editor";
import { Button } from "@/features/shared/components/Button";
import { PublicMaskIcon } from "@/features/shared/components/PublicMaskIcon";
import { PUBLIC_ICONS } from "@/features/shared/constants/publicIcons";
import type { IEditorActionsBarProps } from "./EditorActionsBar.type";

const barClass =
  "flex flex-wrap items-center gap-2 border-b border-line py-2";

const leftClusterClass = "flex min-w-0 flex-1 items-center gap-3";

const actionClusterClass = "flex flex-wrap items-center justify-end gap-2";

const backLinkClass =
  "shrink-0 rounded-sm text-sm font-medium text-muted underline-offset-4 hover:text-fg hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

const titleClass =
  "min-w-0 truncate text-base font-semibold text-fg";

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
}: IEditorActionsBarProps) {
  const slotLabel =
    activeSlot === "primary" ? editor.toolbar.slot.primary : editor.toolbar.slot.secondary;

  const slotToggleButtonClass =
    "min-h-10 min-w-[12ch] shrink-0 touch-manipulation px-3";

  return (
    <div className={barClass}>
      <div className={leftClusterClass}>
        <Link href="/gallery" className={backLinkClass}>
          <span aria-hidden>{editor.toolbar.backArrow}</span> {editor.toolbar.back}
        </Link>
        <h1 className={titleClass}>{title}</h1>
      </div>
      <div className={actionClusterClass} role="group" aria-label={editor.toolbar.groupLabel}>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={!canUndo}
          onClick={onUndo}
          aria-label={editor.toolbar.undo.label}
          title={editor.toolbar.undo.title}
        >
          <PublicMaskIcon src={PUBLIC_ICONS.undo} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={!canRedo}
          onClick={onRedo}
          aria-label={editor.toolbar.redo.label}
          title={editor.toolbar.redo.title}
        >
          <PublicMaskIcon src={PUBLIC_ICONS.redo} />
        </Button>
        <Button
          type="button"
          variant={panMode ? "primary" : "ghost"}
          size="icon"
          onClick={onTogglePanMode}
          aria-pressed={panMode}
          aria-label={editor.toolbar.pan.label}
          title={editor.toolbar.pan.title}
        >
          <PublicMaskIcon src={PUBLIC_ICONS.pan} />
        </Button>
        <Button
          type="button"
          variant={bucketMode ? "primary" : "ghost"}
          size="icon"
          onClick={onToggleBucketMode}
          aria-pressed={bucketMode}
          aria-label={editor.toolbar.bucket.label}
          title={editor.toolbar.bucket.title}
        >
          <PublicMaskIcon src={PUBLIC_ICONS.bucket} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={!canZoomOut}
          onClick={onZoomOut}
          aria-label={editor.toolbar.zoomOut.label}
          title={editor.toolbar.zoomOut.title}
        >
          <PublicMaskIcon src={PUBLIC_ICONS.zoomOut} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={!canZoomIn}
          onClick={onZoomIn}
          aria-label={editor.toolbar.zoomIn.label}
          title={editor.toolbar.zoomIn.title}
        >
          <PublicMaskIcon src={PUBLIC_ICONS.zoomIn} />
        </Button>
        <Button
          type="button"
          variant={shiftOverlayOpen ? "primary" : "ghost"}
          size="icon"
          onClick={onToggleShiftOverlay}
          aria-pressed={shiftOverlayOpen}
          aria-label={editor.toolbar.shift.label}
          title={editor.toolbar.shift.title}
        >
          <PublicMaskIcon src={PUBLIC_ICONS.panArrows} />
        </Button>
        <Button
          type="button"
          variant={layersDrawerOpen ? "primary" : "ghost"}
          size="icon"
          onClick={onToggleLayersDrawer}
          aria-pressed={layersDrawerOpen}
          aria-label={editor.toolbar.layers.label}
          title={editor.toolbar.layers.title}
        >
          <PublicMaskIcon src={PUBLIC_ICONS.layers} />
        </Button>
        <Button
          type="button"
          variant={activeSlot === "primary" ? "primary" : "outline"}
          className={slotToggleButtonClass}
          onClick={onToggleActiveSlot}
          aria-label={editor.toolbar.slot.label(slotLabel)}
          title={editor.toolbar.slot.title}
        >
          {slotLabel}
        </Button>
        <Button
          type="button"
          variant={settingsDrawerOpen ? "primary" : "outline"}
          size="icon"
          onClick={onToggleSettingsDrawer}
          aria-pressed={settingsDrawerOpen}
          aria-label={editor.toolbar.settings.label}
          title={editor.toolbar.settings.title}
        >
          <PublicMaskIcon src={PUBLIC_ICONS.cog} />
        </Button>
      </div>
    </div>
  );
}

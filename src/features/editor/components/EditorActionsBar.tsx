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
import { editorActionsBar } from "./EditorActionsBar.style";
import type { IEditorActionsBarProps } from "./EditorActionsBar.type";
import { useEditorActionsBar } from "./useEditorActionsBar";

export function EditorActionsBar(props: IEditorActionsBarProps) {
  const {
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
  } = props;
  const { slotLabel, slotAriaLabel } = useEditorActionsBar(props);

  return (
    <div className={editorActionsBar.bar}>
      <div className={editorActionsBar.leftCluster}>
        <Link href="/gallery" className={editorActionsBar.backLink}>
          <span aria-hidden>{editor.toolbar.backArrow}</span> {editor.toolbar.back}
        </Link>
        <h1 className={editorActionsBar.heading}>{title}</h1>
      </div>
      <div className={editorActionsBar.actions} role="group" aria-label={editor.toolbar.groupLabel}>
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
          className={editorActionsBar.slotToggle}
          onClick={onToggleActiveSlot}
          aria-label={slotAriaLabel}
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

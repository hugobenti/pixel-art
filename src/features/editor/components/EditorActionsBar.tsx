/**
 * Purpose:
 * Single toolbar row: navigation, document title, undo/redo, palette modal, slot toggle, grid toggle.
 */
"use client";

import Link from "next/link";

import { Button } from "@/features/shared/components/Button";

import type { ColorSlot } from "@/features/editor/logic/paletteMutations";

const barClass =
  "flex flex-wrap items-center gap-2 border-b border-zinc-200 py-2";

const leftClusterClass = "flex min-w-0 flex-1 items-center gap-3";

const actionClusterClass = "flex flex-wrap items-center justify-end gap-2";

const backLinkClass =
  "shrink-0 text-sm font-medium text-zinc-600 underline-offset-4 hover:text-zinc-900 hover:underline";

const titleClass =
  "min-w-0 truncate text-base font-semibold text-zinc-900";

const slotHintClass =
  "shrink-0 rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700";

const iconToggleClass =
  "flex h-10 min-w-10 shrink-0 items-center justify-center rounded-lg border border-zinc-300 bg-white px-2 text-base font-semibold text-zinc-800 shadow-sm hover:bg-zinc-50 active:bg-zinc-100";

interface EditorActionsBarProps {
  title: string;
  showPixelGrid: boolean;
  onToggleGrid: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  activeSlot: ColorSlot;
  onToggleActiveSlot: () => void;
  onOpenPaletteModal: () => void;
  panMode: boolean;
  onTogglePanMode: () => void;
}

export function EditorActionsBar({
  title,
  showPixelGrid,
  onToggleGrid,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  activeSlot,
  onToggleActiveSlot,
  onOpenPaletteModal,
  panMode,
  onTogglePanMode,
}: EditorActionsBarProps) {
  const slotLabel = activeSlot === "primary" ? "Primary" : "Secondary";

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
          className="min-h-10 min-w-[4.5rem] px-3"
          disabled={!canUndo}
          onClick={onUndo}
          title="Undo (Ctrl+Z)"
        >
          Undo
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="min-h-10 min-w-[4.5rem] px-3"
          disabled={!canRedo}
          onClick={onRedo}
          title="Redo (Ctrl+Shift+Z)"
        >
          Redo
        </Button>
        <Button
          type="button"
          variant={panMode ? "primary" : "ghost"}
          className="min-h-10 px-3"
          onClick={onTogglePanMode}
          aria-pressed={panMode}
          title="Pan mode: drag to move the canvas (or hold Space)"
        >
          Pan
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="min-h-10 px-3"
          onClick={onOpenPaletteModal}
        >
          Edit palette
        </Button>
        <span className={slotHintClass} aria-live="polite">
          {slotLabel}
        </span>
        <button
          type="button"
          className={iconToggleClass}
          onClick={onToggleActiveSlot}
          aria-label={`Switch painting slot; active ${slotLabel}`}
          title="Switch primary / secondary color"
        >
          ⇄
        </button>
        <Button
          type="button"
          variant={showPixelGrid ? "primary" : "ghost"}
          className="min-h-10 px-3"
          onClick={onToggleGrid}
          title="Toggle grid (G)"
        >
          {showPixelGrid ? "Hide grid" : "Show grid"}
        </Button>
      </div>
    </div>
  );
}

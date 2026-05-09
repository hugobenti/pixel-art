/**
 * Purpose:
 * Right-side drawer with icon-led mobile-style rows for grid and reference image actions.
 *
 * Notes:
 * Reuses SideDrawer shell and the same enter/exit timing as the layers panel.
 */
"use client";

import { Button } from "@/features/shared/components/Button";
import { PublicMaskIcon } from "@/features/shared/components/PublicMaskIcon";
import { SideDrawer } from "@/features/shared/components/SideDrawer";
import { PUBLIC_ICONS } from "@/features/shared/constants/publicIcons";

import { ANIMATION_MS } from "@/features/editor/components/LayersDrawer/layersDrawer.constants";
import { useEditorSettingsDrawer } from "@/features/editor/components/EditorSettingsDrawer/hooks/useEditorSettingsDrawer";

interface EditorSettingsDrawerProps {
  showPixelGrid: boolean;
  onToggleGrid: () => void;
  showReferenceImage: boolean;
  hasReferenceImage: boolean;
  onToggleReferenceImage: () => void;
  onLoadReferenceImage: () => void;
  onClose: () => void;
}

const menuRootClass = "min-h-0 flex-1 overflow-y-auto px-0 pb-3 pt-0 sm:pb-4";

const menuListClass = "flex flex-col divide-y divide-zinc-200 bg-white";

const menuRowClass = `
  flex min-h-12 w-full items-center justify-between gap-3 px-4 py-3
  text-left text-sm font-medium text-zinc-900 transition-colors
  active:bg-zinc-100 touch-manipulation
`;

const menuRowMutedClass = "cursor-not-allowed opacity-50 active:bg-transparent";

const menuHintClass = "shrink-0 text-xs font-normal text-zinc-500";

const rowLeadClass = "flex min-w-0 flex-1 items-center gap-3";

const menuIconClass = "h-6 w-6 text-zinc-600";

export function EditorSettingsDrawer({
  showPixelGrid,
  onToggleGrid,
  showReferenceImage,
  hasReferenceImage,
  onToggleReferenceImage,
  onLoadReferenceImage,
  onClose,
}: EditorSettingsDrawerProps) {
  const { panelEntered, handleClose } = useEditorSettingsDrawer({ onClose });

  const gridLabel = showPixelGrid ? "Hide grid" : "Show grid";
  const imageLabel = showReferenceImage ? "Hide reference image" : "Show reference image";

  return (
    <SideDrawer
      entered={panelEntered}
      onBackdropClick={handleClose}
      title="Settings"
      motionDurationMs={ANIMATION_MS}
      backdropAriaLabel="Close settings"
      headerRight={
        <Button
          type="button"
          variant="ghost"
          className="min-h-10 shrink-0 touch-manipulation px-3 sm:min-h-9 sm:px-2"
          onClick={handleClose}
        >
          Close
        </Button>
      }
    >
      <div className={menuRootClass}>
        <nav className={menuListClass} aria-label="Editor settings">
          <button
            type="button"
            className={menuRowClass}
            onClick={() => {
              onToggleGrid();
            }}
          >
            <span className={rowLeadClass}>
              <PublicMaskIcon src={PUBLIC_ICONS.grid} className={menuIconClass} />
              <span>Show / hide grid</span>
            </span>
            <span className={menuHintClass}>{gridLabel}</span>
          </button>
          <button
            type="button"
            className={`${menuRowClass} ${!hasReferenceImage ? menuRowMutedClass : ""}`}
            disabled={!hasReferenceImage}
            onClick={() => {
              if (!hasReferenceImage) {
                return;
              }
              onToggleReferenceImage();
            }}
          >
            <span className={rowLeadClass}>
              <PublicMaskIcon src={PUBLIC_ICONS.eye} className={menuIconClass} />
              <span>Show / hide image</span>
            </span>
            <span className={menuHintClass}>
              {!hasReferenceImage ? "Load an image first" : imageLabel}
            </span>
          </button>
          <button
            type="button"
            className={menuRowClass}
            onClick={() => {
              onLoadReferenceImage();
            }}
          >
            <span className={rowLeadClass}>
              <PublicMaskIcon src={PUBLIC_ICONS.upload} className={menuIconClass} />
              <span>Load image</span>
            </span>
            <span className={menuHintClass}>Pick file</span>
          </button>
        </nav>
      </div>
    </SideDrawer>
  );
}

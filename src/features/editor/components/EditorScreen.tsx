/**
 * Purpose:
 * Editor route shell: loads artwork metadata then mounts the interactive workspace.
 */
"use client";

import { editor } from "@/content/editor";
import { EditorWorkspace } from "@/features/editor/components/EditorWorkspace";
import { cx } from "@/features/shared/utils/cx";
import { editorScreen } from "./EditorScreen.style";
import type { IEditorScreenProps } from "./EditorScreen.type";
import { useEditorScreen } from "./useEditorScreen";

export function EditorScreen({ artworkId }: IEditorScreenProps) {
  const { artwork, loadError } = useEditorScreen(artworkId);

  if (loadError) {
    return (
      <main className={editorScreen.frame}>
        <p role="alert" className={editorScreen.error}>
          {loadError}
        </p>
        <a href="/gallery" className={editorScreen.backLink}>
          {editor.screen.backToGallery}
        </a>
      </main>
    );
  }

  if (!artwork) {
    return (
      <main role="status" className={cx(editorScreen.frame, editorScreen.loading)}>
        {editor.screen.loading}
      </main>
    );
  }

  return <EditorWorkspace key={artworkId} initialArtwork={artwork} />;
}

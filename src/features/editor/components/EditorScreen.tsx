/**
 * Purpose:
 * Editor route shell: loads artwork metadata then mounts the interactive workspace.
 */
"use client";

import { editorScreen } from "@/features/editor/components/EditorScreen.style";
import { EditorWorkspace } from "@/features/editor/components/EditorWorkspace";
import { useEditorScreen } from "@/features/editor/components/useEditorScreen";

interface EditorScreenProps {
  artworkId: string;
}

export function EditorScreen({ artworkId }: EditorScreenProps) {
  const { artwork, loadError } = useEditorScreen(artworkId);

  if (loadError) {
    return (
      <div className={editorScreen.error}>
        <p className={editorScreen.errorText}>{loadError}</p>
        <a href="/gallery" className={editorScreen.backLink}>
          Back to gallery
        </a>
      </div>
    );
  }

  if (!artwork) {
    return <div className={editorScreen.loading}>Loading artwork…</div>;
  }

  return <EditorWorkspace key={artworkId} initialArtwork={artwork} />;
}

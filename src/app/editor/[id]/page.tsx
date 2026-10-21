/**
 * Purpose:
 * Dynamic editor route that loads a single artwork by id into the PixelCraft workspace.
 */
"use client";

import { editorPage } from "@/app/editor/[id]/page.style";
import { useEditorPage } from "@/app/editor/[id]/useEditorPage";
import { EditorScreen } from "@/features/editor/components/EditorScreen";

export default function EditorPage() {
  const { id } = useEditorPage();

  if (!id) {
    return <div className={editorPage.missingId}>Missing artwork id.</div>;
  }

  return <EditorScreen artworkId={id} />;
}

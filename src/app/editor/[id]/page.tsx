/**
 * Purpose:
 * Dynamic editor route that loads a single artwork by id into the PixelHB workspace.
 */
"use client";

import { editor } from "@/content/editor";
import { EditorScreen } from "@/features/editor/components/EditorScreen";
import { editorPage } from "./page.style";
import { useEditorPage } from "./useEditorPage";

export default function EditorPage() {
  const { id } = useEditorPage();

  if (!id) {
    return <main className={editorPage.missingId}>{editor.route.missingId}</main>;
  }

  return <EditorScreen artworkId={id} />;
}

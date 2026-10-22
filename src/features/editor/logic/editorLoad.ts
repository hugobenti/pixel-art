/**
 * Purpose:
 * Loads the editor's artwork into a detached editable copy and turns a missing record or a rejected
 * read (private mode, quota, blocked upgrade) into a result, so the screen never waits forever.
 */

import { toEditableArtwork } from "./editableArtwork";
import type { TEditorLoadResult, TReadArtwork } from "./editorLoad.type";

export async function loadEditorArtwork(
  id: string,
  readArtwork: TReadArtwork,
): Promise<TEditorLoadResult> {
  try {
    const row = await readArtwork(id);
    return row ? { status: "ready", artwork: toEditableArtwork(row) } : { status: "notFound" };
  } catch {
    return { status: "failed" };
  }
}

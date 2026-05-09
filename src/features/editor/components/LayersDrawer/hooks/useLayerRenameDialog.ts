/**
 * Purpose:
 * Modal session state for renaming an artwork layer from the layers drawer.
 */
"use client";

import { useCallback, useState } from "react";

export interface LayerRenameSession {
  layerId: string;
  initialName: string;
}

export function useLayerRenameDialog(
  onRename: (layerId: string, nextName: string) => void
) {
  const [session, setSession] = useState<LayerRenameSession | null>(null);

  const requestRename = useCallback((layerId: string, initialName: string) => {
    setSession({ layerId, initialName });
  }, []);

  const dismiss = useCallback(() => {
    setSession(null);
  }, []);

  const confirm = useCallback(
    (nextName: string) => {
      if (!session) {
        return;
      }
      const id = session.layerId;
      dismiss();
      onRename(id, nextName);
    },
    [session, dismiss, onRename]
  );

  return { session, requestRename, dismiss, confirm };
}

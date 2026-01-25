import { useEffect, useRef, useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { SnAmbMessage, useRecordWatch } from 'sn-shadcn-kit/amb';
import { scriptFieldNames } from '@/types/widget';

type UseWidgetWatcherArgs = {
  guid: string;
  hasLocalEdits: boolean;
};

export function useWidgetWatcher({ guid, hasLocalEdits }: UseWidgetWatcherArgs) {
  const qc = useQueryClient();
  const [warn, setWarn] = useState(false);
  
  const justSavedRef = useRef(false);
  const warnRef = useRef(warn);
  const hasLocalEditsRef = useRef(hasLocalEdits);

  useEffect(() => {
    warnRef.current = warn;
  }, [warn]);

  useEffect(() => {
    hasLocalEditsRef.current = hasLocalEdits;
  }, [hasLocalEdits]);

  const handleWatcher = useCallback(
    (e: SnAmbMessage) => {
      if (warnRef.current || !e?.data?.record || !e?.data?.changes) return;

      const touchesScript = e.data.changes.some((item: string) => scriptFieldNames.includes(item));
      if (!touchesScript) return;

      if (justSavedRef.current) {
        justSavedRef.current = false;
        return;
      }

      if (hasLocalEditsRef.current) {
        setWarn(true);
        return;
      }

      qc.invalidateQueries({ queryKey: ['widgetData', guid] });
    },
    [guid, qc]
  );

  useRecordWatch('sp_widget', 'sys_id=' + guid, handleWatcher);

  const markJustSaved = useCallback(() => {
    justSavedRef.current = true;
  }, []);

  return { warn, setWarn, markJustSaved };
}

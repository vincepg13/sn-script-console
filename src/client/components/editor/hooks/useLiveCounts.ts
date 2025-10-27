import { useEffect, useRef, useCallback } from 'react';
import { useWidget } from '@/context/widget-context';
import { getDependencyCounts } from '@/lib/api';
import { useRecordWatch } from 'sn-shadcn-kit/amb';
import { useDebounceCb } from '@/hooks/useDebounceCb';

export function useLiveCounts(widgetId: string) {
  const query = 'sp_widget=' + widgetId;
  const { patchDependencyCounts } = useWidget();
  const controllerRef = useRef(new AbortController());

  const refreshCounts = useCallback(async () => {
    controllerRef.current.abort();
    controllerRef.current = new AbortController();

    try {
      const counts = await getDependencyCounts(widgetId, controllerRef.current.signal);
      patchDependencyCounts(counts);
    } catch (e) {
      console.error('Failed to refresh dependency counts', e);
    }
  }, [widgetId, patchDependencyCounts]);

  const debounced = useDebounceCb(refreshCounts, 400);
  const onRecordEvent = useCallback(() => {
    debounced.tick();
  }, [debounced]);

  useRecordWatch('m2m_sp_widget_dependency', query, onRecordEvent);
  useRecordWatch('m2m_sp_ng_pro_sp_widget', query, onRecordEvent);
  useRecordWatch('sp_ng_template', query, onRecordEvent);

  useEffect(() => () => debounced.cancel(), [debounced]);
  return { refreshCounts, scheduleRefresh: debounced.tick };
}

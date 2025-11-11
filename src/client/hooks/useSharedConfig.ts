import { WidgetRes } from '@/types/widget';
import { ScriptData } from '@/types/script';
import { PolicyData } from '@/types/policy';
import { useEffect, useEffectEvent } from 'react';
import { useAppData } from '@/context/app-context';
import { QueryClient } from '@tanstack/query-core';

type AllowedData = WidgetRes | ScriptData | PolicyData | undefined | null;

export function useSharedRouteConfig(data: AllowedData, isFetching: boolean, qc: QueryClient) {
  const { config, setConfig, setPackageData } = useAppData();

  const scopeChangeEvent = useEffectEvent((invalidate?: boolean) => {
    if (data?.scopeChange) {
      if (data.scopeChange.scope.value !== config.scope.value) {
        const sc = data.scopeChange;

        setConfig(prev =>
          prev.scope.value === sc.scope.value ? prev : { ...prev, scope: sc.scope, updateSet: sc.updateSet }
        );

        if (invalidate) qc.invalidateQueries({ queryKey: ['appConfig'] });
      }
    }
  });

  useEffect(() => scopeChangeEvent(true), [data?.scopeChange]);

  useEffect(() => {
    if (data && data.packageValue) {
      const pv = data.packageValue;
      setPackageData(prev => ({ ...prev, packageItems: pv }));
    }
  }, [data, setPackageData]);
}

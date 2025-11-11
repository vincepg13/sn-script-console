import { isAxiosError } from 'axios';
import { useParams } from 'react-router';
import { getPolicyData } from '@/lib/api';
import { useAppData } from './app-context';
import { PolicyAction } from '@/types/policy';
import { SnConditionMap } from 'sn-shadcn-kit/table';
import { createContext, useCallback, useContext, useMemo, useRef } from 'react';
import { useSharedRouteConfig } from '@/hooks/useSharedConfig';
import { GeneralLoader } from '@/components/generic/GeneralLoader';
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';

interface PolicyContextValue {
  policy: { name: string; guid: string; table: string; scope: string; meta: SnConditionMap };
  actions: PolicyAction[];
  isFetching: boolean;
  isLoading: boolean;
  inScope: boolean;
  refetch: () => void;
  checkDirty: () => boolean;
  registerDirtyChecker: (fn: () => boolean) => void;
  patchActions: (valueOrUpdater: PolicyAction[] | ((prev: PolicyAction[]) => PolicyAction[])) => void;
}

const PolicyContext = createContext<PolicyContextValue | undefined>(undefined);

export const policyDataQuery = (guid: string) => ({
  queryKey: ['policyData', guid],
  placeholderData: keepPreviousData,
  retry: 1,
  refetchOnWindowFocus: true,
  queryFn: async ({ signal }: { signal: AbortSignal }) => await getPolicyData(guid, signal),
  enabled: Boolean(guid),
});

export const PolicyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const qc = useQueryClient();
  const { id } = useParams<{ table: string; id: string }>();

  const checkerRef = useRef<() => boolean>(() => false);

  const registerDirtyChecker = useCallback((fn: () => boolean) => {
    checkerRef.current = fn || (() => false);
  }, []);

  const checkDirty = useCallback(() => {
    try {
      return !!checkerRef.current();
    } catch {
      return false;
    }
  }, []);

  const { data, isLoading, error, isFetching, refetch } = useQuery(policyDataQuery(id!));
  useSharedRouteConfig(data, isFetching, qc);

  const { config } = useAppData();
  const inScope = useMemo(() => data?.scope === config.scope.value, [data?.scope, config.scope.value]);

  const patchActions = useCallback(
    (valueOrUpdater: PolicyAction[] | ((prev: PolicyAction[]) => PolicyAction[])) => {
      if (!id) return;

      qc.setQueryData<Awaited<ReturnType<typeof getPolicyData>>>(['policyData', id], old => {
        if (!old) return old; // nothing cached yet
        const next =
          typeof valueOrUpdater === 'function'
            ? (valueOrUpdater as (prev: PolicyAction[]) => PolicyAction[])(old.actions)
            : valueOrUpdater;

        return { ...old, actions: next };
      });
    },
    [qc, id]
  );

  const value = useMemo<PolicyContextValue | undefined>(() => {
    if (!data) return undefined;
    return {
      policy: {
        name: data.name,
        guid: data.guid,
        table: data.table,
        scope: data.scope,
        meta: data.tableMeta,
      },
      inScope,
      isFetching,
      isLoading,
      actions: data.actions,
      refetch,
      checkDirty,
      patchActions,
      registerDirtyChecker,
    };
  }, [data, inScope, isFetching, isLoading, refetch, checkDirty, patchActions, registerDirtyChecker]);

  if (isLoading) return <GeneralLoader />;

  if (error) {
    if (isAxiosError(error) && (error.status == 500 || error.status == 404)) return null;
    console.error('Error loading policy data', error);
    throw new Error('Error loading policy data');
  }

  if (!id || !data) return null;

  return <PolicyContext.Provider value={value}>{children}</PolicyContext.Provider>;
};

export function usePolicy() {
  const ctx = useContext(PolicyContext);
  if (!ctx) throw new Error('usePolicy must be used within a PolicyProvider');
  return ctx;
}

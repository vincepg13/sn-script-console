import { isAxiosError } from 'axios';
import { useParams } from 'react-router';
import { getPolicyData } from '@/lib/api';
import { AlertCircleIcon } from 'lucide-react';
import { SnConditionMap } from 'sn-shadcn-kit/table';
import { PolicyAction, PolicyType } from '@/types/policy';
import { useSharedRouteConfig } from '@/hooks/useSharedConfig';
import { GeneralLoader } from '@/components/generic/GeneralLoader';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { createContext, useCallback, useContext, useMemo, useRef } from 'react';
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';

interface PolicyContextValue {
  policy: { name: string; guid: string; table?: string; scope: string; meta: SnConditionMap; type: PolicyType };
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

  const inScope = useMemo(() => !!data?.canWrite, [data?.canWrite]);
  // const inScope = useMemo(() => data?.scope === config.scope.value, [data?.scope, config.scope.value]);

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
        scope: data.scope,
        meta: data.tableMeta,
        table: data.table || undefined,
        type: data.type,
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

  if (data.type !== 'sys_ui_policy') {
    return (
      <Alert variant="destructive">
        <AlertCircleIcon className="mt-[3px]" />
        <AlertTitle className="text-xl font-semibold">Unable to render this UI policy.</AlertTitle>
        <AlertDescription>
          <p className="text-base text-foreground">Only UI Policies for tables are supported at this time. Support for catalog and wizard policies will be added in a future update.</p>
        </AlertDescription>
      </Alert>
    );
  }

  return <PolicyContext.Provider value={value}>{children}</PolicyContext.Provider>;
};

export function usePolicy() {
  const ctx = useContext(PolicyContext);
  if (!ctx) throw new Error('usePolicy must be used within a PolicyProvider');
  return ctx;
}

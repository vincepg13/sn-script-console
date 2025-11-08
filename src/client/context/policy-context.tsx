import { isAxiosError } from 'axios';
import { useParams } from 'react-router';
import { getPolicyData } from '@/lib/api';
import { PolicyAction } from '@/types/policy';
import { SnConditionMap } from 'sn-shadcn-kit/table';
import { createContext, useContext, useMemo } from 'react';
import { useSharedRouteConfig } from '@/hooks/useSharedConfig';
import { GeneralLoader } from '@/components/generic/GeneralLoader';
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';

interface PolicyContextValue {
  policy: { name: string; guid: string; table: string; scope: string, meta: SnConditionMap };
  actions: PolicyAction[];
  isFetching: boolean;
  isLoading: boolean;
  refetch: () => void;
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

  const { data, isLoading, error, isFetching, refetch } = useQuery(policyDataQuery(id!));
  useSharedRouteConfig(data, isFetching, qc);

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
      actions: data.actions,
      isFetching,
      isLoading,
      refetch,
    };
  }, [data, isFetching, isLoading, refetch]);

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
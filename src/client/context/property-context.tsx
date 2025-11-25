import { isAxiosError } from "axios";
import { useParams } from "react-router";
import { getPropertyData } from "@/lib/api";
import { PropertyData } from "@/types/property";
import { keepPreviousData } from "@tanstack/query-core";
import { useContext, useMemo, createContext } from "react";
import { useSharedRouteConfig } from "@/hooks/useSharedConfig";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { GeneralLoader } from "@/components/generic/GeneralLoader";

interface PropertyContextValue {
  property: PropertyData;
  isFetching: boolean;
  isLoading: boolean;
  refetch: () => void;
}

const PropertyContext = createContext<PropertyContextValue | undefined>(undefined);

export const propertyDataQuery = (guid: string) => ({
  queryKey: ['propertyData', guid],
  placeholderData: keepPreviousData,
  retry: 1,
  refetchOnWindowFocus: true,
  queryFn: async ({ signal }: { signal: AbortSignal }) => await getPropertyData(guid, signal),
  enabled: Boolean(guid),
});

export const PropertyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const qc = useQueryClient();
  const { id } = useParams<{ table: string; id: string }>();

  const { data, isLoading, error, isFetching, refetch } = useQuery(propertyDataQuery(id!));
  useSharedRouteConfig(data, isFetching, qc);

  //Patch property instead
  // const patchActions = useCallback(
  //   (valueOrUpdater: PolicyAction[] | ((prev: PolicyAction[]) => PolicyAction[])) => {
  //     if (!id) return;

  //     qc.setQueryData<Awaited<ReturnType<typeof getPolicyData>>>(['policyData', id], old => {
  //       if (!old) return old; // nothing cached yet
  //       const next =
  //         typeof valueOrUpdater === 'function'
  //           ? (valueOrUpdater as (prev: PolicyAction[]) => PolicyAction[])(old.actions)
  //           : valueOrUpdater;

  //       return { ...old, actions: next };
  //     });
  //   },
  //   [qc, id]
  // );

  const value = useMemo<PropertyContextValue | undefined>(() => {
    if (!data) return undefined;
    return {
      property: data,
      isFetching,
      isLoading,
      refetch,
      // patchActions,
    };
  }, [data, isFetching, isLoading, refetch]);

  if (isLoading) return <GeneralLoader />;

  if (error) {
    if (isAxiosError(error) && (error.status == 500 || error.status == 404)) return null;
    console.error('Error loading policy data', error);
    throw new Error('Error loading policy data');
  }

  if (!id || !data) return null;

  return <PropertyContext.Provider value={value}>{children}</PropertyContext.Provider>;
};

export function useProperty() {
  const ctx = useContext(PropertyContext);
  if (!ctx) throw new Error('useProperty must be used within a PropertyProvider');
  return ctx;
}

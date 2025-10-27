import { ListData } from '@/types/list';
import { getTableData } from '@/lib/api';
import { useSearchParams, useParams } from 'react-router';
import { createContext, useContext, useState } from 'react';
import { ListSkeleton } from '@/components/list/ListSkeleton';
import { useQuery } from '@tanstack/react-query';
import { getDefaultSortingFromQuery, SortingState } from 'sn-shadcn-kit/table';

interface ListContextValue {
  uuid: string;
  table: string;
  listData: ListData;

  page: number;
  pageSize: number;
  setPageSize: (size: number) => void;

  query: string;
  sorting: SortingState;
  isFetching: boolean;
  isLoading: boolean;
}

const ListContext = createContext<ListContextValue | undefined>(undefined);

export const listDataQuery = (table: string, query: string, page: number, pageSize: number) => ({
  queryKey: ['listData', table, query, page, pageSize],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  placeholderData: (prev: any, previousQuery: any) => (previousQuery?.queryKey?.[1] === table ? prev : undefined),
  refetchOnWindowFocus: true,
  staleTime: 5_000,
  queryFn: async ({ signal }: { signal: AbortSignal }) => await getTableData(table, query, page, pageSize, signal),
});

export const ListProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sp] = useSearchParams();
  const [pageSize, setPageSize] = useState(20);

  const page = Number(sp.get('page') || 1);
  const { table } = useParams<{ table: string }>();
  if (!table) throw new Error("Route param 'table' is required");

  const defaultSortQuery = 'ORDERBYDESCsys_updated_on';
  const query = sp.get('query') || defaultSortQuery;

  const sorting = getDefaultSortingFromQuery(query);
  if (!sorting.length) sorting.push({ id: 'sys_updated_on', desc: true });

  let sortQuery = query;
  if (!sortQuery.includes('ORDERBY')) sortQuery += '^ORDERBYDESCsys_updated_on';

  const { data, isLoading, isFetching, error } = useQuery(listDataQuery(table!, sortQuery, page - 1, pageSize));

  if (isLoading) return <ListSkeleton />;

  if (error || !data) {
    console.error('Error loading widget data', error);
    throw new Error('Error loading widget data');
  }
  const uuid = crypto.randomUUID();
  return (
    <ListContext.Provider
      value={{ table, listData: data, uuid, page, pageSize, query, sorting, isFetching, isLoading, setPageSize }}
    >
      {children}
    </ListContext.Provider>
  );
};

export function useList() {
  const ctx = useContext(ListContext);
  if (!ctx) throw new Error('useList must be used within a ListProvider');
  return ctx;
}

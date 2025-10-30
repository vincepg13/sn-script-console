import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { MenuItem } from '@/types/app';
import { useList } from '@/context/list-context';
import { Link, useSearchParams } from 'react-router';
import { useAppData } from '@/context/app-context';
import { SnConditionBuilder } from 'sn-shadcn-kit/table';
import { SimpleTooltip } from '../generic/SimpleTooltip';
import { LoadingSpinner } from '../generic/LoadingSpinner';
import { useEffect, useMemo, useRef, useState } from 'react';
import { fallbackMenuItems, instanceURI } from '@/lib/config';
import { CircleX, ListFilter, SquareArrowOutUpRight } from 'lucide-react';
import { useDebouncedCallback } from '../editor/hooks/useDebouncedCallback';

export function TableHeader() {
  const [, setSp] = useSearchParams();
  const [showFilter, setShowFilter] = useState(false);
  const tableSearchRef = useRef<HTMLInputElement>(null);
  const [searchClearable, setSearchClearable] = useState(false);

  const { table, listData, uuid, query, isFetching } = useList();
  const { config } = listData;
  const { tableLabel, displayField } = config;

  const { config: appConfig } = useAppData();

  const tagline = useMemo(() => {
    const menu = appConfig.menu || fallbackMenuItems;
    const allMenuItems: MenuItem[] = menu.reduce((acc, curr) => {
      return acc.concat(curr.items);
    }, [] as MenuItem[]);

    const target = allMenuItems.find(s => new RegExp(`/${table}(?:[/?]|$)`).test(s.href));

    return target ? target.description : `Manage your ${tableLabel}`;
  }, [table, tableLabel, appConfig.menu]);

  //Completely reset the query params and search input
  const resetQuery = () => {
    setShowFilter(false);
    if (tableSearchRef.current) tableSearchRef.current.value = '';

    setSp(
      prev => {
        const next = new URLSearchParams(prev);
        next.delete('query');
        next.set('page', '1');
        return next;
      },
      { replace: true }
    );
  };

  // Query on debounced search from input
  const handleChange = useDebouncedCallback(() => {
    const value = tableSearchRef.current?.value;
    if (!value) return resetQuery();
    const query = value.startsWith('*') ? `${displayField}LIKE${value.slice(1)}` : `${displayField}STARTSWITH${value}`;
    setSp(prev => ({ ...prev, query, page: 1 }), { replace: true });
  }, 300);

  // Handle query updates from condition builder
  const handleQueryChange = (builderQuery: string) => {
    if (!builderQuery) return resetQuery();
    if (query === builderQuery) return;

    setShowFilter(false);
    setSp(prev => ({ ...prev, query: builderQuery, page: 1 }), { replace: true });
  };

  // Sync clearable with query
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchClearable(!!tableSearchRef.current?.value);
  }, [tableSearchRef, query]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end justify-between w-full flex-wrap">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex gap-1 items-center">{tableLabel}</h2>
          <p className="text-muted-foreground">{tagline}</p>
        </div>
        <div className="flex items-center gap-2 w-full mt-2 lg:w-auto lg:mt-0">
          {isFetching && <LoadingSpinner className="h-6 w-6" />}
          <div className="relative w-full">
            <Input
              type="text"
              ref={tableSearchRef}
              onChange={handleChange}
              placeholder={`Search by ${displayField}...`}
              className="pr-5"
            />
            {searchClearable && (
              <CircleX
                className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer hover:text-destructive"
                onClick={resetQuery}
              />
            )}
          </div>
          <SimpleTooltip content={showFilter ? 'Close Advanced Filter' : 'Open Advanced Filter'}>
            <Button variant="outline" size="icon" onClick={() => setShowFilter(!showFilter)}>
              <span className={`transition-transform duration-300 ease-in-out ${showFilter ? 'rotate-180' : ''}`}>
                <ListFilter />
              </span>
            </Button>
          </SimpleTooltip>
          <SimpleTooltip content="Open list in instance">
            <Button variant="outline" size="icon" asChild>
              <Link
                to={`${instanceURI}/${table}_list.do?${query ? `sysparm_query=${encodeURIComponent(query)}&` : ''}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center"
              >
                <SquareArrowOutUpRight />
              </Link>
            </Button>
          </SimpleTooltip>
        </div>
      </div>
      <div className={showFilter ? 'block' : 'hidden'}>
        <SnConditionBuilder key={uuid} table={table} onQueryBuilt={handleQueryChange} encodedQuery={query || ''} />
      </div>
    </div>
  );
}

import { Button } from '../ui/button';
import { MenuItem } from '@/types/app';
import { errorHandler } from '@/lib/utils';
import { setPersonalList } from '@/lib/api';
import { useCallback, useMemo } from 'react';
import { useList } from '@/context/list-context';
import { useAppData } from '@/context/app-context';
import { Link, useSearchParams } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { SnSimpleTooltip } from 'sn-shadcn-kit/ui';
import { fallbackMenuItems, instanceURI } from '@/lib/config';
import { useCancelableFn } from 'sn-shadcn-kit/hooks';
import { Settings2, SquareArrowOutUpRight } from 'lucide-react';
import { SnListItem, SnPersonaliseList, SnTableHeader } from 'sn-shadcn-kit/table';


export function TableHeader() {
  const qc = useQueryClient();
  const [, setSp] = useSearchParams();

  const { table, listData, uuid, query, isFetching } = useList();
  const { config, listMechanic } = listData;
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
  const resetQuery = useCallback(() => {
    setSp(
      prev => {
        const next = new URLSearchParams(prev);
        next.delete('query');
        next.set('page', '1');
        return next;
      },
      { replace: true }
    );
  }, [setSp]);

  const updateQuery = useCallback(
    (nextQuery: string) => {
      setSp(prev => ({ ...prev, query: nextQuery, page: 1 }), { replace: true });
    },
    [setSp]
  );

  const saveList = async (items?: SnListItem[]) => {
    try {
      await setPersonal.run(table, items);
      qc.invalidateQueries({ queryKey: ['listData', table] });
    } catch (error) {
      errorHandler(error, 'Failed to save personalised list');
    }
  };

  const setPersonal = useCancelableFn((signal, targetTable: string, items?: SnListItem[]) => {
    const listItems = items?.map(i => i.value);
    return setPersonalList(targetTable, listItems, signal);
  });

  const actions = [
    <SnSimpleTooltip key="personalise-list" content="Personalise List">
      <div>
        <SnPersonaliseList key={table} {...listMechanic} onSave={saveList}>
          <Button variant="outline" size="icon">
            <Settings2 />
          </Button>
        </SnPersonaliseList>
      </div>
    </SnSimpleTooltip>,
    <SnSimpleTooltip key="open-in-instance" content="Open list in instance">
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
    </SnSimpleTooltip>,
  ];

  return (
    <SnTableHeader
      title={tableLabel}
      tagline={tagline}
      table={table}
      displayField={displayField}
      query={query ?? ''}
      uuid={uuid}
      isFetching={isFetching}
      actions={actions}
      onQueryChange={updateQuery}
      onResetQuery={resetQuery}
    />
  );
}

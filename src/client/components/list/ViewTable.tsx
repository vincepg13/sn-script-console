import { useList } from '@/context/list-context';
import { FieldHeader } from '@/types/list';
import { useNavigate, useSearchParams } from 'react-router';
import { Row } from '@tanstack/react-table';
import {
  ColumnDef,
  DataTable,
  DataTableColumnHeader,
  getSortedQuery,
  resolveUpdater,
  SnRow,
  SnRowItem,
  SortingState,
  Updater,
} from 'sn-shadcn-kit/table';

const getGenericColumn = (id: string, label: string): ColumnDef<SnRow, SnRowItem> => ({
  id,
  accessorKey: id,
  cell: ({ getValue }) => <div className="truncate text-left">{getValue().display_value}</div>,
  header: ({ column }) => <DataTableColumnHeader column={column} title={label} />,
});

export function getColumns(fields: FieldHeader[]) {
  return fields.map(field => {
    const { name, label } = field;
    return getGenericColumn(name, label);
  });
}

export function ViewTable() {
  const navigate = useNavigate();
  const [sp, setSp] = useSearchParams();
  const { table, listData, sorting, query, page, pageSize, setPageSize } = useList();

  const pageIndex = page - 1;
  const columns = getColumns(listData.fields);
  const pageCount = Math.ceil(listData.totalCount / pageSize);

  const handlePageChange = (updater: Updater<{ pageIndex: number; pageSize: number }>) => {
    const newState = resolveUpdater(updater, { pageIndex, pageSize });
    if (newState.pageSize !== pageSize) setPageSize(newState.pageSize);

    const next = new URLSearchParams(sp);
    next.set('page', String(newState.pageIndex + 1));
    setSp(next, { replace: false });
  };

  //On sort change, update the URL params with the mapped query
  const handleSortChange = (updater: Updater<SortingState>) => {
    const newSorting = resolveUpdater(updater, sorting);
    const queryParam = getSortedQuery(newSorting, query);

    const next = new URLSearchParams(sp);
    next.set('query', queryParam);
    next.set('page', '1');
    setSp(next, { replace: false });
  };

  //Open the record tab when a row is clicked
  const openRecord = (row: Row<SnRow>) => {
    const guid = row.original.sys_id?.value;

    if (guid) {
      navigate(`/script/${table}/${guid}`);
    }
  };

  return (
    <DataTable
      pageIndex={pageIndex}
      pageSize={pageSize}
      pageCount={pageCount}
      data={listData.records}
      columns={columns}
      totalRowCount={listData.totalCount}
      sorting={sorting}
      onSortingChange={handleSortChange}
      onPageChange={handlePageChange}
      onRowClick={openRecord}
    />
  );
}

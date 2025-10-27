import { TableHeader } from '@/components/list/TableHeader';
import { ViewTable } from '@/components/list/ViewTable';
import { ListProvider } from '@/context/list-context';

export default function ListPage() {
  return (
    <ListProvider>
      <div className="space-y-4 pb-4">
        <TableHeader />
        <ViewTable />
      </div>
    </ListProvider>
  );
}
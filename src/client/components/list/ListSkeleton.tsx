import { SnDataTableSkeleton } from 'sn-shadcn-kit/table';
import { Skeleton } from '../ui/skeleton';

export function ListSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end justify-between w-full flex-wrap">
        <div className="space-y-2">
          <Skeleton className="h-8 w-[250px] rounded-sm" />
          <Skeleton className="h-6 w-[500px] rounded-sm" />
        </div>
        <div className="flex items-center gap-2 w-full mt-2 lg:w-auto lg:mt-0">
          <Skeleton className="h-10 w-60 rounded-md" />
          <Skeleton className="h-10 w-10 rounded-md" />
          <Skeleton className="h-10 w-10 rounded-md" />
        </div>
      </div>
      <SnDataTableSkeleton columnCount={5} rowCount={10} />
    </div>
  );
}

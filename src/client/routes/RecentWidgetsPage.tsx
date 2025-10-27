import { getRecentWidgets } from '@/lib/api';
import { useRecordWatch } from 'sn-shadcn-kit/amb';
import { WidgetCard } from '../components/editor/WidgetCard.tsx';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { WidgetPicker } from '@/components/editor/WidgetPicker.tsx';
import { NewWidgetModal } from '@/components/editor/NewWidgetModal.tsx';
import { GeneralLoader } from '@/components/generic/GeneralLoader.tsx';
import { LoadingSpinner } from '@/components/generic/LoadingSpinner.tsx';

//Tanstack Query fetcher for recently updated widgets
export const recentWidgetsQuery = () => ({
  queryKey: ['recentWidgets'],
  placeholderData: keepPreviousData,
  queryFn: async ({ signal }: { signal: AbortSignal }) => await getRecentWidgets(signal),
});

export default function RecentWidgetsPage() {
  const { data: recentWidgets, isLoading, isFetching, error, refetch } = useQuery(recentWidgetsQuery());

  useRecordWatch('sp_widget', 'nameISNOTEMPTY', () => refetch());

  if (isLoading) return <GeneralLoader />;

  if (error || !recentWidgets) {
    console.error('Error loading widget data', error);
    throw new Error('Error loading widget data');
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {isFetching && <LoadingSpinner />}
        <div className="flex-1">
          <WidgetPicker />
        </div>
        <NewWidgetModal />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        {recentWidgets.map(widget => (
          <WidgetCard
            key={widget.guid}
            name={widget.name}
            scope={widget.scope}
            id={widget.id}
            guid={widget.guid}
            updater={widget.updater}
          />
        ))}
      </div>
    </div>
  );
}

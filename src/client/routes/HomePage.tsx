import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getStatsData } from '@/lib/api';
// import { HomeHero } from '@/components/home/HomeHero';
import { StatCard } from '@/components/home/StatCard';
import { TableStat } from '@/types/stats';
import { ScriptConfig } from '@/components/home/ScriptConfig';
import { Skeleton } from '@/components/ui/skeleton';
import { fallbackStatsTables } from '@/lib/config';

export const statsDataQuery = () => ({
  queryKey: ['statsData'],
  placeholderData: keepPreviousData,
  queryFn: async ({ signal }: { signal: AbortSignal }) => await getStatsData(fallbackStatsTables, signal),
});

export default function HomePage() {
  const { data: statsData, error, isLoading } = useQuery(statsDataQuery());
  if (error) {
    throw error;
  }

  return (
    <div className="w-full flex flex-col gap-6 pt-2 pb-10">
      {/* <HomeHero /> */}
      <HomePageStats items={statsData?.tableCounts} isLoading={isLoading} />
      <ScriptConfig />
    </div>
  );
}

function HomePageStats({ items, isLoading }: { items?: TableStat[]; isLoading: boolean }) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-3xl tracking-tighter font-bold">My Script Stats</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading && Array.from({ length: 4 }).map((_, i) => <Skeleton className="h-[175px] rounded-xl" key={i} />)}
        {items?.map(item => (
          <StatCard key={item.table} table={item.table} title={item.title} items={item.items} />
        ))}
      </div>
    </div>
  );
}

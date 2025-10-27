import { z } from 'zod';

const StatSchema = z.object({
  subtext: z.string(),
  count: z.number(),
  query: z.string(),
});

const StatsSchema = z.array(StatSchema);
const TableStat = z.object({
  title: z.string(),
  table: z.string(),
  items: StatsSchema,
});

export const StatsRes = z.object({
  tableCounts: z.array(TableStat),
});

export type TableStat = z.infer<typeof TableStat>;
export type StatCardItem = z.infer<typeof StatSchema>;
export type StatsCardItems = z.infer<typeof StatsSchema>;

import { Button } from '../ui/button';
import { useEffect, useState } from 'react';
import { StatCardItem } from '@/types/stats';
import { SquareArrowOutUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Link } from 'react-router';

type StatCardProps = {
  title: string;
  table: string;
  items: StatCardItem[];
  intervalMs?: number;
};

const numberVariants = {
  enter: { y: '100%', opacity: 0, position: 'absolute', left: 0, right: 0 },
  center: { y: '0%', opacity: 1, position: 'absolute', left: 0, right: 0 },
  exit: { y: '-100%', opacity: 0, position: 'absolute', left: 0, right: 0 },
};

const textVariants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

export function StatCard({ title, table, items, intervalMs = 10000 }: StatCardProps) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!items?.length) return;

    const id = setInterval(() => {
      setIdx(i => (i + 1) % items.length);
    }, intervalMs);

    return () => clearInterval(id);
  }, [items, intervalMs]);

  if (!items?.length) return null;

  const current = items[idx];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        <Button variant="ghost" size="icon" asChild>
          <Link to={`/list/${table}?query=${encodeURIComponent(current.query)}`} rel="noreferrer">
            <SquareArrowOutUpRight className="text-muted-foreground" />
          </Link>
        </Button>
      </CardHeader>

      <CardContent>
        {/* Number ticker */}
        <div className="relative h-[56px] leading-none overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={idx}
              variants={numberVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', stiffness: 260, damping: 26 }}
              className="text-5xl font-bold text-foreground text-balance"
            >
              {current.count}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Subtext (fade or just swap) */}
        <div className="mt-2 h-4">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={current.subtext}
              variants={textVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5 }}
              className="text-muted-foreground text-xs"
            >
              {current.subtext}
            </motion.p>
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}

import { useRef, useMemo } from 'react';
  
type Debouncer = { tick: () => void; cancel: () => void };

export function useDebounceCb(fn: () => void, ms: number): Debouncer {
  const timer = useRef<number | null>(null);
  return useMemo(
    () => ({
      tick() {
        if (timer.current) window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => {
          fn();
        }, ms);
      },
      cancel() {
        if (timer.current) window.clearTimeout(timer.current);
        timer.current = null;
      },
    }),
    [fn, ms]
  );
}
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useEffect, useCallback } from "react"

export function useDebouncedFn<T extends (...args: any[]) => void>(fn: T, delay: number) {
  const fnRef = useRef(fn)
  const tRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => void (fnRef.current = fn), [fn])
  const debounced = useCallback((...args: Parameters<T>) => {
    if (tRef.current) clearTimeout(tRef.current)
    tRef.current = setTimeout(() => fnRef.current(...args), delay)
  }, [delay]) as T
  useEffect(() => () => { if (tRef.current) clearTimeout(tRef.current) }, [])
  return debounced
}
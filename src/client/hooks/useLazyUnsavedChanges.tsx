import { useBlocker, useBeforeUnload } from 'react-router';
import { useCallback, useEffect, useRef, useState } from 'react';

type CheckDirty = () => boolean;

export function useLazyUnsavedChanges(checkDirty: CheckDirty) {
  const [open, setOpen] = useState(false);

  const autoProceedingRef = useRef(false);
  const checkRef = useRef<CheckDirty>(() => false);
  useEffect(() => {
    checkRef.current = checkDirty;
  }, [checkDirty]);

  // Only block when actually dirty, and never block during an auto-proceed retry
  const shouldBlock = useCallback(() => {
    if (autoProceedingRef.current) return false;
    return !!checkRef.current();
  }, []);

  const blocker = useBlocker(shouldBlock);

  useEffect(() => {
    if (blocker.state !== 'blocked') return;

    // If we're here, shouldBlock() returned true -> we are dirty
    setOpen(true);
  }, [blocker.state]);

  const confirm = useCallback(() => {
    // Allow the retry to pass through the blocker
    autoProceedingRef.current = true;
    setOpen(false);
    blocker.proceed?.();
    // Clear the flag on next tick/frame so future navigations are blockable again
    queueMicrotask(() => { autoProceedingRef.current = false; });
  }, [blocker]);

  const cancel = useCallback(() => {
    setOpen(false);
    blocker.reset?.();
  }, [blocker]);

  useBeforeUnload(
    useCallback((e) => {
      if (!checkRef.current()) return;
      e.preventDefault();
    }, [])
  );

  return { open, setOpen, confirm, cancel, active: true };
}

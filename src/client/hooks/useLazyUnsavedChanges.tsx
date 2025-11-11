import { useBlocker, useBeforeUnload } from 'react-router';
import { useCallback, useEffect, useRef, useState } from 'react';

type CheckDirty = () => boolean;

export function useLazyUnsavedChanges(checkDirty: CheckDirty) {
  // Control modal open state
  const [open, setOpen] = useState(false);

  const blocker = useBlocker(true);
  const autoProceedingRef = useRef(false);
  const checkRef = useRef<CheckDirty>(() => false);

  // keep latest predicate without re-subscribing effects
  useEffect(() => {
    checkRef.current = checkDirty;
  }, [checkDirty]);

  // When a navigation is blocked, lazily compute dirtiness
  useEffect(() => {
    if (blocker.state !== 'blocked') return;

    if (autoProceedingRef.current) {
      autoProceedingRef.current = false;
      return;
    }

    const dirty = !!checkRef.current();
    if (!dirty) {
      autoProceedingRef.current = true;
      blocker.proceed?.();
    } else {
      setOpen(true);
    }
  }, [blocker.state, blocker]);

  const confirm = useCallback(() => {
    setOpen(false);
    blocker.proceed?.();
  }, [blocker]);

  const cancel = useCallback(() => {
    setOpen(false);
    blocker.reset?.();
  }, [blocker]);

  // Hard navigations (refresh/close).
  useBeforeUnload(
    useCallback(e => {
      if (!checkRef.current()) return;
      e.preventDefault();
    }, [])
  );

  return { open, setOpen, confirm, cancel, active: true };
}

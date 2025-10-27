import { useCallback, useEffect, useState } from 'react';
import { useBlocker, useBeforeUnload } from 'react-router';

export function useUnsavedChanges(isBlocked: boolean) {
  const [open, setOpen] = useState(false);
  const blocker = useBlocker(isBlocked);

  useEffect(() => {
    if (blocker.state === 'blocked') {
      setOpen(true);
    }

    if (!isBlocked && open) {
      setOpen(false);
      if (blocker.state === 'blocked') blocker.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocker.state, isBlocked]);

  const confirm = useCallback(() => {
    setOpen(false);
    if (blocker.proceed) blocker.proceed();
  }, [blocker]);

  const cancel = useCallback(() => {
    setOpen(false);
    if (blocker.reset) blocker.reset();
  }, [blocker]);

  useBeforeUnload(
    useCallback(
      event => {
        if (!isBlocked) return;
        event.preventDefault();
        event.returnValue = '';
      },
      [isBlocked]
    )
  );

  return { open, setOpen, confirm, cancel, active: isBlocked };
}
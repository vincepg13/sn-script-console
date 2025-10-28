/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useState } from 'react';
import { useBlocker, useBeforeUnload } from 'react-router';

export function useUnsavedChanges(isBlocked: boolean) {
  const [open, setOpen] = useState(false)
  const blocker = useBlocker(isBlocked)

  useEffect(() => {
    setOpen(blocker.state === 'blocked')
  }, [blocker.state])

  const confirm = useCallback(() => {
    blocker.proceed?.()
  }, [blocker])

  const cancel = useCallback(() => {
    blocker.reset?.()
  }, [blocker])

  useBeforeUnload(
    useCallback((event) => {
      if (!isBlocked) return
      event.preventDefault()
      event.returnValue = ''
    }, [isBlocked])
  )

  return { open, setOpen, confirm, cancel, active: isBlocked }
}
import { useEffect, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export function GeneralConfirm({
  title,
  msg,
  continueCb,
  cancelCb,
}: {
  title?: string;
  msg?: string;
  continueCb?: () => void;
  cancelCb?: () => void;
}) {
  const [open, setOpen] = useState(!!msg);

  useEffect(() => {
    setOpen(!!msg);
  }, [msg]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title || 'Are you absolutely sure?'}</AlertDialogTitle>
          <AlertDialogDescription>{msg}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={cancelCb}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={continueCb}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

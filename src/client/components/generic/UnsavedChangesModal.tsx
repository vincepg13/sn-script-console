import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '../ui/button';

export function UnsavedChangesModal({
  open,
  setOpen,
  onConfirm,
  onCancel,
  title = 'You have unsaved changes',
  description = 'Navigating away will discard your unsaved changes. Continue?',
  cancelBtnText = 'Stay',
  confirmBtnText = 'Discard & Leave',
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  description?: string;
  cancelBtnText?: string;
  confirmBtnText?: string;
}) {
  return (
    <AlertDialog open={open} onOpenChange={v => (v ? setOpen(true) : onCancel())}>
      <AlertDialogContent className="text-accent-foreground">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelBtnText}</AlertDialogCancel>
          <Button variant="destructive" onClick={onConfirm}>
            {confirmBtnText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

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

export function ExternalChangesDialog({
  open,
  setOpen,
  onConfirm,
  onCancel,
  title = 'An External Change Was Detected',
  description = "The record you're editing has been updated. Please decide whether you want to load the external changes, or keep your changes",
  cancelBtnText = 'Sync external change',
  confirmBtnText = 'Keep my changes',
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
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="text-accent-foreground">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>{cancelBtnText}</AlertDialogCancel>
          <Button variant="destructive" onClick={onConfirm}>
            {confirmBtnText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

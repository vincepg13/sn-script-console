import { PackageX } from 'lucide-react';
import { errorHandler } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { deleteRecord, setPreference } from '@/lib/api';
import { LoadingSpinner } from '@/components/generic/LoadingSpinner';
import { useAbortableController } from '@/hooks/useAbortableController';
import {
  AlertDialog,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';

type DeletePackageDialogProps = {
  pkgName: string;
  pkgId: string;
  open: boolean;
  setOpen: (val: boolean) => void;
  onDelete: () => void;
};

export function DeletePackageDialog({ pkgName, pkgId, open, setOpen, onDelete }: DeletePackageDialogProps) {
  const { getSignal } = useAbortableController();

  const deleteMutation = useMutation({
    mutationKey: ['packageDelete', pkgId],
    mutationFn: async () => {
      const signal = getSignal();
      await deleteRecord('sys_user_preference', pkgId, signal);
      await setPreference('script_console.current_package', '', signal);
    },
    onSuccess: () => onDelete(),
    onError: e => errorHandler(e, 'Failed to delete package'),
    onSettled: () => setOpen(false),
  });

  if (!pkgId) return null;

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="text-accent-foreground">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. Package <strong>{pkgName}</strong> will be permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button variant="destructive" onClick={() => deleteMutation.mutate()}>
            {deleteMutation.isPending ? (
              <>
                <LoadingSpinner className="text-white" /> Deleting Package...
              </>
            ) : (
              <>
                <PackageX className="size-5" /> Delete Package
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

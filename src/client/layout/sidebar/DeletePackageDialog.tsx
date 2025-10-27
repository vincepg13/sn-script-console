import { PackageX } from 'lucide-react';
import { errorHandler } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { deleteRecord, setPreference } from '@/lib/api';
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
import { useState } from 'react';
import { LoadingSpinner } from '@/components/generic/LoadingSpinner';

type DeletePackageDialogProps = {
  pkgName: string;
  pkgId: string;
  open: boolean;
  setOpen: (val: boolean) => void;
  onDelete: () => void;
};

export function DeletePackageDialog({ pkgName, pkgId, open, setOpen, onDelete }: DeletePackageDialogProps) {
  const { getSignal } = useAbortableController();
  const [isDeleting, setIsDeleting] = useState(false);

  const deletePackage = async () => {
    const signal = getSignal();
    try {
      setIsDeleting(true);
      await deleteRecord('sys_user_preference', pkgId, signal);
      await setPreference('script_console.current_package', '', signal);
      onDelete();
    } catch (e) {
      errorHandler(e, 'Failed to delete package');
    } finally {
      setIsDeleting(false);
      setOpen(false);
    }
  };

  if (!pkgId) return null;

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. Package <strong>{pkgName}</strong> will be permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button variant="destructive" onClick={deletePackage}>
            {isDeleting ? <><LoadingSpinner className='text-white'/> Deleting Package...</> : <><PackageX className='size-5' /> Delete Package</>}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

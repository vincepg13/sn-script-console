import { toast } from 'sonner';
import { useRef } from 'react';
import { errorHandler } from '@/lib/utils';
import { packagePrefix } from '@/lib/config';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BadgePlus, Pencil } from 'lucide-react';
import { ScriptPackages } from '@/types/package';
import { useAppData } from '@/context/app-context';
import { createPackage, patchRecord } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCancelableFn } from '@/hooks/useAbortableController';
import { LoadingSpinner } from '@/components/generic/LoadingSpinner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type NewPackageDialogProps = {
  open: boolean;
  type?: 'create' | 'rename';
  pkgId?: string;
  pkgName?: string;
  pkgGuid?: string;
  setOpen: (val: boolean) => void;
  setCurrentPackage: (val: string) => void;
};

export function NewPackageDialog({
  open,
  type = 'create',
  pkgId,
  pkgName,
  pkgGuid,
  setOpen,
  setCurrentPackage,
}: NewPackageDialogProps) {
  const qc = useQueryClient();
  const isCreate = type === 'create';
  const idRef = useRef<HTMLInputElement>(null);
  const { config, setPackageData } = useAppData();

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isCreate) return;
    const name = e.target.value;
    idRef.current!.value = packagePrefix + name.trim().toLowerCase().replace(/\s+/g, '_');
  };

  const createPackageCancellable = useCancelableFn((signal, id: string, name: string) => {
    return isCreate
      ? createPackage(id, name, signal)
      : patchRecord('sys_user_preference', pkgGuid!, { description: name }, signal);
  });

  const packageMutation = useMutation({
    mutationKey: ['packageCreate', isCreate ? 'create' : 'rename', pkgGuid],
    mutationFn: ({ id, name }: { id: string; name: string }) => createPackageCancellable.run(id, name),
    onSuccess: (res, variables) => {
      const actionLabel = isCreate ? 'created' : 'renamed';
      toast.success(`Package "${variables.name}" ${actionLabel}`);

      if (isCreate)
        setPackageData({
          ...config.packageData,
          currentPackage: variables.id,
          packages: res.packages as ScriptPackages,
          packageItems: {},
        });

      qc.invalidateQueries({ queryKey: ['appConfig'] });
      setCurrentPackage(variables.id);
      setOpen(false);
    },
    onError: error => errorHandler(error, 'Failed to create package'),
  });

  const onCreatePackage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = (formData.get('name')! as string).trim();
    const id = idRef.current!.value;
    packageMutation.mutate({ id, name });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] text-accent-foreground">
        <DialogHeader>
          <DialogTitle>{isCreate ? 'New Package' : 'Rename Package'}</DialogTitle>
          <DialogDescription>
            {isCreate ? (
              'Create a new script package to organize your scripts.'
            ) : (
              <span className="text-red-500 dark:text-red-400 font-semibold">The package ID cannot be changed</span>
            )}
          </DialogDescription>
        </DialogHeader>
        <form id="new-package-form" onSubmit={onCreatePackage} autoComplete="off">
          <div className="grid gap-3">
            <div className="grid gap-2">
              <Label>Package Name</Label>
              <Input
                id="p-name"
                name="name"
                required
                onChange={onChangeName}
                maxLength={40}
                defaultValue={isCreate ? '' : pkgName}
              />
            </div>
            <div className="grid gap-2">
              <Label>Package ID</Label>
              <Input id="p-id" name="id" disabled ref={idRef} defaultValue={isCreate ? '' : pkgId} />
            </div>
          </div>
        </form>

        <DialogFooter>
          <Button type="submit" form="new-package-form" className="w-full" disabled={packageMutation.isPending}>
            {packageMutation.isPending ? (
              <>
                <LoadingSpinner /> {isCreate ? 'Creating Package...' : 'Renaming Package...'}
              </>
            ) : (
              <>
                {isCreate ? (
                  <>
                    <BadgePlus /> Create Package
                  </>
                ) : (
                  <>
                    <Pencil /> Rename Package
                  </>
                )}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

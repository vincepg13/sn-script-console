import { toast } from 'sonner';
import { Button } from '../ui/button';
import { PackageData } from '@/types/app';
import { errorHandler, removeItemFromPackage } from '@/lib/utils';
import { useLocation } from 'react-router';
import { useEffect, useState } from 'react';
import { PackageValue } from '@/types/package';
import { SimpleTooltip } from './SimpleTooltip';
import { LoadingSpinner } from './LoadingSpinner';
import { useAppData } from '@/context/app-context';
import { addToPackage } from '@/lib/api';
import { PackageMinus, PackagePlus } from 'lucide-react';
import { useAbortableController } from '../../hooks/useAbortableController';
import { useQueryClient } from '@tanstack/react-query';

type LocalVariant = 'outline' | 'secondary' | 'ghost' | null;
type AddToPackageProps = {
  table: string;
  path: string;
  currentPackage: string;
  variant?: LocalVariant;
  onAdded: (result: PackageValue) => void;
  getSignal: () => AbortSignal;
};
type RemoveFromPackageProps = {
  table: string;
  path: string;
  pkg: PackageData;
  onRemove: (result: PackageValue) => void;
  getSignal: () => AbortSignal;
};

export function ModifyPackage({ table, variant }: {table: string; variant?: LocalVariant}) {
  const qc = useQueryClient();
  const location = useLocation();
  const { getSignal } = useAbortableController();
  const { isInPackage, setPackageData, config } = useAppData();

  const [inPackage, setInPackage] = useState(isInPackage(table, location.pathname));
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInPackage(isInPackage(table, location.pathname));
  }, [isInPackage, table, location.pathname]);

  const onAddedToPackage = (result: PackageValue) => {
    setInPackage(true);
    toast.success('Item added to package');
    setPackageData({ ...config.packageData, packageItems: result });
    qc.invalidateQueries({ queryKey: ['appConfig'] });
  };

  const onRemovedFromPackage = (result: PackageValue) => {
    setInPackage(false);
    toast.success('Item removed from package');
    setPackageData({ ...config.packageData, packageItems: result });
    qc.invalidateQueries({ queryKey: ['appConfig'] });
  };

  if (!config.packageData.currentPackage) return null;

  return inPackage ? (
    <RemoveFromPackage
      table={table}
      path={location.pathname}
      pkg={config.packageData}
      onRemove={onRemovedFromPackage}
      getSignal={getSignal}
    />
  ) : (
    <AddToPackage
      table={table}
      variant={variant}
      path={location.pathname}
      currentPackage={config.packageData.currentPackage}
      onAdded={onAddedToPackage}
      getSignal={getSignal}
    />
  );
}

function AddToPackage({ table, variant, currentPackage, path, onAdded, getSignal }: AddToPackageProps) {
  const [saving, isSaving] = useState(false);

  const addPackageItem = async () => {
    try {
      isSaving(true);
      const result = await addToPackage(currentPackage, table, path, getSignal());
      onAdded?.(result.packageValue);
    } catch (error) {
      errorHandler(error, 'Failed to add item to package');
    } finally {
      isSaving(false);
    }
  };

  return (
    <SimpleTooltip content="Add to Package">
      <Button variant={variant} size="icon" onClick={addPackageItem} disabled={saving}>
        {saving ? <LoadingSpinner /> : <PackagePlus className="size-5" />}
      </Button>
    </SimpleTooltip>
  );
}

function RemoveFromPackage({ table, path, pkg, onRemove, getSignal }: RemoveFromPackageProps) {
  const [removing, isRemoving] = useState(false);

  const removePackageItem = async () => {
    try {
      isRemoving(true);
      const newPackageValue =  await removeItemFromPackage(table, path, pkg, getSignal());
      if (newPackageValue) onRemove(newPackageValue);
    } catch (error) {
      errorHandler(error, 'Failed to remove item from package');
    } finally {
      isRemoving(false);
    }
  };

  return (
    <SimpleTooltip content="Remove from Package">
      <Button variant="trash" size="icon" disabled={removing} onClick={removePackageItem}>
        {removing ? <LoadingSpinner /> : <PackageMinus className="size-5" />}
      </Button>
    </SimpleTooltip>
  );
}

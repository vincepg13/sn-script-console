import { patchRecord } from '@/lib/api';
import { PackageData } from '@/types/app';
import { PackageGroup } from './PackageGroup';
import { PackageValue } from '@/types/package';
import { useDebouncedFn } from '@/hooks/useDebounceFn';
import { errorHandler, removeItemFromPackage } from '@/lib/utils';
import { LoadingSpinner } from '@/components/generic/LoadingSpinner';
import { useAbortableController } from '@/hooks/useAbortableController';
import { useMemo, useState, useEffect, useCallback, startTransition, useDeferredValue } from 'react';


type PackageItemProps = {
  pkg: PackageData;
  items: PackageValue;
  changing: boolean;
  resync: () => Promise<void>;
  setPackage: (data: PackageData) => void;
};


//Hook to manage open/closed state map for package tables
type OpenMap = Record<string, boolean>;

function useOpenMap(items: PackageValue) {
  const initial = useMemo<OpenMap>(() => {
    const map: OpenMap = {};
    for (const [tableName, table] of Object.entries(items ?? {})) {
      map[tableName] = !!table.isActive;
    }
    return map;
  }, [items]);

  const [openMap, setOpenMap] = useState<OpenMap>(initial);
  useEffect(() => setOpenMap(initial), [initial]); //eslint-disable-line

  const setOpen = useCallback((tableName: string, open: boolean) => {
    setOpenMap(prev => (prev[tableName] === open ? prev : { ...prev, [tableName]: open }));
  }, []);

  return { openMap, setOpen };
}

export function PackageMenu({ pkg, items, changing, resync, setPackage }: PackageItemProps) {
  const { getSignal } = useAbortableController();
  const [inRemoval, setInRemoval] = useState('');

  const { openMap, setOpen } = useOpenMap(items || {});

  const persistPackageItems = useDebouncedFn((updatedItems: PackageValue) => {
    const pref = pkg.packages.find(p => p.id === pkg.currentPackage);
    if (!pref) return;

    const body = { value: JSON.stringify(updatedItems) };
    patchRecord('sys_user_preference', pref.guid, body, getSignal());
  }, 250);

  const onActiveChange = useCallback(
    (tableName: string, open: boolean) => {
      setOpen(tableName, open);

      startTransition(() => {
        const updatedItems: PackageValue = { ...pkg.packageItems };
        const cur = updatedItems[tableName] || { items: [], label: tableName, isActive: false };
        updatedItems[tableName] = { ...cur, isActive: open };

        setPackage({ ...pkg, packageItems: updatedItems });
        persistPackageItems(updatedItems);
      });
    },
    [pkg, setOpen, setPackage, persistPackageItems]
  );

  const removePackageItem = useCallback(
    async (table: string, path: string) => {
      try {
        setInRemoval(path);
        const newPackageValue = await removeItemFromPackage(table, path, pkg, getSignal());
        setPackage({ ...pkg, packageItems: newPackageValue ?? {} });
        resync();
      } catch (error) {
        errorHandler(error, 'Failed to remove item from package');
      } finally {
        setInRemoval('');
      }
    },
    [pkg, getSignal, setPackage, resync]
  );

  const transformed = useMemo(() => {
    if (!items) return [];
    return Object.entries(items)
      .sort(([, a], [, b]) => a.label.localeCompare(b.label))
      .map(([tableName, table]) => ({
        tableName,
        items: table.items,
        tableLabel: table.label,
      }));
  }, [items]);

  const deferredTransformed = useDeferredValue(transformed);

  if (!items || !pkg) return null;

  if (changing) {
    return (
      <div className="flex gap-2 items-center px-4 py-2">
        <LoadingSpinner className="size-4" />
        <span className="text-sm text-muted-foreground">Loading package items...</span>
      </div>
    );
  }

  return (
    <PackageGroup
      items={deferredTransformed}
      openMap={openMap}
      inRemoval={inRemoval}
      onActiveChange={onActiveChange}
      removeItem={removePackageItem}
    />
  );
}


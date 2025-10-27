/* eslint-disable react-hooks/set-state-in-effect */
import { createContext, useContext, useMemo, useState, useCallback, useEffect, ReactNode } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAbortableController } from '@/hooks/useAbortableController';
import { changePackage, refreshApplication } from '@/lib/api';
import { errorHandler } from '@/lib/utils';
import { AppConfig, Preferences } from '@/types/app';
import { PackageValue } from '@/types/package';

type AppDataContextValue = {
  config: AppConfig;
  setConfig: (patch: Partial<AppConfig> | ((prev: AppConfig) => AppConfig)) => void;
  setPackageData: (
    patch: Partial<AppConfig['packageData']> | ((prev: AppConfig['packageData']) => AppConfig['packageData'])
  ) => void;
  isInPackage: (table: string, path: string) => boolean;
  setLocalPreference: <K extends keyof Preferences>(name: K, value: Preferences[K]) => void;
};

type AppActionsContextValue = {
  refreshScope: () => Promise<void>;
  changePackage: (pkgId: string) => Promise<PackageValue>;
  isChangingPackage: boolean;
};

//Context for data and actions separately to avoid unnecessary re-renders.
const AppDataContext = createContext<AppDataContextValue | null>(null);
const AppActionsContext = createContext<AppActionsContextValue | null>(null);

export function AppProvider({ config, children }: { config: AppConfig; children: ReactNode }) {
  const qc = useQueryClient();
  const { getSignal } = useAbortableController();

  /* ------------------------------- State -------------------------------- */
  const [state, setState] = useState<AppConfig>(config);
  useEffect(() => setState(config), [config]);

  /* ------------------------------- Updaters ------------------------------ */

  const setConfig = useCallback<AppDataContextValue['setConfig']>(patch => {
    setState(prev =>
      typeof patch === 'function' ? (patch as (p: AppConfig) => AppConfig)(prev) : { ...prev, ...patch }
    );
  }, []);

  const setPackageData = useCallback<AppDataContextValue['setPackageData']>(
    patch => {
      setConfig(prev => {
        const nextPackageData =
          typeof patch === 'function'
            ? (patch as (p: AppConfig['packageData']) => AppConfig['packageData'])(prev.packageData)
            : { ...prev.packageData, ...patch };

        return { ...prev, packageData: nextPackageData };
      });
    },
    [setConfig]
  );

  const setLocalPreference = useCallback<AppDataContextValue['setLocalPreference']>(
    (name, value) => {
      setConfig(prev => ({
        ...prev,
        preferences: { ...prev.preferences, [name]: value },
      }));
    },
    [setConfig]
  );

  const isInPackage = useCallback<AppDataContextValue['isInPackage']>(
    (table, path) => {
      const { packageItems } = state.packageData;
      if (!packageItems) return false;
      const tableItems = packageItems[table];
      if (!tableItems) return false;
      return tableItems.items.some(item => item.path === path);
    },
    [state.packageData]
  );

  /* ------------------------------- Actions ------------------------------ */

  const refreshScope = useCallback(async () => {
    try {
      const { scope, updateSet } = await refreshApplication();
      setConfig({ scope, updateSet });
      qc.invalidateQueries({ queryKey: ['widgetData'] });
      qc.invalidateQueries({ queryKey: ['scriptData'] });
    } catch (error) {
      errorHandler(error, 'Failed to change application');
    }
  }, [qc, setConfig]);

  const changePackageMutation = useMutation<PackageValue, unknown, string>({
    mutationFn: async pkgId => {
      const signal = getSignal();
      return changePackage(pkgId, signal);
    },
    onSuccess: (newItems, pkgId) => {
      setPackageData(prev => ({
        ...prev,
        currentPackage: pkgId,
        packageItems: newItems,
      }));
    },
    onError: e => errorHandler(e, 'Failed to change package'),
  });

  const changePackageFn = useCallback(
    (pkgId: string) => changePackageMutation.mutateAsync(pkgId),
    [changePackageMutation]
  );

  /* ------------------------------- Context Values ----------------------- */

  const dataValue = useMemo<AppDataContextValue>(
    () => ({
      config: state,
      setConfig,
      setPackageData,
      setLocalPreference,
      isInPackage,
    }),
    [state, setConfig, setPackageData, setLocalPreference, isInPackage]
  );

  const actionsValue = useMemo<AppActionsContextValue>(
    () => ({
      refreshScope,
      changePackage: changePackageFn,
      isChangingPackage: changePackageMutation.isPending,
    }),
    [refreshScope, changePackageFn, changePackageMutation.isPending]
  );

  /* ------------------------------- Provider Tree ------------------------ */

  return (
    <AppDataContext.Provider value={dataValue}>
      <AppActionsContext.Provider value={actionsValue}>{children}</AppActionsContext.Provider>
    </AppDataContext.Provider>
  );
}

// Custom hooks for consuming contexts based on what's necessary.
export function useAppData(): AppDataContextValue {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within <AppProvider>');
  return ctx;
}

export function useAppActions(): AppActionsContextValue {
  const ctx = useContext(AppActionsContext);
  if (!ctx) throw new Error('useAppActions must be used within <AppProvider>');
  return ctx;
}

export function useAppConfig() {
  const data = useAppData();
  const actions = useAppActions();
  return { ...data, ...actions };
}

import { getWidget, setPreference } from '@/lib/api';
import { useAppData } from './app-context';
import { Link, useParams } from 'react-router';
import { SnCodeMirrorHandle } from 'sn-shadcn-kit/script';
import { DependencyCounts, WidgetRes } from '@/types/widget';
import { GeneralLoader } from '@/components/generic/GeneralLoader';
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  RefObject,
  useRef,
  useEffectEvent,
} from 'react';
import { openWidgetColumnsKey } from '@/lib/config';

type SaveData = Record<string, string>;

interface WidgetContextValue {
  widget: WidgetRes;
  isFetching: boolean;
  toggleFieldVisibility: (fieldName: string) => void;

  saveData: SaveData;
  setFieldValue: (fieldName: keyof WidgetRes['fields'], value: string) => void;

  getScriptRef: (fieldName: string) => RefObject<SnCodeMirrorHandle | null>;
  setScriptRef: (fieldName: string, ref: SnCodeMirrorHandle | null) => void;

  stagedChanges: boolean;
  setStagedChanges: (staged: boolean) => void;
  applySavedChanges: (changes: Partial<SaveData>) => void;
  patchDependencyCounts: (counts: DependencyCounts) => void;
}

const WidgetContext = createContext<WidgetContextValue | undefined>(undefined);

export const widgetQuery = (widgetId: string) => ({
  queryKey: ['widgetData', widgetId],
  placeholderData: keepPreviousData,
  refetchOnWindowFocus: true,
  queryFn: async ({ signal }: { signal: AbortSignal }) => await getWidget(widgetId, signal),
});

export const WidgetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { id } = useParams<{ id: string }>();
  const qc = useQueryClient();
  const widgetId = id ?? '';
  const scriptRefsRef = useRef<Record<string, RefObject<SnCodeMirrorHandle | null>>>({});

  const getScriptRef = useCallback((fieldName: string) => {
    let r = scriptRefsRef.current[fieldName];
    if (!r) {
      r = { current: null } as RefObject<SnCodeMirrorHandle | null>;
      scriptRefsRef.current[fieldName] = r;
    }
    return r;
  }, []);

  // Write to the ref’s current (used by editors’ onReady)
  const setScriptRef = useCallback(
    (fieldName: string, ref: SnCodeMirrorHandle | null) => {
      getScriptRef(fieldName).current = ref;
    },
    [getScriptRef]
  );

  // Clear registry when navigating to a different widget
  useEffect(() => {
    scriptRefsRef.current = {};
  }, [widgetId]);

  const { data, isLoading, isFetching, error } = useQuery({
    ...widgetQuery(widgetId),
    refetchOnMount: 'always',
    staleTime: 0,
    gcTime: 0,
    enabled: Boolean(id),
  });

  const [saveData, setSaveData] = useState<SaveData>({});
  const [stagedChanges, setStagedChanges] = useState(false);

  const { config, setConfig, setPackageData } = useAppData();
  useEffect(() => {
    if (data && data.scopeChange) {
      const sc = data.scopeChange;

      setConfig(prev =>
        prev.scope.value === sc.scope.value ? prev : { ...prev, scope: sc.scope, updateSet: sc.updateSet }
      );
      qc.invalidateQueries({ queryKey: ['appConfig'] });
    }
  }, [data, qc, setConfig]);

  const scopeChangeEvent = useEffectEvent(() => {
    if (data?.scopeChange) {
      if (data.scopeChange.scope.value !== config.scope.value) {
        const sc = data.scopeChange;

        setConfig(prev =>
          prev.scope.value === sc.scope.value ? prev : { ...prev, scope: sc.scope, updateSet: sc.updateSet }
        );
      }
    }
  });
  useEffect(() => scopeChangeEvent(), [isFetching]);

  useEffect(() => {
    if (data && data.packageValue) {
      const pv = data.packageValue;
      setPackageData(prev => ({ ...prev, packageItems: pv }));
    }
  }, [data, setPackageData]);

  // normalization for comparisons
  const normalizeForCompare = useCallback(
    (name: keyof WidgetRes['fields'], raw: unknown) => {
      let t = String(raw ?? '');

      // 1) EOLs: turn CRLF or lone CR into LF
      t = t.replace(/\r\n?/g, '\n');

      // 2) Strip trailing spaces per line (optional but you already do this)
      t = t.replace(/[ \t]+$/gm, '');

      // 3) Drop BOM if present (some editors strip it)
      t = t.replace(/^\uFEFF/, '');

      // 4) Normalize final newline policy: choose NONE (or choose exactly one)
      //    Pick one and be consistent across both sides.
      t = t.replace(/\n+$/g, '');

      // 5) (Your special-case) compact HTML gaps if desired
      const fieldType = data?.fields[name]?.type;
      if (fieldType && /html|template/i.test(String(fieldType))) {
        t = t.replace(/>\s+</g, '><');
      }

      return t;
    },
    [data]
  );

  // Stage a single field
  const setFieldValue = useCallback(
    (fieldName: keyof WidgetRes['fields'], value: string) => {
      if (!data) return;

      setSaveData(prev => {
        const next = { ...prev };
        const key = String(fieldName);

        const serverVal = normalizeForCompare(fieldName, data.fields[fieldName]?.value ?? '');
        const stagedVal = normalizeForCompare(fieldName, value);

        if (stagedVal === serverVal) {
          delete next[key];
        } else {
          next[key] = value;
        }

        setStagedChanges(Object.keys(next).length > 0);
        return next;
      });
    },
    [data, normalizeForCompare]
  );

  // Reset staged changes immediately when navigating to a different widget
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSaveData({});
    setStagedChanges(false);
  }, [widgetId]);

  const toggleFieldVisibility = useCallback(
    (fieldName: string) => {
      qc.setQueryData<WidgetRes>(['widgetData', widgetId], prev => {
        if (!prev) return prev as unknown as WidgetRes;

        const next = prev.toggleButtons?.map(btn =>
          btn.field === fieldName ? { ...btn, visible: !btn.visible } : btn
        );
        const visible = next?.filter(b => b.visible).map(btn => btn.field) ?? [];
        setPreference(openWidgetColumnsKey, visible.join(','));

        return { ...prev, toggleButtons: next };
      });
    },
    [qc, widgetId]
  );

  const patchDependencyCounts = useCallback(
    (counts: DependencyCounts) => {
      qc.setQueryData<WidgetRes>(['widgetData', widgetId], prev => {
        if (!prev) return prev as unknown as WidgetRes;
        return { ...prev, dependencyCounts: counts };
      });
    },
    [qc, widgetId]
  );

  // After a successful save, patch cache + remove just-saved keys from delta
  const applySavedChanges = useCallback(
    (changes: Partial<SaveData>) => {
      const key = ['widgetData', widgetId];

      qc.setQueryData<WidgetRes>(key, prev => {
        if (!prev) return prev as unknown as WidgetRes;
        const nextFields = { ...prev.fields };
        (Object.entries(changes) as Array<[string, string | undefined]>).forEach(([name, entry]) => {
          if (entry) nextFields[name] = { ...nextFields[name], value: entry };
        });
        return { ...prev, fields: nextFields };
      });

      setSaveData(prev => {
        if (!prev) return prev;
        const next = { ...prev };
        for (const name of Object.keys(changes)) delete next[name];
        setStagedChanges(Object.keys(next).length > 0);
        return next;
      });
    },
    [qc, widgetId]
  );

  if (!id) return <div>Invalid widget ID</div>;
  if (isLoading) return <GeneralLoader />;

  if (error || !data) {
    return (
      <div className="flex items-center px-4 py-16 h-[70vh] sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="w-full space-y-6 text-center">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Oops! Widget Lost in Cyberspace</h1>
            <p className="text-gray-500">The widget your are looking for is either missing or inaccessible.</p>
          </div>
          <Link
            to="/widget_editor?recent=true"
            className="inline-flex h-10 items-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
          >
            Select another widget
          </Link>
        </div>
      </div>
    );
  }

  return (
    <WidgetContext.Provider
      value={{
        saveData,
        widget: data,
        stagedChanges,
        isFetching,
        getScriptRef,
        setScriptRef,
        setFieldValue,
        applySavedChanges,
        patchDependencyCounts,
        toggleFieldVisibility,
        setStagedChanges,
      }}
    >
      {children}
    </WidgetContext.Provider>
  );
};

export function useWidget() {
  const ctx = useContext(WidgetContext);
  if (!ctx) throw new Error('useWidget must be used within a WidgetProvider');
  return ctx;
}

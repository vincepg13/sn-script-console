import { isAxiosError } from 'axios';
import { getScriptData } from '@/lib/api';
import { useAppData } from './app-context';
import { ScriptTableItems } from '@/types/app';
import { ScriptMetadata } from '@/types/script';
import { fallbackScriptTables } from '@/lib/config';
import { useNavigate, useParams } from 'react-router';
import { useSharedRouteConfig } from '@/hooks/useSharedConfig';
import { SnAmbMessage, useRecordWatch } from 'sn-shadcn-kit/amb';
import { GeneralLoader } from '@/components/generic/GeneralLoader';
import { ESVersion, SnCodeMirrorHandle } from 'sn-shadcn-kit/script';
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { createContext, RefObject, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

interface ScriptContextValue {
  metadata: ScriptMetadata;
  serverVal: string;
  stagedChanges: boolean;
  canWrite: boolean;
  esVersion: ESVersion;
  guid: string;
  isFetching: boolean;
  scriptTables: ScriptTableItems;
  editorRef: RefObject<SnCodeMirrorHandle | null>;
  refetch: () => void;
  getCurrentValue: () => string;
  onEditorChange: (val: string) => void;
  setStagedChanges: (v: boolean) => void;
}

export const normalize = (s: string) =>
  String(s ?? '')
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+$/gm, '')
    .trim();

const ScriptContext = createContext<ScriptContextValue | undefined>(undefined);

export const scriptDataQuery = (table: string, guid: string, field: string) => ({
  queryKey: ['scriptData', table, guid, field],
  placeholderData: keepPreviousData,
  retry: 0,
  refetchOnWindowFocus: true,
  queryFn: async ({ signal }: { signal: AbortSignal }) => await getScriptData(table, guid, field, signal),
  enabled: Boolean(table && guid && field),
});

export const ScriptProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [stagedChanges, setStagedChanges] = useState(false);

  const { config } = useAppData();
  const { table, id } = useParams<{ table: string; id: string }>();

  const scriptTables = useMemo(() => config?.scriptTables || fallbackScriptTables, [config?.scriptTables]);
  const targetTable = scriptTables[table!];
  const targetField = targetTable?.field;

  const { data, isLoading, error, isFetching, refetch } = useQuery(scriptDataQuery(table!, id!, targetField));
  useSharedRouteConfig(data, isFetching, qc);

  const patchScriptInCache = (nextScript: string, updatedBy: string, updatedOn: string) => {
    qc.setQueryData<Awaited<ReturnType<typeof getScriptData>>>(['scriptData', table, id, targetField], prev => {
      if (!prev) return prev;
      if (normalize(prev.script ?? '') === normalize(nextScript)) return prev;
      return {
        ...prev,
        script: nextScript,
        metadata: { ...prev.metadata, updater: { ...prev.metadata.updater, name: updatedBy, updated: updatedOn } },
      };
    });
  };

  const serverVal = data?.script || '';
  const timerRef = useRef<number | null>(null);
  const editorRef = useRef<SnCodeMirrorHandle | null>(null);
  const serverNorm = useMemo(() => normalize(serverVal), [serverVal]);

  useEffect(() => {
    // editorRef.current?.setValue?.(serverVal);
    const editorVal = editorRef.current?.getRawValue();
    if (!editorVal) return;

    const same = normalize(editorVal) === serverNorm;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStagedChanges(!same);
  }, [serverNorm]);

  useEffect(() => {
    if ((table && id && !targetField) || (isAxiosError(error) && error.status == 500)) {
      navigate(`/form/${table}/${id}`, { replace: true });
      return;
    }
    if (isAxiosError(error) && error.status == 404) {
      navigate('/invalid', { replace: true });
      return;
    }
  }, [table, id, targetField, navigate, error]);

  const getCurrentValue = () => editorRef.current?.getValue?.() ?? '';

  const onEditorChange = useCallback(
    (val: string, bounceTime?: number) => {
      if (!stagedChanges) setStagedChanges(true);

      // debounce the expensive compare
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        const same = normalize(val) === serverNorm;
        setStagedChanges(!same);
      }, bounceTime ?? 0);
    },
    [serverNorm, stagedChanges]
  );

  if (!table || !id) return null;
  if (isLoading) return <GeneralLoader />;

  if (error) {
    if (isAxiosError(error) && (error.status == 500 || error.status == 404)) return null;
    console.error('Error loading script data', error);
    throw new Error('Error loading script data');
  }

  if (!data) return null;

  const { canWrite, metadata, esVersion } = data;
  const handleAmbMessage = (e: SnAmbMessage) => {
    if (e && e.data && e.data.changes) {
      if (e.data.record && e.data.changes.includes(targetField)) {
        const target = e.data.record[targetField].value ?? '';
        patchScriptInCache(
          target,
          e.data.record.sys_updated_by.display_value,
          e.data.record.sys_updated_on.display_value
        );
        // qc.invalidateQueries({ queryKey: ['scriptData', table, id, targetField] });
      }
    }
  };

  return (
    <ScriptContext.Provider
      value={{
        canWrite,
        metadata,
        serverVal,
        esVersion,
        stagedChanges,
        editorRef,
        guid: id!,
        isFetching,
        scriptTables,
        onEditorChange,
        getCurrentValue,
        refetch,
        setStagedChanges,
      }}
    >
      {children}
      <MountScriptWatcher key={`${table}:${id!}`} table={table} guid={id!} cb={handleAmbMessage} />
    </ScriptContext.Provider>
  );
};

function MountScriptWatcher({ table, guid, cb }: { table: string; guid: string; cb: (e: SnAmbMessage) => void }) {
  useRecordWatch(table, 'sys_id=' + guid, cb);
  return null;
}

export function useScript() {
  const ctx = useContext(ScriptContext);
  if (!ctx) throw new Error('useScript must be used within a ScriptProvider');
  return ctx;
}

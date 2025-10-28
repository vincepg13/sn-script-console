import { useAppData } from '@/context/app-context';
import { normalize, useScript } from '@/context/script-context';
import { useEffect, useEffectEvent, useMemo, useState } from 'react';
import { setEsVersion, SnScriptEditor, SnScriptFieldType } from 'sn-shadcn-kit/script';
import { ExternalChangesDialog } from '../generic/ExternalChangesDialog';

export function ScriptField() {
  const {
    metadata,
    canWrite,
    serverVal,
    editorRef,
    esVersion,
    isFetching,
    stagedChanges,
    onEditorChange,
    setStagedChanges,
  } = useScript();

  const { table, field, type, updater } = metadata;

  const { config } = useAppData();
  const { esLintConfig, preferences, prettierConfig } = config;

  const [val, setVal] = useState(serverVal);
  const [warnExternalChange, setWarnExternalChange] = useState(false);

  const externalChangeEvent = useEffectEvent((externalValue: string) => {
    const editorVal = editorRef.current?.getRawValue();
    if (!editorVal) return;

    if (stagedChanges && editorVal) {
      if (normalize(editorVal) !== normalize(externalValue)) {
        return setWarnExternalChange(true);
      }
    }
    setVal(externalValue);
  });
  useEffect(() => externalChangeEvent(serverVal), [serverVal]);

  const lintingSettings = useMemo(() => {
    return setEsVersion(esVersion, esLintConfig!);
  }, [esLintConfig, esVersion]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <SnScriptEditor
        height="100%"
        snType={type as SnScriptFieldType}
        table={table}
        theme={preferences?.theme || 'atom'}
        lineWrapping={false}
        readonly={!canWrite || isFetching}
        fieldName={field}
        content={val}
        esLintConfig={lintingSettings}
        prettierOptions={prettierConfig ?? undefined}
        parentClasses="block h-full min-h-0"
        cmContainerClasses="h-full min-h-0 overflow-auto"
        onChange={onEditorChange}
        onReady={r => (editorRef.current = r)}
        customToolbar={null}
      />
      <ExternalChangesDialog
        description={`The record you're editing has been updated by ${updater.name} at ${updater.updated}. Please decide whether you want to load the external changes, or keep your changes`}
        open={warnExternalChange}
        setOpen={setWarnExternalChange}
        onConfirm={() => {
          setStagedChanges(true);
          setWarnExternalChange(false);
        }}
        onCancel={() => {
          setVal(serverVal);
        }}
      />
    </div>
  );
}

import { toast } from 'sonner';
import { Link } from 'react-router';
import { Button } from '../ui/button';
import { globalSave } from '@/lib/api';
import { errorHandler } from '@/lib/utils';
import { instanceURI } from '@/lib/config';
import { Separator } from '../ui/separator';
import { useCallback, useState } from 'react';
import { ToolbarButtons } from './ToolbarButtons';
import { useScript } from '@/context/script-context';
import { SimpleTooltip } from '../generic/SimpleTooltip';
import { useSaveShortcut } from '@/hooks/useSaveShortcut';
import { RecordVersions } from '../generic/RecordVersions';
import { LoadingSpinner } from '../generic/LoadingSpinner';
import { History, Save, SquareArrowOutUpRight } from 'lucide-react';
import { ScriptPickers } from './ScriptPickers';
import { useAppConfig } from '@/context/app-context';

export function ScriptHeader() {
  const [saving, setSaving] = useState(false);
  const [versioning, setVersioning] = useState(false);

  const { editorRef, canWrite, metadata, refetch } = useScript();
  const { table, guid, field, display } = metadata;
  const { refreshScope, config } = useAppConfig();
  const { prettierConfig } = config;

  const onSave = useCallback(async () => {
    if (prettierConfig?.formatOnSave) await editorRef.current?.format?.();
    const value = editorRef.current!.getRawValue();

    try {
      setSaving(true);
      const res = await globalSave(table, guid, { [field]: { name: field, value } });

      if (res.isActionAborted === false) {
        toast.success('Script saved');
        refetch();
      } else {
        toast.error('Save aborted by server');
        refreshScope();
      }
    } catch (error) {
      errorHandler(error, 'not saved');
    } finally {
      setSaving(false);
    }
  }, [prettierConfig?.formatOnSave, editorRef, table, guid, field, refetch, refreshScope]);

  useSaveShortcut({ enabled: canWrite, onTrigger: onSave });

  return (
    <div className="flex gap-2 px-4">
      <ScriptPickers table={table} guid={guid} display={display} />
      <ToolbarButtons canWrite={canWrite} editorRef={editorRef} />
      <Separator orientation="vertical" className="h-9!" />
      <SimpleTooltip content="View versions">
        <Button variant="outline" size="icon" onClick={() => setVersioning(true)}>
          <History />
        </Button>
      </SimpleTooltip>
      <SimpleTooltip content="Open in instance">
        <Button variant="outline" size="icon" asChild>
          <Link
            to={`${instanceURI}/${table}.do?sys_id=${guid}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center"
          >
            <SquareArrowOutUpRight />
          </Link>
        </Button>
      </SimpleTooltip>
      {canWrite && (
        <Button onClick={onSave}>
          {saving ? <LoadingSpinner className="text-primary-foreground" /> : <Save />} Save
        </Button>
      )}
      <RecordVersions
        table={table}
        recordId={guid}
        open={versioning}
        editable={canWrite}
        queryKey={['scriptData', table, guid, field]}
        setOpen={setVersioning}
      />
    </div>
  );
}

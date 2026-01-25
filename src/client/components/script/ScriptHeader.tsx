import { toast } from 'sonner';
import { Button } from '../ui/button';
import { globalSave } from '@/lib/api';
import { errorHandler } from '@/lib/utils';
import { Separator } from '../ui/separator';
import { useCallback, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { ToolbarButtons } from './ToolbarButtons';
import { useScript } from '@/context/script-context';
import { SnSimpleTooltip } from 'sn-shadcn-kit/ui';
import { useSaveShortcut } from 'sn-shadcn-kit/hooks';
import { RecordVersions } from '../generic/RecordVersions';
import { SnLoadingSpinner } from 'sn-shadcn-kit/ui';
import { History, Save } from 'lucide-react';
import { ScriptPickers } from './ScriptPickers';
import { useAppConfig } from '@/context/app-context';
import { OpenInInstance } from '../generic/OpenInInstance';

export function ScriptHeader() {
  const [versioning, setVersioning] = useState(false);

  const { editorRef, canWrite, metadata, refetch } = useScript();
  const { table, guid, field, display } = metadata;
  const { refreshScope, config } = useAppConfig();
  const { prettierConfig } = config;

  const saveMutation = useMutation({
    mutationKey: ['scriptSave', table, guid, field],
    mutationFn: (value: string) => globalSave(table, guid, { [field]: { name: field, value } }),
    onSuccess: res => {
      if (res.isActionAborted === false) {
        toast.success('Script saved');
        refetch();
      } else {
        toast.error('Save aborted by server');
        refreshScope();
      }
    },
    onError: error => errorHandler(error, 'not saved'),
  });

  const onSave = useCallback(async () => {
    if (prettierConfig?.formatOnSave) {
      await editorRef.current?.format?.();
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    const value = editorRef.current!.getRawValue();
    saveMutation.mutate(value);
  }, [prettierConfig?.formatOnSave, editorRef, saveMutation]);

  useSaveShortcut({ enabled: canWrite, onTrigger: onSave });

  return (
    <div className="flex gap-2 px-4">
      <ScriptPickers table={table} guid={guid} display={display} />
      <ToolbarButtons canWrite={canWrite} editorRef={editorRef} />
      <Separator orientation="vertical" className="h-9!" />
      <SnSimpleTooltip content="View versions">
        <Button variant="outline" size="icon" onClick={() => setVersioning(true)}>
          <History />
        </Button>
      </SnSimpleTooltip>
      <OpenInInstance table={table} guid={guid} />
      {canWrite && (
        <Button onClick={onSave}>
          {saveMutation.isPending ? <SnLoadingSpinner className="text-primary-foreground" /> : <Save />} Save
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

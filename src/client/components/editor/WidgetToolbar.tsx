import { toast } from 'sonner';
import { Button } from '../ui/button';
import { errorHandler } from '@/lib/utils';
import { useNavigate } from 'react-router';
import { WidgetPicker } from './WidgetPicker';
import { WidgetOptions } from './WidgetOptions';
import { WidgetDropdown } from './WidgetDropdown';
import { NewWidgetModal } from './NewWidgetModal';
import { useAppData } from '@/context/app-context';
import { useMutation } from '@tanstack/react-query';
import { deleteRecord, saveWidget } from '@/lib/api';
import { useWidget } from '@/context/widget-context';
import { useSaveShortcut } from 'sn-shadcn-kit/hooks';
import { BadgePlus, Save, Trash2 } from 'lucide-react';
import { ModifyPackage } from '../generic/ModifyPackage';
import { WidgetDependencies } from './WidgetDependencies';
import { SnLoadingSpinner } from 'sn-shadcn-kit/ui';
import { SnGeneralConfirm } from 'sn-shadcn-kit/ui';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

export function WidgetToolbar({ setSaveFlag }: { setSaveFlag?: (s: boolean) => void }) {
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState('');

  const { widget, saveData, isFetching, applySavedChanges, getScriptRef, toggleFieldVisibility } = useWidget();
  const { canWrite, canDelete } = widget.security;
  const controllerRef = useRef(new AbortController());

  const { prettierConfig } = useAppData().config;

  const resetController = () => {
    controllerRef.current.abort();
    controllerRef.current = new AbortController();
  };

  const deleteMutation = useMutation({
    mutationKey: ['widgetDelete', widget.guid],
    mutationFn: () => deleteRecord('sp_widget', widget.guid, controllerRef.current.signal),
    onMutate: () => resetController(),
    onSuccess: () => {
      toast.success('Widget deleted');
      navigate('/widget_editor?recent=true');
    },
    onError: e => errorHandler(e, 'Failed to delete widget'),
  });

  const saveMutation = useMutation({
    mutationKey: ['widgetSave', widget.guid],
    mutationFn: async () => {
      resetController();
      const localSaveData = { ...saveData };

      if (prettierConfig?.formatOnSave) {
        const scriptFields = ['script', 'client_script', 'template', 'css', 'link'] as const;

        for (const fieldName of scriptFields) {
          const visible = widget.toggleButtons.find(b => b.field === fieldName && b.visible);
          if (visible) {
            const scriptRef = getScriptRef(fieldName).current;
            await scriptRef?.format?.();
            localSaveData[fieldName] = scriptRef?.getRawValue() || '';
          }
        }

        //Give CM debounce time to finish formatting
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      const result = await saveWidget(widget.guid, localSaveData, controllerRef.current.signal);
      return { result, localSaveData };
    },
    onMutate: () => {
      setSaveFlag?.(true);
    },
    onSuccess: ({ result, localSaveData }) => {
      if (result) {
        toast.success('Widget saved');
        applySavedChanges(localSaveData);
      } else {
        setSaveFlag?.(false);
      }
    },
    onError: e => {
      setSaveFlag?.(false);
      errorHandler(e, 'Failed to save widget');
    },
  });

  const processDelete = useCallback(() => {
    deleteMutation.mutate();
  }, [deleteMutation]);

  const onSave = useCallback(() => {
    saveMutation.mutate();
  }, [saveMutation]);

  useSaveShortcut({ enabled: canWrite, onTrigger: onSave });

  useEffect(() => {
    return () => controllerRef.current.abort();
  }, []);

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <div>
        <WidgetPicker v={widget.guid} dv={widget.fields.name.display_value || ''} />
      </div>
      <ModifyPackage table="sp_widget" />
      <div className="flex gap-2 items-center">
        {widget.toggleButtons
          .filter(b => !b.visible)
          .map(b => (
            <Button key={b.field} variant="outline" onClick={() => toggleFieldVisibility(b.field)}>
              <BadgePlus />
              {b.label}
            </Button>
          ))}
        <WidgetOptions
          key={widget.guid}
          widget={widget.guid}
          options={widget.fields.option_schema.value || '[]'}
          editable={canWrite}
        />
        <WidgetDependencies />
        <WidgetDropdown widget={widget} />
      </div>
      <div className="ml-auto flex gap-2 items-center">
        {isFetching && <SnLoadingSpinner />}
        {canDelete && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() =>
                  setConfirm('This action will delete this widget and its dependencies. Click continue to proceed.')
                }
                variant="trash"
                size="icon"
              >
                <Trash2 />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete this widget</TooltipContent>
          </Tooltip>
        )}
        <NewWidgetModal
          tooltip="Create a new widget"
          button={
            <Button size="icon">
              <BadgePlus />
            </Button>
          }
        />
        {canWrite && (
          <Button onClick={onSave} disabled={saveMutation.isPending}>
            {saveMutation.isPending ? <SnLoadingSpinner className="text-primary-foreground" /> : <Save />}
            Save
          </Button>
        )}
      </div>
      <SnGeneralConfirm msg={confirm} continueCb={processDelete} cancelCb={() => setConfirm('')} />
    </div>
  );
}

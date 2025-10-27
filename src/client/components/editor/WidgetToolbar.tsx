import { toast } from 'sonner';
import { Button } from '../ui/button';
import { errorHandler } from '@/lib/utils';
import { useNavigate } from 'react-router';
import { WidgetPicker } from './WidgetPicker';
import { WidgetOptions } from './WidgetOptions';
import { WidgetDropdown } from './WidgetDropdown';
import { NewWidgetModal } from './NewWidgetModal';
import { deleteRecord, saveWidget } from '@/lib/api';
import { useWidget } from '@/context/widget-context';
import { BadgePlus, Save, Trash2 } from 'lucide-react';
import { ModifyPackage } from '../generic/ModifyPackage';
import { useSaveShortcut } from '@/hooks/useSaveShortcut';
import { WidgetDependencies } from './WidgetDependencies';
import { LoadingSpinner } from '../generic/LoadingSpinner';
import { GeneralConfirm } from '../generic/GeneralConfirm';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

export function WidgetToolbar() {
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState('');

  const { widget, saveData, isFetching, applySavedChanges, toggleFieldVisibility } = useWidget();
  const { canWrite, canDelete } = widget.security;
  const controllerRef = useRef(new AbortController());

  const resetController = () => {
    controllerRef.current.abort();
    controllerRef.current = new AbortController();
  };

  const processDelete = useCallback(async () => {
    resetController();

    try {
      await deleteRecord('sp_widget', widget.guid, controllerRef.current.signal);
      toast.success('Widget deleted');
      navigate('/widget_editor?recent=true');
    } catch (e) {
      errorHandler(e, 'Failed to delete widget');
    }
  }, [navigate, widget.guid]);

  const onSave = useCallback(async () => {
    resetController();

    try {
      const result = await saveWidget(widget.guid, saveData, controllerRef.current.signal);
      if (result) {
        toast.success('Widget saved');
        applySavedChanges(saveData);
      }
    } catch (e) {
      errorHandler(e, 'Failed to save widget');
    }
  }, [applySavedChanges, saveData, widget.guid]);

  useSaveShortcut({ enabled: canWrite, onTrigger: onSave });

  useEffect(() => {
    return () => controllerRef.current.abort();
  }, []);

  return (
    <div className="flex flex-wrap gap-2 items-center pt-1">
      <div>
        <WidgetPicker v={widget.guid} dv={widget.fields.name.display_value || ''} />
      </div>
      {isFetching ? <LoadingSpinner /> : <ModifyPackage table="sp_widget" />}
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
          <Button onClick={onSave}>
            <Save />
            Save
          </Button>
        )}
      </div>
      <GeneralConfirm msg={confirm} continueCb={processDelete} cancelCb={() => setConfirm('')} />
    </div>
  );
}

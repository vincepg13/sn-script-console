import { toast } from 'sonner';
import { MessageCircleWarning, Save } from 'lucide-react';
import { Button } from '../ui/button';
import { Spinner } from '../ui/spinner';
import { patchRecord } from '@/lib/api';
import { EditorJson } from './EditorJson';
import { errorHandler } from '@/lib/utils';
import { JSX, useRef, useState } from 'react';
import { useProperty } from '@/context/property-context';
import { useCancelableFn } from '@/hooks/useAbortableController';
import { useSaveShortcut } from '@/hooks/useSaveShortcut';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

type SaveData = {
  value: string;
};

export function ValueEditor() {
  const { property } = useProperty();
  const [saving, setSaving] = useState(false);
  const saveBtnRef = useRef<HTMLButtonElement>(null);
  const saveDataRef = useRef<SaveData>({ value: property.value });

  useSaveShortcut({ enabled: property.canWrite, buttonRef: saveBtnRef });

  const setSaveData = (data: Partial<SaveData>) => {
    saveDataRef.current = { ...saveDataRef.current, ...data };
  };

  const saveProperty = useCancelableFn(signal => {
    return patchRecord('sys_properties', property.guid, saveDataRef.current, signal);
  });

  const handleSave = async () => {
    console.log('Saving data:', saveDataRef.current);
    setSaving(true);

    try {
      await saveProperty.run();
      toast.success('Property values updated');
    } catch (error) {
      errorHandler(error, 'Failed to save property');
    } finally {
      setSaving(false);
    }
  };

  let editor: JSX.Element | null = null;

  switch (property.editorType) {
    case 'json':
      editor = (
        <EditorJson
          value={property.value}
          editable={property.canWrite}
          onChange={(value: string) => setSaveData({ value })}
        />
      );
      break;
    default:
      editor = null;
      break;
  }

  return (
    <div className="flex flex-col gap-4">
      {editor === null ? (
        <Alert>
          <MessageCircleWarning className="mt-1" />
          <AlertTitle className="text-lg">Invalid Property Value</AlertTitle>
          <AlertDescription>
            The value editor is only designed for system properties where the value is in JSON format. For other
            property types, please use the form to update its value.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="flex flex-col gap-4">
          {editor}
          <div className="flex justify-center">
            <Button ref={saveBtnRef} disabled={!property.canWrite || saving} onClick={handleSave}>
              {saving ? <Spinner type="loader" /> : <Save />}
              Save Property
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

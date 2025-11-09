import { Button } from '../ui/button';
import { useEffect, useState } from 'react';
import { PolicyRow } from './PolicyActionRow';
import { usePolicy } from '@/context/policy-context';
import { ActionField, FieldsByTable } from '@/types/policy';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Asterisk, BadgePlus, Glasses, MessageCircleWarning, PencilOff, RectangleEllipsis, Save } from 'lucide-react';

export function PolicyActions() {
  const { policy, actions } = usePolicy();

  const [localActions, setLocalActions] = useState(actions);
  const [fields, setFields] = useState<FieldsByTable>({ [policy.table]: policy.meta });

  const onSave = () => {
    console.log('SAVE DATA', localActions);
  };

  const removeAction = (actionId: string) => {
    setLocalActions(prev => prev.filter(action => action.guid !== actionId));
  };

  const addAction = () => {
    setLocalActions(prev => [
      ...prev,
      {
        guid: crypto.randomUUID(),
        field: { value: '', displayValue: 'Select Field' },
        mandatory: { value: 'ignore', displayValue: 'Leave Alone' },
        visible: { value: 'ignore', displayValue: 'Leave Alone' },
        disabled: { value: 'ignore', displayValue: 'Leave Alone' },
        cleared: { value: false, displayValue: 'False' },
      },
    ]);
  };

  useEffect(() => setLocalActions(actions), [actions]);

  const patchAction = (actionId: string, field: ActionField, value: string | boolean, dv?: string) => {
    console.log('ACTION PATCH:', actionId, field, value, dv);
    setLocalActions(prev =>
      prev.map(action => {
        if (action.guid !== actionId) return action;

        const targetAction = { ...action, [field]: { ...action[field], value, displayValue: dv || String(value) } };

        return targetAction;
      })
    );
  };

  const labelParent = 'pl-1 flex gap-1 items-center flex-1';
  const labelClass = 'text-sm font-medium';
  const iconClass = 'text-muted-foreground size-5';

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 justify-between items-end">
        <div>
          <h3 className="text-lg font-bold tracking-tight flex gap-1 items-center">{policy.name}</h3>
          <p className="text-muted-foreground">Modify UI policy actions or add new ones. Press save once done.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={addAction}>
            <BadgePlus /> Add Action{' '}
          </Button>
          <Button onClick={onSave}>
            <Save /> Save
          </Button>
        </div>
      </div>
      <hr></hr>
      {localActions.length > 0 ? (
        <>
          <div className="flex gap-2 mb-[-10px]">
            <div className={labelParent}>
              <RectangleEllipsis className={iconClass} />
              <div className={labelClass}>Field</div>
            </div>
            <div className={labelParent}>
              <Asterisk className={iconClass} />
              <div className={labelClass}>Mandatory</div>
            </div>
            <div className={labelParent}>
              <Glasses className={iconClass} />
              <div className={labelClass}>Visible</div>
            </div>
            <div className={labelParent}>
              <PencilOff className={iconClass} />
              <div className={labelClass}>Readonly</div>
            </div>
            <div className="min-w-[80px] flex flex-col">
              <div className={labelClass}>Clear Value</div>
            </div>
            <div className="min-w-[50px]"></div>
          </div>
          {localActions.map(action => (
            <PolicyRow
              key={action.guid}
              table={policy.table}
              action={action}
              fields={fields}
              setFields={setFields}
              onChange={patchAction}
              onRemove={removeAction}
            />
          ))}
        </>
      ) : (
        <Alert>
          <MessageCircleWarning className="mt-1" />
          <AlertTitle className="text-lg">Take Action!</AlertTitle>
          <AlertDescription>
            This UI policy currently has no configured actions. Add one above to get started, and remember to press the
            save button once you're finished.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

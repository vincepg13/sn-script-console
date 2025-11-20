import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Spinner } from '../ui/spinner';
import { errorHandler } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { postPolicyActions } from '@/lib/api';
import { usePolicy } from '@/context/policy-context';
import { objectEquals } from '@observ33r/object-equals';
import { PolicyRow, PolicyRowHeader } from './PolicyActionRow';
import { useCancelableFn } from '@/hooks/useAbortableController';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { BadgePlus, MessageCircleWarning, Save } from 'lucide-react';
import { ActionField, FieldsByTable, PolicyAction, PolicyActionData, PolicyActionItem } from '@/types/policy';

const normalize = (arr: PolicyAction[]) => {
  return arr.map(a => ({
    ...a,
    mandatory: a.mandatory.value,
    visible: a.visible.value,
    disabled: a.disabled.value,
    cleared: a.cleared?.value,
    field: a.field?.value,
  }));
};

const buildActionBody = (action: PolicyAction, table?: string, policyGuid?: string, policyScope?: string) => {
  const actionBody: PolicyActionItem = {
    mandatory: action.mandatory.value,
    visible: action.visible.value,
    disabled: action.disabled.value,
    field: action.field?.value,
    cleared: action.cleared?.value,
  };

  if (table) actionBody.table = table;
  if (policyGuid) actionBody.ui_policy = policyGuid;
  if (policyScope) actionBody.sys_scope = policyScope;
  if (!action.guid.startsWith('new:')) actionBody.sys_id = action.guid;

  return actionBody;
};

export function PolicyActions() {
  const { policy, inScope, actions, patchActions, registerDirtyChecker } = usePolicy();

  const [saving, setSaving] = useState(false);
  const [localActions, setLocalActions] = useState(actions);
  const [fields, setFields] = useState<FieldsByTable | undefined>(
    policy.type === "sys_ui_policy" ? { [policy.table!]: policy.meta } : undefined
  );

  const removeAction = (actionId: string) => {
    setLocalActions(prev => prev.filter(action => action.guid !== actionId));
  };

  const actionClass = policy.type + '_action';
  const addAction = () => {
    setLocalActions(prev => [
      ...prev,
      {
        actionClass,
        canWrite: true,
        guid: 'new:' + crypto.randomUUID(),
        mandatory: { value: 'ignore', displayValue: 'Leave Alone' },
        visible: { value: 'ignore', displayValue: 'Leave Alone' },
        disabled: { value: 'ignore', displayValue: 'Leave Alone' },
        cleared: { value: false, displayValue: 'False' },
        field: policy.type === "sys_ui_policy" ? { value: '', displayValue: 'Select Field' } : undefined,
      },
    ]);
  };

  useEffect(() => setLocalActions(actions), [actions]);

  // Register difference checker
  useEffect(() => {
    const fn = () => !objectEquals(normalize(actions), normalize(localActions));
    registerDirtyChecker(fn);
    return () => registerDirtyChecker(() => false);
  }, [actions, localActions, registerDirtyChecker]);

  const patchAction = (actionId: string, field: ActionField, value: string | boolean, dv?: string) => {
    setLocalActions(prev =>
      prev.map(action => {
        if (action.guid !== actionId) return action;

        const targetAction = { ...action, [field]: { ...action[field], value, displayValue: dv || String(value) } };

        return targetAction;
      })
    );
  };

  const saveActions = useCancelableFn((signal, actions: PolicyActionData) => {
    return postPolicyActions(actions, signal);
  });

  const onSave = async () => {
    setSaving(true);
    const toInsert = localActions
      .filter(action => action.guid.startsWith('new:'))
      .map(action => buildActionBody(action, policy.table, policy.guid, policy.scope));

    const toUpdate = localActions
      .filter(action => !action.guid.startsWith('new:'))
      .map(action => buildActionBody(action));

    const toDelete = actions
      .filter(action => !localActions.find(a => a.guid === action.guid))
      .map(action => action.guid);

    try {
      await saveActions.run({ toInsert, toUpdate, toDelete });
      toast.success('Policy actions saved');
      patchActions(localActions);
    } catch (e) {
      errorHandler(e, 'Error saving policy actions');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 justify-between items-end">
        <div>
          <h3 className="text-lg font-bold tracking-tight flex gap-1 items-center">{policy.name}</h3>
          <p className="text-muted-foreground">
            Modify UI policy actions or add new ones. Make sure you are in the same scope as the policy and Press save
            once done.
          </p>
        </div>
        {inScope && (
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={addAction}>
              <BadgePlus /> Add Action
            </Button>
            <Button onClick={onSave} disabled={saving}>
              {saving ? <Spinner type="loader" /> : <Save />} Save
            </Button>
          </div>
        )}
      </div>
      <hr></hr>
      {localActions.length > 0 ? (
        <>
          <PolicyRowHeader policyType={policy.type} disabled={!inScope} />
          {localActions.map(action => (
            <PolicyRow
              key={action.guid}
              type={policy.type}
              table={policy.table}
              action={action}
              fields={fields}
              disabled={!action.canWrite}
              setFields={fields ? setFields : undefined}
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

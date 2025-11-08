import { usePolicy } from '@/context/policy-context';
import { PolicyAction } from '@/types/policy';
import { startTransition, useEffect, useState } from 'react';
import { SnConditionMap, SnDotwalkChoice } from 'sn-shadcn-kit/table';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';

type ActionField = 'field' | 'mandatory' | 'visible' | 'disabled' | 'cleared';
type FieldsByTable = Record<string, SnConditionMap>;

export function PolicyActions() {
  const { policy, actions } = usePolicy();

  const [localActions, setLocalActions] = useState(actions);
  const [fields, setFields] = useState<FieldsByTable>({ [policy.table]: policy.meta });

  useEffect(() => {
    console.log('ACTIONs CHANGED:', actions);
    setLocalActions(actions);
  }, [actions]);

  const patchAction = (actionId: string, field: ActionField, value: string, dv?: string) => {
    setLocalActions(prev =>
      prev.map(action => {
        if (action.guid !== actionId) return action;

        const targetAction = { ...action, [field]: { ...action[field], value, displayValue: dv || String(value) } };

        return targetAction;
      })
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <h3>POLICY ACTIONS</h3>
      {localActions.map(action => (
        <PolicyRow
          key={action.guid}
          table={policy.table}
          action={action}
          fields={fields}
          setFields={setFields}
          onChange={patchAction}
        />
      ))}
    </div>
  );
}

function PolicyRow({
  fields,
  table,
  action,
  disabled,
  onChange,
  setFields,
}: {
  table: string;
  action: PolicyAction;
  fields: FieldsByTable;
  disabled?: boolean;
  setFields: React.Dispatch<React.SetStateAction<FieldsByTable>>;
  onChange: (action: string, field: ActionField, value: string, displayValue?: string) => void;
}) {
  const onChangeWalkedField = (updated: Partial<{ field: string; fieldLabel?: string }>) => {
    if (updated.field) onChange(action.guid, 'field', updated.field, updated.fieldLabel);
  };

  const onChangeActionField = (field: ActionField, value: string) => {
    onChange(action.guid, field, value);
  };

  return (
    <div className="flex gap-2 items-center">
      <SnDotwalkChoice
        className="flex-1"
        label={action.field.displayValue}
        baseTable={table}
        disabled={disabled}
        fieldsByTable={fields}
        setFieldsByTable={setFields}
        onChange={onChangeWalkedField}
      />
      <PolicyFieldAction field="mandatory" value={action.mandatory.value} onChange={onChangeActionField} />
      <PolicyFieldAction field="visible" value={action.visible.value} onChange={onChangeActionField} />
      <PolicyFieldAction field="disabled" value={action.disabled.value} onChange={onChangeActionField} />
    </div>
  );
}

function PolicyFieldAction({
  value,
  field,
  disabled,
  onChange,
}: {
  value: string;
  field: ActionField;
  disabled?: boolean;
  onChange: (field: ActionField, value: string) => void;
}) {
  const [localValue, setLocalValue] = useState(value);
  return (
    <Select
      disabled={disabled}
      value={localValue}
      onValueChange={val => {
        setLocalValue(val);
        startTransition(() => onChange(field, val));
      }}
    >
      <SelectTrigger className="flex-1">
        <SelectValue placeholder="Select an action" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Policy Actions</SelectLabel>
          <SelectItem value="ignore">Leave Alone</SelectItem>
          <SelectItem value="true">True</SelectItem>
          <SelectItem value="false">False</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

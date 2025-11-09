import { Trash } from 'lucide-react';
import { Switch } from '../ui/switch';
import { Button } from '../ui/button';
import { useState, startTransition } from 'react';
import { SnDotwalkChoice } from 'sn-shadcn-kit/table';
import { ActionField, FieldsByTable, PolicyAction } from '@/types/policy';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';

export function PolicyRow({
  fields,
  table,
  action,
  disabled,
  onChange,
  onRemove,
  setFields,
}: {
  table: string;
  action: PolicyAction;
  fields: FieldsByTable;
  disabled?: boolean;
  setFields: React.Dispatch<React.SetStateAction<FieldsByTable>>;
  onRemove: (id: string) => void;
  onChange: (action: string, field: ActionField, value: string | boolean, displayValue?: string) => void;
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
        className="w-full flex-1"
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
      <div className="min-w-[80px] flex flex-col">
        <div className="w-full flex justify-center">
          <Switch
            checked={action.cleared.value}
            onCheckedChange={val => onChange(action.guid, 'cleared', val, String(val))}
          />
        </div>
      </div>
      <div className="min-w-[50px] flex justify-center">
        <Button variant="trash" size="icon" onClick={() => onRemove(action.guid)}>
          <Trash />
        </Button>
      </div>
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
      <SelectTrigger className="w-full flex-1">
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

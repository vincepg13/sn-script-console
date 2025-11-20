import { Switch } from '../ui/switch';
import { Button } from '../ui/button';
import { useState, startTransition } from 'react';
import { SnDotwalkChoice } from 'sn-shadcn-kit/table';
import { ActionField, FieldsByTable, PolicyAction, PolicyType } from '@/types/policy';
import { Asterisk, Eye, Lock, SquarePen, Trash } from 'lucide-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';

export function PolicyRowHeader({ policyType, disabled }: { policyType: PolicyType; disabled?: boolean }) {
  const iconClass = 'text-muted-foreground size-5';
  const labelParent = 'pl-1 flex gap-1 items-center flex-1';
  const labelClass = `text-sm font-medium ${disabled ? 'text-muted-foreground' : ''}`;

  return (
    <div className="flex gap-2 mb-[-10px]">
      {policyType === 'sys_ui_policy' && <div className={labelParent}>
        <SquarePen className={`${iconClass}`} />
        <div className={labelClass}>Field</div>
      </div>}
      <div className={labelParent}>
        <Asterisk className={iconClass} />
        <div className={labelClass}>Mandatory</div>
      </div>
      <div className={labelParent}>
        <Eye className={iconClass} />
        <div className={labelClass}>Visible</div>
      </div>
      <div className={labelParent}>
        <Lock className={iconClass} />
        <div className={labelClass}>Read only</div>
      </div>
      {policyType === 'sys_ui_policy' && <div className="min-w-[80px] flex flex-col">
        <div className={labelClass}>Clear Value</div>
      </div>}
      {!disabled && <div className="min-w-[50px]"></div>}
    </div>
  );
}

export function PolicyRow({
  type,
  fields,
  table,
  action,
  disabled,
  onChange,
  onRemove,
  setFields,
}: {
  table?: string;
  type: PolicyType;
  action: PolicyAction;
  fields?: FieldsByTable;
  disabled?: boolean;
  setFields?: React.Dispatch<React.SetStateAction<FieldsByTable | undefined>>;
  onRemove: (id: string) => void;
  onChange: (action: string, field: ActionField, value: string | boolean, displayValue?: string) => void;
}) {
  const onChangeWalkedField = (updated: Partial<{ field: string; fieldLabel?: string }>) => {
    if (updated.field) onChange(action.guid, 'field', updated.field, updated.fieldLabel);
  };

  const onChangeActionField = (field: ActionField, value: string) => {
    onChange(action.guid, field, value);
  };

  const isSysPolicy = type === 'sys_ui_policy';

  return (
    <div className="flex gap-2 items-center">
      {isSysPolicy && action.field && (
        <SnDotwalkChoice
          className="w-full flex-1"
          label={action.field.displayValue}
          baseTable={table!}
          disabled={disabled}
          fieldsByTable={fields!}
          onChange={onChangeWalkedField}
          setFieldsByTable={setFields as React.Dispatch<React.SetStateAction<FieldsByTable>>}
        />
      )}
      <PolicyFieldAction
        field="mandatory"
        value={action.mandatory.value}
        onChange={onChangeActionField}
        disabled={disabled}
      />
      <PolicyFieldAction
        field="visible"
        value={action.visible.value}
        onChange={onChangeActionField}
        disabled={disabled}
      />
      <PolicyFieldAction
        field="disabled"
        value={action.disabled.value}
        onChange={onChangeActionField}
        disabled={disabled}
      />
      {isSysPolicy && action.cleared && <div className="min-w-[80px] flex flex-col">
        <div className="w-full flex justify-center">
          <Switch
            disabled={disabled}
            checked={action.cleared.value}
            onCheckedChange={val => onChange(action.guid, 'cleared', val, String(val))}
          />
        </div>
      </div>}
      {!disabled && (
        <div className="min-w-[50px] flex justify-center">
          <Button variant="trash" size="icon" onClick={() => onRemove(action.guid)}>
            <Trash />
          </Button>
        </div>
      )}
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

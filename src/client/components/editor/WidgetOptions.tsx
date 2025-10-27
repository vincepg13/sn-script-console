import { toast } from 'sonner';
import { useState } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { patchRecord } from '@/lib/api';
import { Textarea } from '../ui/textarea';
import { errorHandler } from '@/lib/utils';
import { Option, Options } from '@/types/widget';
import { Button } from '@/components/ui/button';
import { Settings2, Trash2 } from 'lucide-react';
import { LoadingSpinner } from '../generic/LoadingSpinner';
import { optionSections, optionTypes } from '@/lib/config';
import { SnRecordPicker, SnRecordPickerItem } from 'sn-shadcn-kit/standalone';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

function setSafeName(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9-]/gi, '_')
    .replace(/^-|-$/g, '');
}

function transformOptions(options: string) {
  const opts = JSON.parse(options) as Options;

  return opts.map(o => {
    o.localId = crypto.randomUUID();
    return o;
  });
}

export function WidgetOptions({ widget, options, editable }: { widget: string; options: string; editable: boolean }) {
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [schema, setSchema] = useState(transformOptions(options));
  const [open, setOpen] = useState<string | undefined>(undefined);

  const addOption = () => {
    const newOpt: Option = { name: '', label: '', type: 'string', section: 'other', localId: crypto.randomUUID() };
    setSchema(prev => [...prev, newOpt]);
    setOpen(newOpt.localId);
  };

  const updateOption = (id: string, patch: Partial<Option>) => {
    setSchema(prev => prev.map(o => (o.localId === id ? { ...o, ...patch } : o)));
  };

  const removeOption = (id: string) => {
    setSchema(prev => prev.filter(o => o.localId !== id));
    setOpen(undefined);
  };

  const saveOptions = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const stringified = schema.length > 0 ? JSON.stringify(schema.map(({ localId, ...o }) => o)) : '';
      await patchRecord('sp_widget', widget, { option_schema: stringified }, new AbortController().signal, [
        'option_schema',
      ]);
      toast.success('Options saved');

      setOpen(undefined);
      setDialogOpen(false);
    } catch (err) {
      errorHandler(err, 'Failed to save options');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <form id="optionsForm" onSubmit={saveOptions}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Settings2 />
            Options
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] md:max-w-[600px] max-h-[80vh] overflow-y-auto text-accent-foreground">
          <DialogHeader>
            <DialogTitle>Widget Options</DialogTitle>
            <DialogDescription>Build the options schema for your widget here.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <Accordion type="single" collapsible value={open} onValueChange={setOpen}>
              {schema.map(opt => (
                <AccordionItem key={opt.localId} value={opt.localId!}>
                  <AccordionTrigger>
                    <div className="w-full flex justify-between items-center gap-2">
                      <p>{opt.label || <span className="text-muted-foreground">Configure new option</span>}</p>
                      {editable && (
                        <Trash2
                          onClick={() => removeOption(opt.localId!)}
                          className="h-5 w-5 text-muted-foreground hover:text-red-500"
                        />
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid gap-2">
                      <OptionForm
                        option={opt}
                        onChange={patch => updateOption(opt.localId!, patch)}
                        editable={editable}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          {editable && (
            <DialogFooter>
              <Button variant="outline" onClick={addOption}>
                Add option
              </Button>
              <Button form="optionsForm" type="submit" disabled={saving}>
                {saving ? (
                  <span className="flex gap-2 items-center">
                    <LoadingSpinner className="h-4 w-4 text-primary-foreground" /> Saving...
                  </span>
                ) : (
                  'Save changes'
                )}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </form>
    </Dialog>
  );
}

type OptionFormProps = { option: Option; editable: boolean; onChange: (patch: Partial<Option>) => void };

function OptionForm({ option, editable, onChange }: OptionFormProps) {
  const updateName = (name: string, label: string) => {
    if (name) return '';
    return setSafeName(label);
  };

  const fixName = (name: string) => {
    if (!name) return '';
    return setSafeName(name);
  };

  const labelClass = `${editable ? '' : 'text-muted-foreground'}`;
  const fieldCellClass = `grid gap-2 ${!editable ? 'cursor-not-allowed' : ''}`;

  return (
    <div className="grid gap-3 px-1">
      <div className={fieldCellClass}>
        <Label className={labelClass}>Label</Label>
        <Input
          value={option.label}
          disabled={!editable}
          onChange={e => onChange({ label: e.target.value })}
          onBlur={() => onChange({ name: updateName(option.name, option.label) })}
        />
      </div>
      <div className={fieldCellClass}>
        <Label className={labelClass}>Name</Label>
        <Input
          value={option.name}
          disabled={!editable}
          onChange={e => onChange({ name: e.target.value })}
          onBlur={() => onChange({ name: fixName(option.name) })}
        />
      </div>
      <div className={fieldCellClass}>
        <Label className={labelClass}>Type</Label>
        <Select value={option.type} onValueChange={v => onChange({ type: v as Option['type'] })} disabled={!editable}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Option Types</SelectLabel>
              {optionTypes.map(type => (
                <SelectItem key={type} value={type} onClick={() => onChange({ type })}>
                  {type}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Show table field for references and lists */}
      {(option.type == 'reference' || option.type == 'glide_list') && (
        <div className={fieldCellClass}>
          <Label className={labelClass}>Referenced Table</Label>
          <OptionPicker option={option} partialChange={onChange} editable={editable} />
        </div>
      )}

      {/* Show choice text area for choices */}
      {option.type == 'choice' && (
        <div className={fieldCellClass}>
          <Label className={labelClass}>Choices</Label>
          <OptionChoices option={option} partialChange={onChange} editable={editable} />
        </div>
      )}

      <div className={fieldCellClass}>
        <Label className={labelClass}>Default Value</Label>
        <Input
          value={option.default_value}
          disabled={!editable}
          onChange={e => onChange({ default_value: e.target.value })}
        />
      </div>
      <div className={fieldCellClass}>
        <Label className={labelClass}>Section</Label>
        <Select
          value={option.section}
          onValueChange={v => onChange({ section: v as Option['section'] })}
          disabled={!editable}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a section" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Option Sections</SelectLabel>
              {optionSections.map(section => (
                <SelectItem key={section} value={section} onClick={() => onChange({ section })}>
                  {section}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

type OptionPickerProps = { option: Option; editable: boolean; partialChange: (patch: Partial<Option>) => void };

function OptionPicker({ option, editable, partialChange }: OptionPickerProps) {
  const [table, setTable] = useState<SnRecordPickerItem | null>({
    value: option.value || '',
    display_value: option.displayValue || '',
  });

  const onChange = (record: SnRecordPickerItem) => {
    setTable(record);

    const value = record.primary;
    partialChange({ value, displayValue: record.display_value, ed: { reference: value } });
  };

  return (
    <SnRecordPicker
      table="sys_db_object"
      fields={['label', 'name']}
      query="ORDERBYDESCsys_updated_on"
      value={table}
      editable={editable}
      onChange={r => onChange(r as SnRecordPickerItem)}
      placeholder="Select a table..."
      clearable={false}
    />
  );
}

export function OptionChoices({ option, editable, partialChange }: OptionPickerProps) {
  const changeArr = option.choices || [];
  const defaultVal = changeArr.map(c => c.value).join('\n');

  const buildChoices = (text: string) => {
    const lines = text.split('\n');
    return lines.map(l => ({ label: l, value: l }));
  };

  return (
    <Textarea
      disabled={!editable}
      defaultValue={defaultVal}
      onBlur={e => partialChange({ choices: buildChoices(e.target.value) })}
    />
  );
}

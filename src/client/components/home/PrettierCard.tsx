import { toast } from 'sonner';
import { Link } from 'react-router';
import { setPreference } from '@/lib/api';
import { Checkbox } from '../ui/checkbox';
import { errorHandler } from '@/lib/utils';
import { ExternalLink, Save } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAppData } from '@/context/app-context';
import { SimpleTooltip } from '../generic/SimpleTooltip';
import { useCallback, useEffect, useState } from 'react';
import { LoadingSpinner } from '../generic/LoadingSpinner';
import { ObjectWrap, PrettierConfig, TrailingComma } from '@/types/script';
import { commaOptions, objectWrapOptions, prettierPrefKey } from '@/lib/config';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function PrettierCard({resync}: {resync: () => void}) {
  const [saving, setSaving] = useState(false);
  const { config, setConfig } = useAppData();
  const pcServer = config.prettierConfig!;

  const [prettier, setPrettier] = useState<PrettierConfig>(pcServer);
  useEffect(() => setPrettier(pcServer), [pcServer]);

  const setPrettierKey = useCallback(
    <K extends keyof PrettierConfig>(key: K, value: PrettierConfig[K]) => {
      setPrettier(prev => ({ ...prev, [key]: value }) as PrettierConfig);
    },
    [setPrettier]
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      await setPreference(prettierPrefKey, JSON.stringify(prettier));
      setConfig({ prettierConfig: prettier });
      toast.success('Prettier settings saved');
      resync();
    } catch (error) {
      errorHandler(error, 'Failed to save prettier settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Prettier Configuration</CardTitle>
        <CardDescription>Configure your Prettier settings below</CardDescription>
        <CardAction>
          <SimpleTooltip content="View Prettier Documentation">
            <Button variant="ghost" size="icon" asChild>
              <Link to="https://prettier.io/docs/en/options.html" target="_blank">
                <ExternalLink />
              </Link>
            </Button>
          </SimpleTooltip>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form id="prettier-form" className="w-full" onSubmit={onSubmit}>
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Print Width</Label>
                <Input
                  id="print-width"
                  type="number"
                  placeholder="80"
                  required
                  value={prettier.printWidth}
                  onChange={e => setPrettierKey('printWidth', Number(e.target.value))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tab-width">Tab Width</Label>
                <Input
                  id="tab-width"
                  type="number"
                  placeholder="2"
                  required
                  value={prettier.tabWidth}
                  onChange={e => setPrettierKey('tabWidth', Number(e.target.value))}
                />
              </div>
              <SelectField
                id="trailing-commas"
                label="Trailing Commas"
                value={prettier.trailingComma}
                options={commaOptions}
                onValueChange={v => setPrettierKey('trailingComma', v as TrailingComma)}
              />
              <SelectField
                id="object-wrap"
                label="Object Wrap"
                value={prettier.objectWrap}
                options={objectWrapOptions}
                onValueChange={v => setPrettierKey('objectWrap', v as ObjectWrap)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <CheckboxField
                id="semi-colons"
                label="Add semi colons"
                checked={prettier.semi}
                onCheckedChange={v => setPrettierKey('semi', Boolean(v))}
              />

              <CheckboxField
                id="single-quote"
                label="Force single quotes"
                checked={prettier.singleQuote}
                onCheckedChange={v => setPrettierKey('singleQuote', Boolean(v))}
              />
              <CheckboxField
                id="bracket-spacing"
                label="Add bracket spacing"
                checked={prettier.bracketSpacing}
                onCheckedChange={v => setPrettierKey('bracketSpacing', Boolean(v))}
              />
              <CheckboxField
                id="format-save"
                label="Format on Save"
                checked={prettier.formatOnSave || false}
                onCheckedChange={v => setPrettierKey('formatOnSave', Boolean(v))}
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2 mt-auto">
        <Button type="submit" className="w-full" form="prettier-form" disabled={saving}>
          {saving && (
            <span className="flex items-center gap-2">
              <LoadingSpinner /> Saving...
            </span>
          )}
          {!saving && (
            <span className="flex items-center gap-2">
              <Save /> Save Changes
            </span>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

type CheckboxFieldProps = {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

function CheckboxField({ id, label, checked, onCheckedChange }: CheckboxFieldProps) {
  return (
    <div className="flex items-center gap-3">
      <Checkbox id={id} checked={checked} onCheckedChange={onCheckedChange} />
      <Label htmlFor={id}>{label}</Label>
    </div>
  );
}

type SelectFieldProps = {
  id: string;
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onValueChange: (value: string) => void;
};
function SelectField({ id, label, value, options, onValueChange }: SelectFieldProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{label} options</SelectLabel>
            {options.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

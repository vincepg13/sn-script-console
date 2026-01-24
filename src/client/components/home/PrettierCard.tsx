import { toast } from 'sonner';
import { Link } from 'react-router';
import { setPreference } from '@/lib/api';
import { SnCardFooter } from './CardFooter';
import { Checkbox } from '../ui/checkbox';
import { errorHandler } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { useAppData } from '@/context/app-context';
import { SnSimpleTooltip } from 'sn-shadcn-kit/ui';
import { useMutation } from '@tanstack/react-query';
import { objectEquals } from '@observ33r/object-equals';
import { SnGeneralConfirm } from 'sn-shadcn-kit/ui';
import { JsonDialog } from '../generic/JsonDialog';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DefaultPrettierOptions } from '@/types/defaults';
import { ObjectWrap, PrettierConfig, TrailingComma } from '@/types/script';
import { commaOptions, objectWrapOptions, prettierPrefKey } from '@/lib/config';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';

export function PrettierCard({ resync }: { resync: () => void }) {
  const { config, setConfig } = useAppData();
  const pcServer = config.prettierConfig!;
  const tabWidth = config.prettierConfig?.tabWidth || 4;

  const [jsonOpen, setJsonOpen] = useState(false);
  const [defaultMsg, setDefaultMsg] = useState('');
  const [prettier, setPrettier] = useState<PrettierConfig>(pcServer);
  useEffect(() => setPrettier(pcServer), [pcServer]);

  const isDefault = useMemo(() => {
    return objectEquals(prettier, DefaultPrettierOptions);
  }, [prettier]);

  const setPrettierKey = useCallback(
    <K extends keyof PrettierConfig>(key: K, value: PrettierConfig[K]) => {
      setPrettier(prev => ({ ...prev, [key]: value }) as PrettierConfig);
    },
    [setPrettier]
  );

  const handleJsonSave = (value: string) => {
    const parsed = JSON.parse(value) as PrettierConfig;
    setPrettier(parsed);
  };

  const saveMutation = useMutation({
    mutationKey: ['prettierConfigSave'],
    mutationFn: () => setPreference(prettierPrefKey, JSON.stringify(prettier)),
    onSuccess: () => {
      setConfig({ prettierConfig: prettier });
      toast.success('Prettier settings saved');
      resync();
    },
    onError: error => errorHandler(error, 'Failed to save prettier settings'),
  });

  const openDefaultDialog = useCallback(() => {
    setDefaultMsg(
      'Are you sure you want to reset your Prettier settings to default? You will lose all custom configurations.'
    );
  }, []);

  const setDefaultPrettier = useCallback(() => {
    setPrettier(DefaultPrettierOptions);
    saveMutation.mutate();
    setDefaultMsg('');
  }, [saveMutation]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Prettier Configuration</CardTitle>
        <CardDescription>Configure your Prettier settings below</CardDescription>
        <CardAction>
          <SnSimpleTooltip content="View Prettier Documentation">
            <Button variant="ghost" size="icon" asChild>
              <Link to="https://prettier.io/docs/en/options.html" target="_blank">
                <ExternalLink />
              </Link>
            </Button>
          </SnSimpleTooltip>
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
      <SnCardFooter
        formId="prettier-form"
        isDefault={isDefault}
        isSaving={saveMutation.isPending}
        onReset={openDefaultDialog}
        onOpenJson={() => setJsonOpen(true)}
      />
      <SnGeneralConfirm
        title="Reset Prettier to Defaults"
        msg={defaultMsg}
        continueCb={setDefaultPrettier}
        cancelCb={() => setDefaultMsg('')}
      ></SnGeneralConfirm>
      <JsonDialog
        open={jsonOpen}
        setOpen={setJsonOpen}
        json={prettier ? JSON.stringify(prettier, null, tabWidth) : ''}
        setJson={handleJsonSave}
        onSave={saveMutation.mutate}
        title="Prettier Configuration"
        description={
          <div>
            <div className="mb-2">
              Here you can customise the raw Prettier options in JSON. This gives you full configurability.
            </div>
            <div>
              <strong>Please note:</strong> Options you add which are not part of the default rule set will not show in
              the UI, but the options will be applied.
            </div>
          </div>
        }
      />
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

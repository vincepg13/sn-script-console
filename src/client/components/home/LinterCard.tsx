import { toast } from 'sonner';
import { Link } from 'react-router';
import { JsonDialog } from '../generic/JsonDialog';
import { setPreference } from '@/lib/api';
import { errorHandler } from '@/lib/utils';
import { LintLevel } from '@/types/script';
import { ExternalLink } from 'lucide-react';
import { SnCardFooter } from './CardFooter';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RuleEntry } from 'sn-shadcn-kit/script';
import { useAppData } from '@/context/app-context';
import { useMutation } from '@tanstack/react-query';
import { DefaultESLintOptions } from '@/types/defaults';
import { SnSimpleTooltip } from 'sn-shadcn-kit/ui';
import { objectEquals } from '@observ33r/object-equals';
import { SnGeneralConfirm } from 'sn-shadcn-kit/ui';
import { defaultLintLevels, eslintPrefKey } from '@/lib/config';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';

export function LinterCard({ resync }: { resync: () => void }) {
  const { config, setConfig } = useAppData();
  const lintServer = config.esLintConfig!;
  const tabWidth = config.prettierConfig?.tabWidth || 4;

  const [jsonOpen, setJsonOpen] = useState(false);
  const [defaultMsg, setDefaultMsg] = useState('');
  const [linter, setLinter] = useState(lintServer.rules!);

  const isDefault = useMemo(() => {
    return objectEquals(linter, DefaultESLintOptions.rules);
  }, [linter]);

  useEffect(() => {
    setLinter(lintServer.rules!);
  }, [lintServer.rules]);

  const setLinterKey = useCallback(
    (key: string, value: RuleEntry) => {
      setLinter(prev => {
        const next = { ...prev };
        if (Array.isArray(next[key])) {
          const target = [...next[key]];
          target[0] = value;
          return { ...prev, [key]: target as RuleEntry };
        }
        return { ...prev, [key]: value };
      });
    },
    [setLinter]
  );

  const handleJsonSave = (value: string) => {
    const parsed = JSON.parse(value) as Record<string, RuleEntry>;
    setLinter(parsed);
  };

  const saveMutation = useMutation({
    mutationKey: ['lintConfigSave'],
    mutationFn: () => setPreference(eslintPrefKey, JSON.stringify(linter)),
    onSuccess: () => {
      const newLintConfig = { ...lintServer, rules: linter };
      setConfig({ esLintConfig: newLintConfig });
      toast.success('ESLint settings saved');
      resync();
    },
    onError: error => errorHandler(error, 'Failed to save linter settings'),
  });

  const openDefaultDialog = useCallback(() => {
    setDefaultMsg(
      'Are you sure you want to reset your ESLint settings to default? You will lose all custom configurations.'
    );
  }, []);

  const setDefaultLinter = useCallback(() => {
    setLinter(DefaultESLintOptions.rules!);
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
        <CardTitle>ES Lint Configuration</CardTitle>
        <CardDescription>Configure your ESLint settings below</CardDescription>
        <CardAction>
          <SnSimpleTooltip content="View ESLint Documentation">
            <Button variant="ghost" size="icon" asChild>
              <Link to="https://eslint.org/docs/latest/rules/" target="_blank">
                <ExternalLink />
              </Link>
            </Button>
          </SnSimpleTooltip>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} id="linter-form">
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4">
              <SimpleLintRule label="Missed Semicolons" linterKey="semi" linter={linter} setLinterKey={setLinterKey} />
              <SimpleLintRule
                label="No Unused Variables"
                linterKey="no-unused-vars"
                linter={linter}
                setLinterKey={setLinterKey}
              />
              <SimpleLintRule
                label="Redeclared Variables"
                linterKey="no-redeclare"
                linter={linter}
                setLinterKey={setLinterKey}
              />
              <SimpleLintRule
                label="Unreachable Code"
                linterKey="no-unreachable"
                linter={linter}
                setLinterKey={setLinterKey}
              />
              <SimpleLintRule
                label="Duplicate Obj Keys"
                linterKey="no-dupe-keys"
                linter={linter}
                setLinterKey={setLinterKey}
              />
              <SimpleLintRule
                label="Mixed Tabs & Spaces"
                linterKey="no-irregular-whitespace"
                linter={linter}
                setLinterKey={setLinterKey}
              />
              <SimpleLintRule
                label="Invalid typeof"
                linterKey="valid-typeof"
                linter={linter}
                setLinterKey={setLinterKey}
              />
              <SimpleLintRule label="Require isNaN" linterKey="use-isnan" linter={linter} setLinterKey={setLinterKey} />
            </div>
          </div>
        </form>
      </CardContent>
      <SnCardFooter
        formId="linter-form"
        isDefault={isDefault}
        isSaving={saveMutation.isPending}
        onReset={openDefaultDialog}
        onOpenJson={() => setJsonOpen(true)}
      />
      <SnGeneralConfirm
        title="Reset ES Lint to Defaults"
        msg={defaultMsg}
        continueCb={setDefaultLinter}
        cancelCb={() => setDefaultMsg('')}
      ></SnGeneralConfirm>
      <JsonDialog
        open={jsonOpen}
        setOpen={setJsonOpen}
        json={linter ? JSON.stringify(linter, null, tabWidth) : ''}
        setJson={handleJsonSave}
        onSave={saveMutation.mutate}
        title="ESLint Configuration"
        description={
          <div>
            <div className="mb-2">
              Here you can customise the raw ESLint rules in JSON. This gives you full configurability
            </div>
            <div>
              <strong>Please note:</strong> Any rules you add which are not part of the default rule set will not show
              in the UI, but the rules will be applied.
            </div>
          </div>
        }
      />
    </Card>
  );
}

function SimpleLintRule({
  linter,
  label,
  linterKey,
  setLinterKey,
}: {
  label: string;
  linterKey: string;
  linter: Record<string, RuleEntry>;
  setLinterKey: (key: string, value: RuleEntry) => void;
}) {
  const linterValue = Array.isArray(linter[linterKey]) ? linter[linterKey][0] : linter[linterKey];

  return (
    <div className="grid gap-2">
      <Label htmlFor={linterKey}>{label}</Label>
      <Select value={linterValue as LintLevel} onValueChange={v => setLinterKey(linterKey, v as LintLevel)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>ES Lint Level</SelectLabel>
            {defaultLintLevels.map(option => (
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

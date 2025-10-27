import { Link } from 'react-router';
import { LintLevel } from '@/types/script';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ExternalLink, Save } from 'lucide-react';
import { useAppData } from '@/context/app-context';
import { SimpleTooltip } from '../generic/SimpleTooltip';
import { useCallback, useEffect, useState } from 'react';
import { defaultLintLevels, eslintPrefKey } from '@/lib/config';
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
import { setPreference } from '@/lib/api';
import { errorHandler } from '@/lib/utils';
import { LoadingSpinner } from '../generic/LoadingSpinner';
import { RuleEntry } from 'sn-shadcn-kit/script';
import { toast } from 'sonner';

export function LinterCard({resync}: {resync: () => void}) {
  const [saving, setSaving] = useState(false);
  const { config, setConfig } = useAppData();
  const lintServer = config.esLintConfig!;

  const [linter, setLinter] = useState(lintServer.rules!);
  useEffect(() => setLinter(lintServer.rules!), [lintServer.rules]);

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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      await setPreference(eslintPrefKey, JSON.stringify(linter));

      const newLintConfig = { ...lintServer, rules: linter };
      setConfig({ esLintConfig: newLintConfig });
      toast.success('ESLint settings saved');
      resync();
    } catch (error) {
      errorHandler(error, 'Failed to save linter settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>ES Lint Configuration</CardTitle>
        <CardDescription>Configure your ESLint settings below</CardDescription>
        <CardAction>
          <SimpleTooltip content="View ESLint Documentation">
            <Button variant="ghost" size="icon" asChild>
              <Link to="https://eslint.org/docs/latest/rules/" target="_blank">
                <ExternalLink />
              </Link>
            </Button>
          </SimpleTooltip>
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
      <CardFooter className="flex-col gap-2 mt-auto">
        <Button type="submit" className="w-full" form="linter-form" disabled={saving}>
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

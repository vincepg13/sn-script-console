/* eslint-disable react-hooks/exhaustive-deps */
import { Switch } from '../ui/switch';
import { setPreference } from '@/lib/api';
import { errorHandler } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { useAppData } from '@/context/app-context';
import { CmThemeValue } from 'sn-shadcn-kit/script';
import { useDebouncedFn } from '@/hooks/useDebounceFn';
import { useEffect, useState, startTransition, useRef } from 'react';
// import { useAbortableController } from '@/hooks/useAbortableController';
import { autoPackageAddKey, autoScopeSwitchKey, cmThemeKey, directToWidgetKey, themeOptions } from '@/lib/config';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';

export function SnOptionsCard({ resync }: { resync: () => void }) {
  // const { getSignal } = useAbortableController();
  const saving = useRef(false);
  const { config, setLocalPreference } = useAppData();

  const [theme, setTheme] = useState<string>(config.preferences?.theme || 'atom');
  const [scopeSwitch, setScopeSwitch] = useState<boolean>(!!config.preferences?.autoScopeSwitch);
  const [packageAdd, setPackageAdd] = useState<boolean>(!!config.preferences?.autoPackageAdd);
  const [lastWidget, setLastWidget] = useState<boolean>(!!config.preferences?.directToWidget);

  useEffect(() => {
    if (saving.current) return;
    if (config.preferences?.theme !== theme) setTheme(config.preferences?.theme || 'atom');
  }, [config.preferences?.theme]);

  useEffect(() => {
    if (saving.current) return;

    const v = !!config.preferences?.autoScopeSwitch;
    if (v !== scopeSwitch) setScopeSwitch(v);
  }, [config.preferences?.autoScopeSwitch]);

  useEffect(() => {
    if (saving.current) return;

    const v = !!config.preferences?.autoPackageAdd;
    if (v !== packageAdd) setPackageAdd(v);
  }, [config.preferences?.autoPackageAdd]);

  useEffect(() => {
    if (saving.current) return;

    const v = !!config.preferences?.directToWidget;
    if (v !== lastWidget) setLastWidget(v);
  }, [config.preferences?.directToWidget]);

  const debounceSync = useDebouncedFn(() => {
    if (!saving.current) return resync();
  }, 1000);

  const savePref = useDebouncedFn(async (name: string, value: string, onErrorRollback?: () => void) => {
    try {
      saving.current = true;
      await setPreference(name, value);
      // await setPreference(name, value, getSignal());
      debounceSync();
    } catch (err) {
      onErrorRollback?.();
      errorHandler(err, 'Failed to save preference: ' + name);
    } finally {
      saving.current = false;
    }
  }, 200);

  const setThemePref = (value: CmThemeValue) => {
    setTheme(value);
    startTransition(() => setLocalPreference('theme', value));
    savePref(cmThemeKey, value);
  };

  const setScopeSwitchPref = (checked: boolean) => {
    const prev = scopeSwitch;
    setScopeSwitch(checked);
    startTransition(() => setLocalPreference('autoScopeSwitch', checked));
    savePref(autoScopeSwitchKey, String(checked), () => {
      setScopeSwitch(prev);
      startTransition(() => setLocalPreference('autoScopeSwitch', prev));
    });
  };

  const setPackageAddPref = (checked: boolean) => {
    const prev = packageAdd;
    setPackageAdd(checked);
    startTransition(() => setLocalPreference('autoPackageAdd', checked));
    savePref(autoPackageAddKey, String(checked), () => {
      setPackageAdd(prev);
      startTransition(() => setLocalPreference('autoPackageAdd', prev));
    });
  };

  const setLastWidgetPref = (checked: boolean) => {
    const prev = lastWidget;
    setLastWidget(checked);
    startTransition(() => setLocalPreference('directToWidget', checked));
    savePref(directToWidgetKey, String(checked), () => {
      setLastWidget(prev);
      startTransition(() => setLocalPreference('directToWidget', prev));
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>General Configuration</CardTitle>
        <CardDescription>Configure your general settings below</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="general-form" className="w-full">
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="script-theme">Script Theme</Label>
              <Select value={theme} onValueChange={setThemePref}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Theme options</SelectLabel>
                    {themeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Automatic Scope Switch</Label>
              <div className="flex items-center gap-2">
                <Switch id="scope-switch" checked={scopeSwitch} onCheckedChange={setScopeSwitchPref} />
                <Label htmlFor="scope-switch" className="text-sm font-normal text-muted-foreground">
                  Opening a scripted item will automatically switch your current scope. Manual app changes can only be
                  done via the homepage.
                </Label>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Automatic Package Addition</Label>
              <div className="flex items-center gap-2">
                <Switch id="package-switch" checked={packageAdd} onCheckedChange={setPackageAddPref} />
                <Label htmlFor="package-switch" className="text-sm font-normal text-muted-foreground">
                  Scripted items you open will automatically be added to your current package.
                </Label>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Open Last Widget</Label>
              <div className="flex items-center gap-2">
                <Switch id="last-widget-switch" checked={lastWidget} onCheckedChange={setLastWidgetPref} />
                <Label htmlFor="last-widget-switch" className="text-sm font-normal text-muted-foreground">
                  Widget editor goes straight to your last opened widget instead of showing recently updated.
                </Label>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

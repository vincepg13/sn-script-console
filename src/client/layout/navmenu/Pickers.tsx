import { ReactNode, useMemo } from 'react';
import { Link, useLocation } from 'react-router';
import { errorHandler } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAppData } from '@/context/app-context';
import { AppScope, AppUpdateSet, PickerMenuItem } from '@/types/app';
import { useQueryClient } from '@tanstack/react-query';
import { setApplication, setUpdateSet } from '@/lib/api';
import { AppWindow, FolderCog, Settings2 } from 'lucide-react';
import { SimpleTooltip } from '@/components/generic/SimpleTooltip';
import { DropdownMenuShortcut } from '@/components/ui/dropdown-menu';
import { SnRecordPickerItem, SnRecordPicker } from 'sn-shadcn-kit/standalone';
import { applicationOptions, globalScope, updateSetOptions } from '@/lib/config';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

const getMenu = (menu: PickerMenuItem[], target: string) => {
  if (!target) return [];
  return menu.map(option => ({
    ...option,
    href: option.href.replace('{target}', target),
  }));
};

export function Pickers() {
  const qc = useQueryClient();
  const { config, setConfig } = useAppData();
  const { scope, updateSet, preferences } = config;

  const handleAppChange = async (newScope: SnRecordPickerItem) => {
    try {
      const { scope, updateSet } = await setApplication(newScope.value);
      setConfig({ scope, updateSet });
      qc.invalidateQueries({ queryKey: ['appConfig'] });
      qc.invalidateQueries({ queryKey: ['widgetData'] });
      qc.invalidateQueries({ queryKey: ['listData'] });
      qc.invalidateQueries({ queryKey: ['scriptData'] });
    } catch (error) {
      return errorHandler(error, 'Failed to change application');
    }
  };

  const handleUpdateSetChange = async (newUpdateSet: SnRecordPickerItem) => {
    try {
      const updateSet = await setUpdateSet(newUpdateSet.value);
      setConfig({ updateSet });
    } catch (error) {
      return errorHandler(error, 'Failed to change update set');
    }
  };

  const pickers = (
    <div className="flex flex-col items-center gap-2 2xl:flex-row">
      <UpdateSetPicker initialSet={updateSet} scope={scope.value} onChange={handleUpdateSetChange} />
      <AppPicker scope={scope} onChange={handleAppChange} auto={preferences.autoScopeSwitch} />
    </div>
  );

  return (
    <div>
      <div className="hidden 2xl:block">{pickers}</div>
      <div className="block 2xl:hidden">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon">
              <Settings2 />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" onOpenAutoFocus={e => e.preventDefault()}>
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="leading-none font-medium">Application Scope</h4>
                <p className="text-muted-foreground text-sm">Change application scope or update set.</p>
              </div>
              {pickers}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

function AppPicker({
  scope,
  auto,
  onChange,
}: {
  scope: AppScope;
  auto: boolean;
  onChange: (item: SnRecordPickerItem) => void;
}) {
  const location = useLocation();
  const scopePicker = { value: scope.value, display_value: scope.name };
  const appMenu = useMemo(() => getMenu(applicationOptions, scope.value), [scope.value]);

  if (!scope) return null;

  const onHomePage = location.pathname === '/';
  const editable = !auto || (auto && onHomePage);

  return (
    <div className="flex picker-group w-full">
      <PickerActions title="Application Options" icon={<AppWindow />} items={appMenu} />
      <div className="[&_button]:rounded-none [&_button]:rounded-r-md flex-1">
        <SnRecordPicker
          table="sys_scope"
          fields={['name', 'scope']}
          query="private=false"
          value={scopePicker}
          onChange={record => onChange((record || globalScope) as SnRecordPickerItem)}
          placeholder="Select an Application..."
          clearable={editable}
          editable={editable}
        />
      </div>
    </div>
  );
}

type UpdateSetPickerProps = {
  initialSet: AppUpdateSet | null;
  scope: string;
  onChange: (item: SnRecordPickerItem) => void;
};

function UpdateSetPicker({ initialSet, onChange, scope }: UpdateSetPickerProps) {
  const updatePicker = initialSet ? { value: initialSet.value, display_value: initialSet.name } : null;
  const updateMenu = useMemo(() => getMenu(updateSetOptions, initialSet?.value ?? ''), [initialSet]);

  if (!scope || !updatePicker) return null;

  return (
    <div className="flex picker-group w-full">
      <PickerActions title="Update Set Options" icon={<FolderCog />} items={updateMenu} />

      <div className="[&_button]:rounded-none [&_button]:rounded-r-md flex-1">
        <SnRecordPicker
          table="sys_update_set"
          fields={['name', 'sys_created_on']}
          query={`state=in progress^application=${scope}^ORDERBYDESCsys_created_on`}
          value={updatePicker}
          onChange={record => onChange(record as SnRecordPickerItem)}
          placeholder="Select an Update Set..."
          clearable={false}
        />
      </div>
    </div>
  );
}

function PickerActions({ title, icon, items }: { title: string; icon: ReactNode; items: PickerMenuItem[] }) {
  return (
    <DropdownMenu>
      <SimpleTooltip content={title}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="rounded-none rounded-l-md border-r-0">
            {icon}
          </Button>
        </DropdownMenuTrigger>
      </SimpleTooltip>
      <DropdownMenuContent className="w-56" align="start" onCloseAutoFocus={e => e.preventDefault()}>
        <DropdownMenuLabel>{title}</DropdownMenuLabel>
        <DropdownMenuGroup>
          {items.map(item => {
            const Icon = item.icon;
            return (
              <DropdownMenuItem key={item.label} asChild>
                <div className="flex w-full items-center justify-between">
                  <Link to={item.href} target={item.target || '_blank'} className="flex-1 text-left">
                    {item.label}
                  </Link>
                  {Icon && (
                    <DropdownMenuShortcut>
                      <Icon className="h-4 w-4 opacity-60" />
                    </DropdownMenuShortcut>
                  )}
                </div>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

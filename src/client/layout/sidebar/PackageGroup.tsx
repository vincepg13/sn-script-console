import { memo } from 'react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { LucideIcon, ChevronRight, Trash } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { LoadingSpinner } from '@/components/generic/LoadingSpinner';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';

type NavMainProps = {
  items: {
    tableName: string;
    tableLabel: string;
    icon?: LucideIcon;
    items?: { label: string; path: string }[];
  }[];
  openMap: Record<string, boolean>;
  inRemoval: string;
  removeItem: (table: string, path: string) => void;
  onActiveChange: (tableName: string, open: boolean) => void;
};

type TableRowProps = {
  tableName: string;
  tableLabel: string;
  icon?: LucideIcon;
  items?: { label: string; path: string }[];
  open: boolean;
  inRemoval: string;
  onToggle: (open: boolean) => void;
  onRemove: (table: string, path: string) => void;
};

export function PackageGroup({ items, openMap, inRemoval, removeItem, onActiveChange }: NavMainProps) {
  return (
    <SidebarGroup className="pt-0">
      <SidebarGroupLabel>Script Package Files</SidebarGroupLabel>

      {items.length === 0 && (
        <div className="px-2">
          <Alert>
            <AlertTitle>Nothing to see here...</AlertTitle>
            <AlertDescription>No files have been added to this package.</AlertDescription>
          </Alert>
        </div>
      )}

      <SidebarMenu>
        {items.map(item => (
          <TableRow
            key={item.tableName}
            tableName={item.tableName}
            tableLabel={item.tableLabel}
            icon={item.icon}
            items={item.items}
            open={!!openMap[item.tableName]}
            inRemoval={inRemoval}
            onToggle={o => onActiveChange(item.tableName, o)}
            onRemove={removeItem}
          />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

const TableRow = memo(function TableRow({
  tableName,
  tableLabel,
  icon: Icon,
  items,
  open,
  inRemoval,
  onToggle,
  onRemove,
}: TableRowProps) {
  return (
    <Collapsible asChild open={open} onOpenChange={onToggle} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton>
            {Icon && <Icon />}
            <span className="font-semibold">{tableLabel}</span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarMenuSub className="mr-0 pr-0">
            {items?.map(s => (
              <SidebarMenuSubItem key={s.path} className="flex items-center justify-between">
                <SidebarMenuSubButton asChild>
                  <Link to={s.path} className="flex-1">
                    <span className="text-sm">{s.label}</span>
                  </Link>
                </SidebarMenuSubButton>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemove(tableName, s.path)}
                  className="text-muted-foreground hover:bg-red-600/10 hover:text-red-600"
                >
                  {inRemoval === s.path ? <LoadingSpinner className="size-4" /> : <Trash className="size-4" />}
                </Button>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
});

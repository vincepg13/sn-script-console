import { useState } from 'react';
import { Link } from 'react-router';
import { PackageMenu } from './PackageMenu';
import { PackageManager } from './PackageManager';
import { useAppConfig } from '@/context/app-context';
import { Separator } from '@/components/ui/separator';
import { ChevronsLeftRightEllipsis } from 'lucide-react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useQueryClient } from '@tanstack/react-query';

export function AppSidebar() {
  const qc = useQueryClient();
  const [loading, setLoading] = useState(false);

  const { config, changePackage, setPackageData } = useAppConfig();
  const { packageData } = config;

  const onPackageChange = async (value: string) => {
    setLoading(true);
    await changePackage(value);
    setLoading(false);
    resyncPackage();
  };

  const resyncPackage = async () => {
    qc.invalidateQueries({ queryKey: ['appConfig'] });
  };

  return (
    <Sidebar>
      <SidebarHeader className="py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="data-[slot=sidebar-menu-button]:!p-0 justify-center h-[36px]" asChild>
              <Link to="/">
                <div className="flex items-center justify-center py-4">
                  <ChevronsLeftRightEllipsis className="inline-block mr-2 h-5 w-5 align-middle" />
                  <span className="text-base font-semibold">Script Console</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <PackageManager onChange={onPackageChange} resync={resyncPackage} />
        {packageData.packages.length > 0 && (
          <>
            <Separator />
            <PackageMenu
              pkg={packageData}
              items={packageData.packageItems}
              changing={loading}
              resync={resyncPackage}
              setPackage={setPackageData}
            />
          </>
        )}
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}

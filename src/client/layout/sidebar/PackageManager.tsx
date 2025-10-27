import { useEffect, useEffectEvent, useMemo, useState } from 'react';
import { BadgePlus, Pencil, Settings2, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppData } from '@/context/app-context';
import { SimpleTooltip } from '@/components/generic/SimpleTooltip';
import { SidebarGroup, SidebarGroupLabel } from '@/components/ui/sidebar';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NewPackageDialog } from './NewPackageDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DeletePackageDialog } from './DeletePackageDialog';

type pkgType = 'create' | 'rename';

export function PackageManager({ onChange, resync }: { onChange: (pkgId: string) => void, resync: () => void }) {
  const { config, setPackageData } = useAppData();
  const { packageData } = config;
  const { currentPackage: myPackage, packages } = packageData;
  const myPackageObj = useMemo(() => packages.find(pkg => pkg.id === myPackage), [packages, myPackage]);

  const [deleting, setDeleting] = useState(false);
  const [pkgDialog, setPkgDialog] = useState<{ type: pkgType; open: boolean }>({ type: 'create', open: false });

  const [currentPackage, setCurrentPackage] = useState(myPackage || '');
  const externalPackageUpdate = useEffectEvent((pkg: string) => {
    if (currentPackage !== pkg) setCurrentPackage(pkg);
  });
  useEffect(() => externalPackageUpdate(myPackage || ''), [myPackage]);

  const warnOnDelete = () => setDeleting(true);

  const onPackageChange = async (value: string) => {
    setCurrentPackage(value);
    onChange(value);
  };

  const setCreating = (val: boolean) => setPkgDialog(prev => ({ ...prev, open: val }));
  const openPackageDialog = (type: 'create' | 'rename') => {
    setPkgDialog({ type, open: true });
  };

  const onPackageDelete = () => {
    setCurrentPackage('');
    setPackageData({
      packages: packageData.packages.filter(pkg => pkg.id !== myPackage),
      currentPackage: '',
      packageItems: {},
    });
    setDeleting(false);
    resync();
  };

  return (
    <SidebarGroup className="py-3">
      <SidebarGroupLabel className="text-sm flex items-center justify-between mb-1">
        <span className="font-semibold">My Script Packages</span>
      </SidebarGroupLabel>
      {packages.length === 0 ? (
        <>
          <p className="text-sm px-2 pb-2 ">
            You do not currently have any script packages. Create one to get started.
          </p>
          <Button variant="outline" onClick={() => openPackageDialog('create')} className="w-full">
            Create New Package
          </Button>
        </>
      ) : (
        <div className="flex items-center gap-1 px-2">
          <Select value={currentPackage} onValueChange={onPackageChange}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select a package" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {packages.map(pkg => (
                  <SelectItem key={pkg.id} value={pkg.id}>
                    {pkg.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <DropdownMenu>
            <SimpleTooltip content="Package Options">
              <DropdownMenuTrigger asChild>
                <Button size="icon">
                  <Settings2 />
                </Button>
              </DropdownMenuTrigger>
            </SimpleTooltip>
            <DropdownMenuContent className="w-56" align="start" onCloseAutoFocus={e => e.preventDefault()}>
              <DropdownMenuLabel>Package Options</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => openPackageDialog('create')}>
                  Create new package
                  <DropdownMenuShortcut>
                    <BadgePlus className="text-green-500" />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
                {myPackage && (
                  <>
                    <DropdownMenuItem onClick={warnOnDelete}>
                      Delete current package
                      <DropdownMenuShortcut>
                        <Trash className="text-red-500" />
                      </DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openPackageDialog('rename')}>
                      Rename current package
                      <DropdownMenuShortcut>
                        <Pencil className="text-blue-500" />
                      </DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      <NewPackageDialog
        open={pkgDialog.open}
        type={pkgDialog.type}
        pkgName={myPackageObj?.name || ''}
        pkgId={myPackageObj?.id || ''}
        pkgGuid={myPackageObj?.guid || ''}
        setOpen={setCreating}
        setCurrentPackage={setCurrentPackage}
      />
      <DeletePackageDialog
        pkgName={myPackageObj?.name || ''}
        pkgId={myPackageObj?.guid || ''}
        open={deleting}
        setOpen={setDeleting}
        onDelete={onPackageDelete}
      />
    </SidebarGroup>
  );
}

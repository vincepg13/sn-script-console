import { toast } from 'sonner';
import { Badge } from '../ui/badge';
import { isAxiosError } from 'axios';
import { Button } from '../ui/button';
import { ModalForm } from './ModalForm';
import { errorHandler } from '@/lib/utils';
import { depTableMap } from '@/lib/config';
import { Dependency } from '@/types/widget';
import { useWidget } from '@/context/widget-context';
import { useLiveCounts } from './hooks/useLiveCounts';
import { LoadingSpinner } from '../generic/LoadingSpinner';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Clock, Settings, Trash, Upload } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';
import { SnRecordPicker, SnRecordPickerItem } from 'sn-shadcn-kit/standalone';
import { addDependency, deleteRecord, getWidgetDependencies } from '@/lib/api';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '../ui/sheet';

type DepSheetProps = {
  widget: string;
  table?: string;
  dependencies?: Dependency[];
  editable: boolean;
  addCallback: (depId: string) => Promise<void>;
  removeCallback: (table: string, depId: string) => Promise<void>;
  manualReload: (table: string, field: string) => Promise<void>;
};

type DepListItemProps = {
  label: string;
  desc: string;
  items: number;
  table: string;
  field: string;
  isLoading: boolean;
  openDep: (table: string, field: string) => void;
};

function LiveCountsMount({ guid }: { guid: string }) {
  useLiveCounts(guid);
  return null;
}

export function WidgetDependencies() {
  const { widget } = useWidget();
  const { dependencyCounts } = widget;
  const controllerRef = useRef(new AbortController());

  const [open, setIsOpen] = useState(false);
  const [sheetTable, setSheetTable] = useState('');
  const [loadingTable, setLoadingTable] = useState('');
  const [dependencyList, setDependencyList] = useState<Dependency[]>([]);

  const summedDeps = Object.values(dependencyCounts).reduce((acc, count) => acc + count, 0);

  const resetController = () => {
    controllerRef.current.abort();
    controllerRef.current = new AbortController();
  };

  const manualReload = async (table: string, field: string) => {
    try {
      resetController();
      const dependencies = await getWidgetDependencies(table, widget.guid, field, controllerRef.current.signal);
      setDependencyList(dependencies);
    } catch (e) {
      if (isAxiosError(e) && e.code === 'ERR_CANCELED') return;
    }
  };

  const openDepList = async (table: string, field: string) => {
    resetController();

    try {
      setSheetTable('');
      setLoadingTable(table);

      const dependencies = await getWidgetDependencies(table, widget.guid, field, controllerRef.current.signal);
      setIsOpen(false);
      setDependencyList(dependencies);
      setSheetTable(table);
    } catch (e) {
      errorHandler(e, 'Failed to load dependencies');
    } finally {
      setLoadingTable('');
    }
  };

  const newDependency = useCallback(
    async (depId: string) => {
      resetController();

      try {
        const table = sheetTable as keyof typeof depTableMap;
        const linkTable = depTableMap[table].linkTable;
        const res = await addDependency(
          { table, widget: widget.guid, dependency: depId, linkTable },
          controllerRef.current.signal
        );

        if (res.success) {
          setDependencyList(res.dependencies);
        } else {
          toast.error('Failed to add dependency');
        }
      } catch (e) {
        errorHandler(e, 'Failed to add dependency');
      }
    },
    [sheetTable, widget.guid]
  );

  const removeDependency = useCallback(async (table: string, depId: string) => {
    resetController();

    try {
      await deleteRecord(table, depId, controllerRef.current.signal);
      setDependencyList(prev => prev.filter(d => d.depId !== depId));
    } catch (e) {
      errorHandler(e, 'Failed to delete dependency');
    }
  }, []);

  useEffect(() => {
    return () => controllerRef.current.abort();
  }, []);

  return (
    <div>
      <LiveCountsMount key={widget.guid} guid={widget.guid} />
      <DepSheet
        widget={widget.guid}
        table={sheetTable}
        dependencies={dependencyList}
        editable={widget.security.canWrite}
        removeCallback={removeDependency}
        addCallback={newDependency}
        manualReload={manualReload}
      />
      <Popover open={open} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <Settings />
            Widget Dependencies
            {summedDeps > 0 && (
              <Badge className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">{summedDeps}</Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-70 p-2">
          <div className="grid">
            <DepListItem
              label={depTableMap.m2m_sp_widget_dependency.label}
              table="m2m_sp_widget_dependency"
              field="sp_dependency"
              desc={depTableMap.m2m_sp_widget_dependency.desc}
              items={dependencyCounts.dependencies}
              isLoading={loadingTable === 'm2m_sp_widget_dependency'}
              openDep={openDepList}
            />
            <DepListItem
              label={depTableMap.m2m_sp_ng_pro_sp_widget.label}
              table="m2m_sp_ng_pro_sp_widget"
              field="sp_angular_provider"
              desc={depTableMap.m2m_sp_ng_pro_sp_widget.desc}
              items={dependencyCounts.providers}
              isLoading={loadingTable === 'm2m_sp_ng_pro_sp_widget'}
              openDep={openDepList}
            />
            <DepListItem
              label={depTableMap.sp_ng_template.label}
              table="sp_ng_template"
              field="id"
              desc={depTableMap.sp_ng_template.desc}
              items={dependencyCounts.templates}
              isLoading={loadingTable === 'sp_ng_template'}
              openDep={openDepList}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function DepListItem({ label, desc, items, table, field, isLoading, openDep }: DepListItemProps) {
  return (
    <div
      className="flex flex-col gap-1 p-2 rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground"
      onClick={() => openDep(table, field)}
    >
      <div className="text-sm leading-none font-medium flex justify-between items-center">
        <div>{label}</div>
        <div>
          {isLoading && <LoadingSpinner />}
          {!isLoading && !!items && (
            <Badge className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">{items}</Badge>
          )}
        </div>
      </div>
      <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">{desc}</p>
    </div>
  );
}

function DepSheet({ widget, table, dependencies, editable, addCallback, removeCallback, manualReload }: DepSheetProps) {
  const [open, setOpen] = useState(!!table);
  const [adding, setAdding] = useState(false);
  const [removalItem, setRemovalItem] = useState<string>('');
  const [newDep, setNewDep] = useState<SnRecordPickerItem | null>(null);

  const [modalForm, setModalForm] = useState<{
    open: boolean;
    title: string;
    table: string;
    guid: string;
    qry?: string;
  }>({
    open: false,
    title: '',
    table: '',
    guid: '',
  });

  const openModalForm = useCallback((table: string, guid: string, qry?: string) => {
    const title = depTableMap[table as keyof typeof depTableMap]?.label || 'Related Record';
    setModalForm({ open: true, title, table, guid, qry });
  }, []);

  const tableKey = table as keyof typeof depTableMap;
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null);
  const setSheetRef = useCallback((node: HTMLDivElement | null) => {
    if (node) setPortalEl(node);
  }, []);

  const processAddition = async (depId: string) => {
    setAdding(true);
    await addCallback(depId);
    setAdding(false);
    setNewDep(null);
  };

  const processRemoval = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, depId: string) => {
    e.stopPropagation();
    setRemovalItem(depId);
    await removeCallback(table!, depId);
    setRemovalItem('');
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setOpen(!!table), [table]);

  if (!table) return null;

  return (
    <Sheet open={open} onOpenChange={setOpen} modal={true}>
      <SheetContent
        ref={setSheetRef}
        className="overflow-y-auto gap-0 sm:max-w-[450px] md:max-w-[500px] text-accent-foreground"
      >
        <SheetHeader>
          <SheetTitle>{depTableMap[tableKey].label}</SheetTitle>
          <SheetDescription>{depTableMap[tableKey].desc}</SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min">
          {dependencies?.map((dep: Dependency) => (
            <div
              key={dep.depId}
              onClick={() => openModalForm(dep.linkTable, dep.value)}
              className="border-b border-muted py-4 px-4 flex items-center gap-2 last:border-0 cursor-pointer hover:bg-accent"
            >
              <div className="flex-1 basis-0 min-w-0">
                <div className="font-medium truncate">{dep.name}</div>

                <div className="text-sm text-muted-foreground flex items-center gap-1 min-w-0">
                  <Clock className="h-4 w-4 shrink-0" />
                  <p className="w-0 flex-1 truncate">{dep.created}</p>
                </div>
              </div>

              {editable && (
                <div className="shrink-0">
                  <Button variant="destructive" size="icon" onClick={e => processRemoval(e, dep.depId)}>
                    {removalItem === dep.depId ? (
                      <LoadingSpinner className="h-4 w-4 text-white" />
                    ) : (
                      <Trash className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        {modalForm.open && (
          <ModalForm
            open={modalForm.open}
            title={modalForm.title}
            table={modalForm.table}
            guid={modalForm.guid}
            query={modalForm.qry}
            setOpen={(open: boolean) => setModalForm({ open, title: '', table: '', guid: '', qry: '' })}
            onInsert={() => {
              setModalForm({ open: false, title: '', table: '', guid: '', qry: '' });
              manualReload('sp_ng_template', 'id');
            }}
          />
        )}

        {editable && (
          <SheetFooter>
            {table === 'sp_ng_template' ? (
              <div>
                <Button className="w-full" onClick={() => openModalForm('sp_ng_template', '-1', 'sp_widget=' + widget)}>
                  Create New Template
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <SnRecordPicker
                  table={depTableMap[tableKey].linkTable}
                  fields={[depTableMap[tableKey].linkField]}
                  query={`sys_idNOT IN${dependencies?.map(d => d.value).join(',')}`}
                  value={newDep}
                  onChange={record => setNewDep(record as SnRecordPickerItem)}
                  placeholder="Add a new dependency..."
                  clearable={true}
                  portalContainer={portalEl}
                />
                <Button
                  type="button"
                  size="icon"
                  disabled={!newDep || adding}
                  onClick={() => processAddition(newDep!.value)}
                >
                  {adding ? (
                    <LoadingSpinner className="h-4 w-4 text-primary-foreground" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                </Button>
              </div>
            )}
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}

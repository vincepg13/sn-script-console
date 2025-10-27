import { toast } from 'sonner';
import { Badge } from '../ui/badge';
import { Link } from 'react-router';
import { Button } from '../ui/button';
import { errorHandler } from '@/lib/utils';
import { ListRecord } from '@/types/list';
import { getRecords, revertVersion } from '@/lib/api';
import { instanceURI, versionFields } from '@/lib/config';
import { LoadingSpinner } from './LoadingSpinner';
import { useRef, useEffect, useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { Clock, User, History, GitCompareArrows, BadgeCheckIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '../ui/sheet';

type RecordVersionsProps = {
  table: string;
  recordId: string;
  open: boolean;
  editable: boolean;
  queryKey: string[];
  title?: string;
  description?: string;
  setOpen: (open: boolean) => void;
};

export function RecordVersions({
  table,
  recordId,
  queryKey,
  open,
  editable,
  title,
  description,
  setOpen,
}: RecordVersionsProps) {
  const controllerRef = useRef(new AbortController());

  const [loading, setLoading] = useState(true);
  const [reverting, setReverting] = useState('');
  const [versions, setVersions] = useState<ListRecord[]>([]);

  const qc = useQueryClient();
  const revertMutation = useMutation({
    mutationKey: [table, recordId, 'revert'],
    mutationFn: (versionId: string) => revertVersion(versionId),
    onMutate: versionId => setReverting(versionId),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey });
      toast.success('Widget reverted to selected version');
      setOpen(false);
    },

    onError: err => errorHandler(err, 'Failed to revert to selected version'),
    onSettled: () => setReverting(''),
  });

  const getVersionData = useCallback(async () => {
    controllerRef.current.abort();
    controllerRef.current = new AbortController();
    const versionQuery = `name=${table}_${recordId}^ORDERBYDESCsys_recorded_at`;

    try {
      setLoading(true);
      const versionData = await getRecords(
        'sys_update_version',
        versionQuery,
        versionFields,
        controllerRef.current.signal
      );
      setVersions(versionData);
    } catch (e) {
      errorHandler(e, 'Failed to fetch version data');
    } finally {
      setLoading(false);
    }
  }, [recordId, table]);

  useEffect(() => {
    if (!open) {
      controllerRef.current.abort();
      return setVersions([]);
    }

    getVersionData();
    const controller = controllerRef.current;
    return () => controller.abort();
  }, [getVersionData, open]);

  return (
    <Sheet open={open} onOpenChange={setOpen} modal={true}>
      <SheetContent className="overflow-y-auto gap-0 sm:max-w-[450px] md:max-w-[500px] text-accent-foreground">
        <SheetHeader>
          <SheetTitle>{title || 'Record Version History'}</SheetTitle>
          <SheetDescription>
            {description || 'Review, compare and revert to a previous version of this record.'}
          </SheetDescription>
        </SheetHeader>
        <hr></hr>
        {open && (
          <div>
            {loading ? (
              <div className="p-4 text-muted-foreground flex gap-2 items-center">
                <LoadingSpinner />
                Loading version data...
              </div>
            ) : (
              <div className="grid flex-1 auto-rows-min">
                {open &&
                  versions?.map((v, i) => (
                    <div
                      key={v.sys_id.value}
                      className="border-b border-muted p-4 flex items-center gap-2 last:border-0 hover:bg-accent"
                    >
                      <div className="flex-1 basis-0 min-w-0">
                        <div className="font-medium truncate">{v.source.display_value}</div>

                        <div className="text-sm text-muted-foreground flex items-center gap-1 min-w-0">
                          <Clock className="h-4 w-4 shrink-0" />
                          <p className="">{v.sys_recorded_at.display_value}</p>
                          <User className="h-4 w-4 shrink-0" />
                          <p className="">{v.sys_created_by.display_value}</p>
                        </div>
                      </div>
                      {i === 0 ? (
                        <Badge variant="secondary" className="bg-blue-500 text-white dark:bg-blue-600">
                          <BadgeCheckIcon />
                          Current
                        </Badge>
                      ) : (
                        <div className="flex gap-1 items-center">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button size="sm" variant="outline" asChild>
                                <Link
                                  to={`${instanceURI}/merge_form_current_version.do?sysparm_version_id=${v.sys_id.value}`}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  <GitCompareArrows />
                                </Link>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Compare to current</TooltipContent>
                          </Tooltip>
                          {editable && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => revertMutation.mutate(v.sys_id.value)}
                                >
                                  {reverting === v.sys_id.value ? <LoadingSpinner /> : <History />}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Revert to this version</TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

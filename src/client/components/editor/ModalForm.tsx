import { getApi } from '@/lib/utils';
import { SnFormWrapper } from 'sn-shadcn-kit/form';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog';

type ModalFormProps = {
  open: boolean;
  title: string;
  table: string;
  guid: string;
  view?: string;
  query?: string;
  setOpen: (open: boolean) => void;
  onInsert?(guid: string): void;
};

export function ModalForm({ open, title, table, guid, view, query, setOpen, onInsert }: ModalFormProps) {
  const apis = getApi(table, guid, view, query);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="sm:max-w-[425px] md:max-w-[600px] lg:max-w-[800px] max-h-[80%] overflow-y-auto text-accent-foreground"
        onInteractOutside={e => {
          e.preventDefault();
        }}
      >
        <DialogTitle className="text-lg font-medium mb-4">{title}</DialogTitle>
        <DialogDescription className="sr-only">Form within modal</DialogDescription>
        <SnFormWrapper table={table} guid={guid} apis={apis} enableAttachments={false} snInsert={onInsert} />
      </DialogContent>
    </Dialog>
  );
}

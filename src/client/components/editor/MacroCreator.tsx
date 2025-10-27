import { toast } from 'sonner';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { createMacro } from '@/lib/api';
import { useNavigate } from 'react-router';
import { errorHandler } from '@/lib/utils';
import { Ban, SquareStack } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { useEffect, useRef, useState } from 'react';
import { DialogHeader, DialogFooter } from '../ui/dialog';
import { LoadingSpinner } from '../generic/LoadingSpinner';
import { SnRecordPickerItem, SnRecordPicker } from 'sn-shadcn-kit/standalone';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';

type MacroCreatorProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const getFormField = (formEvent: React.FormEvent<HTMLFormElement>, name: string) => {
  const form = formEvent.currentTarget;
  return (form.elements.namedItem(name) as HTMLInputElement)?.value;
};

export function MacroCreator({ open, setOpen }: MacroCreatorProps) {
  const navigate = useNavigate();

  const [creating, setCreating] = useState(false);
  const [invalidTable, setInvalidTable] = useState(false);
  const [table, setTable] = useState<SnRecordPickerItem | null>(null);

  const controllerRef = useRef(new AbortController());
  useEffect(() => () => controllerRef.current?.abort(), []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    controllerRef.current.abort();
    controllerRef.current = new AbortController();

    setInvalidTable(false);
    if (!table?.value) return setInvalidTable(true);

    try {
      setCreating(true);

      const macroData = {
        formatter: getFormField(event, 'f-label'),
        macro: getFormField(event, 'f-macro'),
        table: table.primary!,
        widget: getFormField(event, 'w-name'),
      };

      const macro = await createMacro(macroData, controllerRef.current.signal);
      if (macro.widgetId) {
        toast.success('Macro widget created');
        navigate(`/widget_editor/${macro.widgetId}`);
        setOpen(false);
      }
    } catch (e) {
      errorHandler(e, 'Failed to create macro widget');
    } finally {
      setCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form id="macro-form" onSubmit={handleSubmit} autoComplete="off">
        <DialogContent className="sm:max-w-[425px] text-accent-foreground">
          <DialogHeader>
            <DialogTitle>Create Macro Widget</DialogTitle>
            <DialogDescription>
              Create a macro replacement widget to be embedded within the form widget.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="formatter-label">Formatter Label</Label>
              <Input id="formatter-label" name="f-label" form="macro-form" required />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="formatter-name">Formatter Name</Label>
              <Input id="formatter-name" name="f-name" form="macro-form" required />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="widget-name">Widget Name</Label>
              <Input id="widget-name" name="w-name" form="macro-form" required />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="widget-name">Table</Label>
              <SnRecordPicker
                table="sys_db_object"
                fields={['label', 'name']}
                query="ORDERBYDESCsys_updated_on"
                value={table}
                onChange={r => setTable(r as SnRecordPickerItem)}
                placeholder="Select a table..."
                clearable={false}
              />
              {invalidTable && (
                <p className="text-sm text-red-500">Select the table your macro widget will be available on</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild className="flex-1">
              <Button variant="outline">
                <Ban className="h-5 w-5" />
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="flex-1" form="macro-form" disabled={creating}>
              {creating ? <LoadingSpinner /> : <SquareStack className="h-5 w-5" />}
              Create macro
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

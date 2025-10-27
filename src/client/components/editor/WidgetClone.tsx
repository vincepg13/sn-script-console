import { toast } from 'sonner';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { cloneWidget } from '@/lib/api';
import { useNavigate } from 'react-router';
import { errorHandler } from '@/lib/utils';
import { Ban, CopyPlus } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { useEffect, useRef, useState } from 'react';
import { DialogHeader, DialogFooter } from '../ui/dialog';
import { LoadingSpinner } from '../generic/LoadingSpinner';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';

type WidgetCloneProps = {
  widgetId: string;
  oName: string;
  oId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export function WidgetClone({ widgetId, oName, oId, open, setOpen }: WidgetCloneProps) {
  const navigate = useNavigate();
  const [cloning, setCloning] = useState(false);
  const [name, setName] = useState(`${oName} Copy`);
  const [id, setId] = useState(oId ? `${oId}-copy` : '');

  const controllerRef = useRef(new AbortController());
  useEffect(() => () => controllerRef.current?.abort(), []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    controllerRef.current.abort();
    controllerRef.current = new AbortController();
    
    try {
      setCloning(true);
      const cloneRes = await cloneWidget(widgetId, name, id, controllerRef.current.signal);
      if (cloneRes.guid) {
        navigate('/widget_editor/' + cloneRes.guid);
        toast.success('Widget cloned');
        setOpen(false);
      } else {
        toast.error(cloneRes.message);
      }
    } catch (e) {
      errorHandler(e, 'Failed to clone widget');
    } finally {
      setCloning(false);
    }
  };

  const buildId = (name: string) => {
    setId(
      name
        .toLowerCase()
        .replace(/[^a-z0-9-]/gi, '-')
        .replace(/^-|-$/g, '')
    );
  };

  const correctId = (id: string) => {
    if (!id) return;
    setId(id.toLocaleLowerCase().replace(/[^a-z0-9-]/gi, '-'));
  };

  const nameChange = (v: string) => {
    setName(v);
    buildId(v);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form id="clone-form" onSubmit={handleSubmit} autoComplete="off">
        <DialogContent className="sm:max-w-[425px] text-accent-foreground">
          <DialogHeader>
            <DialogTitle>Clone Widget</DialogTitle>
            <DialogDescription>Update the name and id respectively then submit to clone this widget.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="clone-name">Widget Name</Label>
              <Input
                id="clone-name"
                name="name"
                value={name}
                onChange={e => nameChange(e.target.value)}
                required
                form="clone-form"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="clone-id">Widget ID</Label>
              <Input
                id="clone-id"
                name="id"
                value={id}
                onChange={e => correctId(e.target.value)}
                onBlur={() => setId(prev => prev.replace(/^-+|-+$/g, ''))}
                form="clone-form"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild className="flex-1">
              <Button variant="outline">
                <Ban className="h-5 w-5" />
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="flex-1" form="clone-form" disabled={cloning}>
              {cloning ? <LoadingSpinner /> : <CopyPlus className="h-5 w-5" />}
              Clone widget
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

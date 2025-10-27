import { toast } from 'sonner';
import { useRef, useState } from 'react';
import { createWidget } from '@/lib/api';
import { Textarea } from '../ui/textarea';
import { errorHandler } from '@/lib/utils';
import { NewWidget } from '@/types/widget';
import { useNavigate } from 'react-router';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BadgePlus, Ban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { LoadingSpinner } from '../generic/LoadingSpinner';

export function NewWidgetModal({ button, tooltip }: { button?: React.ReactNode; tooltip?: string }) {
  const navigate = useNavigate();
  const controllerRef = useRef(new AbortController());

  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    controllerRef.current.abort();
    controllerRef.current = new AbortController();

    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      setCreating(true);
      const res = await createWidget(data as NewWidget, controllerRef.current.signal);
      if (res) {
        setOpen(false);
        navigate('/widget_editor/' + res);
      } else {
        toast.error('Failed to create widget');
      }
    } catch (error) {
      errorHandler(e, 'Failed to create widget');
    } finally {
      setCreating(false);
    }
  };

  const DefaultTrigger = (
    <Button type="button">
      <BadgePlus />
      Create Widget
    </Button>
  );

  const TriggerWithOptionalTooltip = button ? (
    tooltip ? (
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>{button}</DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    ) : (
      <DialogTrigger asChild>{button}</DialogTrigger>
    )
  ) : (
    <DialogTrigger asChild>{DefaultTrigger}</DialogTrigger>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {TriggerWithOptionalTooltip}
      <DialogContent className="sm:max-w-[450px] text-accent-foreground">
        <DialogHeader>
          <DialogTitle>Create new widget</DialogTitle>
          <DialogDescription>
            Fill in the initial details for your new widget. On submit you will be redirected to the widget editor.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="grid gap-4 mb-4">
            <div className="grid gap-3">
              <Label htmlFor="widget-name">Name</Label>
              <Input id="widget-name" name="name" placeholder="Enter a widget name..." required />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="widget-id">Widget ID</Label>
              <Input id="widget-id" name="id" placeholder="Enter a unique widget id..." />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="widget-desc">Widget Description</Label>
              <Textarea id="widget-desc" name="description" placeholder="Enter a widget description..." />
            </div>
          </div>
          <DialogFooter className="">
            <DialogClose asChild className="flex-1">
              <Button variant="outline">
                <Ban />
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="flex-1">
              {creating ? (
                <>
                  <LoadingSpinner /> Creating...
                </>
              ) : (
                <>
                  <BadgePlus />
                  Submit Widget
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

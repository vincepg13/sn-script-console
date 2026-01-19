import { toast } from 'sonner';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppData } from '@/context/app-context';
import { SnCodeMirrorHandle, SnScriptEditor } from 'sn-shadcn-kit/script';
import { ReactNode, useRef } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';

type JsonDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  json: string;
  setJson: (value: string) => void;
  onSave: () => void;
  title: string;
  description?: ReactNode;
};

export function JsonDialog({ open, setOpen, json, setJson, onSave, title, description }: JsonDialogProps) {
  const { config } = useAppData();
  const { preferences, esLintConfig, prettierConfig } = config;

  const saveButtonRef = useRef<HTMLButtonElement>(null);
  const editorRef = useRef<SnCodeMirrorHandle>(null);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== 's') return;
    event.preventDefault();

    saveButtonRef.current?.click();
  };

  const handleSave = () => {
    const nextJson = editorRef.current?.getRawValue() || '';

    try {
      JSON.parse(nextJson);
    } catch {
      return toast.error('Invalid JSON');
    }

    setJson(nextJson);
    onSave();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[700px] text-accent-foreground" onKeyDown={handleKeyDown}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? <div className="text-muted-foreground text-sm">{description}</div> : null}
        </DialogHeader>
        <SnScriptEditor
          snType="json"
          table="sys_user_preference"
          fieldName="value"
          content={json}
          height="400px"
          theme={preferences?.theme || 'atom'}
          lineWrapping={false}
          readonly={false}
          esLintConfig={esLintConfig ?? undefined}
          prettierOptions={prettierConfig ?? undefined}
          bounceTime={200}
          customToolbar={null}
          onReady={r => (editorRef.current = r)}
        />
        <DialogFooter>
          <Button ref={saveButtonRef} type="button" className="w-full" onClick={() => handleSave()}>
            <Save /> Save Changes (Ctrl + S)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

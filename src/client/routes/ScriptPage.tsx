import { useUnsavedChanges } from '@/components/editor/hooks/useUnsavedChanges';
import { UnsavedChangesModal } from '@/components/generic/UnsavedChangesModal';
import { ScriptField } from '@/components/script/ScriptField';
import { ScriptHeader } from '@/components/script/ScriptHeader';
import { ScriptProvider, useScript } from '@/context/script-context';

export default function ScriptPage() {
  return (
    <ScriptProvider>
      <div className="flex h-full min-h-0 flex-col gap-4">
        <div className="shrink-0">
          <ScriptHeader />
        </div>
        <div className="flex-1 min-h-0">
          <ScriptField />
        </div>
      </div>
      <GuardedEditor />
    </ScriptProvider>
  );
}

function GuardedEditor() {
  const { stagedChanges } = useScript();
  const guard = useUnsavedChanges(stagedChanges);

  return (
    <UnsavedChangesModal
      title="You have staged changes"
      description="You have unsaved changes on this widget. Navigating away will discard those changes. Are you sure you want to continue?"
      open={guard.open}
      setOpen={guard.setOpen}
      onConfirm={guard.confirm}
      onCancel={guard.cancel}
    />
  );
}

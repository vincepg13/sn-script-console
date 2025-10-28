import { useUnsavedChanges } from '@/hooks/useUnsavedChanges';
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
  const { stagedChanges, setStagedChanges } = useScript();
  const guard = useUnsavedChanges(stagedChanges);

  const handleConfirmation = () => {
    setStagedChanges(false);
    guard.confirm();
  };

  return (
    <UnsavedChangesModal
      title="You have staged changes"
      description="You have unsaved changes on this widget. Navigating away will discard those changes. Are you sure you want to continue?"
      open={guard.open}
      setOpen={guard.setOpen}
      onConfirm={handleConfirmation}
      onCancel={guard.cancel}
    />
  );
}

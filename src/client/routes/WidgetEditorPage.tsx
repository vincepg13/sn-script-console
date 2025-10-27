import { useUnsavedChanges } from '@/components/editor/hooks/useUnsavedChanges';
import { WidgetEditor } from '@/components/editor/WidgetEditor';
import { UnsavedChangesModal } from '@/components/generic/UnsavedChangesModal';
import { useWidget, WidgetProvider } from '@/context/widget-context';

export default function WidgetEditorPage() {
  return (
    <WidgetProvider>
      <GuardedEditor />
    </WidgetProvider>
  );
}

function GuardedEditor() {
  const { stagedChanges } = useWidget();
  const guard = useUnsavedChanges(stagedChanges);

  return (
    <>
      <UnsavedChangesModal
        title="You have staged changes"
        description="You have unsaved changes on this widget. Navigating away will discard those changes. Are you sure you want to continue?"
        open={guard.open}
        setOpen={guard.setOpen}
        onConfirm={guard.confirm}
        onCancel={guard.cancel}
      />
      <WidgetEditor />
    </>
  );
}

import { PolicyProvider, usePolicy } from '@/context/policy-context';
import { PolicyHeader } from '@/components/policy/PolicyHeader';
import { PolicyActions } from '@/components/policy/PolicyActions';
import { MountedTabs, TabsContent } from '@/components/ui/mounted-tabs';
import { useState } from 'react';
import PolicyForm from '@/components/policy/PolicyForm';
import { useLazyUnsavedChanges } from '@/hooks/useLazyUnsavedChanges';
import { UnsavedChangesModal } from '@/components/generic/UnsavedChangesModal';

export function PolicyPage() {
  const [tab, setTab] = useState('policy');

  return (
    <PolicyProvider>
      <MountedTabs value={tab} onValueChange={setTab} className="h-full min-h-0">
        <div className="flex flex-col gap-4 pb-6">
          <div className="shrink-0">
            <PolicyHeader />
          </div>
          <div className="flex-1 min-h-0">
            <TabsContent value="policy">
              <PolicyForm />
            </TabsContent>

            <TabsContent value="actions">
              <PolicyActions />
            </TabsContent>
          </div>
        </div>
      </MountedTabs>
      <GuardedEditor />
    </PolicyProvider>
  );
}

function GuardedEditor() {
  const { checkDirty } = usePolicy();
  const guard = useLazyUnsavedChanges(checkDirty);

  return (
    <UnsavedChangesModal
      title="You have unsaved actions"
      description="You have unsaved actions on this policy. Navigating away will discard those changes. Continue?"
      open={guard.open}
      setOpen={guard.setOpen}
      onConfirm={guard.confirm}
      onCancel={guard.cancel}
    />
  );
}
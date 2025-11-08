import { PolicyProvider } from '@/context/policy-context';
import { PolicyHeader } from '@/components/policy/PolicyHeader';
import { PolicyActions } from '@/components/policy/PolicyActions';
import { MountedTabs, TabsContent } from '@/components/ui/mounted-tabs';
import { useState } from 'react';
import PolicyForm from '@/components/policy/PolicyForm';

export function PolicyPage() {
  const [tab, setTab] = useState('policy');

  return (
    <PolicyProvider>
      <MountedTabs value={tab} onValueChange={setTab} className="flex h-full min-h-0 flex-col gap-4">
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
      </MountedTabs>
      {/* <GuardedEditor /> */}
    </PolicyProvider>
  );
}

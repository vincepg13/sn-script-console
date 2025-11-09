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
      {/* <GuardedEditor /> */}
    </PolicyProvider>
  );
}

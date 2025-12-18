import { useState } from 'react';
import { PropertyProvider } from '@/context/property-context';
import { ValueEditor } from '@/components/property/ValueEditor';
import { PropertyForm } from '@/components/property/PropertyForm';
import { PropertyHeader } from '@/components/property/PropertyHeader';
import { MountedTabs, TabsContent } from '@/components/ui/mounted-tabs';

export function PropertyPage() {
    const [tab, setTab] = useState('form');
  
  return (
    <PropertyProvider>
      <MountedTabs value={tab} onValueChange={setTab} className="h-full min-h-0">
        <div className="flex flex-col gap-4 pb-6">
          <div className="shrink-0">
            <PropertyHeader />
          </div>
          <div className="flex-1 min-h-0">
            <TabsContent value="form">
              <PropertyForm />
            </TabsContent>

            <TabsContent value="value">
              <ValueEditor />
            </TabsContent>
          </div>
        </div>
      </MountedTabs>
    </PropertyProvider>
  );
}

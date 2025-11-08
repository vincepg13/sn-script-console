import { getApi } from '@/lib/utils';
import { SnFormWrapper } from 'sn-shadcn-kit/form';
import { Card, CardContent } from '@/components/ui/card';
import { usePolicy } from '@/context/policy-context';
import { useState } from 'react';
import { GeneralLoader } from '../generic/GeneralLoader';

export default function PolicyForm() {
  const table = 'sys_ui_policy';
  const [formMounted, setFormMounted] = useState(false);
  const { policy, isLoading, isFetching } = usePolicy();
  const { guid } = policy;

  const apis = getApi(table, guid, 'advanced');

  if (!formMounted && (isLoading || isFetching)) return <GeneralLoader />;

  return (
    <div className="pb-10">
      <Card className="w-full">
        <CardContent>
          <SnFormWrapper table={table} guid={guid} apis={apis} enableAttachments={false} snMount={() => setFormMounted(true)} />
        </CardContent>
      </Card>
    </div>
  );
}

import { getApi } from '@/lib/utils';
import { SnFormWrapper } from 'sn-shadcn-kit/form';
import { usePolicy } from '@/context/policy-context';
import { Card, CardContent } from '@/components/ui/card';
import { GeneralLoader } from '../generic/GeneralLoader';
import { useEffect, useEffectEvent, useState } from 'react';

export default function PolicyForm() {
  const table = 'sys_ui_policy';
  const [formMounted, setFormMounted] = useState(false);
  const { policy, withinScope, isLoading, isFetching } = usePolicy();

  const { guid } = policy;
  const apis = getApi(table, guid, 'advanced');

  const unmountEvent = useEffectEvent(() => {
    if (formMounted) setFormMounted(false);
  });
  useEffect(() => unmountEvent(), [withinScope]);

  if (!formMounted && (isLoading || isFetching)) return <GeneralLoader />;

  return (
    <Card className="w-full">
      <CardContent>
        <SnFormWrapper
          key={policy.scope}
          table={table}
          guid={guid}
          apis={apis}
          enableAttachments={false}
          snMount={() => setFormMounted(true)}
        />
      </CardContent>
    </Card>
  );
}

import { getApi } from '@/lib/utils';
import { SnFormWrapper } from 'sn-shadcn-kit/form';
import { Card, CardContent } from '@/components/ui/card';
import { GeneralLoader } from '../generic/GeneralLoader';

type FormProps = {
  table: string;
  guid: string;
  id: string;
  view?: string;
  isLoading?: boolean;
  refetch: () => void;
};

export default function EmbeddedForm({ table, guid, view, id, isLoading, refetch }: FormProps) {
  const apis = getApi(table, guid, view);

  if (isLoading) return <GeneralLoader />;

  return (
    <Card className="w-full">
      <CardContent>
        <SnFormWrapper
          key={id}
          table={table}
          guid={guid}
          apis={apis}
          enableAttachments={false}
          snSubmit={() => refetch()}
        />
      </CardContent>
    </Card>
  );
}

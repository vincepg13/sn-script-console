import { Card, CardContent } from '@/components/ui/card';
import { getApi } from '@/lib/utils';
import { useParams } from 'react-router';
import { SnFormWrapper } from 'sn-shadcn-kit/form';

export default function FormPage() {
  const { table, sys_id } = useParams<{ table: string; sys_id: string }>();
  if (!table || !sys_id) return null;

  const apis = getApi(table, sys_id);

  return (
    <div className="pb-10">
      <Card className="w-full">
        <CardContent>
          <SnFormWrapper table={table} guid={sys_id} apis={apis} enableAttachments={false} />
        </CardContent>
      </Card>
    </div>
  );
}

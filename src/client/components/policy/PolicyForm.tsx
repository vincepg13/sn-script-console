import EmbeddedForm from '../generic/EmbeddedForm';
import { usePolicy } from '@/context/policy-context';

export default function PolicyForm() {
  const { policy, inScope, isLoading, refetch } = usePolicy();
  const { guid } = policy;
 
  return (
    <EmbeddedForm
      table="sys_ui_policy"
      guid={guid}
      id={guid + "/" + inScope}
      isLoading={isLoading}
      refetch={refetch}
    />
  );
}

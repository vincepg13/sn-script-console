import EmbeddedForm from '../generic/EmbeddedForm';
import { useProperty } from '@/context/property-context';

export function PropertyForm() {
  const { property, isLoading, refetch } = useProperty();

  const formKey = `${property.guid}/${property.canWrite}/${property.modCount}`;

  return (
    <EmbeddedForm
      table="sys_properties"
      guid={property.guid}
      id={formKey}
      isLoading={isLoading}
      refetch={refetch}
    />
  );
}

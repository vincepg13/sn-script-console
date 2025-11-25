import { useProperty } from '@/context/property-context';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModifyPackage } from '../generic/ModifyPackage';
import { OpenInInstance } from '../generic/OpenInInstance';
import { Spinner } from '../ui/spinner';

export function PropertyHeader() {
  const table = 'sys_properties';
  const { property, isFetching } = useProperty();

  return (
    <div className="grid grid-cols-[1fr_2fr_1fr] items-center w-full gap-1">
      <div className="flex gap-2 items-center">
        <ModifyPackage table={table} />
        {isFetching && <Spinner type="loader" className="size-5" />}
      </div>
      <div className="flex justify-center">
        <TabsList className="h-9 overflow-hidden w-full max-w-lg">
          <TabsTrigger value="form" className="px-3">
            System Property
          </TabsTrigger>
          <TabsTrigger value="value" className="px-3">
            Value Editor
          </TabsTrigger>
        </TabsList>
      </div>
      <div className="flex justify-end">
        <OpenInInstance table={table} guid={property.guid} />
      </div>
    </div>
  );
}

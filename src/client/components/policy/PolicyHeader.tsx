import { usePolicy } from '@/context/policy-context';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModifyPackage } from '../generic/ModifyPackage';
import { OpenInInstance } from '../generic/OpenInInstance';
import { Spinner } from '../ui/spinner';

export function PolicyHeader() {
  const { policy, isFetching } = usePolicy();

  return (
    <div className="grid grid-cols-[1fr_2fr_1fr] items-center w-full gap-1">
      <div className="flex gap-2 items-center">
        <ModifyPackage table="sys_ui_policy" />
        {isFetching && <Spinner type="loader" className="size-5" />}
      </div>
      <div className="flex justify-center">
        {/* You can have other header controls here */}
        <TabsList className="h-9 overflow-hidden w-full max-w-lg">
          <TabsTrigger value="policy" className="px-3">
            UI Policy
          </TabsTrigger>
          <TabsTrigger value="actions" className="px-3">
            UI Policy Actions
          </TabsTrigger>
        </TabsList>
      </div>
      <div className="flex justify-end">
        <OpenInInstance table="sys_ui_policy" guid={policy.guid} />
      </div>
    </div>
  );
}

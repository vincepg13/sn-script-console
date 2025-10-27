import { Spinner } from "../ui/spinner";

export function GeneralLoader() {
  return (
    <div className="flex h-[70vh] w-full items-center justify-center">
      <div className="flex flex-col items-center space-y-2">
        <Spinner className="size-10 text-muted-foreground" />
        <p className="text-lg text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    </div>
  );
}

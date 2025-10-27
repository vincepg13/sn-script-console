import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";

export function LoadingSpinner({className}: {className?: string}) {
  return <Loader className={cn("h-5 w-5 animate-spin text-muted-foreground", className)} />;
}
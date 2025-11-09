import { Loader, Loader2Icon } from "lucide-react"

import { cn } from "@/lib/utils"

const iconMap = {
  loader: Loader,
  default: Loader2Icon,
}

type LoaderProps = React.ComponentProps<"svg"> & {
  type?: keyof typeof iconMap
}

function Spinner({ className, type = "default", ...props }: LoaderProps) {
  const IconComponent = iconMap[type];
  return (
    <IconComponent
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  )
}

export { Spinner }

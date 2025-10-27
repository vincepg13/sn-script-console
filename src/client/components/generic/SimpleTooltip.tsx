import { ReactNode } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

export function SimpleTooltip({ content, children }: { content: string; children: ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>
        <p>{content}</p>
      </TooltipContent>
    </Tooltip>
  );
}

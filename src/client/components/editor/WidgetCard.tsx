import { Badge } from '../ui/badge';
import { Link } from 'react-router';
import { Button } from '../ui/button';
import { SnAvatar } from 'sn-shadcn-kit/user';
import { WidgetCardItem } from '@/types/widget';
import { Clock, SquareArrowOutUpRight, SquareCode } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { Card, CardTitle, CardAction, CardContent, CardFooter } from '../ui/card';

export function WidgetCard({ name, scope, guid, updater }: WidgetCardItem) {
  return (
    <Card className="w-full gap-4 pt-4 pb-5">
      <div className="flex items-center justify-between gap-4 px-5">
        <CardTitle>{name}</CardTitle>
        {updater.name && updater.initials && (
          <CardAction>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <SnAvatar name={updater.name} initials={updater.initials} image={updater.photo} className="size-9" />
                </div>
              </TooltipTrigger>
              <TooltipContent>Last updated by: {updater.name}</TooltipContent>
            </Tooltip>
          </CardAction>
        )}
      </div>
      <CardContent>
        <div className="text-muted-foreground text-sm flex gap-1 flex-wrap">
          <Badge variant="outline">
            <Clock /> {updater.updated}
          </Badge>
          <Badge variant="outline">
            <SquareCode /> {scope}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="flex items-center gap-2 mt-auto">
        <Button type="button" variant="outline" size="sm" className="flex-1" asChild>
          <Link to={`/widget_editor/${guid}`} className="flex items-center gap-2">
            <SquareArrowOutUpRight /> Open In Editor
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

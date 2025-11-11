import { Link } from 'react-router';
import { Button } from '../ui/button';
import { instanceURI } from '@/lib/config';
import { SimpleTooltip } from './SimpleTooltip';
import { SquareArrowOutUpRight } from 'lucide-react';

export function OpenInInstance({ table, guid }: { table: string; guid: string }) {
  return (
    <SimpleTooltip content="Open in instance">
      <Button variant="outline" size="icon" asChild>
        <Link
          to={`${instanceURI}/${table}.do?sys_id=${guid}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center"
        >
          <SquareArrowOutUpRight />
        </Link>
      </Button>
    </SimpleTooltip>
  );
}

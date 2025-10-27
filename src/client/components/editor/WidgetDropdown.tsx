import { useState } from 'react';
import { Link } from 'react-router';
import { WidgetRes } from '@/types/widget';
import { WidgetClone } from './WidgetClone';
import { Button } from '@/components/ui/button';
import { RecordVersions } from '../generic/RecordVersions';
import { ChevronDownCircle, Copy, Download, ExternalLink, History, SquareCode } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MacroCreator } from './MacroCreator';
import { instanceURI } from '@/lib/config';

export function WidgetDropdown({ widget }: { widget: WidgetRes }) {
  const [cloning, setCloning] = useState(false);
  const [macroing, setMacroing] = useState(false);
  const [versioning, setVersioning] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <ChevronDownCircle />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuLabel>Additional Actions</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link to={`${instanceURI}/sp_widget.do?UNL&sysparm_query=sys_id=${widget.guid}`}>
                Export to XML
                <DropdownMenuShortcut>
                  <Download />
                </DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setCloning(true)}>
              Clone
              <DropdownMenuShortcut>
                <Copy />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={`${instanceURI}/sp_widget.do?sys_id=${widget.guid}`} target="_blank" rel="noreferrer">
                Open in Platform
                <DropdownMenuShortcut>
                  <ExternalLink />
                </DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setVersioning(true)}>
              Show Versions
              <DropdownMenuShortcut>
                <History />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setMacroing(true)}>
              Create Macro
              <DropdownMenuShortcut>
                <SquareCode />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      {cloning && (
        <WidgetClone
          widgetId={widget.guid}
          oName={widget.fields.name.display_value || ''}
          oId={widget.fields.id.value || ''}
          open={cloning}
          setOpen={setCloning}
        />
      )}
      {macroing && <MacroCreator open={macroing} setOpen={setMacroing} />}
      <RecordVersions
        title="Widget Version History"
        table="sp_widget"
        recordId={widget.guid}
        open={versioning}
        editable={widget.security.canWrite}
        queryKey={['widgetData', widget.guid]}
        setOpen={setVersioning}
      />
    </>
  );
}

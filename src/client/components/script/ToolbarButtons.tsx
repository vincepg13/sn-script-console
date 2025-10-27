import { Button } from '../ui/button';
import { memo, RefObject } from 'react';
import { SimpleTooltip } from '../generic/SimpleTooltip';
import { SnCodeMirrorHandle } from 'sn-shadcn-kit/script';
import { SearchCode, MessageSquareCode, Wand2, Maximize2 } from 'lucide-react';

export const ToolbarButtons = memo(function ToolbarButtons({
  canWrite,
  editorRef,
}: {
  canWrite: boolean;
  editorRef: RefObject<SnCodeMirrorHandle | null>;
}) {
  return (
    <>
      <SimpleTooltip content="Search (Ctrl + F)">
        <Button variant="outline" size="icon" onClick={() => editorRef.current?.openSearch?.()}>
          <SearchCode />
        </Button>
      </SimpleTooltip>

      {canWrite && (
        <>
          <SimpleTooltip content="Comment (Ctrl + /)">
            <Button variant="outline" size="icon" onClick={() => editorRef.current?.toggleComment?.()}>
              <MessageSquareCode />
            </Button>
          </SimpleTooltip>
          <SimpleTooltip content="Format (Shift + Alt + F)">
            <Button variant="outline" size="icon" onClick={() => editorRef.current?.format?.()}>
              <Wand2 />
            </Button>
          </SimpleTooltip>
        </>
      )}

      <SimpleTooltip content="Full screen (Ctrl + M)">
        <Button variant="outline" size="icon" onClick={() => editorRef.current?.toggleMax?.()}>
          <Maximize2 />
        </Button>
      </SimpleTooltip>
    </>
  );
});

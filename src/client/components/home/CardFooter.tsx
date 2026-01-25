import { Braces, RotateCcw, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SnLoadingSpinner } from 'sn-shadcn-kit/ui';
import { SnSimpleTooltip } from 'sn-shadcn-kit/ui';
import { CardFooter } from '../ui/card';

type CardFooterProps = {
  formId: string;
  isDefault: boolean;
  isSaving: boolean;
  onReset: () => void;
  onOpenJson: () => void;
};

export function SnCardFooter({ formId, isDefault, isSaving, onReset, onOpenJson }: CardFooterProps) {
  return (
    <CardFooter className="flex gap-2 mt-auto">
      {!isDefault && (
        <SnSimpleTooltip content="Reset to Defaults">
          <Button type="button" variant="outline" size="icon" onClick={onReset}>
            <RotateCcw />
          </Button>
        </SnSimpleTooltip>
      )}
      <Button type="submit" className="flex-1" form={formId} disabled={isSaving}>
        {isSaving ? (
          <span className="flex items-center gap-2">
            <SnLoadingSpinner /> Saving...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Save /> Save Changes
          </span>
        )}
      </Button>
      <SnSimpleTooltip content="Edit Raw JSON">
        <Button type="button" variant="outline" size="icon" onClick={onOpenJson}>
          <Braces />
        </Button>
      </SnSimpleTooltip>
    </CardFooter>
  );
}

import { Braces, RotateCcw, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '../generic/LoadingSpinner';
import { SimpleTooltip } from '../generic/SimpleTooltip';
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
        <SimpleTooltip content="Reset to Defaults">
          <Button type="button" variant="outline" size="icon" onClick={onReset}>
            <RotateCcw />
          </Button>
        </SimpleTooltip>
      )}
      <Button type="submit" className="flex-1" form={formId} disabled={isSaving}>
        {isSaving ? (
          <span className="flex items-center gap-2">
            <LoadingSpinner /> Saving...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Save /> Save Changes
          </span>
        )}
      </Button>
      <SimpleTooltip content="Edit Raw JSON">
        <Button type="button" variant="outline" size="icon" onClick={onOpenJson}>
          <Braces />
        </Button>
      </SimpleTooltip>
    </CardFooter>
  );
}

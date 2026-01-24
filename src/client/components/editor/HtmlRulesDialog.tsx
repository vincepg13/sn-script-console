import { Braces } from 'lucide-react';
import { setPreference } from '@/lib/api';
import { errorHandler } from '@/lib/utils';
import type { WidgetRes } from '@/types/widget';
import { Button } from '@/components/ui/button';
import { JsonDialog } from '../generic/JsonDialog';
import { SnSimpleTooltip } from 'sn-shadcn-kit/ui';
import { useEffect, useRef, useState } from 'react';
import { useWidget } from '@/context/widget-context';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type HtmlRulesDialogProps = {
  rules: WidgetRes['htmlRules'];
};

export function HtmlRulesDialog({ rules }: HtmlRulesDialogProps) {
  const qc = useQueryClient();
  const { widget } = useWidget();
  const [open, setOpen] = useState(false);
  const [localRules, setLocalRules] = useState<WidgetRes['htmlRules']>(rules);
  const latestRulesRef = useRef<WidgetRes['htmlRules']>(rules);

  useEffect(() => {
    setLocalRules(rules);
    latestRulesRef.current = rules;
  }, [rules]);

  const saveMutation = useMutation({
    mutationKey: ['htmlRulesSave', widget.guid],
    mutationFn: (nextRules: WidgetRes['htmlRules']) =>
      setPreference('script_console.html_rules', JSON.stringify(nextRules)),
    onSuccess: (_data, nextRules) => {
      qc.setQueryData<WidgetRes>(['widgetData', widget.guid], prev =>
        prev ? { ...prev, htmlRules: nextRules } : prev
      );
    },
    onError: error => errorHandler(error, 'Failed to save HTML rules'),
  });

  const handleJsonSave = (value: string) => {
    const parsed = JSON.parse(value) as WidgetRes['htmlRules'];
    setLocalRules(parsed);
    latestRulesRef.current = parsed;
  };

  return (
    <>
      <SnSimpleTooltip content="HTML lint rules">
        <Button type="button" variant="ghost" size="icon" onClick={() => setOpen(true)}>
          <Braces />
        </Button>
      </SnSimpleTooltip>
      <JsonDialog
        open={open}
        setOpen={setOpen}
        json={JSON.stringify(localRules ?? {}, null, 2)}
        setJson={handleJsonSave}
        onSave={() => saveMutation.mutate(latestRulesRef.current)}
        title="HTML Lint Rules"
        description={
          <span>
            Configure custom HTML linting rules that will be applied to the widget's HTML template. You can view the
            available rules on&nbsp;
            <a
              href="https://html-validate.org/rules/"
              target="_blank"
              rel="noreferrer"
              className="text-blue-400 underline underline-offset-4 hover:text-blue-500 font-semibold"
            >
              HTML-validate
            </a>
            .
          </span>
        }
      />
    </>
  );
}

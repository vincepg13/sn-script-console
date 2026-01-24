import { Button } from '../ui/button';
import { useSidebar } from '../ui/sidebar';
import { WidgetToolbar } from './WidgetToolbar';
import { angularJsTern } from '@/lib/angular-tern';
import { useAppData } from '@/context/app-context';
import { useWidget } from '@/context/widget-context';
import { useQueryClient } from '@tanstack/react-query';
import { useWidgetWatcher } from './hooks/useWidgetWatcher';
import { useUnloadableBlur } from './hooks/useUnloadableBlur';
import { useSlashPrevention } from 'sn-shadcn-kit/hooks';
import { ExternalChangesDialog } from '../generic/ExternalChangesDialog';
import { useEffect, useEffectEvent, useMemo, useRef, useState } from 'react';
import { Braces, CircleX, CodeSquare, SquareChartGantt } from 'lucide-react';
import { setEsVersion, SnScriptEditor, SnScriptToolbar } from 'sn-shadcn-kit/script';
import { angularTernConfig, WidgetFields, SnScriptFieldType, WidgetFieldVals } from '@/types/widget';
import { HtmlRulesDialog } from './HtmlRulesDialog';

export const editorIconMap = {
  template: <SquareChartGantt />,
  script: <CodeSquare />,
  client_script: <Braces />,
  css: <SquareChartGantt />,
  link: <SquareChartGantt />,
};

const getScriptVals = (fields: WidgetFields): WidgetFieldVals => ({
  template: fields.template.value || '',
  script: fields.script.value || '',
  client_script: fields.client_script.value || '',
  css: fields.css.value || '',
  link: fields.link.value || '',
});

export function WidgetEditor() {
  const qc = useQueryClient();
  const { widget, hasLocalEdits, getScriptRef, setScriptRef, discardLocalEdits, setFieldValue, toggleFieldVisibility } =
    useWidget();


  useUnloadableBlur();
  const {
    warn: watcherWarn,
    setWarn: setWatcherWarn,
    markJustSaved,
  } = useWidgetWatcher({
    guid: widget.guid,
    hasLocalEdits,
  });

  const locked = widget.security.canWrite === false;
  const esVersion = widget.esVersion;

  const { config, setLocalPreference } = useAppData();
  const { esLintConfig, preferences, prettierConfig } = config;

  const [scriptVals, setScriptVals] = useState(getScriptVals(widget.fields));

  const lintingSettings = useMemo(() => {
    return setEsVersion(esVersion, esLintConfig!);
  }, [esLintConfig, esVersion]);

  const externalChangeEvent = useEffectEvent(() => {
    if (!hasLocalEdits) setScriptVals(getScriptVals(widget.fields));
  });
  useEffect(() => externalChangeEvent(), [widget.fields]);

  //On mount close sidebar for widget editor
  const { setOpen } = useSidebar();
  useEffect(() => {
    setOpen(false);
    setLocalPreference('sidebarOpen', false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cmContainer = useRef<HTMLDivElement>(null);
  const { onKeyDown } = useSlashPrevention();

  return (
    <div className="flex flex-col flex-1 min-h-0 gap-2.5" ref={cmContainer} onKeyDown={onKeyDown}>
      <div className="px-4">
        <WidgetToolbar setSaveFlag={markJustSaved} />
      </div>
      <div className="flex flex-1 min-h-0 overflow-y-hidden overflow-x-auto">
        {widget.toggleButtons
          .filter(e => e.visible)
          .map((e, i, arr) => {
            const target = widget.fields[e.field];
            const extraTernDefs = ['client_script', 'link'].includes(e.field) ? [angularJsTern] : undefined;
            const extraTernConfig = ['client_script', 'link'].includes(e.field) ? angularTernConfig : undefined;

            return (
              <div
                className={`flex min-h-0 min-w-[450px] flex-1 flex-col overflow-hidden border border-s-0 ${i === arr.length - 1 ? 'border-e-0' : ''}`}
                key={target.name}
              >
                <SnScriptEditor
                  key={target.name}
                  height="100%"
                  snType={target.type as SnScriptFieldType}
                  table="sp_widget"
                  lineWrapping={false}
                  readonly={locked || !target.canWrite}
                  fieldName={target.name}
                  content={scriptVals[e.field as keyof WidgetFieldVals]}
                  esLintConfig={lintingSettings}
                  theme={preferences?.theme || 'atom'}
                  prettierOptions={prettierConfig ?? undefined}
                  extraTernDefs={extraTernDefs}
                  ternConfig={extraTernConfig}
                  parentClasses="flex-1 min-h-0 flex flex-col gap-1.5"
                  cmContainerClasses="flex-1 min-h-0 overflow-auto"
                  onReady={ref => setScriptRef(target.name, ref)}
                  htmlLintRules={widget.htmlRules}
                  bounceTime={200}
                  onBlur={(v: string) => setFieldValue(target.name, v)}
                  customToolbar={
                    <div className="flex justify-between items-center px-4 pt-1.5">
                      <div className="flex items-center gap-2">
                        {editorIconMap[target.name as keyof typeof editorIconMap]}
                        <p className="text-lg font-semibold">{target.label}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {target.type === 'html_template' && (
                          <HtmlRulesDialog rules={widget.htmlRules}></HtmlRulesDialog>
                        )}
                        <SnScriptToolbar readonly={locked} editorRef={getScriptRef(target.name)} />
                        {arr.length > 1 && (
                          <Button variant="ghost" size="icon" onClick={() => toggleFieldVisibility(target.name)}>
                            <CircleX />
                          </Button>
                        )}
                      </div>
                    </div>
                  }
                />
              </div>
            );
          })}
      </div>
      <ExternalChangesDialog
        open={watcherWarn}
        setOpen={setWatcherWarn}
        onConfirm={() => {
          setWatcherWarn(false);
        }}
        onCancel={() => {
          setWatcherWarn(false);
          discardLocalEdits();
          qc.invalidateQueries({ queryKey: ['widgetData', widget.guid] });
        }}
      />
    </div>
  );
}

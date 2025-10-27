import { Button } from '../ui/button';
import { useSidebar } from '../ui/sidebar';
import { WidgetFields } from '@/types/widget';
import { WidgetToolbar } from './WidgetToolbar';
import { useAppData } from '@/context/app-context';
import { useWidget } from '@/context/widget-context';
import { useQueryClient } from '@tanstack/react-query';
import { SnAmbMessage, useRecordWatch } from 'sn-shadcn-kit/amb';
import { useEffect, useEffectEvent, useMemo, useState } from 'react';
import { UnsavedChangesModal } from '../generic/UnsavedChangesModal';
import { Braces, CircleX, CodeSquare, SquareChartGantt } from 'lucide-react';
import { setEsVersion, SnScriptEditor, SnScriptToolbar } from 'sn-shadcn-kit/script';

type SnScriptFieldType = 'script' | 'script_plain' | 'html_template' | 'css';

const editorIconMap = {
  template: <SquareChartGantt />,
  script: <CodeSquare />,
  client_script: <Braces />,
  css: <SquareChartGantt />,
  link: <SquareChartGantt />,
};

const scriptFieldNames = ['template', 'script', 'client_script', 'css'];
const getScriptVals = (fields: WidgetFields) => ({
  template: fields.template.value || '',
  script: fields.script.value || '',
  client_script: fields.client_script.value || '',
  css: fields.css.value || '',
  link: fields.link.value || '',
});

export function WidgetEditor() {
  const qc = useQueryClient();
  const { widget, stagedChanges, setStagedChanges, getScriptRef, setScriptRef, setFieldValue, toggleFieldVisibility } =
    useWidget();
  const locked = widget.security.canWrite === false;
  const esVersion = widget.esVersion;

  const { config, setLocalPreference } = useAppData();
  const { esLintConfig, preferences } = config;

  const [warn, setWarn] = useState(false);
  const [scriptVals, setScriptVals] = useState<Record<string, string>>(getScriptVals(widget.fields));

  const lintingSettings = useMemo(() => {
    return setEsVersion(esVersion, esLintConfig!);
  }, [esLintConfig, esVersion]);

  const externalChangeEvent = useEffectEvent(() => {
    if (stagedChanges) return setWarn(true);
    setScriptVals(getScriptVals(widget.fields));
  });
  useEffect(() => externalChangeEvent(), [widget]);

  const handleWatcher = (e: SnAmbMessage) => {
    if (e && e.data && e.data.changes) {
      if (e.data.record && e.data.changes.some(item => scriptFieldNames.includes(item))) {
        qc.invalidateQueries({ queryKey: ['widgetData', widget.guid] });
      }
    }
  };

  //On mount close sidebar for widget editor
  const { setOpen } = useSidebar();
  useEffect(() => {
    setOpen(false);
    setLocalPreference('sidebarOpen', false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col flex-1 min-h-0 gap-4">
      <div className="px-4">
        <WidgetToolbar />
      </div>
      <div className="flex flex-1 min-h-0 overflow-y-hidden overflow-x-auto">
        {widget.toggleButtons
          .filter(e => e.visible)
          .map((e, _i, arr) => {
            const target = widget.fields[e.field];
            return (
              <div className="flex min-h-0 min-w-[450px] flex-1 flex-col overflow-hidden border" key={target.name}>
                <SnScriptEditor
                  key={target.name}
                  height="100%"
                  snType={target.type as SnScriptFieldType}
                  table="sp-widget"
                  lineWrapping={false}
                  readonly={locked || !target.canWrite}
                  fieldName={target.name}
                  content={scriptVals[e.field]}
                  esLintConfig={lintingSettings}
                  theme={preferences?.theme || 'atom'}
                  parentClasses="flex-1 min-h-0 flex flex-col"
                  cmContainerClasses="flex-1 min-h-0 overflow-auto"
                  onReady={ref => setScriptRef(target.name, ref)}
                  onBlur={(v: string) => setFieldValue(target.name, v)}
                  customToolbar={
                    <div className="flex justify-between items-center px-4 pt-2">
                      <div className="flex items-center gap-2">
                        {editorIconMap[target.name as keyof typeof editorIconMap]}
                        <p className="text-lg font-semibold">{target.label}</p>
                      </div>
                      <div className="flex items-center gap-1">
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
      <UnsavedChangesModal
        title="An External Change Was Detected"
        description={`This widget has been updated elsewhere. Do you want to keep your changes or sync to the latest version?`}
        open={warn}
        setOpen={setWarn}
        confirmBtnText="Keep my changes"
        onConfirm={() => {
          setWarn(false);
          setStagedChanges(true);
        }}
        onCancel={() => {
          setWarn(false);
          setStagedChanges(false);
          setScriptVals(getScriptVals(widget.fields));
        }}
        cancelBtnText="Sync external change"
      />
      <MountWidgetWatcher key={widget.guid} guid={widget.guid} cb={handleWatcher} />
    </div>
  );
}

function MountWidgetWatcher({ guid, cb }: { guid: string; cb: (e: SnAmbMessage) => void }) {
  useRecordWatch('sp_widget', 'sys_id=' + guid, cb);
  return null;
}

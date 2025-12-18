import { useAppData } from '@/context/app-context';
import { SnScriptEditor } from 'sn-shadcn-kit/script';

type EditorJsonProps = {
  value: string;
  editable: boolean;
  onChange: (value: string) => void;
};

export function EditorJson({ value, editable, onChange }: EditorJsonProps) {
  const { config } = useAppData();
  // const editorRef = useRef<SnCodeMirrorHandle | null>(null);
  const { esLintConfig, preferences, prettierConfig } = config;

  return (
    <SnScriptEditor
      snType="json"
      table="sys_properties"
      fieldName="value"
      content={value}
      height="70vh"
      theme={preferences?.theme || 'atom'}
      lineWrapping={false}
      readonly={!editable}
      esLintConfig={esLintConfig ?? undefined}
      prettierOptions={prettierConfig ?? undefined}
      onBlur={onChange}
      bounceTime={200}
      // onReady={r => (editorRef.current = r)}
      customToolbar={null}
    />
  );
}

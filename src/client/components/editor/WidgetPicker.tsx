import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { SnRecordPicker, SnRecordPickerItem } from 'sn-shadcn-kit/standalone';

export function WidgetPicker({ v, dv }: { v?: string; dv?: string }) {
  const navigate = useNavigate();
  const pickVal = useMemo(() => (v ? { display_value: dv || v, value: v } : null), [v, dv]);

  return (
    <SnRecordPicker
      table="sp_widget"
      fields={['name', 'sys_scope']}
      query="ORDERBYDESCsys_updated_on"
      value={pickVal}
      onChange={record => {
        const next = record as SnRecordPickerItem;
        navigate('/widget_editor' + (next?.value ? `/${next.value}` : ''));
      }}
      placeholder="Select a widget to edit..."
      clearable={false}
    />
  );
}

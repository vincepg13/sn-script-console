import { useNavigate } from 'react-router';
import { ScriptTableItems } from '@/types/app';
import { useScript } from '@/context/script-context';
import { useEffect, useMemo, useState } from 'react';
import { ModifyPackage } from '../generic/ModifyPackage';
import { SnRecordPickerItem, SnRecordPicker } from 'sn-shadcn-kit/standalone';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { LoadingSpinner } from '../generic/LoadingSpinner';

//Transform scriptTables into an array of objects with table and label properties and sort alphabetically by label
function transformTables(tables: ScriptTableItems) {
  return Object.values(tables)
    .map(({ table, label, display }) => ({ table, label, display }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function ScriptPickers({ table, guid, display }: { table: string; guid: string; display: string }) {
  const navigate = useNavigate();
  const { scriptTables, isFetching } = useScript();

  const [scriptTable, setScriptTable] = useState(table);
  useEffect(() => setScriptTable(table), [table]);

  const [scriptRecord, setScriptRecord] = useState({ display_value: display, value: guid });
  useEffect(() => {
    setScriptRecord({ display_value: display, value: guid });
  }, [display, guid]);

  const scriptTableOptions = useMemo(() => {
    return transformTables(scriptTables);
  }, [scriptTables]);

  useEffect(() => {
    setScriptTable(table);
  }, [table]);

  const handleScriptChange = (script: SnRecordPickerItem) => {
    setScriptRecord(script);
    navigate(`/script/${scriptTable}/${script.value}`);
  };

  const pickerTable = scriptTableOptions.find(t => t.table === scriptTable);
  if (!pickerTable) return null;

  return (
    <div className="mr-auto flex gap-2 items-center font-medium">
      <Select onValueChange={setScriptTable} value={scriptTable} disabled={isFetching}>
        <SelectTrigger className="min-w-50">
          <SelectValue placeholder="Script Table" />
        </SelectTrigger>
        <SelectContent>
          {scriptTableOptions.map(({ table, label }) => (
            <SelectItem key={table} value={table}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="font-normal">
        <SnRecordPicker
          table={scriptTable || 'sys_script_include'}
          fields={pickerTable.display}
          query={`sys_id!=${guid}^ORDERBYDESCsys_updated_on`}
          value={scriptRecord}
          onChange={record => handleScriptChange(record as SnRecordPickerItem)}
          placeholder="Select a widget to edit..."
          editable={!isFetching}
          clearable={false}
        />
      </div>
      <ModifyPackage table={table} />
      {isFetching && <LoadingSpinner />}
    </div>
  );
}

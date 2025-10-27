import { getAxiosInstance } from 'sn-shadcn-kit';
import { ListRecords, ListRecordsSchema } from '@/types/list';
import { AppConfigSchema, ScopeUpdateSchema, UpdateSetSchema } from '@/types/app';
import {
  DependencyCountSchema,
  DependencyList,
  DependencyListSchema,
  NewDependencyResponse,
  NewWidget,
  WidgetListRes,
  WidgetListSchema,
  WidgetRes,
  WidgetSchema,
} from '@/types/widget';
import { ScriptSchema } from '@/types/script';
import { StatsRes } from '@/types/stats';
import { PackageCreateRes, PackageUpdateSchema, PackageValueSchema } from '@/types/package';

const tableApi = '/api/now/table';
const coreApi = '/api/x_659318_script/console_core';
const baseApi = '/api/x_659318_script/console_widget';
const packageApi = '/api/x_659318_script/console_package';

type CloneRes = { guid: string; message: string };
type MacroRes = { widgetId: string; uiFormatter: string; spFormatter: string };
type MacroData = { formatter: string; macro: string; table: string; widget: string };
type Dependency = { table: string; widget: string; dependency: string; linkTable: string };

export async function getAppConfig(signal?: AbortSignal) {
  const axios = getAxiosInstance();
  const response = await axios.get(`${coreApi}/app_config`, { signal });

  return AppConfigSchema.parse(response.data.result);
}

export async function getTableData(table: string, query: string, page: number, pageSize: number, signal: AbortSignal) {
  const axios = getAxiosInstance();
  const response = await axios.get(`${coreApi}/table_data/${table}`, {
    signal,
    params: { query, page, pageSize },
  });

  return ListRecordsSchema.parse(response.data.result);
}

export async function getScriptData(table: string, id: string, field: string, signal: AbortSignal) {
  const axios = getAxiosInstance();
  const res = await axios.get(`${coreApi}/script_data/${table}/${id}/${field}`, { signal });

  return res.data.result ? ScriptSchema.parse(res.data.result) : null;
}

export async function getWidget(widgetId: string, signal: AbortSignal): Promise<WidgetRes> {
  const axios = getAxiosInstance();
  const response = await axios.get(`${baseApi}/get_widget/${widgetId}`, { signal });

  return WidgetSchema.parse(response.data.result.data);
}

export async function getRecentWidgets(signal: AbortSignal): Promise<WidgetListRes> {
  const axios = getAxiosInstance();
  const response = await axios.get(`${baseApi}/recent_widgets`, { signal });

  return WidgetListSchema.parse(response.data.result.widgets);
}

export async function saveWidget(
  widgetId: string,
  fields: Record<string, string>,
  signal: AbortSignal
): Promise<string> {
  const axios = getAxiosInstance();
  const res = await axios.put(`${tableApi}/sp_widget/${widgetId}`, fields, { signal });

  return res.data.result.sys_id;
}

export async function createWidget({ name, id, description }: NewWidget, signal: AbortSignal): Promise<string> {
  const axios = getAxiosInstance();
  const res = await axios.post(`${tableApi}/sp_widget`, { name, id, description }, { signal });

  return res.data.result.sys_id;
}

export async function getDependencyCounts(widgetId: string, signal: AbortSignal) {
  const axios = getAxiosInstance();
  const response = await axios.get(`${baseApi}/refresh_dep_count/${widgetId}`, { signal });

  return DependencyCountSchema.parse(response.data.result);
}

export async function getWidgetDependencies(
  table: string,
  widget: string,
  field: string,
  signal: AbortSignal
): Promise<DependencyList> {
  const axios = getAxiosInstance();
  const response = await axios.get(`${baseApi}/get_dependencies/${table}/${widget}/${field}`, { signal });

  return DependencyListSchema.parse(response.data.result.dependencies);
}

export async function addDependency(dependency: Dependency, signal: AbortSignal) {
  const axios = getAxiosInstance();
  const res = await axios.post(`${baseApi}/create_dependency`, dependency, { signal });

  return NewDependencyResponse.parse(res.data.result);
}

export async function getRecords(table: string, query: string, fields: string[], signal: AbortSignal) {
  const axios = getAxiosInstance();
  const res = await axios.get(`${tableApi}/${table}`, {
    signal,
    params: {
      sysparm_display_value: 'all',
      sysparm_query: query,
      sysparm_fields: fields.join(','),
    },
  });

  return ListRecords.parse(res.data.result);
}

export async function deleteRecord(table: string, guid: string, signal: AbortSignal) {
  const axios = getAxiosInstance();
  await axios.delete(`${tableApi}/${table}/${guid}`, { signal });
}

export async function patchRecord(
  table: string,
  guid: string,
  data: Record<string, unknown>,
  signal: AbortSignal,
  fields?: string[]
): Promise<Record<string, unknown>> {
  const axios = getAxiosInstance();
  const queryParams = fields ? `?sysparm_fields=${fields.join(',')}` : '';
  const res = await axios.patch(`${tableApi}/${table}/${guid}${queryParams}`, data, { signal });
  return res.data.result;
}

export async function cloneWidget(guid: string, name: string, id: string, signal: AbortSignal): Promise<CloneRes> {
  const axios = getAxiosInstance();
  const response = await axios.post(`${baseApi}/clone_widget/${guid}`, { name, id }, { signal });

  return { guid: response.data.result.guid, message: response.data.result.message };
}

export async function revertVersion(versionId: string, signal?: AbortSignal): Promise<boolean> {
  const axios = getAxiosInstance();
  const response = await axios.post(`${coreApi}/global_method/revertVersion`, { params: [versionId] }, { signal });

  return response.data.result.returned;
}

export async function createMacro(macro: MacroData, signal?: AbortSignal): Promise<MacroRes> {
  const axios = getAxiosInstance();
  const response = await axios.post(`${baseApi}/create_macro`, macro, { signal });

  return response.data.result;
}

export async function refreshApplication(signal?: AbortSignal) {
  const axios = getAxiosInstance();
  const response = await axios.post(`${coreApi}/global_method/refreshScope`, {}, { signal });

  return ScopeUpdateSchema.parse(response.data.result.returned);
}

export async function setApplication(appId: string, signal?: AbortSignal) {
  const axios = getAxiosInstance();
  const response = await axios.post(`${coreApi}/global_method/setCurrentScope`, { params: [appId] }, { signal });

  return ScopeUpdateSchema.parse(response.data.result.returned);
}

export async function setUpdateSet(updateSetId: string, signal?: AbortSignal) {
  const axios = getAxiosInstance();
  const response = await axios.post(
    `${coreApi}/global_method/setCurrentUpdateSet`,
    { params: [updateSetId] },
    { signal }
  );

  return UpdateSetSchema.parse(response.data.result.returned);
}

export async function globalSave(table: string, recordID: string, data: Record<string, unknown>, signal?: AbortSignal) {
  const axios = getAxiosInstance();
  const res = await axios.post(
    `/api/now/sp/uiaction/42df02e20a0a0b340080e61b551f2909`,
    { table, recordID, data },
    { signal }
  );

  return res.data.result;
}

export async function getStatsData(tables: string[], signal: AbortSignal) {
  const axios = getAxiosInstance();
  const res = await axios.get(`${coreApi}/stats_data`, {
    signal,
    params: { tables: tables.join(',') },
  });

  return StatsRes.parse(res.data.result);
}

export async function setPreference(name: string, value: string, signal?: AbortSignal) {
  const axios = getAxiosInstance();
  const prefApi = '/angular.do?sysparm_type=$sp';
  await axios.post(prefApi, null, { params: { name, value, type: 'set_preference' }, signal });
}

export async function createPackage(name: string, description: string, signal?: AbortSignal) {
  const axios = getAxiosInstance();
  const res = await axios.post(`${packageApi}/create`, { name, description }, { signal });

  return PackageCreateRes.parse(res.data.result);
}

export async function addToPackage(packageId: string, table: string, path: string, signal?: AbortSignal) {
  const axios = getAxiosInstance();
  const res = await axios.put(`${packageApi}/add_item`, { packageId, table, path }, { signal });

  return PackageUpdateSchema.parse(res.data.result);
}

export async function changePackage(packageId: string, signal: AbortSignal) {
  const axios = getAxiosInstance();
  const res = await axios.put(`${packageApi}/change`, { packageId }, { signal });

  return PackageValueSchema.parse(res.data.result);
}
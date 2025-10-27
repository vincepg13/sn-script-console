import { toast } from 'sonner';
import { patchRecord } from './api';
import { isAxiosError } from 'axios';
import { twMerge } from 'tailwind-merge';
import { PackageData } from '@/types/app';
import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function errorHandler(e: unknown, msg: string) {
  if (isAxiosError(e) && e.code === 'ERR_CANCELED') return;
  const eMsg = isAxiosError(e) && e.response?.data?.error?.message ? `: ${e.response.data.error.message}` : '';
  toast.error(msg + eMsg);
  console.error(msg, e);
}

export function getApi(table: string, guid: string, view?: string, query?: string) {
  const queryParams = [];
  if (view) queryParams.push(`view=${view}`);
  if (query) queryParams.push(`qry=${query}`);

  return {
    formData: `/api/x_659318_script/console_core/form_data/${table}/${guid}?${queryParams.join('&')}`,
    refDisplay: '/api/x_659318_script/console_core/ref_display',
  };
}

export async function removeItemFromPackage(
  table: string,
  path: string,
  pkg: PackageData,
  signal: AbortSignal
) {
  const newPackageValue = { ...pkg.packageItems };
  const tableItems = { ...newPackageValue[table] };

  if (!tableItems) return;
  const newItems = tableItems.items.filter(item => item.path !== path);

  if (newItems.length) {
    tableItems.items = newItems;
    newPackageValue[table] = tableItems;
  } else {
    delete newPackageValue[table];
  }

  const targetPref = pkg.packages.find(p => p.id === pkg.currentPackage);
  if (!targetPref) return;

  const val = { value: JSON.stringify(newPackageValue) };
  await patchRecord('sys_user_preference', targetPref.guid, val, signal);

  return newPackageValue;
}

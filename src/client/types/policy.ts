import { z } from 'zod';
import { PackageValueSchema } from './package';
import { ScopeUpdateSchema } from '@/types/app';
import { SnConditionMap, SnConditionMapSchema } from 'sn-shadcn-kit/table';

const ValuePair = z.object({
  value: z.string(),
  displayValue: z.string(),
});

const ActionItem = z.object({
  value: z.enum(['true', 'false', 'ignore']),
  displayValue: z.string(),
});

const PolicyActionSchema = z.object({
  guid: z.string(),
  canWrite: z.boolean(),
  actionClass: z.string(),
  mandatory: ActionItem,
  visible: ActionItem,
  disabled: ActionItem,
  field: ValuePair.optional().nullable(),
  cleared: ValuePair.transform(val => ({ ...val, value: val.value === '1' })).optional().nullable(),
});

const PolicyTypeEnum = z.enum([
  'sys_ui_policy',
  'catalog_ui_policy',
  'wizard_ui_policy',
] as const);

export const PolicySchema = z.object({
  name: z.string(),
  guid: z.string(),
  scope: z.string(),
  type: PolicyTypeEnum,
  canWrite: z.boolean(),
  tableMeta: SnConditionMapSchema,
  actions: z.array(PolicyActionSchema),
  table: z.string().optional().nullable(),
  scopeChange: ScopeUpdateSchema.optional().nullable(),
  packageValue: PackageValueSchema.optional().nullable(),
});

export const PolicyActionResSchema = z.object({
  inserted: z.array(z.string()),
  updated: z.array(z.string()),
  deleted: z.array(z.string()),
});

export type PolicyData = z.infer<typeof PolicySchema>;
export type PolicyType = z.infer<typeof PolicyTypeEnum>;
export type PolicyAction = z.infer<typeof PolicyActionSchema>;
export type ActionField = 'field' | 'mandatory' | 'visible' | 'disabled' | 'cleared';
export type FieldsByTable = Record<string, SnConditionMap>;

export type PolicyActionResponse = z.infer<typeof PolicyActionResSchema>;
export type PolicyActionData = { toInsert: PolicyActionItem[]; toUpdate: PolicyActionItem[]; toDelete: string[] };

// Action save data
export type PolicyActionItem = {
  mandatory: string;
  visible: string;
  disabled: string;
  field?: string;
  cleared?: boolean;
  ui_policy?: string;
  sys_scope?: string;
  sys_id?: string;
  table?: string | null;
};

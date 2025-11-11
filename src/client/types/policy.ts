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
  field: ValuePair,
  mandatory: ActionItem,
  visible: ActionItem,
  disabled: ActionItem,
  cleared: ValuePair.transform(val => ({ ...val, value: val.value === '1' })),
});

export const PolicySchema = z.object({
  name: z.string(),
  guid: z.string(),
  table: z.string(),
  scope: z.string(),
  tableMeta: SnConditionMapSchema,
  actions: z.array(PolicyActionSchema),
  scopeChange: ScopeUpdateSchema.optional().nullable(),
  packageValue: PackageValueSchema.optional().nullable(),
});

export const PolicyActionResSchema = z.object({
  inserted: z.array(z.string()),
  updated: z.array(z.string()),
  deleted: z.array(z.string()),
});

export type PolicyData = z.infer<typeof PolicySchema>;
export type PolicyAction = z.infer<typeof PolicyActionSchema>;
export type ActionField = 'field' | 'mandatory' | 'visible' | 'disabled' | 'cleared';
export type FieldsByTable = Record<string, SnConditionMap>;

export type PolicyActionResponse = z.infer<typeof PolicyActionResSchema>;
export type PolicyActionData = { toInsert: PolicyActionItem[]; toUpdate: PolicyActionItem[]; toDelete: string[] };
export type PolicyActionItem = {
  field: string;
  mandatory: string;
  visible: string;
  disabled: string;
  cleared: boolean;
  table?: string;
  ui_policy?: string;
  sys_scope?: string;
  sys_id?: string;
};

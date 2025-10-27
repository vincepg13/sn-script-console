import { z } from 'zod';
import { PackageValueSchema } from './package';
import { ScopeUpdateSchema } from '@/types/app';
import { ESVersion } from 'sn-shadcn-kit/script';
import { LastUpdatedSchema, PrettierSchema } from './defaults';

const ScriptMetadataSchema = z.object({
  table: z.string(),
  field: z.string(),
  guid: z.string(),
  display: z.string(),
  type: z.string(),
  scope: z.string().optional().nullable(),
  updater: LastUpdatedSchema,
});

export const ScriptSchema = z.object({
  canWrite: z.boolean(),
  script: z.string(),
  esVersion: z.custom<ESVersion>(),
  metadata: ScriptMetadataSchema,
  scopeChange: ScopeUpdateSchema.optional().nullable(),
  packageValue: PackageValueSchema.optional().nullable(),
});

export type ArrowParens = 'avoid' | 'always';
export type ObjectWrap = 'preserve' | 'collapse';
export type TrailingComma = 'none' | 'es5' | 'all';
export type LintLevel = 'off' | 'warn' | 'error';
export type ScriptData = z.infer<typeof ScriptSchema>;
export type ScriptMetadata = z.infer<typeof ScriptMetadataSchema>;
export type PrettierConfig = z.infer<typeof PrettierSchema>;
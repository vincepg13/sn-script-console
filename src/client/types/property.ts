import { z } from 'zod';
import { ScopeUpdateSchema } from './app';
import { PackageValueSchema } from './package';

const EditorTypeEnum = z.enum([
  'json',
  'choice',
  'integer',
  'text',
] as const);

export const PropertySchema = z.object({
  name: z.string(),
  guid: z.string(),
  type: z.string(),
  value: z.string(),
  canWrite: z.boolean(),
  editorType: EditorTypeEnum,
  scopeChange: ScopeUpdateSchema.optional().nullable(),
  packageValue: PackageValueSchema.optional().nullable(),
  modCount: z.string().transform((val) => parseInt(val, 10)),
});

export type PropertyData = z.infer<typeof PropertySchema>;
export type PropertyEditorType = z.infer<typeof EditorTypeEnum>;
